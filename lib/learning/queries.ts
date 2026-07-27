import { createClient } from "@/lib/supabase/server";
import type { LearningItem, LearningModule } from "@/types/learning";

const MODULE_COLUMNS =
  "id, title, description, sort_order, published, created_at, updated_at";
const ITEM_COLUMNS =
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

export async function getAdminLearningModules(): Promise<LearningModule[]> {
  const supabase = await createClient();
  const [{ data: modules, error: moduleError }, { data: items, error: itemError }] =
    await Promise.all([
      supabase
        .from("learning_modules")
        .select(MODULE_COLUMNS)
        .order("sort_order")
        .order("created_at"),
      supabase
        .from("learning_items")
        .select(ITEM_COLUMNS)
        .order("sort_order")
        .order("created_at"),
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
      supabase
        .from("learning_items")
        .select(ITEM_COLUMNS)
        .eq("published", true)
        .order("sort_order")
        .order("created_at"),
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
