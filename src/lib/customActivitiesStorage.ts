import type { Activity } from "../types/activity";

// LocalStorage key used to persist user-created activities between page reloads.
const CUSTOM_KEY = "kidsapp_custom_activities";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((x) => typeof x === "string");
}

function isActivity(value: unknown): value is Activity {
  if (!isRecord(value)) return false;

  const id = value.id;
  const title = value.title;
  const description = value.description;
  const steps = value.steps;
  const ageGroups = value.ageGroups;
  const weather = value.weather;
  const timeOfDay = value.timeOfDay;
  const source = value.source;

  if (typeof id !== "string") return false;
  if (typeof title !== "string") return false;
  if (typeof description !== "string") return false;

  if (!isStringArray(steps)) return false;
  if (!isStringArray(ageGroups)) return false;

  if (typeof weather !== "string") return false;
  if (typeof timeOfDay !== "string") return false;
  if (typeof source !== "string") return false;

  return true;
}

export function readCustomActivities(): Activity[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isActivity);
  } catch {
    return [];
  }
}

export function writeCustomActivities(activities: Activity[]) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(activities));
}
