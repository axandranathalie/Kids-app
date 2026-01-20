// Small Open-Meteo client for outdoor weather.

export type WeatherSummary = {
  temperatureC: number;
  windSpeedMps: number;
  isDay: boolean;
  weatherCode: number;
  outdoorHint: "good" | "bad";
};

type OpenMeteoCurrent = {
  temperature_2m: number;
  wind_speed_10m: number;
  is_day: number; 
  weather_code: number;
};

type OpenMeteoResponse = {
  current?: OpenMeteoCurrent;
};

function toOutdoorHint(c: OpenMeteoCurrent): "good" | "bad" {
  const code = c.weather_code;
  const wind = c.wind_speed_10m;

  const badCodes = new Set<number>([
    51, 53, 55, 56, 57, // drizzle
    61, 63, 65, 66, 67, // rain / freezing rain
    71, 73, 75, 77,     // snow / snow grains
    80, 81, 82,         // rain showers
    85, 86,             // snow showers
    95, 96, 99,         // thunderstorms
  ]);

  if (badCodes.has(code)) return "bad";
  if (wind >= 10) return "bad"; 
  return "good";
}

export async function fetchWeatherSummary(opts: {
  lat: number;
  lon: number;
}): Promise<WeatherSummary> {
  const { lat, lon } = opts;

  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${encodeURIComponent(lat)}` +
    `&longitude=${encodeURIComponent(lon)}` +
    "&current=temperature_2m,wind_speed_10m,is_day,weather_code" +
    "&timezone=auto";

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather request failed: ${res.status}`);
  }

  const data = (await res.json()) as OpenMeteoResponse;

    if (!data.current) {
    throw new Error("Weather response missing 'current' field.");
  }


  const current = data.current;
  return {
    temperatureC: current.temperature_2m,
    windSpeedMps: current.wind_speed_10m,
    isDay: current.is_day === 1,
    weatherCode: current.weather_code,
    outdoorHint: toOutdoorHint(current),
  };
}
