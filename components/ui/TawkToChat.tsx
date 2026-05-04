'use client';

import { useEffect } from 'react';

const TAWK_SRC = 'https://embed.tawk.to/69f8a3d9f0a9241c34e82ac5/1jnpk02lb';

export default function TawkToChat() {
  useEffect(() => {
    // Prevent double-injection on hot-reload
    if (document.querySelector(`script[src="${TAWK_SRC}"]`)) return;

    (window as Window & { Tawk_API?: object; Tawk_LoadStart?: Date }).Tawk_API ??= {};
    (window as Window & { Tawk_API?: object; Tawk_LoadStart?: Date }).Tawk_LoadStart = new Date();

    const s1 = document.createElement('script');
    s1.async = true;
    s1.src = TAWK_SRC;
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');

    const s0 = document.getElementsByTagName('script')[0];
    s0.parentNode?.insertBefore(s1, s0);

    return () => {
      s1.parentNode?.removeChild(s1);
    };
  }, []);

  return null;
}
