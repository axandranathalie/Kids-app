import { Link } from "react-router-dom";

export function ParentView() {
  return (
    <main className="min-h-screen p-6">
      <header className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center rounded-xl border border-gray-300 px-3 py-2 text-sm font-semibold"
        >
          ← Back
        </Link>
      </header>

      <h1 className="text-2xl font-bold">Parent mode</h1>
    </main>
  );
}
