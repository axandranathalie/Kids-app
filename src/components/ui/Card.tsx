import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

// Reusable container for grouped content (results, lists, panels).
export function Card({ children, className = "" }: Props) {
  return (
    <div
      className={[
        "rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
