import React from 'react';
import MissionVision from '../../src/components/about/MissionVision';
import CorePillarsGrid from '../../src/components/about/CorePillarsGrid';
import StatsStrip from '../../src/components/about/StatsStrip';
import TeamPeek from '../../src/components/about/TeamPeek';
import CallToActionBanner from '../../src/components/about/CallToActionBanner';
import BackToTopButton from '../../src/components/about/BackToTopButton';
import Newsletter from '@/components/home/newsletter';

export default function AboutPage() {
  return (
    <main>
      <MissionVision />
      <CorePillarsGrid />
      <StatsStrip />
      <TeamPeek />
      <Newsletter />
      <BackToTopButton />
    </main>
  );
}
