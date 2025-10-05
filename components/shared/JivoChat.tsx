'use client';

import { useEffect } from 'react';

export default function JivoChat() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//code.jivosite.com/widget/DEMO';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
