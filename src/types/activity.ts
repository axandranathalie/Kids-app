export type AgeGroup = "3-5" | "6-8" | "9-10";
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
