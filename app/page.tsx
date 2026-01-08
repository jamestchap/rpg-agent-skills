const skills = [
  {
    title: "Support Coordination",
    description: "Assign skill leads for support, healer, and scout builds.",
    level: "Planned",
    trend: "Step 1"
  },
  {
    title: "Training Review",
    description: "Evaluate performance logs from the most recent trial run.",
    level: "In review",
    trend: "Step 2"
  },
  {
    title: "Session Zero Facilitation",
    description: "Align the party on tone, safety, and campaign expectations.",
    level: "Upcoming",
    trend: "Step 3"
  }
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
          Command Center
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Shape balanced parties in minutes.
        </h2>
        <p className="max-w-3xl text-base text-slate-300">
          Combine tactical, lore, and social proficiencies to produce the ideal
          agent mix for every campaign. Review what is trending, then configure
          your next deployment.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400">
            Create skill profile
          </button>
          <button className="rounded-full border border-slate-700 px-5 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white">
            View recent builds
          </button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold text-white">Plan-aligned skills</h3>
          <p className="text-sm text-slate-400">
            Focus on the skill work that matches the party planning checklist.
          </p>
          <div className="mt-6 grid gap-4">
            {skills.map((skill) => (
              <div
                key={skill.title}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-white">
                      {skill.title}
                    </p>
                    <p className="text-sm text-slate-400">{skill.description}</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                    {skill.trend}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-3 text-sm text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                  <span>{skill.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h3 className="text-lg font-semibold text-white">Next actions</h3>
          <ul className="flex flex-col gap-4 text-sm text-slate-300">
            <li className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
              <p className="font-semibold text-white">Assign skill leads</p>
              <p>Pick owners for the new support, healer, and scout builds.</p>
            </li>
            <li className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
              <p className="font-semibold text-white">Review training logs</p>
              <p>See which agents leveled up after the latest trial.</p>
            </li>
            <li className="rounded-lg border border-slate-800 bg-slate-950/80 p-4">
              <p className="font-semibold text-white">Plan session zero</p>
              <p>Align the party on tone, safety, and expectations.</p>
            </li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
