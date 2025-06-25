import React from 'react';

export default function HeroBanner() {
  return (
    <header className="bg-gradient-to-r from-[#091f40] to-[#0f2d59] h-[260px] flex flex-col justify-center items-center text-center px-4 mb-8">
      <h1 className="text-4xl font-bold text-white mb-2 drop-shadow">Privacy Policy</h1>
      <p className="max-w-xl text-lg text-white/80 mb-2">Your data, our responsibility.</p>
      <div className="text-white/60 text-sm">Last updated: 25 June 2025</div>
    </header>
  );
}
