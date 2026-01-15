import type { Activity } from "../types/activity";
import { activityImageByFile } from "./activityImages";

// Returns the resolved image URL for an activity (if any)
export function getActivityImageUrl(activity: Activity): string | undefined {
  if (activity.image?.src) return activity.image.src;

  const file = activity.image?.file;
  if (!file) return undefined;

  return activityImageByFile[file];
}

