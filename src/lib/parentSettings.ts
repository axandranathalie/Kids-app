// Reads parent-managed activity settings from localStorage (custom activities + hidden activity ids).

import type { Activity } from "../types/activity";
import { readCustomActivities } from "./customActivitiesStorage";

const HIDDEN_KEY = "kidsapp_hidden_activity_ids";

function readHiddenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    if (!raw) return new Set();
    const arr: unknown = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

export function readParentActivities(): {
  hiddenIds: Set<string>;
  customActivities: Activity[];
} {
  return {
    hiddenIds: readHiddenIds(),
    customActivities: readCustomActivities(),
  };
}
