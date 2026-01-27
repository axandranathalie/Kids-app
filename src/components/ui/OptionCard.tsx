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
        "w-full rounded-2xl border px-4 py-3 text-center font-semibold shadow-sm transition",
        "active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20",

        selected
          ? "ring-2 ring-black/20 border-black/30"
          : "border-gray-200 hover:brightness-[0.98]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <img
        src={iconSrc}
        alt=""
        className="mx-auto mb-2 h-14 w-14 object-contain sm:h-16 sm:w-16"
      />
      <span className="block text-sm sm:text-base">{label}</span>
    </button>
  );
}
