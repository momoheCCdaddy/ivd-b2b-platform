"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { COOKIE_SETTINGS_EVENT, readConsent, saveConsent } from "@/lib/privacy-consent";

export default function CookieConsent() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = readConsent();
    if (saved) {
      setAnalytics(saved.analytics);
      setMarketing(saved.marketing);
      document.documentElement.dataset.analyticsConsent = String(saved.analytics);
      document.documentElement.dataset.marketingConsent = String(saved.marketing);
    } else {
      setVisible(true);
    }

    const open = () => {
      const current = readConsent();
      setAnalytics(current?.analytics === true);
      setMarketing(current?.marketing === true);
      setCustomizing(true);
      setVisible(true);
    };
    window.addEventListener(COOKIE_SETTINGS_EVENT, open);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, open);
  }, []);

  function choose(nextAnalytics: boolean, nextMarketing: boolean) {
    saveConsent(nextAnalytics, nextMarketing);
    setVisible(false);
    setCustomizing(false);
  }

  if (!visible) return null;

  return (
    <aside className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-3xl rounded-2xl border border-secondary-200 bg-white p-5 shadow-2xl" aria-label={t("cookie.ariaLabel")}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-secondary-800">{t("cookie.title")}</h2>
          <p className="mt-1 text-xs leading-relaxed text-secondary-500">{t("cookie.message")} <a href="/privacy" className="font-semibold text-primary-600 hover:underline">{t("cookie.privacyPolicy")}</a>.</p>
        </div>
        {readConsent() && <button type="button" onClick={() => { setVisible(false); setCustomizing(false); }} className="rounded-lg p-1.5 text-secondary-400 hover:bg-secondary-50 hover:text-secondary-700" aria-label={t("cookie.close")}><X className="h-4 w-4" /></button>}
      </div>

      {customizing && (
        <div className="mt-4 space-y-2 border-t border-secondary-100 pt-4">
          <div className="flex items-center justify-between rounded-xl bg-secondary-50 px-4 py-3">
            <div><p className="text-xs font-semibold text-secondary-700">{t("cookie.essentialTitle")}</p><p className="mt-0.5 text-[11px] text-secondary-500">{t("cookie.essentialDescription")}</p></div>
            <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">{t("cookie.alwaysActive")}</span>
          </div>
          <PreferenceRow title={t("cookie.analyticsTitle")} description={t("cookie.analyticsDescription")} checked={analytics} onChange={setAnalytics} />
          <PreferenceRow title={t("cookie.marketingTitle")} description={t("cookie.marketingDescription")} checked={marketing} onChange={setMarketing} />
        </div>
      )}

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {!customizing && <button type="button" onClick={() => setCustomizing(true)} className="rounded-lg border border-secondary-200 px-3 py-2 text-xs font-semibold text-secondary-600 hover:bg-secondary-50">{t("cookie.customize")}</button>}
        <button type="button" onClick={() => choose(false, false)} className="rounded-lg border border-secondary-200 px-3 py-2 text-xs font-semibold text-secondary-600 hover:bg-secondary-50">{t("cookie.essentialOnly")}</button>
        {customizing
          ? <button type="button" onClick={() => choose(analytics, marketing)} className="rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white hover:bg-primary-700">{t("cookie.savePreferences")}</button>
          : <button type="button" onClick={() => choose(true, true)} className="rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white hover:bg-primary-700">{t("cookie.acceptAll")}</button>}
      </div>
    </aside>
  );
}

function PreferenceRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-secondary-100 px-4 py-3">
      <span><span className="block text-xs font-semibold text-secondary-700">{title}</span><span className="mt-0.5 block text-[11px] text-secondary-500">{description}</span></span>
      <input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} className="h-4 w-4 shrink-0 rounded border-secondary-300 text-primary-600 focus:ring-primary-500" />
    </label>
  );
}
