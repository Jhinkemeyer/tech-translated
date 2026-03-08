export default function Contact() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-zinc-400 text-lg">
          Have a question about a PC build, or just want to talk tech? Drop me a
          message below.
        </p>
      </div>

      <form className="space-y-6 mt-8">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Name
          </label>
          <input
            type="text"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-zinc-600 transition-colors"
            placeholder="Your Name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-zinc-600 transition-colors"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Message
          </label>
          <textarea
            rows={5}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-zinc-600 transition-colors"
            placeholder="What's on your mind?"
          ></textarea>
        </div>
        <button
          type="button"
          className="bg-zinc-50 text-zinc-950 font-bold px-8 py-3 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}
