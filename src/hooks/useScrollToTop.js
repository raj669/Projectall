import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

export function useScrollMemory(routeKey) {
  const scrollPositions = JSON.parse(sessionStorage.getItem('scrollPositions') || '{}');

  useEffect(() => {
    const savedPosition = scrollPositions[routeKey];
    if (savedPosition !== undefined) {
      window.scrollTo(0, savedPosition);
    } else {
      window.scrollTo(0, 0);
    }
  }, [routeKey, scrollPositions]);

  useEffect(() => {
    const handleScroll = () => {
      scrollPositions[routeKey] = window.scrollY;
      sessionStorage.setItem('scrollPositions', JSON.stringify(scrollPositions));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [routeKey, scrollPositions]);
}
