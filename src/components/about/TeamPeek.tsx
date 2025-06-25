import React from 'react';

const team = [
  {
    name: 'Melvin Lim',
    role: 'Founder & Lead Reviewer',
    bio: 'Retail trader. Data geek. Built FBR to help others avoid the mistakes he made.'
  },
  {
    name: 'Jun Wei',
    role: 'Co-Founder & Product',
    bio: 'Product builder. Obsessed with transparency and user experience.'
  },
  {
    name: 'Alicia Tan',
    role: 'Research & Compliance',
    bio: 'Regulation nerd. Keeps broker data honest and up-to-date.'
  }
];

const TeamPeek = () => (
  <section className="my-10">
    <h2 className="text-2xl font-semibold mb-6 text-center">Meet the Team</h2>
    <div className="flex flex-wrap justify-center gap-6">
      {team.map((member) => (
        <div key={member.name} className="bg-white dark:bg-slate-900 rounded-lg shadow p-5 w-64 text-center hover:shadow-md transition-shadow">
          <div className="font-bold text-lg mb-1 text-[#0b1e3c] dark:text-white">{member.name}</div>
          <div className="text-cyan-600 font-medium mb-1">{member.role}</div>
          <div className="text-gray-600 dark:text-gray-300 text-sm">{member.bio}</div>
        </div>
      ))}
    </div>
  </section>
);

export default TeamPeek;
