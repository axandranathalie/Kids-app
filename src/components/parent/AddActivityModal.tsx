import { useCallback, useEffect, useMemo, useState } from "react";
import { X, ChevronDown } from "lucide-react";
import type { Activity, AgeGroup } from "../../types/activity";

import uploadImageIcon from "../../assets/icons/image.png";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (activity: Activity) => void;
  initialActivity?: Activity | null;
};

type WhereValue = Activity["weather"];
type WhenValue = Activity["timeOfDay"];

function makeId(): string {
  return `custom-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function validate(d: {
  title: string;
  description: string;
  steps: string[];
  ageGroups: AgeGroup[];
  where: WhereValue;
  when: WhenValue;
  hasImage: boolean;
}) {
  const errors: Record<string, string> = {};

  const title = d.title.trim();
  const description = d.description.trim();
  const steps = d.steps.map((s) => s.trim()).filter(Boolean);

  if (title.length < 3) errors.title = "Skriv en titel (minst 3 tecken).";
  if (description.length < 10) {
    errors.description = "Skriv en beskrivning (minst 10 tecken).";
  }

  if (d.ageGroups.length === 0) errors.ageGroups = "Välj minst en ålder.";

  // "valfritt" is valid; only guard against empty strings.
  if (!d.where) errors.where = "Välj var aktiviteten kan göras.";
  if (!d.when) errors.when = "Välj när aktiviteten passar.";

  if (steps.length === 0) errors.steps = "Lägg till minst ett steg.";
  else if (steps.some((s) => s.length < 3)) {
    errors.steps = "Varje steg måste ha minst 3 tecken.";
  }

  return { errors, cleanedSteps: steps };
}

export function AddActivityModal({
  open,
  onClose,
  onSubmit,
  initialActivity,
}: Props) {
  const seed = initialActivity ?? null;

  // Form state (initialized on mount; parent should remount via key on open/edit)
  const [title, setTitle] = useState(() => seed?.title ?? "");
  const [description, setDescription] = useState(() => seed?.description ?? "");
  const [steps, setSteps] = useState<string[]>(() =>
    seed?.steps?.length ? seed.steps : [""],
  );
  const [ageGroups, setAgeGroups] = useState<AgeGroup[]>(
    () => seed?.ageGroups ?? [],
  );
  const [where, setWhere] = useState<WhereValue>(
    () => seed?.weather ?? "valfritt",
  );
  const [when, setWhen] = useState<WhenValue>(
    () => seed?.timeOfDay ?? "valfritt",
  );

  const [isWhereOpen, setIsWhereOpen] = useState(false);
  const [isWhenOpen, setIsWhenOpen] = useState(false);

  const whereOptions = [
    { value: "inomhus", label: "Inomhus" },
    { value: "utomhus", label: "Utomhus" },
    { value: "valfritt", label: "Var som helst" },
  ] as const;

  const whenOptions = [
    { value: "morgon", label: "Morgon" },
    { value: "eftermiddag", label: "Dag" },
    { value: "kväll", label: "Kväll" },
    { value: "valfritt", label: "När som helst" },
  ] as const;

  const whereLabel =
    whereOptions.find((o) => o.value === where)?.label ?? "Välj";
  const whenLabel = whenOptions.find((o) => o.value === when)?.label ?? "Välj";

  const [imageFile, setImageFile] = useState<File | null>(null);

  // Persisted image (Data URL) so it survives refresh via LocalStorage
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(
    () => seed?.image?.src ?? null,
  );

  // Temporary preview URL for immediate feedback (does not survive refresh)
  const imagePreviewSrc = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  // What we show in the UI: prefer preview, otherwise saved data URL
  const previewSrc = imagePreviewSrc ?? imageDataUrl;

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const resetLocalState = useCallback(() => {
    setTitle("");
    setDescription("");
    setSteps([""]);
    setAgeGroups([]);
    setWhere("valfritt");
    setWhen("valfritt");
    setImageFile(null);
    setTouched({});
    setSubmitAttempted(false);
  }, []);

  const handleClose = useCallback(() => {
    resetLocalState();
    onClose();
  }, [onClose, resetLocalState]);

  const { errors } = useMemo(
    () =>
      validate({
        title,
        description,
        steps,
        ageGroups,
        where,
        when,
        hasImage: Boolean(previewSrc),
      }),
    [title, description, steps, ageGroups, where, when, previewSrc],
  );

  const canSubmit = Object.keys(errors).length === 0;

  // Close modal on ESC
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Revoke preview URL to avoid leaks
  useEffect(() => {
    if (!imagePreviewSrc) return;
    return () => URL.revokeObjectURL(imagePreviewSrc);
  }, [imagePreviewSrc]);

  if (!open) return null;

  const showError = (key: string) => submitAttempted || touched[key];

  const toggleAge = (g: AgeGroup) => {
    setAgeGroups((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  };

  const updateStep = (idx: number, value: string) => {
    setSteps((prev) => prev.map((s, i) => (i === idx ? value : s)));
  };

  const addStep = () => setSteps((prev) => [...prev, ""]);

  const removeStep = (idx: number) => {
    setSteps((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);

    const next = validate({
      title,
      description,
      steps,
      ageGroups,
      where,
      when,
      hasImage: Boolean(previewSrc),
    });

    if (Object.keys(next.errors).length > 0) return;

    const activity: Activity = {
      id: seed?.id ?? makeId(),
      title: title.trim(),
      description: description.trim(),
      steps: next.cleanedSteps,
      ageGroups,
      weather: where,
      timeOfDay: when,
      image: imageDataUrl
        ? { src: imageDataUrl, alt: title.trim() || "Aktivitetsbild" }
        : undefined,

      source: seed?.source ?? "custom",
    };

    onSubmit(activity);
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={seed ? "Redigera aktivitet" : "Lägg till ny aktivitet"}
    >
      <div className="mx-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white p-5">
          <div className="text-lg font-extrabold text-gray-900">
            {seed ? "Redigera aktivitet" : "Lägg till ny aktivitet"}
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/70"
            aria-label="Stäng"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <div className="max-h-[calc(100dvh-140px)] overflow-y-auto p-5">
          <div className="space-y-4">
            {/* Image upload */}
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Ladda upp bild
              </label>

              <div className="mt-2">
                <input
                  id="activity-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setImageFile(file);

                    if (!file) {
                      setImageDataUrl(null);
                      return;
                    }

                    const reader = new FileReader();
                    reader.onload = () => {
                      const result =
                        typeof reader.result === "string"
                          ? reader.result
                          : null;
                      setImageDataUrl(result);
                    };
                    reader.readAsDataURL(file);
                  }}
                />

                <label
                  htmlFor="activity-image-upload"
                  className="block cursor-pointer rounded-2xl border border-black/10 bg-white/60 p-4 text-center"
                >
                  {previewSrc ? (
                    <div className="mx-auto h-24 w-full overflow-hidden rounded-2xl border border-black/10 bg-white">
                      <img
                        src={previewSrc}
                        alt="Förhandsvisning"
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={uploadImageIcon}
                        alt="Ladda upp bild"
                        className="h-14 w-14"
                        draggable={false}
                      />
                      <div className="text-sm font-extrabold text-gray-900">
                        Ladda upp bild
                      </div>
                      <div className="text-xs font-semibold text-gray-600">
                        Bilden visas för barnet tillsammans med aktiviteten.
                      </div>
                    </div>
                  )}
                </label>

                {previewSrc ? (
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImageDataUrl(null);
                    }}
                    className="mt-2 w-full rounded-full border border-black/10 bg-white/70 py-2 text-xs font-extrabold text-gray-800"
                  >
                    Ta bort bild
                  </button>
                ) : null}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Titel på aktiviteten
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, title: true }))}
                placeholder="Aktivitetens namn…"
                className={cn(
                  "mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm",
                  "border-black/10 focus:outline-none focus:ring-2 focus:ring-black/10",
                  showError("title") && errors.title && "border-red-400",
                )}
              />
              {showError("title") && errors.title ? (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {errors.title}
                </p>
              ) : null}
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Beskrivning av aktiviteten
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => setTouched((p) => ({ ...p, description: true }))}
                placeholder="Förklara vad aktiviteten handlar om…"
                rows={3}
                className={cn(
                  "mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm",
                  "border-black/10 focus:outline-none focus:ring-2 focus:ring-black/10",
                  showError("description") &&
                    errors.description &&
                    "border-red-400",
                )}
              />
              {showError("description") && errors.description ? (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {errors.description}
                </p>
              ) : null}
            </div>

            {/* Steps */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-800">
                  Lägg till steg för steg
                </label>

                <button
                  type="button"
                  onClick={addStep}
                  className="rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs font-extrabold"
                >
                  + Lägg till steg
                </button>
              </div>

              <div className="mt-2 space-y-2">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      value={step}
                      onChange={(e) => updateStep(idx, e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, steps: true }))}
                      placeholder={`Steg ${idx + 1}…`}
                      className={cn(
                        "w-full rounded-xl border bg-white px-3 py-2 text-sm",
                        "border-black/10 focus:outline-none focus:ring-2 focus:ring-black/10",
                        showError("steps") && errors.steps && "border-red-400",
                      )}
                    />

                    <button
                      type="button"
                      onClick={() => removeStep(idx)}
                      disabled={steps.length <= 1}
                      className={cn(
                        "grid h-9 w-9 place-items-center rounded-full border border-black/10",
                        steps.length <= 1
                          ? "bg-gray-100 text-gray-400"
                          : "bg-white/70 text-gray-700",
                      )}
                      aria-label="Ta bort steg"
                      title="Ta bort steg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {showError("steps") && errors.steps ? (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {errors.steps}
                </p>
              ) : null}
            </div>

            {/* Age */}
            <div>
              <label className="text-sm font-semibold text-gray-800">
                Ålder
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["2-4", "5-7", "8-10"] as AgeGroup[]).map((g) => {
                  const active = ageGroups.includes(g);
                  const label =
                    g === "2-4" ? "2–4" : g === "5-7" ? "5–7" : "8–10";

                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleAge(g)}
                      onBlur={() =>
                        setTouched((p) => ({ ...p, ageGroups: true }))
                      }
                      className={cn(
                        "rounded-full border px-3 py-2 text-xs font-extrabold transition",
                        active
                          ? "bg-emerald-100 border-emerald-400"
                          : "bg-white/70 border-black/10",
                        showError("ageGroups") &&
                          errors.ageGroups &&
                          !active &&
                          "border-red-400",
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {showError("ageGroups") && errors.ageGroups ? (
                <p className="mt-1 text-xs font-semibold text-red-600">
                  {errors.ageGroups}
                </p>
              ) : null}
            </div>

            {/* Where + When */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-gray-800">
                  Var
                </label>
                <button
                  type="button"
                  onClick={() => setIsWhereOpen(true)}
                  onBlur={() => setTouched((p) => ({ ...p, where: true }))}
                  aria-haspopup="dialog"
                  aria-expanded={isWhereOpen}
                  className={cn(
                    "mt-1 w-full rounded-xl border bg-white px-3 py-2 text-left text-sm font-semibold",
                    "border-black/10 focus:outline-none focus:ring-2 focus:ring-black/10",
                    showError("where") && errors.where && "border-red-400",
                  )}
                >
                  <span className="flex items-center justify-between">
                    <span className="text-gray-900">{whereLabel}</span>
                    <ChevronDown
                      className="h-4 w-4 text-gray-700"
                      aria-hidden="true"
                    />
                  </span>
                </button>

                {showError("where") && errors.where ? (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {errors.where}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800">
                  När
                </label>
                <button
                  type="button"
                  onClick={() => setIsWhenOpen(true)}
                  onBlur={() => setTouched((p) => ({ ...p, when: true }))}
                  aria-haspopup="dialog"
                  aria-expanded={isWhenOpen}
                  className={cn(
                    "mt-1 w-full rounded-xl border bg-white px-3 py-2 text-left text-sm font-semibold",
                    "border-black/10 focus:outline-none focus:ring-2 focus:ring-black/10",
                    showError("when") && errors.when && "border-red-400",
                  )}
                >
                  <span className="flex items-center justify-between">
                    <span className="text-gray-900">{whenLabel}</span>
                    <ChevronDown
                      className="h-4 w-4 text-gray-700"
                      aria-hidden="true"
                    />
                  </span>
                </button>

                {showError("when") && errors.when ? (
                  <p className="mt-1 text-xs font-semibold text-red-600">
                    {errors.when}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Where sheet */}
            {isWhereOpen ? (
              <div
                className="fixed inset-0 z-60"
                role="dialog"
                aria-modal="true"
                aria-label="Välj var"
              >
                <button
                  type="button"
                  className="absolute inset-0 bg-black/30"
                  onClick={() => setIsWhereOpen(false)}
                  aria-label="Stäng"
                />

                <div
                  className={[
                    "fixed inset-0",
                    "flex justify-center",
                    "items-end sm:items-center",
                    "px-3 sm:px-6",
                    "pb-[max(12px,env(safe-area-inset-bottom))] sm:pb-0",
                    "pt-3 sm:pt-0",
                  ].join(" ")}
                >
                  <div className="w-full max-w-md rounded-3xl bg-white p-4 shadow-xl">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-base font-extrabold text-gray-900">
                        Var
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsWhereOpen(false)}
                        className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
                      >
                        Stäng
                      </button>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-black/10">
                      {whereOptions.map((o) => {
                        const isSelected = o.value === where;
                        return (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() => {
                              setWhere(o.value as WhereValue);
                              setIsWhereOpen(false);
                            }}
                            className={[
                              "w-full px-4 py-3 text-left text-sm font-semibold",
                              "border-b border-black/5 last:border-b-0",
                              isSelected
                                ? "bg-emerald-50 text-gray-900"
                                : "bg-white text-gray-800 hover:bg-black/5",
                            ].join(" ")}
                          >
                            {o.label}
                            {isSelected ? " ✓" : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* When sheet */}
            {isWhenOpen ? (
              <div
                className="fixed inset-0 z-60"
                role="dialog"
                aria-modal="true"
                aria-label="Välj när"
              >
                <button
                  type="button"
                  className="absolute inset-0 bg-black/30"
                  onClick={() => setIsWhenOpen(false)}
                  aria-label="Stäng"
                />

                <div
                  className={[
                    "fixed inset-0",
                    "flex justify-center",
                    "items-end sm:items-center",
                    "px-3 sm:px-6",
                    "pb-[max(12px,env(safe-area-inset-bottom))] sm:pb-0",
                    "pt-3 sm:pt-0",
                  ].join(" ")}
                >
                  <div className="w-full max-w-md rounded-3xl bg-white p-4 shadow-xl">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-base font-extrabold text-gray-900">
                        När
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsWhenOpen(false)}
                        className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-semibold"
                      >
                        Stäng
                      </button>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-black/10">
                      {whenOptions.map((o) => {
                        const isSelected = o.value === when;
                        return (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() => {
                              setWhen(o.value as WhenValue);
                              setIsWhenOpen(false);
                            }}
                            className={[
                              "w-full px-4 py-3 text-left text-sm font-semibold",
                              "border-b border-black/5 last:border-b-0",
                              isSelected
                                ? "bg-emerald-50 text-gray-900"
                                : "bg-white text-gray-800 hover:bg-black/5",
                            ].join(" ")}
                          >
                            {o.label}
                            {isSelected ? " ✓" : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Actions */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={cn(
                  "w-full rounded-full py-3 text-base font-extrabold shadow-sm transition",
                  "border-2",
                  canSubmit
                    ? "bg-orange-400 text-white border-orange-500 hover:brightness-[0.98] active:scale-[0.99]"
                    : "bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed",
                )}
              >
                {seed ? "Spara ändringar" : "+ Lägg till ny aktivitet"}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="mt-3 w-full rounded-full border border-black/10 bg-white/70 py-3 text-sm font-extrabold text-gray-800"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
