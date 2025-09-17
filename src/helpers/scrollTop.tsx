import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);  // Scroll to the top of the page on route change
  }, [location]);  // Runs every time the route changes

  return null;  // This component doesn't render anything to the UI
};

export default ScrollToTop;
