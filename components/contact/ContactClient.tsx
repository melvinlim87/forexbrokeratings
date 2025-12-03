"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n-client";

export default function ContactClient() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | { type: "success" | "error"; message: string }>(null);
  const [submitted, setSubmitted] = useState(false);

  const { t } = useI18n();
  const channels = [
    {
      icon: (
        <svg aria-label="Email" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4zm0 0l8 8m8-8l-8 8" /></svg>
      ),
      label: t("contact.email"),
      state: "active",
      description:
        t("contact.description"),
      cta: (
        <div className="mt-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setResult(null);
              setForm({
                title: t('contact.cta_question'),
                content: t('contact.preset_question'),
                email: '',
              });
              setShowForm(true);
            }}
            className="w-full justify-center items-center py-4 font-semibold text-white bg-cyan-700 rounded-full shadow hover:bg-cyan-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors duration-150"
          >
            {t('contact.cta_question')}
          </button>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setResult(null);
              setForm({
                title: t('contact.cta_claim'),
                content: t('contact.preset_claim'),
                email: '',
              });
              setShowForm(true);
            }}
            className="inline-flex w-full justify-center items-center h-11 px-4 font-semibold text-cyan-700 bg-white rounded-full border border-cyan-200 shadow-sm hover:bg-cyan-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors duration-150"
          >
            {t('contact.cta_claim')}
          </button>
        </div>
      ),
    },
    {
      icon: (
        <svg aria-label="Telegram" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M22 4L12 20l-4-7-7-2z" /></svg>
      ),
      label: t("contact.telegram"),
      state: "active",
      description:
        t("contact.telegram_description"),
      cta: (
        <div className="mt-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              const text = encodeURIComponent(t('contact.preset_question'));
              const tg = `tg://resolve?phone=6583127744&text=${text}`;
              const web = `https://t.me/+6583127744?text=${text}`;
              try {
                window.location.href = tg;
                setTimeout(() => {
                  window.open(web, '_blank');
                }, 500);
              } catch (e) {
                window.open(web, '_blank');
              }
            }}
            className="w-full justify-center items-center py-4 font-semibold text-white bg-cyan-700 rounded-full shadow hover:bg-cyan-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors duration-150"
          >
            {t('contact.cta_question')}
          </button>
          <button
            type="button"
            onClick={() => {
              const text = encodeURIComponent(t('contact.preset_claim'));
              const tg = `tg://resolve?phone=6583127744&text=${text}`;
              const web = `https://t.me/+6583127744?text=${text}`;
              try {
                window.location.href = tg;
                setTimeout(() => {
                  window.open(web, '_blank');
                }, 500);
              } catch (e) {
                window.open(web, '_blank');
              }
            }}
            className="inline-flex w-full justify-center items-center h-11 px-4 font-semibold text-cyan-700 bg-white rounded-full border border-cyan-200 shadow-sm hover:bg-cyan-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors duration-150"
          >
            {t('contact.cta_claim')}
          </button>
        </div>
      ),
    },
    {
      icon: (
        <svg aria-label="Instagram" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" /></svg>
      ),
      label: t("contact.instagram"),
      state: "soon",
      description:
        t("contact.instagram_description"),
      cta: (
        <button
          disabled
          className="inline-flex w-full justify-center items-center h-11 px-4 mt-2 font-semibold text-slate-500 bg-white rounded-full border border-slate-200 shadow-sm cursor-not-allowed"
          aria-disabled="true"
        >
          {t("contact.coming_soon")}
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
        setSubmitted(true);
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
      <article data-section="channels" className="max-w-6xl mx-auto px-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {channels.map((ch) => (
            <div
              key={ch.label}
              className={`relative group rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col items-start transition-shadow duration-200 ease-in-out hover:shadow-lg focus-within:shadow-lg bg-gradient-to-br from-white to-slate-50`}
              tabIndex={ch.state === "active" ? 0 : -1}
            >
              <span className="absolute top-4 left-4">
                <span className={`inline-flex items-center justify-center rounded-2xl p-3 ${ch.label === t("contact.instagram") ? "bg-slate-200 text-slate-600" : "bg-cyan-600 text-white"}`}>
                  {ch.icon}
                </span>
              </span>
              <span className="ml-16 text-lg font-semibold text-[#11223a] mb-1">{ch.label}</span>
              {ch.state === "soon" && (
                <span className="ml-16 mb-2 inline-flex items-center gap-2 px-2.5 py-1 text-xs rounded-full bg-amber-100 text-amber-700 font-medium">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {t("contact.coming_soon")}
                </span>
              )}
              <span className="ml-16 text-gray-700 text-sm mb-4 block min-h-[48px]">{ch.description}</span>
              <div className="w-full">
                {/* Primary button style (pill) and Secondary subtle pill */}
                <div className="flex flex-col gap-3">
                  {React.isValidElement(ch.cta) ? ch.cta : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>

      {showForm ? (
        <article data-section="contact-form" className="max-w-xl mx-auto px-4 mt-8">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-xl font-semibold text-[#11223a]">Contact Support</h2>
            {result && result.type === "error" && (
              <p className={`text-red-600 text-sm`}>{result.message}</p>
            )}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                id="title"
                type="text"
                className="w-full rounded-md border border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 p-4"
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
                className="w-full rounded-md border border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 p-4"
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
                className="w-full rounded-md border border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 p-4"
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
      ) : submitted ? (
        <article data-section="contact-success" className="max-w-xl mx-auto px-4 mt-8">
          <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-green-800">
            <h3 className="text-lg font-semibold mb-1">Message sent successfully</h3>
            <p className="text-sm">Thanks for reaching out. We\'ll get back to you within 1 business day.</p>
          </div>
        </article>
      ) : null}
    </>
  );
}
