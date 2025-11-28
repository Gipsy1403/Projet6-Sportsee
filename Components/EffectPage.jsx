'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function EffectsPages({ children }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Quand l'URL change → on relance l'effet
    const timeout = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(timeout);
  }, []); // <-- relance l'effet à chaque nouvelle page

  return (
    <div className={`page-fade ${visible ? 'visible' : ''}`}>
      {children}
    </div>
  );
}
