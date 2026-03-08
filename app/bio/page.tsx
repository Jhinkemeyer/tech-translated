import Image from "next/image"; // <-- We import the Next.js optimized Image component

export default function Bio() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8">
      {/* Header Section */}
      <section className="border-b border-zinc-800 pb-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          The Architect
        </h1>
        <p className="text-zinc-400 text-xl font-mono">
          Joshua // Developer & Creator
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Your Actual Headshot! */}
        <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl">
          <Image
            src="/headshot.png" // <-- Make sure this matches your exact filename (e.g., .png or .jpg)
            alt="Joshua"
            fill
            className="object-cover"
            priority // Tells Next.js to load this image instantly
          />
        </div>

        {/* Biography Content */}
        <div className="md:col-span-2 space-y-6 text-zinc-300 leading-relaxed text-lg">
          <p>
            Welcome to{" "}
            <span className="text-zinc-50 font-semibold italic">
              Tech Translated
            </span>
            . I built this platform as a central hub for breaking down complex
            hardware, software development, and everything in between.
          </p>

          <p>
            When I am not writing dispatches or pushing code, I am usually
            tinkering with custom PC builds, exploring new tech ecosystems, or
            optimizing workflows.
          </p>

          <p>
            If you want to talk tech, hardware, or development, feel free to use
            the{" "}
            <a
              href="/contact"
              className="text-zinc-50 underline decoration-zinc-700 hover:decoration-zinc-400 transition-colors"
            >
              Transmission Channel
            </a>{" "}
            to reach out directly to my inbox.
          </p>
        </div>
      </div>
    </div>
  );
}
