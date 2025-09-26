import React from 'react';
import T from '@/components/common/T';

const MissionVision = () => (
  <section className="my-10">
    <T as="h2" k="about.story_mission" className="text-2xl font-semibold mb-2" />
    <T as="p" k="about.story_paragraph" className="mb-6" />
    <T as="h2" k="about.our_vision" className="mt-10 text-2xl font-semibold mb-2" />
    <T as="p" k="about.vision_paragraph" />
  </section>
);

export default MissionVision;
