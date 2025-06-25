"use client";
import React from 'react';

const BackToTopButton = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return visible ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 px-5 py-2 rounded-full bg-[#0b1e3c] text-white shadow-lg transition-opacity"
      aria-label="Back to top"
    >
      ↑ Back to Top
    </button>
  ) : null;
};

export default BackToTopButton;
