import type { WeatherSummary } from "./weatherApi";

export type WeatherIconKey = "sun" | "cloudy" | "rain" | "snow";

export function pickWeatherIconKey(w: WeatherSummary): WeatherIconKey {
  const code = w.weatherCode;

  // Open-Meteo weather codes
  // 0 = clear
  if (code === 0) return "sun";

  // Mostly clear / partly cloudy / overcast
  if ([1, 2, 3].includes(code)) return "cloudy";

  // Fog
  if ([45, 48].includes(code)) return "cloudy";

  // Drizzle / rain / showers / freezing rain / thunderstorms
  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(
      code
    )
  ) {
    return "rain";
  }

  // Snow / snow grains / snow showers
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";

  // fallback
  return "cloudy";
}
