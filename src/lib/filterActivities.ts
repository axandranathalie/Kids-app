import type { Activity, AgeGroup, WeatherTag, TimeOfDay } from "../types/activity";

export type KidsWhen = "dag" | "kväll";

export type KidsFilters = {
  age: AgeGroup | null;
  where: WeatherTag | null;
  when: KidsWhen | null;
};

// Maps UI choice ("dag/kväll") to data model ("morgon/eftermiddag/kväll")
function matchesWhen(activityTime: TimeOfDay, when: KidsWhen): boolean {
  if (activityTime === "valfritt") return true;

  if (when === "dag") {
    return activityTime === "morgon" || activityTime === "eftermiddag";
  }

  return activityTime === "kväll";
}

function matchesWhere(activityWeather: WeatherTag, where: WeatherTag): boolean {
  // If the activity works anywhere, it matches all where-filters
  if (activityWeather === "valfritt") return true;

  // If user chose "var som helst", accept all activities
  if (where === "valfritt") return true;

  // Otherwise require exact match
  return activityWeather === where;
}

export function filterActivities(activities: Activity[], filters: KidsFilters): Activity[] {
  const { age, where, when } = filters;
  if (!age || !where || !when) return [];

  return activities.filter((a) => {
    const ageOk = a.ageGroups.includes(age);
    const whereOk = matchesWhere(a.weather, where);
    const whenOk = matchesWhen(a.timeOfDay, when);

    return ageOk && whereOk && whenOk;
  });
}
