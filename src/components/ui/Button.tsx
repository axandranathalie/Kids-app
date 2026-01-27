import type { ReactNode, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 font-semibold shadow-sm transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60";

  const styles =
    variant === "primary"
      ? "bg-rose-400 text-white hover:brightness-95"
      : "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50";

  return (
    <button
      {...props}
      className={[base, styles, className].filter(Boolean).join(" ")}
    />
  );
}
