import { useEffect, useMemo, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { setParentPin } from "../../lib/parentPin";

type Props = {
  onComplete: () => void;
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function ParentSetup({ onComplete }: Props) {
  const challenge = useMemo(() => {
    const a = randomInt(1, 9);
    const b = randomInt(1, 9);
    return { a, b, answer: a + b };
  }, []);

  const [step, setStep] = useState<"math" | "pin">("math");
  const [mathInput, setMathInput] = useState("");
  const [mathError, setMathError] = useState<string | null>(null);

  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [pinError, setPinError] = useState<string | null>(null);

  const pinRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    // When switching to PIN step, focus the first digit input.
    if (step === "pin") pinRefs.current[0]?.focus();
  }, [step]);

  const submitMath = () => {
    const n = Number(mathInput);

    if (!Number.isFinite(n)) {
      setMathError("Skriv ett nummer 🙂");
      return;
    }

    if (n !== challenge.answer) {
      setMathError("Inte riktigt – testa igen!");
      return;
    }

    setMathError(null);
    setStep("pin");
  };

  const onPinChange = (index: number, value: string) => {
    // Allow only one digit per box.
    const digit = value.replace(/\D/g, "").slice(-1);
    setPinError(null);

    setPin((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (digit && index < 3) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const onPinKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key !== "Backspace") return;

    // If current box has a digit, clear it. Otherwise, jump back.
    if (pin[index]) {
      setPin((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    if (index > 0) pinRefs.current[index - 1]?.focus();
  };

  const savePin = () => {
    const pinStr = pin.join("");

    if (!/^\d{4}$/.test(pinStr)) {
      setPinError("PIN-koden måste vara 4 siffror.");
      return;
    }
    setParentPin(pinStr);
    onComplete();
  };

  return (
    <section className="mx-auto flex min-h-[70dvh] w-full max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="w-full">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-black/10">
          <Lock
            className="h-10 w-10 text-gray-900"
            strokeWidth={2.5}
            aria-hidden="true"
            focusable="false"
          />
        </div>

        <h1 className="text-4xl font-extrabold">Vuxenläge</h1>
        <p className="mx-auto mt-2 max-w-sm text-gray-700">
          För att skydda inställningar behöver en vuxen låsa upp.
        </p>

        {step === "math" ? (
          <div className="mt-6">
            <div className="mx-auto rounded-2xl border border-gray-200 bg-[#fbf7ea] p-4 text-center">
              <div className="text-lg font-semibold">Lös mattetalet:</div>
              <div className="mt-2 text-4xl font-extrabold">
                {challenge.a} + {challenge.b} = ?
              </div>
            </div>

            <div className="mt-4">
              <input
                inputMode="numeric"
                value={mathInput}
                onChange={(e) =>
                  setMathInput(e.target.value.replace(/[^\d]/g, ""))
                }
                className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-lg"
                placeholder="Skriv svaret här"
              />

              {mathError ? (
                <p className="mt-2 text-sm font-semibold text-red-600">
                  {mathError}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={submitMath}
              className="mt-4 w-full rounded-full bg-emerald-100 py-3 text-lg font-bold shadow-sm border-4 border-emerald-600"
            >
              Fortsätt
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <div className="text-center">
              <div className="text-lg font-semibold">Välj en PIN-kod</div>
              <p className="mt-1 text-gray-700">
                4 siffror som bara en vuxen kan.
              </p>
            </div>

            <div className="mt-4 flex justify-center gap-3">
              {pin.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    pinRefs.current[i] = el;
                  }}
                  inputMode="numeric"
                  value={d}
                  onChange={(e) => onPinChange(i, e.target.value)}
                  onKeyDown={(e) => onPinKeyDown(i, e)}
                  className="h-14 w-14 rounded-2xl border-2 border-gray-300 bg-white text-center text-2xl font-bold"
                  aria-label={`PIN digit ${i + 1}`}
                />
              ))}
            </div>

            {pinError ? (
              <p className="mt-3 text-center text-sm font-semibold text-red-600">
                {pinError}
              </p>
            ) : null}

            <button
              type="button"
              onClick={savePin}
              className="mt-5 w-full rounded-full bg-emerald-100 py-3 text-lg font-bold shadow-sm border-4 border-emerald-600"
            >
              Spara PIN
            </button>

            <p className="mt-3 text-center text-xs text-gray-600">
              PIN sparas i den här webbläsaren (skolprojekt-mode).
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
