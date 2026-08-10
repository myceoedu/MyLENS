import { createClient } from "@/lib/supabase/server";
import type {
  LearningItem,
  LearningModule,
  LearningTaskSubmission,
  LearningTaskStatus,
  LearningTaskSubmissionMode,
} from "@/types/learning";
import type { AdminTaskFilter, AdminTaskListItem } from "@/lib/learning/tasks";
import { statusesForTaskFilter } from "@/lib/learning/tasks";

const MODULE_COLUMNS =
  "id, title, description, sort_order, published, created_at, updated_at";
const ITEM_COLUMNS =
  "id, module_id, title, description, content_type, content_url, storage_path, starts_at, duration_minutes, sort_order, published, created_by, created_at, updated_at, submission_mode, due_at";
const ITEM_COLUMNS_LEGACY =
  "id, module_id, title, description, content_type, content_url, storage_path, starts_at, duration_minutes, sort_order, published, created_by, created_at, updated_at";

function groupModules(
  moduleRows: Omit<LearningModule, "items">[],
  itemRows: LearningItem[]
): LearningModule[] {
  const itemsByModule = new Map<string, LearningItem[]>();

  for (const item of itemRows) {
    const items = itemsByModule.get(item.module_id) ?? [];
    items.push(item);
    itemsByModule.set(item.module_id, items);
  }

  return moduleRows.map((module) => ({
    ...module,
    items: itemsByModule.get(module.id) ?? [],
  }));
}

async function fetchLearningItems(
  supabase: Awaited<ReturnType<typeof createClient>>,
  publishedOnly: boolean
) {
  let query = supabase
    .from("learning_items")
    .select(ITEM_COLUMNS)
    .order("sort_order")
    .order("created_at");
  if (publishedOnly) query = query.eq("published", true);

  const first = await query;
  if (!first.error) return first;

  // Staging fallback before 014_learning_tasks.sql is applied.
  let legacy = supabase
    .from("learning_items")
    .select(ITEM_COLUMNS_LEGACY)
    .order("sort_order")
    .order("created_at");
  if (publishedOnly) legacy = legacy.eq("published", true);
  return legacy;
}

export async function getAdminLearningModules(): Promise<LearningModule[]> {
  const supabase = await createClient();
  const [{ data: modules, error: moduleError }, { data: items, error: itemError }] =
    await Promise.all([
      supabase
        .from("learning_modules")
        .select(MODULE_COLUMNS)
        .order("sort_order")
        .order("created_at"),
      fetchLearningItems(supabase, false),
    ]);

  if (moduleError) throw new Error(moduleError.message);
  if (itemError) throw new Error(itemError.message);

  return groupModules(
    (modules ?? []) as Omit<LearningModule, "items">[],
    (items ?? []) as LearningItem[]
  );
}

export async function getCreatorLearningModules(): Promise<LearningModule[]> {
  const supabase = await createClient();
  const [{ data: modules, error: moduleError }, { data: items, error: itemError }] =
    await Promise.all([
      supabase
        .from("learning_modules")
        .select(MODULE_COLUMNS)
        .eq("published", true)
        .order("sort_order")
        .order("created_at"),
      fetchLearningItems(supabase, true),
    ]);

  if (moduleError) throw new Error(moduleError.message);
  if (itemError) throw new Error(itemError.message);

  const learningItems = (items ?? []) as LearningItem[];
  const storagePaths = learningItems.flatMap((item) =>
    item.storage_path ? [item.storage_path] : []
  );
  const { data: signedUrls } = storagePaths.length
    ? await supabase.storage.from("learning-content").createSignedUrls(storagePaths, 60 * 60)
    : { data: [] };
  const signedUrlByPath = new Map(
    (signedUrls ?? []).map((item) => [item.path, item.signedUrl])
  );
  const resolvedItems = learningItems.map((item) => ({
    ...item,
    resolved_url: item.storage_path
      ? (signedUrlByPath.get(item.storage_path) ?? null)
      : item.content_url,
  }));

  return groupModules(
    (modules ?? []) as Omit<LearningModule, "items">[],
    resolvedItems
  );
}

export async function getCreatorCompletedLearningItemIds(userId: string): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("learning_item_progress")
    .select("item_id")
    .eq("user_id", userId);

  // Keep the academy available during a staged deployment where the application
  // reaches production before the companion progress migration has been applied.
  if (error?.code === "42P01") return [];
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => row.item_id);
}

export async function getCreatorTaskSubmissionsByItem(
  userId: string
): Promise<Record<string, LearningTaskSubmission>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("learning_task_submissions")
    .select(
      "id, item_id, user_id, school_id, answer_text, answer_url, storage_path, status, admin_notes, attempt, submitted_at, reviewed_at, created_at, updated_at"
    )
    .eq("user_id", userId);

  if (error?.code === "42P01") return {};
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as LearningTaskSubmission[];
  const storagePaths = rows.flatMap((row) => (row.storage_path ? [row.storage_path] : []));
  const { data: signedUrls } = storagePaths.length
    ? await supabase.storage.from("learning-tasks").createSignedUrls(storagePaths, 60 * 60)
    : { data: [] };
  const signedUrlByPath = new Map(
    (signedUrls ?? []).map((item) => [item.path, item.signedUrl])
  );

  const map: Record<string, LearningTaskSubmission> = {};
  for (const row of rows) {
    map[row.item_id] = {
      ...row,
      resolved_file_url: row.storage_path
        ? (signedUrlByPath.get(row.storage_path) ?? null)
        : null,
    };
  }
  return map;
}

type SchoolEmbed = { name: string } | { name: string }[] | null;
type ModuleEmbed = { title: string } | { title: string }[] | null;
type ItemEmbed = {
  title: string;
  due_at: string | null;
  submission_mode: string | null;
  learning_modules: ModuleEmbed;
} | null;

function embedName(value: SchoolEmbed): string | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0]?.name ?? null;
  return value.name ?? null;
}

function embedTitle(value: ModuleEmbed): string | null {
  if (!value) return null;
  if (Array.isArray(value)) return value[0]?.title ?? null;
  return value.title ?? null;
}

export async function getAdminTaskSubmissions(options: {
  filter: AdminTaskFilter;
  query?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ items: AdminTaskListItem[]; total: number }> {
  const supabase = await createClient();
  const page = Math.max(1, options.page ?? 1);
  const pageSize = options.pageSize ?? 20;
  const rangeStart = (page - 1) * pageSize;
  const statusList = statusesForTaskFilter(options.filter);
  const searchTerm = options.query?.replaceAll(/[,%()]/g, "").trim() ?? "";

  let listQuery = supabase
    .from("learning_task_submissions")
    .select(
      "id, item_id, user_id, school_id, answer_text, answer_url, storage_path, status, admin_notes, attempt, submitted_at, reviewed_at, updated_at, schools(name), learning_items(title, due_at, submission_mode, learning_modules(title))",
      { count: "exact" }
    )
    .order("submitted_at", { ascending: false, nullsFirst: false })
    .order("updated_at", { ascending: false });

  if (statusList) listQuery = listQuery.in("status", statusList);

  const { data: rows, count, error } = await listQuery.range(
    rangeStart,
    rangeStart + pageSize - 1
  );

  if (error?.code === "42P01") return { items: [], total: 0 };
  if (error) throw new Error(error.message);

  const userIds = [...new Set((rows ?? []).map((row) => row.user_id))];
  const profileMap: Record<string, { full_name: string | null; email: string }> = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email")
      .in("id", userIds);
    for (const profile of profiles ?? []) {
      profileMap[profile.id] = { full_name: profile.full_name, email: profile.email };
    }
  }

  let items: AdminTaskListItem[] = (rows ?? []).map((row) => {
    const item = (Array.isArray(row.learning_items)
      ? row.learning_items[0]
      : row.learning_items) as ItemEmbed;
    const profile = profileMap[row.user_id];
    return {
      id: row.id,
      item_id: row.item_id,
      user_id: row.user_id,
      school_id: row.school_id,
      answer_text: row.answer_text,
      answer_url: row.answer_url,
      storage_path: row.storage_path,
      status: row.status as LearningTaskStatus,
      admin_notes: row.admin_notes,
      attempt: row.attempt,
      submitted_at: row.submitted_at,
      reviewed_at: row.reviewed_at,
      updated_at: row.updated_at,
      task_title: item?.title ?? "Task",
      module_title: embedTitle(item?.learning_modules ?? null),
      creator_name: profile?.full_name ?? null,
      creator_email: profile?.email ?? null,
      school_name: embedName(row.schools as SchoolEmbed),
      due_at: item?.due_at ?? null,
      submission_mode: (item?.submission_mode as AdminTaskListItem["submission_mode"]) ?? null,
    };
  });

  if (searchTerm) {
    const q = searchTerm.toLowerCase();
    items = items.filter(
      (item) =>
        item.task_title.toLowerCase().includes(q) ||
        (item.creator_name ?? "").toLowerCase().includes(q) ||
        (item.creator_email ?? "").toLowerCase().includes(q) ||
        (item.school_name ?? "").toLowerCase().includes(q)
    );
  }

  return { items, total: count ?? items.length };
}

export async function getAdminTaskSubmissionDetail(submissionId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("learning_task_submissions")
    .select(
      "id, item_id, user_id, school_id, answer_text, answer_url, storage_path, status, admin_notes, attempt, submitted_at, reviewed_at, created_at, updated_at, schools(id, name), learning_items(id, title, description, due_at, submission_mode, module_id, learning_modules(id, title))"
    )
    .eq("id", submissionId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const [{ data: profile }, signed] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("id", data.user_id)
      .maybeSingle(),
    data.storage_path
      ? supabase.storage.from("learning-tasks").createSignedUrl(data.storage_path, 60 * 60)
      : Promise.resolve({ data: null }),
  ]);

  const item = Array.isArray(data.learning_items) ? data.learning_items[0] : data.learning_items;
  const moduleRow = item
    ? Array.isArray(item.learning_modules)
      ? item.learning_modules[0]
      : item.learning_modules
    : null;
  const school = Array.isArray(data.schools) ? data.schools[0] : data.schools;

  return {
    submission: {
      ...(data as LearningTaskSubmission),
      resolved_file_url: signed.data?.signedUrl ?? null,
    },
    task: item
      ? {
          id: item.id as string,
          title: item.title as string,
          description: (item.description as string | null) ?? null,
          due_at: (item.due_at as string | null) ?? null,
          submission_mode: (item.submission_mode as LearningTaskSubmissionMode | null) ?? null,
          module_id: item.module_id as string,
          module_title: (moduleRow?.title as string | null) ?? null,
        }
      : null,
    creator: profile,
    school,
  };
}
