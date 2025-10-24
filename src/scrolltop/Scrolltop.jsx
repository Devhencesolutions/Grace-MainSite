// ScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Disable smooth scrolling when navigating to a new location
  useEffect(() => {
    const originalScrollTo = window.scrollTo;
    window.scrollTo = (...args) => {
      originalScrollTo.apply(window, args);
      window.scrollTo = originalScrollTo;
    };
  }, []);

  return null;
}

export default ScrollToTop;
