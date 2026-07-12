"use client";

import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => setVisible(localStorage.getItem("cobioer_cookie_consent") === null), []);
  if (!visible) return null;

  function choose(value: "essential" | "accepted") {
    localStorage.setItem("cobioer_cookie_consent", value);
    localStorage.setItem("cobioer_cookie_consent_at", new Date().toISOString());
    setVisible(false);
  }

  return (
    <aside className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl rounded-2xl border border-secondary-200 bg-white p-5 shadow-2xl" aria-label="Cookie consent">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <p className="flex-1 text-xs leading-relaxed text-secondary-500">We use essential storage for language and privacy preferences. Optional analytics are activated only after consent. See our <a href="/privacy" className="font-semibold text-primary-600 hover:underline">Privacy Policy</a>.</p>
        <div className="flex shrink-0 gap-2"><button onClick={() => choose("essential")} className="rounded-lg border border-secondary-200 px-3 py-2 text-xs font-semibold text-secondary-600 hover:bg-secondary-50">Essential only</button><button onClick={() => choose("accepted")} className="rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white hover:bg-primary-700">Accept all</button></div>
      </div>
    </aside>
  );
}

