import React from 'react';

const CallToActionBanner = () => (
  <section className="my-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-8 flex flex-col items-center text-center">
    <h2 className="text-2xl font-bold text-white mb-2">Stay informed. Trade smarter.</h2>
    <p className="text-white/90 mb-4">Get the latest broker reviews, trading insights, and exclusive promotions—straight to your inbox.</p>
    <form className="flex flex-col sm:flex-row gap-2 w-full max-w-md mx-auto">
      <input
        type="email"
        placeholder="Your email address"
        className="px-4 py-2 rounded-l-md border-none focus:ring-2 focus:ring-cyan-300 flex-1"
        aria-label="Your email address"
      />
      <button
        type="submit"
        className="bg-[#091f40] text-white font-semibold px-6 py-2 rounded-r-md hover:bg-cyan-700 transition-colors"
      >
        Subscribe
      </button>
    </form>
    <div className="text-xs text-white/60 mt-2">Editorial independence. No spam. <a href="/disclosure" className="underline">Affiliate disclosure</a>.</div>
  </section>
);

export default CallToActionBanner;
