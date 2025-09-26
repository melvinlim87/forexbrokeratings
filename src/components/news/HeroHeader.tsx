import React from 'react';
import T from '@/components/common/T';

const HeroHeader = () => (
  <header className="bg-gradient-to-r from-[#091f40] to-[#0f2d59] h-[180px] flex flex-col justify-center items-center text-center px-4 mb-12">
    <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow"><T k="news.hero_title" /></h1>
    <h2 className="text-lg md:text-2xl text-cyan-200 font-medium max-w-2xl mx-auto"><T k="news.hero_subtitle" /></h2>
  </header>
);

export default HeroHeader;
