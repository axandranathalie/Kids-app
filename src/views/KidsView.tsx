import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

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

type OptionButtonProps = {
  label: string;
  iconSrc: string;
  selected: boolean;
  onClick: () => void;
};

function OptionButton({
  label,
  iconSrc,
  selected,
  onClick,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-2xl border px-4 py-3 text-center font-semibold shadow-sm transition",
        selected
          ? "border-black bg-white"
          : "border-gray-200 bg-white/70 hover:bg-white",
      ].join(" ")}
    >
      <img
        src={iconSrc}
        alt=""
        className="mx-auto mb-2 h-12 w-12 object-contain"
      />
      <span className="block">{label}</span>
    </button>
  );
}

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
            <OptionButton
              label="3–5 år"
              iconSrc={age3_5}
              selected={filters.age === "3-5"}
              onClick={() => setFilters((p) => ({ ...p, age: "3-5" }))}
            />
            <OptionButton
              label="6–7 år"
              iconSrc={age6_7}
              selected={filters.age === "6-7"}
              onClick={() => setFilters((p) => ({ ...p, age: "6-7" }))}
            />
            <OptionButton
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
            <OptionButton
              label="Inomhus"
              iconSrc={indoors}
              selected={filters.where === "indoors"}
              onClick={() => setFilters((p) => ({ ...p, where: "indoors" }))}
            />
            <OptionButton
              label="Utomhus"
              iconSrc={outdoors}
              selected={filters.where === "outdoors"}
              onClick={() => setFilters((p) => ({ ...p, where: "outdoors" }))}
            />
            <OptionButton
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
            <OptionButton
              label="Dag"
              iconSrc={day}
              selected={filters.when === "day"}
              onClick={() => setFilters((p) => ({ ...p, when: "day" }))}
            />
            <OptionButton
              label="Kväll"
              iconSrc={evening}
              selected={filters.when === "evening"}
              onClick={() => setFilters((p) => ({ ...p, when: "evening" }))}
            />
          </div>
        </section>

        <button
          type="button"
          disabled={!canSubmit}
          className={[
            "mt-10 w-full rounded-full px-6 py-4 text-lg font-bold shadow-md transition",
            canSubmit
              ? "bg-rose-400 text-white hover:brightness-95"
              : "bg-gray-200 text-gray-500 cursor-not-allowed",
          ].join(" ")}
          onClick={() => {
            // Placeholder for next step: filtering + random activity selection.
            console.log("Selected filters:", filters);
          }}
        >
          Jag väljer en aktivitet åt dig 🎉
        </button>
      </div>
    </main>
  );
}
