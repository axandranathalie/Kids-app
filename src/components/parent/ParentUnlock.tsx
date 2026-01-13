import { useEffect, useRef, useState } from "react";
import { Unlock } from "lucide-react";
import { verifyParentPin } from "../../lib/parentPin";

type Props = {
  onSuccess: () => void;
};

export function ParentUnlock({ onSuccess }: Props) {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);

  // Keep refs to the 4 inputs so we can auto-advance focus (kid-friendly UX).
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    // Focus first input on mount.
    refs.current[0]?.focus();
  }, []);

  const onChangeDigit = (index: number, value: string) => {
    // Allow only one digit per box.
    const digit = value.replace(/\D/g, "").slice(-1);
    setError(null);

    setPin((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    // Auto-move focus forward when a digit is entered.
    if (digit && index < 3) refs.current[index + 1]?.focus();
  };

  const onKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== "Backspace") return;

    // If current box is empty, jump back to previous box.
    if (!pin[index] && index > 0) {
      refs.current[index - 1]?.focus();
      return;
    }

    // Otherwise clear current digit.
    if (pin[index]) {
      setPin((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
    }
  };

  const submit = () => {
    const pinStr = pin.join("");

    if (!/^\d{4}$/.test(pinStr)) {
      setError("Fyll i 4 siffror.");
      return;
    }

    if (!verifyParentPin(pinStr)) {
      setError("Fel PIN-kod.");

      // Reset PIN inputs on incorrect attempt
      setPin(["", "", "", ""]);
      refs.current[0]?.focus();

      return;
    }

    onSuccess();
  };

  return (
    <section className="mx-auto flex min-h-[70dvh] w-full max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="w-full">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-black/10">
          <Unlock className="h-10 w-10 text-gray-900" strokeWidth={2.5} />
        </div>

        <h1 className="text-4xl font-extrabold">Vuxenläge</h1>
        <p className="mx-auto mt-2 max-w-sm text-gray-700">
          Skriv din PIN-kod för att låsa upp.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          {pin.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              inputMode="numeric"
              value={d}
              onChange={(e) => onChangeDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              className="h-14 w-14 rounded-2xl border-2 border-gray-300 bg-white text-center text-2xl font-bold"
              aria-label={`PIN digit ${i + 1}`}
            />
          ))}
        </div>

        {error ? (
          <p className="mt-3 text-center text-sm font-semibold text-red-600">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          onClick={submit}
          className="mt-6 w-full rounded-full bg-emerald-100 py-3 text-lg font-bold shadow-sm border-4 border-emerald-600"
        >
          Lås upp
        </button>
      </div>
    </section>
  );
}
