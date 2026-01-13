import { Link } from "react-router-dom";

export function ParentHomeView() {
  return (
    <main className="min-h-dvh bg-[#fbf7ea] p-6 font-kids">
      <header className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center rounded-xl border border-gray-300 bg-white/70 px-3 py-2 text-sm font-semibold"
        >
          ← Tillbaka
        </Link>
      </header>

      <h1 className="text-3xl font-bold">Föräldraläge</h1>
      <p className="mt-2 text-gray-700">
        Här kommer inställningar sen.
      </p>
    </main>
  );
}
