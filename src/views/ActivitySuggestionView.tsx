import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import type { Activity } from "../types/activity";
import { activityImageByFile } from "../lib/activityImages";
import { allActivities } from "../data/activities";
import { readCustomActivities } from "../lib/customActivitiesStorage";
import { readHiddenActivityIds } from "../lib/hiddenActivitiesStorage";
import { filterActivities, type KidsFilters } from "../lib/filterActivities";
import confettiIcon from "../assets/icons/confetti1.png";
import refreshIcon from "../assets/icons/refresh.png";
import soundIcon from "../assets/icons/sound.png";

type LocationState = {
  activity?: Activity;
  filters?: KidsFilters;
};

function getActivityImageUrl(activity: Activity): string | undefined {
  // Custom activities may store an image as a direct URL (data/blob).
  if (activity.image?.src) return activity.image.src;

  // Base activities map an image key to an imported asset.
  const file = activity.image?.file;
  if (!file) return undefined;

  return activityImageByFile[file];
}

export function ActivitySuggestionView() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const activity = state?.activity;
  const filters = state?.filters;

  const [isSpeaking, setIsSpeaking] = useState(false);

  const getSvVoice = () => {
    const voices = window.speechSynthesis?.getVoices?.() ?? [];
    return voices.find((v) => v.lang?.toLowerCase().startsWith("sv")) ?? null;
  };

  // Cancel any ongoing speech without touching React state (safe in effects).
  const cancelSpeech = () => {
    window.speechSynthesis?.cancel?.();
  };

  // Stop speech and reset UI state (use for user actions).
  const stopSpeech = () => {
    cancelSpeech();
    setIsSpeaking(false);
  };

  const speakActivity = (a: Activity) => {
    if (!("speechSynthesis" in window)) return;

    // Toggle: if already speaking, stop.
    if (window.speechSynthesis.speaking || isSpeaking) {
      stopSpeech();
      return;
    }

    const parts: string[] = [];
    if (a.title) parts.push(a.title);
    if (a.description) parts.push(a.description);
    if (a.steps?.length) parts.push("Steg:");
    if (a.steps?.length) parts.push(...a.steps);

    const utter = new SpeechSynthesisUtterance(parts.join(". "));
    utter.lang = "sv-SE";
    utter.rate = 0.95;

    const voice = getSvVoice();
    if (voice) utter.voice = voice;

    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utter);
  };

  const hiddenIds = useMemo(() => readHiddenActivityIds(), []);
  const customActivities = useMemo(() => readCustomActivities(), []);

  const filteredActivities = useMemo(() => {
    if (!filters) return [];

    // Apply parent settings: include custom activities, exclude hidden ones.
    const available = [...customActivities, ...allActivities].filter(
      (a) => !hiddenIds.has(a.id),
    );

    return filterActivities(available, filters);
  }, [filters, customActivities, hiddenIds]);

  useEffect(() => {
    // Router state can be lost on refresh; recover by picking a fallback activity.
    if (!filters) return;
    if (activity) return;

    const first = filteredActivities[0];
    if (!first) return;

    navigate("/activity-suggestion", {
      replace: true,
      state: { activity: first, filters },
    });
  }, [activity, filters, filteredActivities, navigate]);

  useEffect(() => {
    // Ensure speech is stopped if the user leaves this page.
    return () => {
      cancelSpeech();
    };
  }, []);

  useEffect(() => {
    // Stop speech when the activity changes.
    cancelSpeech();

    // Reset speaking state asynchronously (keeps ESLint rule happy).
    const id = window.setTimeout(() => setIsSpeaking(false), 0);
    return () => window.clearTimeout(id);
  }, [activity?.id]);

  if (!filters) {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6 bg-[#fbf7ea]">
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

  if (!activity) {
    if (!filteredActivities[0]) {
      return (
        <div className="min-h-dvh flex items-center justify-center p-6 bg-[#fbf7ea]">
          <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white/70 p-5 text-center">
            <h1 className="text-xl font-bold">Inga aktiviteter hittades</h1>
            <p className="mt-2 text-sm text-gray-600">
              Testa att ändra dina val så hittar vi något 😊
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
    return null;
  }

  const imgUrl = getActivityImageUrl(activity);

  const getNewActivity = () => {
    // Avoid repeating the same activity.
    const list = filteredActivities.filter((a) => a.id !== activity.id);
    if (list.length === 0) return;

    const random = list[Math.floor(Math.random() * list.length)];

    // Replace state to avoid adding extra history entries.
    navigate("/activity-suggestion", {
      replace: true,
      state: { activity: random, filters },
    });
  };

  const noMore = filteredActivities.length <= 1;

  return (
    <div className="min-h-dvh bg-[#fbf7ea] px-4 py-6 sm:px-6 font-kids">
      <header className="relative">
        <Link
          to="/kids"
          className="absolute left-0 top-0 inline-flex items-center rounded-xl border border-gray-300 bg-white/70 px-3 py-2 text-sm font-semibold"
        >
          ← Tillbaka
        </Link>

        <div className="pt-12 sm:hidden">
          <h1 className="flex items-center justify-center gap-3 text-2xl font-bold text-center">
            Jag har hittat en aktivitet
            <img src={confettiIcon} alt="" className="h-9 w-9" />
          </h1>
        </div>

        <div className="hidden sm:flex items-center justify-center pt-2">
          <h1 className="inline-flex items-center gap-3 text-4xl md:text-5xl font-bold tracking-tight whitespace-nowrap">
            Jag har hittat en aktivitet
            <img src={confettiIcon} alt="" className="h-12 w-12" />
          </h1>
        </div>
      </header>

      <main className="mt-6 flex justify-center">
        <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
          <div
            className={[
              "rounded-3xl border-2 overflow-hidden",
              "border-pink-400",
              "shadow-[0_8px_30px_rgba(0,0,0,0.08)]",
              "bg-linear-to-b from-pink-200/70 via-pink-100/40 to-sky-200/50",
            ].join(" ")}
          >
            <div className="p-5 sm:p-8 md:p-10">
              <div className="flex items-center justify-center gap-3">
                <div className="px-5 py-2 text-center font-extrabold text-xl sm:text-2xl md:text-3xl text-gray-900">
                  {activity.title}
                </div>

                <button
                  type="button"
                  onClick={() => speakActivity(activity)}
                  aria-label={
                    isSpeaking ? "Stoppa uppläsning" : "Läs upp aktivitet"
                  }
                  className={[
                    "inline-flex items-center justify-center rounded-full px-3 py-2 border-2 shadow-sm",
                    "bg-emerald-100 border-emerald-600",
                    "transition active:scale-[0.98]",
                    "focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600/25",
                    isSpeaking ? "brightness-95" : "hover:brightness-[0.98]",
                  ].join(" ")}
                >
                  <img
                    src={soundIcon}
                    alt=""
                    aria-hidden="true"
                    className="h-6 w-6 sm:h-7 sm:w-7"
                  />
                </button>
              </div>

              {imgUrl ? (
                <div className="mt-5 flex justify-center">
                  <div className="w-full max-w-xs sm:max-w-sm md:max-w-md overflow-hidden rounded-3xl border border-black/10 bg-white/60">
                    <img
                      src={imgUrl}
                      alt={activity.image?.alt || activity.title || "Aktivitetsbild"}
                      loading="lazy"
                      className="w-full object-cover rounded-3xl max-h-80 sm:max-h-90 md:max-h-105"
                    />
                  </div>
                </div>
              ) : null}

              {activity.description ? (
                <p className="mt-5 text-center text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                  {activity.description}
                </p>
              ) : null}

              {activity.steps?.length ? (
                <div className="mt-4 flex justify-center">
                  <ul className="w-full max-w-sm sm:max-w-md md:max-w-lg list-disc space-y-3 pl-12 text-base sm:text-lg md:text-xl text-gray-800">
                    {activity.steps.map((step, index) => (
                      <li key={`${activity.id}-step-${index}`}>{step}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <button
                type="button"
                className={[
                  "mt-8 w-full rounded-full px-6 py-4 sm:py-5",
                  "font-bold text-lg sm:text-xl md:text-2xl",
                  "bg-emerald-100 text-gray-900 border-4 border-emerald-600",
                  "shadow-sm transition active:scale-[0.99]",
                  noMore ? "opacity-50" : "hover:brightness-[0.98]",
                ].join(" ")}
                onClick={getNewActivity}
                disabled={noMore}
              >
                <span className="flex w-full items-center justify-center gap-3">
                  <span className="text-center">
                    Jag vill ha en ny aktivitet
                  </span>
                  <img
                    src={refreshIcon}
                    alt=""
                    className="h-8 w-8 sm:h-9 sm:w-9"
                  />
                </span>
              </button>

              {noMore ? (
                <p className="mt-3 text-center text-sm sm:text-base text-gray-700">
                  Jag har inga fler som matchar dina val just nu.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
