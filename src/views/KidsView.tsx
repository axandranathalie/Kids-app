import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { OptionCard } from "../components/ui/OptionCard";
import { AppLayout } from "../components/layout/AppLayout";
import { allActivities } from "../data/activities";
import { filterActivities, type KidsFilters } from "../lib/filterActivities";
import type { Activity } from "../types/activity";

// Icons
import age2_4 from "../assets/icons/kid3-5.png";
import age5_7 from "../assets/icons/kid6-7.png";
import age8_10 from "../assets/icons/kid8-10.png";
import indoors from "../assets/icons/indoors.png";
import outdoors from "../assets/icons/outdoors.png";
import anywhere from "../assets/icons/anywhere.png";
import dayIcon from "../assets/icons/day.png";
import eveningIcon from "../assets/icons/evening.png";

const defaultFilters: KidsFilters = {
  age: null,
  where: null,
  when: null,
};

export function KidsView() {
  const [filters, setFilters] = useState<KidsFilters>(defaultFilters);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Enable submit only when all filters are selected.
  const canSubmit = Boolean(filters.age && filters.where && filters.when);

const filteredActivities = useMemo(() => {
  return filterActivities(allActivities, filters);
}, [filters]);


  const pickRandomActivity = () => {
    // Reset previous result on every click.
    setSelectedActivity(null);

    if (!canSubmit) return;

    const list = filteredActivities;
    if (list.length === 0) return;

    const random = list[Math.floor(Math.random() * list.length)];
    setSelectedActivity(random);
  };

  return (
    <AppLayout
      header={
        <header className="grid grid-cols-3 items-center">
          <div className="justify-self-start">
            <Link
              to="/"
              className="inline-flex items-center rounded-xl border border-gray-300 bg-white/60 px-3 py-2 text-sm font-semibold"
            >
              ← Tillbaka
            </Link>
          </div>

          <h1 className="justify-self-center text-2xl font-bold">Barnläge</h1>

          <div className="justify-self-end text-right text-sm text-gray-600">
            Vädret just nu
          </div>
        </header>
      }
    >
      <main>
        {/* Age */}
        <section className="mt-8">
          <h2 className="text-center text-xl font-bold">Hur gammal är du?</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <OptionCard
              label="2–4 år"
              iconSrc={age2_4}
              selected={filters.age === "2-4"}
              onClick={() => {
                setFilters((p) => ({ ...p, age: "2-4" }));
                setSelectedActivity(null);
              }}
            />
            <OptionCard
              label="5–7 år"
              iconSrc={age5_7}
              selected={filters.age === "5-7"}
              onClick={() => {
                setFilters((p) => ({ ...p, age: "5-7" }));
                setSelectedActivity(null);
              }}
            />
            <OptionCard
              label="8–10 år"
              iconSrc={age8_10}
              selected={filters.age === "8-10"}
              onClick={() => {
                setFilters((p) => ({ ...p, age: "8-10" }));
                setSelectedActivity(null);
              }}
            />
          </div>
        </section>

        {/* Where */}
        <section className="mt-10">
          <h2 className="text-center text-xl font-bold">Var vill du leka?</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <OptionCard
              label="Inomhus"
              iconSrc={indoors}
              selected={filters.where === "inomhus"}
              onClick={() => {
                setFilters((p) => ({ ...p, where: "inomhus" }));
                setSelectedActivity(null);
              }}
            />
            <OptionCard
              label="Utomhus"
              iconSrc={outdoors}
              selected={filters.where === "utomhus"}
              onClick={() => {
                setFilters((p) => ({ ...p, where: "utomhus" }));
                setSelectedActivity(null);
              }}
            />
            <OptionCard
              label="Var som helst"
              iconSrc={anywhere}
              selected={filters.where === "valfritt"}
              onClick={() => {
                setFilters((p) => ({ ...p, where: "valfritt" }));
                setSelectedActivity(null);
              }}
            />
          </div>
        </section>

        {/* When */}
        <section className="mt-10">
          <h2 className="text-center text-xl font-bold">När vill du leka?</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <OptionCard
              label="Dag"
              iconSrc={dayIcon}
              selected={filters.when === "dag"}
              onClick={() => {
                setFilters((p) => ({ ...p, when: "dag" }));
                setSelectedActivity(null);
              }}
            />
            <OptionCard
              label="Kväll"
              iconSrc={eveningIcon}
              selected={filters.when === "kväll"}
              onClick={() => {
                setFilters((p) => ({ ...p, when: "kväll" }));
                setSelectedActivity(null);
              }}
            />
          </div>
        </section>

        <Button
          type="button"
          disabled={!canSubmit}
          className="mt-10 w-full rounded-full py-4 text-lg"
          onClick={pickRandomActivity}
        >
          Jag väljer en aktivitet åt dig 🎉
        </Button>

        {canSubmit && filteredActivities.length === 0 ? (
          <p className="mt-4 text-sm text-gray-600">
            Jag hittade ingen aktivitet som matchar. Testa att ändra dina val 😊
          </p>
        ) : null}

        {selectedActivity ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white/70 p-4">
            <h3 className="text-lg font-bold">{selectedActivity.title}</h3>
            {selectedActivity.description ? (
              <p className="mt-2 text-sm text-gray-600">
                {selectedActivity.description}
              </p>
            ) : null}
          </div>
        ) : null}
      </main>
    </AppLayout>
  );
}
