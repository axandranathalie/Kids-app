import { Link } from "react-router-dom";
import { baseActivities } from "../data/activities";

export function KidsView() {
  return (
    <main className="min-h-screen p-6">
      <header className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center rounded-xl border border-gray-300 px-3 py-2 text-sm font-semibold"
        >
          ← Tillbaka
        </Link>
      </header>

      <h1 className="text-2xl font-bold">Barnläge</h1>
      <p className="mt-2 text-sm text-gray-600">
        Antal aktiviteter: {baseActivities.length}
      </p>
    </main>
  );
}
