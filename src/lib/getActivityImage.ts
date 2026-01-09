import type { Activity } from "../types/activity";
import { activityImageByFile } from "./activityImages";

// Returns the resolved image URL for an activity (if any)
export function getActivityImageUrl(activity: Activity): string | undefined {
  const file = activity.image?.file;
  if (!file) return undefined;

  return activityImageByFile[file];
}
