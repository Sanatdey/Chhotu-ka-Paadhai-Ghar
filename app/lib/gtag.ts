export const trackEvent = (name: string, params?: any) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
};