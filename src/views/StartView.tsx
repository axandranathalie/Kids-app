import { Link } from "react-router-dom";

import logo from "../assets/icons/logo.png";
import kidsIcon from "../assets/icons/kids.png";
import settingsIcon from "../assets/icons/settings.png";

export function StartView() {
  return (
    <main
      className="min-h-screen bg-[#F7F1E6] px-4 py-8 sm:px-6 sm:py-10"
      aria-labelledby="start-title"
    >
      <div className="grid place-items-start pt-10 sm:min-h-0 sm:pt-0">
        <div className="mx-auto flex w-full max-w-sm flex-col items-center sm:max-w-130">
          {/* Logo */}
          <img
            src={logo}
            alt="AktivitetsAppen"
            className="mb-4 h-28 w-28 select-none drop-shadow-sm sm:mb-6 sm:h-40 sm:w-40 md:h-60 md:w-60"
            draggable={false}
            decoding="async"
          />

          {/* Title */}
          <h1
            id="start-title"
            className="mb-8 text-center text-4xl font-semibold tracking-tight sm:mb-12 sm:text-6xl"
          >
            <span className="bg-linear-to-r from-[#3ED6CC] via-[#6AA8FF] to-[#B48CFF] bg-clip-text text-transparent drop-shadow-[0_4px_0_rgba(0,0,0,0.22)]">
              AktivitetsAppen
            </span>
          </h1>
          <nav aria-label="Välj läge" className="w-full">
            <div className="flex w-full flex-col gap-3 sm:gap-4">
              {/* Kids */}
              <Link
                to="/kids"
                className={[
                  "group relative flex items-center",
                  "h-16 w-full rounded-2xl sm:h-20",
                  "border-2 border-[#43C6F5]",
                  "bg-[#BFF3F3] px-4 sm:px-6",
                  "shadow-[0_10px_20px_rgba(0,0,0,0.18)]",
                  "transition-all duration-200 ease-out",
                  "hover:-translate-y-1 hover:scale-[1.01]",
                  "hover:shadow-[0_14px_28px_rgba(0,0,0,0.20)]",
                  "active:translate-y-0.5 active:shadow-[0_8px_16px_rgba(0,0,0,0.16)]",
                  "hover:bg-[#C9F7F7] hover:border-[#2FB7E9]",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#43C6F5]/40",
                ].join(" ")}
              >
                <img
                  src={kidsIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-12 w-12 shrink-0 select-none sm:h-20 sm:w-20"
                  draggable={false}
                  decoding="async"
                />
                <span className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold text-black sm:text-4xl">
                  Barnläge
                </span>
                <span
                  aria-hidden="true"
                  className="ml-auto text-2xl font-semibold text-black transition-transform group-hover:translate-x-1 sm:text-3xl"
                >
                  →
                </span>
              </Link>

              {/* Parent */}
              <Link
                to="/parent"
                className={[
                  "group relative flex items-center",
                  "h-16 w-full rounded-2xl sm:h-20",
                  "border-2 border-black",
                  "bg-[#E9E9E9] px-4 sm:px-6",
                  "shadow-[0_10px_20px_rgba(0,0,0,0.18)]",
                  "transition-all duration-200 ease-out",
                  "hover:-translate-y-1 hover:scale-[1.01]",
                  "hover:shadow-[0_14px_28px_rgba(0,0,0,0.20)]",
                  "active:translate-y-0.5 active:shadow-[0_8px_16px_rgba(0,0,0,0.16)]",
                  "hover:bg-[#F0F0F0] hover:border-[#111111]",
                  "focus:outline-none focus-visible:ring-4 focus-visible:ring-black/25",
                ].join(" ")}
              >
                <img
                  src={settingsIcon}
                  alt=""
                  aria-hidden="true"
                  className="h-12 w-12 shrink-0 select-none sm:h-20 sm:w-20"
                  draggable={false}
                  decoding="async"
                />
                <span className="absolute left-1/2 -translate-x-1/2 text-2xl font-semibold text-black sm:text-4xl">
                  Vuxenläge
                </span>

                <span
                  aria-hidden="true"
                  className="ml-auto text-2xl font-semibold text-black transition-transform group-hover:translate-x-1 sm:text-3xl"
                >
                  →
                </span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </main>
  );
}
