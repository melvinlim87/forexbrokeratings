"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Link as ScrollLink, animateScroll } from 'react-scroll';
import { Disclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

const toc = [
  { id: 'who-we-are', label: '1. Who We Are & Scope' },
  { id: 'frameworks', label: '2. Legal Frameworks' },
  { id: 'data-we-collect', label: '3. Information We Collect' },
  { id: 'bases', label: '4. Purposes & Legal Bases' },
  { id: 'cookies', label: '5. Cookies & Tracking' },
  { id: 'transfers', label: '6. Global Data Transfers' },
  { id: 'sharing', label: '7. How We Share Information' },
  { id: 'retention', label: '8. Data Retention' },
  { id: 'security', label: '9. Security Measures' },
  { id: 'rights', label: '10. Your Rights' },
  { id: 'automated', label: '11. Automated Decision-Making' },
  { id: 'thirdparties', label: '12. Third-Party Links' },
  { id: 'children', label: '13. Children’s Privacy' },
  { id: 'changes', label: '14. Changes to This Policy' },
];

export default function StickyTOC({ mobileOnly }: { mobileOnly?: boolean }) {
  const tocList = (
    <nav aria-label="Table of contents" className="sticky top-[100px]">
      <ul className="pl-4 space-y-2">
        {toc.map((item) => (
          <li key={item.id} className='border-b border-gray-200 dark:border-gray-800'>
            <ScrollLink
              to={item.id}
              smooth
              offset={-72} // Offset for fixed header height (72px)
              duration={300}
              className="block cursor-pointer text-base text-gray-700 dark:text-gray-200 hover:text-cyan-600 focus:text-cyan-600 transition-colors py-1"
              activeClass="font-bold text-cyan-600"
              spy
            >
              {item.label}
            </ScrollLink>
          </li>
        ))}
      </ul>
    </nav>
  );

  if (mobileOnly) {
    return (
      <div className="md:hidden mb-4">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between items-center rounded bg-cyan-100 dark:bg-slate-800 px-4 py-2 text-cyan-900 dark:text-cyan-200 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400">
                Contents
                <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
              </Disclosure.Button>
              <Disclosure.Panel className="pt-2 pb-1 bg-white dark:bg-slate-900 rounded-b shadow">
                {tocList}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    );
  }
  return tocList;
}
