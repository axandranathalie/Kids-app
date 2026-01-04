import type { ReactNode } from "react";

type AppLayoutProps = {
  header?: ReactNode;
  children: ReactNode;
};

export function AppLayout({ header, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-(--app-bg)">
      {/* Full-width header */}
      {header ? <div className="px-6 py-4">{header}</div> : null}

      {/* Centered content */}
      <div className="px-6 pb-10">
        <div className="mx-auto w-full max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
