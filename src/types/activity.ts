export type AgeGroup = "2-4" | "5-7" | "8-10";
export type WeatherTag = "inomhus" | "utomhus" | "valfritt";
export type TimeOfDay = "morgon" | "eftermiddag" | "kväll" | "valfritt";

export type Activity = {
  id: string;
  title: string;
  description: string;
  steps: string[];

  ageGroups: AgeGroup[];
  weather: WeatherTag;
  timeOfDay: TimeOfDay;

  durationMinutes?: number;
  materials?: string[];
  image?: {
    alt: string;
    src?: string;
  };

  source: "base" | "custom";
  hidden?: boolean;
};
