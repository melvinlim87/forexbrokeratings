"use client";

import React, { useState } from "react";

export default function ContactClient() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | { type: "success" | "error"; message: string }>(null);

  const channels = [
    {
      icon: (
        <svg aria-label="Email" className="w-6 h-6 text-cyan-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4zm0 0l8 8m8-8l-8 8" /></svg>
      ),
      label: "Email",
      state: "active",
      description:
        "Best way to reach us. We reply within 1 business day (Mon–Fri, UTC ±0).",
      cta: (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 mt-4 font-semibold text-white bg-cyan-700 rounded-md shadow hover:bg-cyan-800 focus:outline focus:outline-2 focus:outline-cyan-400 transition-colors duration-150"
        >
          Email Us
        </button>
      ),
    },
    {
      icon: (
        <svg aria-label="Telegram" className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 4L12 20l-4-7-7-2z" /></svg>
      ),
      label: "Telegram",
      state: "soon",
      description:
        "@FXBrokerratings will launch shortly. Stay tuned!",
      cta: (
        <button
          disabled
          className="inline-flex items-center px-4 py-2 mt-4 font-semibold text-gray-500 bg-gray-200 rounded-md cursor-not-allowed border border-gray-300"
          aria-disabled="true"
        >
          Coming Soon
        </button>
      ),
    },
    {
      icon: (
        <svg aria-label="Instagram" className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" /></svg>
      ),
      label: "Instagram",
      state: "soon",
      description:
        "DM support via @forexbrokerratings will be available soon.",
      cta: (
        <button
          disabled
          className="inline-flex items-center px-4 py-2 mt-4 font-semibold text-gray-500 bg-gray-200 rounded-md cursor-not-allowed border border-gray-300"
          aria-disabled="true"
        >
          Coming Soon
        </button>
      ),
    },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    if (!form.title.trim() || !form.content.trim() || !form.email.trim()) {
      setResult({ type: "error", message: "Please fill in title, content and email." });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ type: "success", message: "Message sent. We'll get back to you within 1 business day." });
        setForm({ title: "", content: "", email: "" });
        setShowForm(false);
      } else {
        setResult({ type: "error", message: data?.error || "Failed to send. Please try again later." });
      }
    } catch (err) {
      setResult({ type: "error", message: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <article data-section="channels" className="max-w-4xl mx-auto px-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {channels.map((ch) => (
            <div
              key={ch.label}
              className={`relative group bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex flex-col items-start transition-shadow duration-150 ease-in-out hover:shadow-lg focus-within:shadow-lg ${ch.state === "soon" ? "opacity-70" : ""}`}
              tabIndex={ch.state === "active" ? 0 : -1}
            >
              <span className="absolute top-4 left-4">{ch.icon}</span>
              <span className="ml-12 text-lg font-semibold text-[#11223a] mb-1">{ch.label}</span>
              {ch.state === "soon" && (
                <span className="ml-12 mb-2 px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-500 font-medium inline-block">Coming Soon</span>
              )}
              <span className="ml-12 text-gray-700 text-sm mb-4 block min-h-[48px]">{ch.description}</span>
              <div className="ml-12">{ch.cta}</div>
            </div>
          ))}
        </div>
      </article>

      {showForm && (
        <article data-section="contact-form" className="max-w-xl mx-auto px-4 mt-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-xl font-semibold text-[#11223a]">Contact Support</h2>
            {result && (
              <p className={`${result.type === "error" ? "text-red-600" : "text-green-600"} text-sm`}>{result.message}</p>
            )}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                id="title"
                type="text"
                className="w-full rounded-md border border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                id="content"
                rows={5}
                className="w-full rounded-md border border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
              <input
                id="email"
                type="email"
                className="w-full rounded-md border border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center px-4 py-2 font-semibold text-white bg-cyan-700 rounded-md shadow hover:bg-cyan-800 disabled:opacity-60"
              >
                {submitting ? "Sending..." : "Send Message"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-gray-500">We will send your message to support@forexbrokeratings.com.</p>
          </form>
        </article>
      )}
    </>
  );
}
