import type { Activity, AgeGroup, WeatherTag, TimeOfDay } from "../types/activity";

export type KidsWhen = "dag" | "kväll";

export type KidsFilters = {
  age: AgeGroup | null;
  where: WeatherTag | null;
  when: KidsWhen | null;
};

function matchesWhen(activityTime: TimeOfDay, when: KidsWhen): boolean {
  if (activityTime === "valfritt") return true;

  // Map UI choice ("dag/kväll") to data model ("morgon/eftermiddag/kväll")
  if (when === "dag") return activityTime === "morgon" || activityTime === "eftermiddag";
  return activityTime === "kväll";
}

export function filterActivities(
  activities: Activity[],
  filters: KidsFilters
): Activity[] {
  const { age, where, when } = filters;
  if (!age || !where || !when) return [];

  return activities.filter((a) => {
    const ageOk = a.ageGroups.includes(age);
    const whereOk = a.weather === "valfritt" || a.weather === where;
    const whenOk = matchesWhen(a.timeOfDay, when);

    return ageOk && whereOk && whenOk;
  });
}
