export const COOKIE_SETTINGS_EVENT = "cobioer:open-cookie-settings";
export const CONSENT_CHANGED_EVENT = "cobioer:consent-changed";
export const CONSENT_STORAGE_KEY = "cobioer_cookie_consent";
export const CONSENT_VERSION = 1;

export type ConsentPreferences = {
  version: number;
  essential: true;
  analytics: boolean;
  marketing: boolean;
  updatedAt: string;
};

export function readConsent(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (!raw) return null;

  if (raw === "accepted" || raw === "essential") {
    return {
      version: CONSENT_VERSION,
      essential: true,
      analytics: raw === "accepted",
      marketing: raw === "accepted",
      updatedAt: window.localStorage.getItem("cobioer_cookie_consent_at") || new Date(0).toISOString(),
    };
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ConsentPreferences>;
    if (parsed.version !== CONSENT_VERSION || parsed.essential !== true) return null;
    return {
      version: CONSENT_VERSION,
      essential: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date(0).toISOString(),
    };
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean, marketing: boolean): ConsentPreferences {
  const preferences: ConsentPreferences = {
    version: CONSENT_VERSION,
    essential: true,
    analytics,
    marketing,
    updatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
  window.localStorage.setItem("cobioer_cookie_consent_at", preferences.updatedAt);
  document.documentElement.dataset.analyticsConsent = String(analytics);
  document.documentElement.dataset.marketingConsent = String(marketing);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: preferences }));
  return preferences;
}

export function openCookieSettings() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
}
