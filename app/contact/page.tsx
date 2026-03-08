"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      // Send the data to your secret API route
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" }); // Clear the form
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Transmission error:", error);
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <section className="border-b border-zinc-800 pb-8">
        <h1 className="text-4xl font-bold mb-4">Transmission Channel</h1>
        <p className="text-zinc-400 text-lg">
          Send a secure message directly to my inbox.
        </p>
      </section>

      {status === "success" ? (
        <div className="p-6 rounded-xl border border-emerald-900/50 bg-emerald-950/20 text-emerald-400 text-center">
          <h2 className="text-xl font-bold mb-2">Transmission Received</h2>
          <p>Thanks for reaching out! I will get back to you soon.</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 text-sm text-emerald-500 hover:text-emerald-300 transition-colors"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-400 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-zinc-600 transition-colors"
                placeholder="Han Solo"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-400 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-zinc-600 transition-colors"
                placeholder="han@millenniumfalcon.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-zinc-400 mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-zinc-600 transition-colors resize-none"
              placeholder="I've got a bad feeling about this..."
            />
          </div>

          {status === "error" && (
            <p className="text-red-400 text-sm">
              Signal lost. There was an error sending your message. Please try
              again.
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="bg-zinc-50 text-zinc-950 font-bold px-8 py-3 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {status === "submitting" ? "Encrypting..." : "Send Message"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
