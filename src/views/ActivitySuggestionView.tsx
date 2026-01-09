import { Link, useLocation, useNavigate } from "react-router-dom";
import type { Activity } from "../types/activity";
import { activityImageByFile } from "../lib/activityImages";

type LocationState = {
  activity?: Activity;
};

function getActivityImageUrl(activity: Activity): string | undefined {
  const file = activity.image?.file;
  if (!file) return undefined;

  // Matches filenames in /src/assets/activities/
  return activityImageByFile[file];
}

export function ActivitySuggestionView() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const activity = state?.activity;

  // If someone visits the route directly (no state), send them back to kids page.
  if (!activity) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white/70 p-5 text-center">
          <h1 className="text-xl font-bold">Ingen aktivitet vald</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gå tillbaka och välj en aktivitet först 😊
          </p>

          <button
            type="button"
            className="mt-4 w-full rounded-full bg-black text-white py-3 font-semibold"
            onClick={() => navigate("/kids")}
          >
            Till barnläge
          </button>
        </div>
      </div>
    );
  }

  const imgUrl = getActivityImageUrl(activity);

  return (
    <div className="min-h-dvh p-6">
      <header className="flex items-center justify-between">
        <Link
          to="/kids"
          className="inline-flex items-center rounded-xl border border-gray-300 bg-white/60 px-3 py-2 text-sm font-semibold"
        >
          ← Tillbaka
        </Link>

        <h1 className="text-xl font-bold">Jag har hittat en aktivitet ✨</h1>

        <div className="w-21.5" />
      </header>

      <main className="mt-6 flex justify-center">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/70 p-4">
          <h2 className="text-center text-lg font-bold">{activity.title}</h2>

          {imgUrl ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white">
              <img
                src={imgUrl}
                alt={activity.image?.alt ?? activity.title}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          ) : null}

          {activity.description ? (
            <p className="mt-4 text-sm text-gray-700">{activity.description}</p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
