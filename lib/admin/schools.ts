import { states } from "@/lib/data/states";

export function slugifySchoolName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getStateShortName(stateId: string): string {
  return states.find((s) => s.id === stateId)?.shortName ?? "MY";
}

export function getStateLabel(stateId: string): string {
  return states.find((s) => s.id === stateId)?.name ?? stateId;
}
