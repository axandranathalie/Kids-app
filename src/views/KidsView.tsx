import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { OptionCard } from "../components/ui/OptionCard";

// Icons
import age3_5 from "../assets/icons/kid3-5.png";
import age6_7 from "../assets/icons/kid6-7.png";
import age8_10 from "../assets/icons/kid8-10.png";
import indoors from "../assets/icons/indoors.png";
import outdoors from "../assets/icons/outdoors.png";
import anywhere from "../assets/icons/anywhere.png";
import day from "../assets/icons/day.png";
import evening from "../assets/icons/evening.png";

type AgeGroup = "3-5" | "6-7" | "8-10";
type Where = "indoors" | "outdoors" | "anywhere";
type When = "day" | "evening";

type KidsFilters = {
  age: AgeGroup | null;
  where: Where | null;
  when: When | null;
};

const defaultFilters: KidsFilters = {
  age: null,
  where: null,
  when: null,
};



export function KidsView() {
  const [filters, setFilters] = useState<KidsFilters>(defaultFilters);

  // Enables the main button only when all filters are selected.
  const canSubmit = useMemo(() => {
    return Boolean(filters.age && filters.where && filters.when);
  }, [filters.age, filters.where, filters.when]);

  return (
    <main className="min-h-screen p-6">
      <header className="mb-6 grid grid-cols-3 items-center">
        <div className="justify-self-start">
          <Link
            to="/"
            className="inline-flex items-center rounded-xl border border-gray-300 px-3 py-2 text-sm font-semibold"
          >
            ← Tillbaka
          </Link>
        </div>

        <h1 className="justify-self-center text-2xl font-bold">Barnläge</h1>

        <div className="justify-self-end text-right text-sm text-gray-600">
          Vädret just nu
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl">
        {/* Age */}
        <section className="mt-8">
          <h2 className="text-xl font-bold text-center">Hur gammal är du?</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <OptionCard
              label="3–5 år"
              iconSrc={age3_5}
              selected={filters.age === "3-5"}
              onClick={() => setFilters((p) => ({ ...p, age: "3-5" }))}
            />

            <OptionCard
              label="6–7 år"
              iconSrc={age6_7}
              selected={filters.age === "6-7"}
              onClick={() => setFilters((p) => ({ ...p, age: "6-7" }))}
            />
            <OptionCard
              label="8–10 år"
              iconSrc={age8_10}
              selected={filters.age === "8-10"}
              onClick={() => setFilters((p) => ({ ...p, age: "8-10" }))}
            />
          </div>
        </section>

        {/* Where */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-center">Var vill du leka?</h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <OptionCard
              label="Inomhus"
              iconSrc={indoors}
              selected={filters.where === "indoors"}
              onClick={() => setFilters((p) => ({ ...p, where: "indoors" }))}
            />
            <OptionCard
              label="Utomhus"
              iconSrc={outdoors}
              selected={filters.where === "outdoors"}
              onClick={() => setFilters((p) => ({ ...p, where: "outdoors" }))}
            />
            <OptionCard
              label="Var som helst"
              iconSrc={anywhere}
              selected={filters.where === "anywhere"}
              onClick={() => setFilters((p) => ({ ...p, where: "anywhere" }))}
            />
          </div>
        </section>

        {/* When */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-center">När vill du leka?</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <OptionCard
              label="Dag"
              iconSrc={day}
              selected={filters.when === "day"}
              onClick={() => setFilters((p) => ({ ...p, when: "day" }))}
            />
            <OptionCard
              label="Kväll"
              iconSrc={evening}
              selected={filters.when === "evening"}
              onClick={() => setFilters((p) => ({ ...p, when: "evening" }))}
            />
          </div>
        </section>

        <Button
          type="button"
          disabled={!canSubmit}
          className="mt-10 w-full rounded-full py-4 text-lg"
          onClick={() => {
            console.log("Selected filters:", filters);
          }}
        >
          Jag väljer en aktivitet åt dig 🎉
        </Button>
      </div>
    </main>
  );
}
