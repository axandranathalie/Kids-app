export type ParentLocation = {
  city: string;
  lat: number;
  lon: number;
};

const LOCATION_KEY = "kidsapp_parent_location";

// Default fallback until the parent picks a location (or if localStorage is invalid).
// Default = Stockholm
const DEFAULT_LOCATION: ParentLocation = {
  city: "Stockholm",
  lat: 59.3293,
  lon: 18.0686,
};

export function readParentLocation(): ParentLocation {
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    if (!raw) return DEFAULT_LOCATION;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_LOCATION;

    const obj = parsed as Partial<ParentLocation>;

    if (
      typeof obj.city === "string" &&
      typeof obj.lat === "number" &&
      typeof obj.lon === "number"
    ) {
      return { city: obj.city, lat: obj.lat, lon: obj.lon };
    }

    return DEFAULT_LOCATION;
  } catch {
    return DEFAULT_LOCATION;
  }
}

export function writeParentLocation(next: ParentLocation) {
  localStorage.setItem(LOCATION_KEY, JSON.stringify(next));
}
