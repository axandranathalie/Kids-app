import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ParentSetup } from "../components/parent/ParentSetup";
import { ParentUnlock } from "../components/parent/ParentUnlock";
import { hasParentPin } from "../lib/parentPin";

export function ParentView() {
  const navigate = useNavigate();
  const [hasPin, setHasPin] = useState<boolean>(() => hasParentPin());

  useEffect(() => {
    // Sync across tabs/windows when the parent PIN is created/cleared in another tab.
    const onStorage = () => setHasPin(hasParentPin());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <main className="min-h-dvh bg-[#fbf7ea] p-6 font-kids">
      <header className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center rounded-xl border border-gray-300 bg-white/70 px-3 py-2 text-sm font-semibold"
        >
          ← Tillbaka
        </Link>
      </header>

      {hasPin ? (
        <ParentUnlock onSuccess={() => navigate("/parent/home")} />
      ) : (
        <ParentSetup
          onComplete={() => {
            setHasPin(true);
            navigate("/parent/home");
          }}
        />
      )}
    </main>
  );
}
