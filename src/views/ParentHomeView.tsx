import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { AddActivityModal } from "../components/parent/AddActivityModal";

import { allActivities } from "../data/activities";
import type { Activity } from "../types/activity";
import { getActivityImageUrl } from "../lib/getActivityImage";
import {
  readCustomActivities,
  writeCustomActivities,
} from "../lib/customActivitiesStorage";
import { presetCities } from "../data/presetCities";
import {
  readSelectedCityId,
  writeSelectedCityId,
} from "../lib/weatherCityStorage";
import {
  readHiddenActivityIds,
  writeHiddenActivityIds,
} from "../lib/hiddenActivitiesStorage";

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
  if (a.weather === "inomhus") return "Inomhus";
  if (a.weather === "utomhus") return "Utomhus";
  return "Var som helst";
}

function getWhenLabel(a: Activity): string {
  if (a.timeOfDay === "morgon") return "Morgon";
  if (a.timeOfDay === "eftermiddag") return "Eftermiddag";
  if (a.timeOfDay === "kväll") return "Kväll";
  return "När som helst";
}

function resolveActivityImageSrc(activity: Activity): string | undefined {
  return activity.image?.src ?? getActivityImageUrl(activity);
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
    readHiddenActivityIds(),
  );

  const [isAddOpen, setIsAddOpen] = useState(false);

  const [customActivities, setCustomActivities] = useState<Activity[]>(() =>
    readCustomActivities(),
  );

  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const activities = useMemo(
    () => [...customActivities, ...allActivities],
    [customActivities],
  );

  const totalCount = activities.length;
  const [selectedCityId, setSelectedCityId] = useState(() =>
    readSelectedCityId(),
  );

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

      if (makeVisible) next.delete(activityId);
      else next.add(activityId);

      writeHiddenActivityIds(next);
      return next;
    });
  };

  const deleteCustomActivity = (activityId: string) => {
    const ok = window.confirm("Vill du ta bort aktiviteten?");
    if (!ok) return;

    setCustomActivities((prev) => {
      const next = prev.filter((a) => a.id !== activityId);
      writeCustomActivities(next);
      return next;
    });

    setHiddenIds((prev) => {
      if (!prev.has(activityId)) return prev;
      const next = new Set(prev);
      next.delete(activityId);
      writeHiddenActivityIds(next);
      return next;
    });

    if (editingActivity?.id === activityId) {
      setIsAddOpen(false);
      setEditingActivity(null);
    }
  };

  // Load a few images eagerly on mobile to avoid “blank thumbnails” during fast scroll.
  const eagerCount = useMemo(() => {
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    return isMobile ? 18 : 12;
  }, []);

  return (
    <main className="min-h-dvh bg-[#fbf7ea] p-6 font-kids">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center rounded-xl border border-gray-300 bg-white/70 px-3 py-2 text-sm font-semibold"
        >
          ← Tillbaka
        </Link>
        <div className="w-20" />
      </header>

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

        <div className="mt-4 rounded-2xl bg-white/60 px-4 py-3 shadow-sm border border-black/10">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-extrabold text-gray-900">
              Välj stad
            </div>

            <div className="relative w-44 sm:w-56">
              <select
                value={selectedCityId}
                onChange={(e) => {
                  const next = e.target.value;
                  setSelectedCityId(next);
                  writeSelectedCityId(next);
                }}
                aria-label="Välj väderstad"
                className="w-full appearance-none rounded-xl border border-black/10 bg-white/70 pl-3 pr-10 py-2 text-sm font-semibold text-gray-900"
              >
                {[...presetCities]
                  .sort((a, b) => a.name.localeCompare(b.name, "sv"))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>

              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-700"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingActivity(null);
            setIsAddOpen(true);
          }}
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

        <ul className="mt-4 space-y-3">
          {activities.map((activity, index) => {
            const imgUrl = resolveActivityImageSrc(activity);
            const hidden = isHidden(activity.id, hiddenIds);
            const isCustom = activity.source === "custom";
            const shouldEagerLoad = isCustom || index < eagerCount;

            return (
              <li
                key={activity.id}
                className="rounded-2xl border border-black/10 bg-white p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-white">
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={
                          activity.image?.alt ||
                          activity.title ||
                          "Aktivitetsbild"
                        }
                        className="h-full w-full object-cover"
                        loading={shouldEagerLoad ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={shouldEagerLoad ? "high" : "auto"}
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-[10px] font-semibold text-gray-500">
                        Ingen bild
                      </div>
                    )}
                  </div>

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

                  <div className="flex items-center gap-3">
                    {activity.source === "custom" ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingActivity(activity);
                            setIsAddOpen(true);
                          }}
                          className="rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-extrabold text-gray-800"
                        >
                          Redigera
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteCustomActivity(activity.id)}
                          className="rounded-full border border-red-200 bg-red-50/80 px-3 py-2 text-xs font-extrabold text-red-700 hover:bg-red-100"
                        >
                          Radera
                        </button>
                      </div>
                    ) : null}

                    <div className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/70">
                      {hidden ? (
                        <EyeOff className="h-5 w-5 text-gray-700" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-700" />
                      )}
                    </div>

                    <Switch
                      checked={!hidden}
                      onChange={(nextVisible) =>
                        toggleVisibility(activity.id, nextVisible)
                      }
                      label={hidden ? "Visa aktivitet" : "Dölj aktivitet"}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <AddActivityModal
        // Force remount to reset modal state between add/edit.
        key={(editingActivity?.id ?? "new") + "-" + String(isAddOpen)}
        open={isAddOpen}
        initialActivity={editingActivity}
        onClose={() => {
          setIsAddOpen(false);
          setEditingActivity(null);
        }}
        onSubmit={(activityFromModal) => {
          setCustomActivities((prev) => {
            const next = editingActivity
              ? prev.map((a) =>
                  a.id === editingActivity.id
                    ? { ...activityFromModal, id: a.id }
                    : a,
                )
              : [activityFromModal, ...prev];

            writeCustomActivities(next);

            return next;
          });

          setIsAddOpen(false);
          setEditingActivity(null);
        }}
      />
    </main>
  );
}
