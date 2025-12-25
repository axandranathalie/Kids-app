import { Link } from "react-router-dom";

export function StartView() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-3xl font-bold">Aktivitetsgeneratorn</h1>
        <p className="text-sm text-gray-600">Välj ett läge för att fortsätta.</p>

        <div className="grid gap-3">
          <Link
            to="/kids"
            className="rounded-xl bg-black px-4 py-3 text-white font-semibold"
          >
            Barnläge
          </Link>

          <Link
            to="/parent"
            className="rounded-xl border border-gray-300 px-4 py-3 font-semibold"
          >
            Vuxenläge
          </Link>
        </div>
      </div>
    </main>
  );
}
