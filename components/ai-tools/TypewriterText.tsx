import React from "react";

export default function TypewriterText({ text, messageEndRef }: { text: string, messageEndRef: React.RefObject<HTMLDivElement> }) {
  const [displayed, setDisplayed] = React.useState('');
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    let i = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDisplayed('');
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      messageEndRef.current?.scrollTo({ top: messageEndRef.current.scrollHeight, behavior: 'smooth' });
      if (i >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 12);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return <span>{displayed}</span>;
}
