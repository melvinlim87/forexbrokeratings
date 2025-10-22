import React from 'react';
import { FaUsers, FaClipboardCheck, FaShieldAlt, FaGift } from 'react-icons/fa';
import T from '@/components/common/T';

const pillars = [
  {
    icon: <FaUsers className="text-blue-500 w-8 h-8 mb-2" />,
    titleKey: 'about.pillars.real_reviews.title',
    descKey: 'about.pillars.real_reviews.desc',
  },
  {
    icon: <FaClipboardCheck className="text-green-500 w-8 h-8 mb-2" />,
    titleKey: 'about.pillars.live_tests.title',
    descKey: 'about.pillars.live_tests.desc',
  },
  {
    icon: <FaShieldAlt className="text-cyan-500 w-8 h-8 mb-2" />,
    titleKey: 'about.pillars.regulations.title',
    descKey: 'about.pillars.regulations.desc',
  },
  {
    icon: <FaGift className="text-yellow-500 w-8 h-8 mb-2" />,
    titleKey: 'about.pillars.promotions.title',
    descKey: 'about.pillars.promotions.desc',
  }
];

const CorePillarsGrid = () => (
  <section className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
    {pillars.map((pillar) => (
      <div key={pillar.titleKey} className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer">
        {pillar.icon}
        <T as="h3" k={pillar.titleKey} className="font-semibold text-lg mb-1 text-[#0b1e3c]" />
        <T as="p" k={pillar.descKey} className="text-gray-600 text-sm" />
      </div>
    ))}
  </section>
);

export default CorePillarsGrid;
