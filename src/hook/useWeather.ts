import { useEffect, useMemo, useState } from "react";
import { fetchWeatherSummary, type WeatherSummary } from "../lib/weatherApi";

type State =
  | { status: "idle" | "loading"; data: null; error: null }
  | { status: "success"; data: WeatherSummary; error: null }
  | { status: "error"; data: null; error: string };

export function useWeather(coords: { lat: number; lon: number } | null) {
  const [state, setState] = useState<State>({
    status: "idle",
    data: null,
    error: null,
  });

  // Memoized "request key" so we only refetch when the location meaningfully changes.
  // (toFixed prevents tiny float diffs from triggering unnecessary requests.)
  const key = useMemo(() => {
    if (!coords) return null;
    return `${coords.lat.toFixed(4)}:${coords.lon.toFixed(4)}`;
  }, [coords]);

  useEffect(() => {
    if (!coords || !key) return;

    // Prevent setting state after unmount or after coords change mid-request.
    let cancelled = false;

    (async () => {
      try {
        setState({ status: "loading", data: null, error: null });
        const data = await fetchWeatherSummary(coords);
        if (cancelled) return;
        setState({ status: "success", data, error: null });
      } catch (e) {
        if (cancelled) return;
        setState({
          status: "error",
          data: null,
          error: e instanceof Error ? e.message : "Unknown error",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [coords, key]);

  return state;
}
