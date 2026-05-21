type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: AnalyticsPayload[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackAnalyticsEvent(eventName: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;

  const eventPayload = { event: eventName, ...payload };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventPayload);

  window.gtag?.("event", eventName, payload);
  window.fbq?.("trackCustom", eventName, payload);
}