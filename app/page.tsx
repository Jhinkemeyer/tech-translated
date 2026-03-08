export default function Home() {
  return (
    <div className="space-y-8">
      <section className="mb-12 border-b border-zinc-800 pb-8">
        <h1 className="text-4xl font-bold mb-4">Latest Dispatches</h1>
        <p className="text-zinc-400 text-lg">
          Breaking down the coolest hardware, PC builds, and software.
        </p>
      </section>

      {/* A placeholder for how your article cards will eventually look */}
      <div className="grid gap-6">
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors cursor-pointer">
          <h2 className="text-xl font-semibold mb-2">
            Optimizing the Slicer-Deck Workflow
          </h2>
          <p className="text-zinc-400 text-sm mb-4">March 7, 2026</p>
          <p className="text-zinc-300 line-clamp-2">
            A quick look at my new mobile development setup and how I keep
            projects cleanly separated.
          </p>
        </div>
      </div>
    </div>
  );
}
