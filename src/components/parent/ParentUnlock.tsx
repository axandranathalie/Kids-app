import { useEffect, useRef, useState } from "react";
import { Unlock } from "lucide-react";
import { verifyParentPin } from "../../lib/parentPin";

type Props = {
  onSuccess: () => void;
};

const PIN_LENGTH = 4;

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function ParentUnlock({ onSuccess }: Props) {
  const [pin, setPin] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);

  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const focusIndex = (index: number) => {
    refs.current[index]?.focus();
    refs.current[index]?.select();
  };

  const clearAll = () => {
    setPin(Array(PIN_LENGTH).fill(""));
    focusIndex(0);
  };

  const setDigitAt = (index: number, digit: string) => {
    setPin((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
  };

  const handleChange = (index: number, raw: string) => {
    setError(null);

    const digits = onlyDigits(raw);

    // Distribute pasted/typed digits across remaining boxes.
    if (digits.length > 1) {
      setPin((prev) => {
        const next = [...prev];
        let writeIndex = index;

        for (const ch of digits) {
          if (writeIndex >= PIN_LENGTH) break;
          next[writeIndex] = ch;
          writeIndex += 1;
        }

        const nextFocus = Math.min(writeIndex, PIN_LENGTH - 1);
        queueMicrotask(() => focusIndex(nextFocus));
        return next;
      });

      return;
    }

    const digit = digits.slice(-1);
    setDigitAt(index, digit);

    if (digit && index < PIN_LENGTH - 1) {
      focusIndex(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    setError(null);

    if (e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();

      if (pin[index]) {
        setDigitAt(index, "");
        return;
      }

      if (index > 0) {
        focusIndex(index - 1);
        setDigitAt(index - 1, "");
      }
      return;
    }

    if (e.key === "Delete") {
      e.preventDefault();
      setDigitAt(index, "");
      return;
    }

    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusIndex(index - 1);
      return;
    }

    if (e.key === "ArrowRight" && index < PIN_LENGTH - 1) {
      e.preventDefault();
      focusIndex(index + 1);
      return;
    }
  };

  const handlePaste = (
    index: number,
    e: React.ClipboardEvent<HTMLInputElement>,
  ) => {
    const pasted = onlyDigits(e.clipboardData.getData("text"));
    if (!pasted) return;

    e.preventDefault();
    setError(null);

    setPin((prev) => {
      const next = [...prev];
      let writeIndex = index;

      for (const ch of pasted) {
        if (writeIndex >= PIN_LENGTH) break;
        next[writeIndex] = ch;
        writeIndex += 1;
      }

      const nextFocus = Math.min(writeIndex, PIN_LENGTH - 1);
      queueMicrotask(() => focusIndex(nextFocus));
      return next;
    });
  };

  const submit = () => {
    const pinStr = pin.join("");

    if (!/^\d{4}$/.test(pinStr)) {
      setError("Fyll i 4 siffror.");
      return;
    }

    if (!verifyParentPin(pinStr)) {
      setError("Fel PIN-kod.");
      clearAll();
      return;
    }

    onSuccess();
  };

  return (
    <section className="mx-auto flex min-h-[70dvh] w-full max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="w-full">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-black/10">
          <Unlock
            className="h-10 w-10 text-gray-900"
            strokeWidth={2.5}
            aria-hidden="true"
            focusable="false"
          />
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
              autoComplete="one-time-code"
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={(e) => handlePaste(i, e)}
              className="h-14 w-14 rounded-2xl border-2 border-gray-300 bg-white text-center text-2xl font-bold"
              aria-label={`Siffra ${i + 1} av ${PIN_LENGTH} i PIN-kod`}
              type="password"
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
