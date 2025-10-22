"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Link as ScrollLink, animateScroll } from 'react-scroll';
import { Disclosure } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '@/lib/i18n-client';

const toc = [
  { id: 'who-we-are', k: 'privacy.toc.item.who_we_are' },
  { id: 'frameworks', k: 'privacy.toc.item.frameworks' },
  { id: 'data-we-collect', k: 'privacy.toc.item.data_we_collect' },
  { id: 'bases', k: 'privacy.toc.item.bases' },
  { id: 'cookies', k: 'privacy.toc.item.cookies' },
  { id: 'transfers', k: 'privacy.toc.item.transfers' },
  { id: 'sharing', k: 'privacy.toc.item.sharing' },
  { id: 'retention', k: 'privacy.toc.item.retention' },
  { id: 'security', k: 'privacy.toc.item.security' },
  { id: 'rights', k: 'privacy.toc.item.rights' },
  { id: 'automated', k: 'privacy.toc.item.automated' },
  { id: 'thirdparties', k: 'privacy.toc.item.thirdparties' },
  { id: 'children', k: 'privacy.toc.item.children' },
  { id: 'changes', k: 'privacy.toc.item.changes' },
];

export default function StickyTOC({ mobileOnly }: { mobileOnly?: boolean }) {
  const { t } = useI18n();
  const tocList = (
    <nav aria-label={t('privacy.toc.title')} className="sticky top-[100px]">
      <ul className="pl-4 space-y-2">
        {toc.map((item) => (
          <li key={item.id} className='border-b border-gray-200'>
            <ScrollLink
              to={item.id}
              smooth
              offset={-72} // Offset for fixed header height (72px)
              duration={300}
              className="block cursor-pointer text-base text-gray-700 hover:text-cyan-600 focus:text-cyan-600 transition-colors py-1"
              activeClass="font-bold text-cyan-600"
              spy
            >
              {t(item.k)}
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
              <Disclosure.Button className="flex w-full justify-between items-center rounded bg-cyan-100 px-4 py-2 text-cyan-900 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400">
                {t('privacy.toc.title')}
                <ChevronDown className={`w-5 h-5 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} />
              </Disclosure.Button>
              <Disclosure.Panel className="pt-2 pb-1 bg-white rounded-b shadow">
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
