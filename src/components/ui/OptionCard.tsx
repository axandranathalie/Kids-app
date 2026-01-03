import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  iconSrc: string;
  selected?: boolean;
};

// Reusable selectable card used for filter options.
export function OptionCard({
  label,
  iconSrc,
  selected = false,
  className = "",
  ...props
}: Props) {
  return (
    <button
      type="button"
      {...props}
      className={[
        "w-full rounded-2xl border px-4 py-3 text-center font-semibold shadow-sm transition active:scale-[0.99]",
        selected
          ? "border-black bg-white"
          : "border-gray-200 bg-white/70 hover:bg-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <img
        src={iconSrc}
        alt=""
        className="mx-auto mb-2 h-20 w-20 object-contain scale-110"
      />
      <span className="block">{label}</span>
    </button>
  );
}
