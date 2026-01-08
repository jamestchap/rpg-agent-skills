import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RPG Agent Skills",
  description: "A lightweight dashboard for roleplaying agent skills."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-10">
          <header className="flex flex-col gap-2 border-b border-slate-800 pb-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
              RPG Agent Skills
            </p>
            <h1 className="text-3xl font-semibold text-white">
              Tune the skills your agents bring to every quest.
            </h1>
            <p className="max-w-2xl text-base text-slate-300">
              Build balanced parties, calibrate proficiencies, and keep every
              companion aligned on the mission ahead.
            </p>
          </header>
          <main className="flex flex-1 flex-col gap-8 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
