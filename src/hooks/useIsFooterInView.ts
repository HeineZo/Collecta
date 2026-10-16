import { useEffect, useState } from "react";

// Whether the app footer is on screen
export function useIsFooterInView() {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const footer = document.querySelector(".app-footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);
  return isInView;
}
