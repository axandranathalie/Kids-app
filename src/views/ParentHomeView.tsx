import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { AddActivityModal } from "../components/parent/AddActivityModal";

import { allActivities } from "../data/activities";
import type { Activity } from "../types/activity";
import { getActivityImageUrl } from "../lib/getActivityImage";

// LocalStorage key for hidden activities in kids mode
const HIDDEN_KEY = "kidsapp_hidden_activity_ids";

function readHiddenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(HIDDEN_KEY);
    if (!raw) return new Set();

    const arr: unknown = JSON.parse(raw);
    if (!Array.isArray(arr)) return new Set();

    return new Set(arr.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function writeHiddenIds(ids: Set<string>) {
  localStorage.setItem(HIDDEN_KEY, JSON.stringify(Array.from(ids)));
}

function isHidden(activityId: string, hiddenIds: Set<string>): boolean {
  return hiddenIds.has(activityId);
}

function getAgeLabels(activity: Activity): string[] {
  const pretty = (g: string) => {
    if (g === "2-4") return "2–4";
    if (g === "5-7") return "5–7";
    if (g === "8-10") return "8–10";
    return g;
  };

  return (activity.ageGroups ?? []).map(pretty);
}

function getWhereLabel(a: Activity): string {
  // weather tag: inomhus / utomhus / valfritt
  if (a.weather === "inomhus") return "Inomhus";
  if (a.weather === "utomhus") return "Utomhus";
  return "Var som helst";
}

function getWhenLabel(a: Activity): string {
  // timeOfDay: morgon / eftermiddag / kväll / valfritt
  if (a.timeOfDay === "morgon") return "Morgon";
  if (a.timeOfDay === "eftermiddag") return "Eftermiddag";
  if (a.timeOfDay === "kväll") return "Kväll";
  return "När som helst";
}

type ChipProps = {
  children: ReactNode;
  className?: string;
};

function Chip({ children, className }: ChipProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        "border border-black/10 bg-white/70 text-gray-800",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

type SwitchProps = {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  label?: string;
};

function Switch({ checked, onChange, disabled, label }: SwitchProps) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      aria-label={label ?? (checked ? "Visible" : "Hidden")}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-6 w-11 items-center rounded-full border",
        "transition",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        checked
          ? "bg-emerald-200 border-emerald-600"
          : "bg-gray-200 border-gray-300",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition",
          checked ? "translate-x-5" : "translate-x-0.5",
        ].join(" ")}
      />
    </button>
  );
}

export function ParentHomeView() {
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(() =>
    readHiddenIds()
  );
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [customActivities, setCustomActivities] = useState<Activity[]>([]);

  const activities = useMemo(
    () => [...customActivities, ...allActivities],
    [customActivities]
  );

  const totalCount = activities.length;

  const visibleCount = useMemo(() => {
    let visible = 0;
    for (const a of activities) {
      if (!isHidden(a.id, hiddenIds)) visible += 1;
    }
    return visible;
  }, [activities, hiddenIds]);

  const toggleVisibility = (activityId: string, makeVisible: boolean) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);

      // makeVisible=true => remove from hidden
      if (makeVisible) next.delete(activityId);
      else next.add(activityId);

      writeHiddenIds(next);
      return next;
    });
  };

  return (
    <main className="min-h-dvh bg-[#fbf7ea] p-6 font-kids">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center rounded-xl border border-gray-300 bg-white/70 px-3 py-2 text-sm font-semibold"
        >
          ← Tillbaka
        </Link>

        {/* Keeps header spacing stable */}
        <div className="w-20" />
      </header>

      {/* Top summary */}
      <section className="mx-auto mt-6 w-full max-w-4xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/60 p-4 text-center shadow-sm border border-black/10">
            <div className="text-2xl font-extrabold text-gray-900">
              {totalCount}
            </div>
            <div className="mt-1 text-sm font-semibold text-gray-700">
              Totalt antal aktiviteter
            </div>
          </div>

          <div className="rounded-2xl bg-white/60 p-4 text-center shadow-sm border border-black/10">
            <div className="text-2xl font-extrabold text-gray-900">
              {visibleCount}
            </div>
            <div className="mt-1 text-sm font-semibold text-gray-700">
              Synliga aktiviteter för barn
            </div>
          </div>
        </div>

        {/* Add button */}
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className={[
            "mt-5 w-full rounded-full py-4 text-lg font-extrabold shadow-sm",
            "bg-orange-400 text-white border-2 border-orange-500",
            "hover:brightness-[0.98] active:scale-[0.99] transition",
          ].join(" ")}
        >
          + Lägg till ny aktivitet
        </button>

        <h2 className="mt-8 text-center text-2xl font-extrabold text-gray-900">
          Aktiviteter
        </h2>

        {/* List */}
        <ul className="mt-4 space-y-3">
          {activities.map((activity) => {
            const imgUrl = getActivityImageUrl(activity);
            const hidden = isHidden(activity.id, hiddenIds);

            return (
              <li
                key={activity.id}
                className="rounded-2xl bg-white/60 p-4 shadow-sm border border-black/10"
              >
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-white/60">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={activity.image?.alt ?? activity.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-[10px] font-semibold text-gray-500">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Text + chips */}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-base font-extrabold text-gray-900">
                      {activity.title}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {getAgeLabels(activity).map((label) => (
                        <Chip
                          key={`${activity.id}-age-${label}`}
                          className="bg-sky-50/80 border-sky-200"
                        >
                          {label}
                        </Chip>
                      ))}

                      <Chip className="bg-violet-50/80 border-violet-200">
                        {getWhereLabel(activity)}
                      </Chip>

                      <Chip className="bg-emerald-50/80 border-emerald-200">
                        {getWhenLabel(activity)}
                      </Chip>
                    </div>
                  </div>

                  {/* Right controls */}
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-white/70 border border-black/10">
                      {hidden ? (
                        <EyeOff className="h-5 w-5 text-gray-700" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-700" />
                      )}
                    </div>

                    {/* Switch: ON = visible, OFF = hidden */}
                    <Switch
                      checked={!hidden}
                      onChange={(nextVisible) =>
                        toggleVisibility(activity.id, nextVisible)
                      }
                      label="Toggle visibility"
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      <AddActivityModal
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={(newActivity) => {
          setCustomActivities((prev) => [newActivity, ...prev]);
          setIsAddOpen(false);
        }}
      />
    </main>
  );
}
