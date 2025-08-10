import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} • SmartBulk` : 'SmartBulk';
    return () => {
      document.title = prev;
    };
  }, [title]);
}

