// Stores the parent's chosen city (preset list) in localStorage.
import { presetCities, type PresetCity } from "../data/presetCities";

const CITY_KEY = "kidsapp_weather_city_id";
const DEFAULT_CITY_ID = "malmo";

export function readSelectedCityId(): string {
  try {
    const raw = localStorage.getItem(CITY_KEY);
    if (!raw) return DEFAULT_CITY_ID;
    return raw;
  } catch {
    return DEFAULT_CITY_ID;
  }
}

export function writeSelectedCityId(cityId: string) {
  localStorage.setItem(CITY_KEY, cityId);
}

export function getSelectedCity(): PresetCity {
  const id = readSelectedCityId();
  return presetCities.find((c) => c.id === id) ?? presetCities[0];
}
