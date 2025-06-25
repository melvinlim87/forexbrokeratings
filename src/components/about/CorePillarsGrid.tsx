import React from 'react';
import { FaUsers, FaClipboardCheck, FaShieldAlt, FaGift } from 'react-icons/fa';

const pillars = [
  {
    icon: <FaUsers className="text-cyan-500 w-8 h-8 mb-2" />,
    title: 'Real Reviews',
    desc: 'Unbiased, real-user reviews—no paid placements or fake testimonials.'
  },
  {
    icon: <FaClipboardCheck className="text-cyan-500 w-8 h-8 mb-2" />,
    title: 'Live Tests',
    desc: 'First-hand trading results and transparent broker scorecards.'
  },
  {
    icon: <FaShieldAlt className="text-cyan-500 w-8 h-8 mb-2" />,
    title: 'Regulations',
    desc: 'We verify regulator status and license details for every broker.'
  },
  {
    icon: <FaGift className="text-cyan-500 w-8 h-8 mb-2" />,
    title: 'Promotions',
    desc: 'Prime-broker promos, always checked for authenticity and value.'
  }
];

const CorePillarsGrid = () => (
  <section className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
    {pillars.map((pillar) => (
      <div key={pillar.title} className="bg-white dark:bg-slate-900 rounded-lg shadow p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
        {pillar.icon}
        <h3 className="font-semibold text-lg mb-1 text-[#0b1e3c] dark:text-white">{pillar.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{pillar.desc}</p>
      </div>
    ))}
  </section>
);

export default CorePillarsGrid;
