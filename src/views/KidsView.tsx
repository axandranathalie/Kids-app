import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { OptionCard } from "../components/ui/OptionCard";
import { AppLayout } from "../components/layout/AppLayout";
import { allActivities } from "../data/activities";
import { filterActivities, type KidsFilters } from "../lib/filterActivities";
import { useWeather } from "../hook/useWeather";
import { getSelectedCity } from "../lib/weatherCityStorage";
import { readCustomActivities } from "../lib/customActivitiesStorage";
import { readHiddenActivityIds } from "../lib/hiddenActivitiesStorage";

// Icons
import kidsIcon from "../assets/icons/kids.png";
import age2_4 from "../assets/icons/kid2-4.png";
import age5_7 from "../assets/icons/kid5-7.png";
import age8_10 from "../assets/icons/kid8-10.png";
import indoors from "../assets/icons/indoors.png";
import outdoors from "../assets/icons/outdoors.png";
import anywhere from "../assets/icons/anywhere.png";
import dayIcon from "../assets/icons/day.png";
import eveningIcon from "../assets/icons/evening.png";
import confettiIcon from "../assets/icons/confetti2.png";

import sunIcon from "../assets/icons/sun.png";
import cloudyIcon from "../assets/icons/cloudy.png";
import rainIcon from "../assets/icons/rain.png";
import snowyIcon from "../assets/icons/snowy.png";

import { pickWeatherIconKey } from "../lib/weatherIcon";

const defaultFilters: KidsFilters = {
  age: null,
  where: null,
  when: null,
};

export function KidsView() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<KidsFilters>(defaultFilters);

  // Enable CTA only when all filters are selected.
  const canSubmit = Boolean(filters.age && filters.where && filters.when);

  // Read selected city from localStorage (preset cities).
  const selectedCity = useMemo(() => getSelectedCity(), []);

  const weatherCoords = useMemo(
    () => ({ lat: selectedCity.lat, lon: selectedCity.lon }),
    [selectedCity.lat, selectedCity.lon]
  );

  const weather = useWeather(weatherCoords);
  const weatherSuccess = weather.status === "success" ? weather.data : null;

  const hiddenIds = useMemo(() => readHiddenActivityIds(), []);
  const customActivities = useMemo(() => readCustomActivities(), []);

  const availableActivities = useMemo(() => {
    const combined = [...customActivities, ...allActivities];
    return combined.filter((a) => !hiddenIds.has(a.id));
  }, [customActivities, hiddenIds]);

  const filteredActivities = useMemo(() => {
    return filterActivities(availableActivities, filters);
  }, [availableActivities, filters]);

  const hasResults = filteredActivities.length > 0;

  const pickRandomActivity = () => {
    if (!canSubmit) return;

    if (!hasResults) return;

    const random =
      filteredActivities[Math.floor(Math.random() * filteredActivities.length)];

    // Navigate to the suggestion view and pass both the chosen activity and the selected filters.
    navigate("/activity-suggestion", { state: { activity: random, filters } });
  };

  return (
    <AppLayout
      header={
        // Responsive header layout:
        // - Mobile: back button left, weather right, title on its own row centered
        // - Tablet/Desktop: title centered column, weather in the right column
        <header className="grid grid-cols-2 items-start gap-y-3 sm:grid-cols-3 sm:items-center">
          <div className="justify-self-start">
            <Link
              to="/"
              className="inline-flex items-center rounded-xl border border-gray-300 bg-white/60 px-3 py-2 text-sm font-semibold"
            >
              ← Tillbaka
            </Link>
          </div>

          <div className="justify-self-end text-right sm:col-start-3">
            <div className="text-sm font-semibold text-gray-800">
              Vädret just nu
            </div>

            {weather.status === "loading" || weather.status === "idle" ? (
              <div className="mt-1 text-xs font-semibold text-gray-600">
                Laddar…
              </div>
            ) : weather.status === "error" ? (
              <div className="mt-1 text-xs font-semibold text-red-600">
                Kunde inte hämta väder
              </div>
            ) : weatherSuccess ? (
              <div className="mt-1 flex flex-col items-end gap-2">
                <div className="text-xs font-semibold text-gray-700">
                  {selectedCity.name}: {Math.round(weatherSuccess.temperatureC)}
                  °C
                </div>

                {(() => {
                  const key = pickWeatherIconKey(weatherSuccess);

                  const iconSrc =
                    key === "sun"
                      ? sunIcon
                      : key === "rain"
                      ? rainIcon
                      : key === "snow"
                      ? snowyIcon
                      : cloudyIcon;

                  return <img src={iconSrc} alt="" className="h-17 w-17" />;
                })()}
              </div>
            ) : null}
          </div>

          <div className="col-span-2 flex justify-center sm:col-span-1 sm:col-start-2">
            <div className="flex items-center gap-2 sm:gap-4">
              <img
                src={kidsIcon}
                alt=""
                className="h-8 w-8 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20"
              />

              <h1 className="text-3xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl leading-none">
                <span className="bg-linear-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
                  Barnläge
                </span>
              </h1>
            </div>
          </div>
        </header>
      }
    >
      <main className="mt-6 flex justify-center px-3 pb-10 sm:px-6">
        <div className="w-full max-w-3xl rounded-3xl bg-white/40 px-4 py-6 shadow-sm sm:px-8 sm:py-8">
          <section>
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              Hur gammal är du?
            </h2>

            <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
              <OptionCard
                label="2–4 år"
                iconSrc={age2_4}
                selected={filters.age === "2-4"}
                className="bg-emerald-50/80 border-emerald-300 hover:bg-emerald-50"
                onClick={() => setFilters((p) => ({ ...p, age: "2-4" }))}
              />
              <OptionCard
                label="5–7 år"
                iconSrc={age5_7}
                selected={filters.age === "5-7"}
                className="bg-emerald-50/80 border-emerald-300 hover:bg-emerald-50"
                onClick={() => setFilters((p) => ({ ...p, age: "5-7" }))}
              />
              <OptionCard
                label="8–10 år"
                iconSrc={age8_10}
                selected={filters.age === "8-10"}
                className="bg-emerald-50/80 border-emerald-300 hover:bg-emerald-50"
                onClick={() => setFilters((p) => ({ ...p, age: "8-10" }))}
              />
            </div>
          </section>

          <section className="mt-8 sm:mt-10">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              Var vill du leka?
            </h2>

            <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
              <OptionCard
                label="Inomhus"
                iconSrc={indoors}
                selected={filters.where === "inomhus"}
                className="bg-violet-50/70 border-violet-300 hover:bg-violet-50"
                onClick={() => setFilters((p) => ({ ...p, where: "inomhus" }))}
              />
              <OptionCard
                label="Utomhus"
                iconSrc={outdoors}
                selected={filters.where === "utomhus"}
                className="bg-violet-50/70 border-violet-300 hover:bg-violet-50"
                onClick={() => setFilters((p) => ({ ...p, where: "utomhus" }))}
              />
              <OptionCard
                label="Var som helst"
                iconSrc={anywhere}
                selected={filters.where === "valfritt"}
                className="bg-violet-50/70 border-violet-300 hover:bg-violet-50"
                onClick={() => setFilters((p) => ({ ...p, where: "valfritt" }))}
              />
            </div>
          </section>

          <section className="mt-8 sm:mt-10">
            <h2 className="text-center text-xl font-bold sm:text-2xl">
              När vill du leka?
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <OptionCard
                label="Dag"
                iconSrc={dayIcon}
                selected={filters.when === "dag"}
                className="bg-sky-50/80 border-sky-300 hover:bg-sky-50"
                onClick={() => setFilters((p) => ({ ...p, when: "dag" }))}
              />
              <OptionCard
                label="Kväll"
                iconSrc={eveningIcon}
                selected={filters.when === "kväll"}
                className="bg-sky-50/80 border-sky-300 hover:bg-sky-50"
                onClick={() => setFilters((p) => ({ ...p, when: "kväll" }))}
              />
            </div>
          </section>

          <Button
            type="button"
            disabled={!canSubmit || !hasResults}
            className="mt-8 w-full rounded-full py-4 text-lg sm:mt-10"
            onClick={pickRandomActivity}
          >
            <span className="inline-flex items-center justify-center gap-2">
              Jag väljer en aktivitet åt dig
              <img
                src={confettiIcon}
                alt=""
                className="h-10 w-10 sm:h-12 sm:w-12"
              />
            </span>
          </Button>

          {canSubmit && !hasResults ? (
            <p className="mt-4 text-center text-sm text-gray-600">
              Jag hittade ingen aktivitet som matchar. Testa att ändra dina val
              😊
            </p>
          ) : null}
        </div>
      </main>
    </AppLayout>
  );
}
