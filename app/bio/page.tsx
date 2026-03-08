import Image from "next/image";

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
        {/* Your Headshot */}
        <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl">
          <Image
            src="/headshot.png" /* Remember to keep this .png or .jpg depending on your file! */
            alt="Joshua"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Biography Content */}
        <div className="md:col-span-2 space-y-6 text-zinc-300 leading-relaxed text-lg">
          <p>
            Welcome to{" "}
            <span className="text-zinc-50 font-semibold italic">
              Tech Translated
            </span>
            . For years, I've loved sharing my excitement for the latest tech,
            giving hardware advice, and talking about my current projects with
            friends and family. I built this platform from the ground up to be
            the central hub for all of it.
          </p>

          <p>
            As a developer and tech enthusiast, I spend my time bridging the gap
            between raw technical data and practical everyday use. Whether I am
            optimizing a custom PC build, writing new code, or just geeking out
            over new hardware, this is where I translate the complex stuff into
            something approachable.
          </p>

          <p>
            If you are looking for tech advice, curious about my latest build,
            or just want to say hi, use the{" "}
            <a
              href="/contact"
              className="text-zinc-50 underline decoration-zinc-700 hover:decoration-zinc-400 transition-colors"
            >
              Transmission Channel
            </a>{" "}
            to drop a message straight to my inbox.
          </p>
        </div>
      </div>
    </div>
  );
}
