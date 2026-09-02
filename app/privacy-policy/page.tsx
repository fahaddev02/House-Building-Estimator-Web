import React from "react";
import { Shield } from "lucide-react";
import { SUPPORT_EMAIL } from "@/components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>Legal & Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Last Updated: September 2026
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            1. Overview & Commitment
          </h2>
          <p>
            Paint Calculator & Estimator (&quot;we&quot;, &quot;us&quot;) is committed to protecting your personal privacy. This Privacy Policy details our practices regarding information collection, storage, and processing when using our web calculators and companion services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            2. Local Browser Storage (LocalStorage)
          </h2>
          <p>
            All calculations, room dimensions, paint configurations, and saved estimates are stored <strong>strictly locally on your own device</strong> using browser LocalStorage. We do not transmit or store your architectural measurements, project notes, or pricing data on our servers.
          </p>
          <p>
            You may clear your stored projects at any time through your browser settings or directly within the Saved Projects interface.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            3. Information We Collect
          </h2>
          <p>
            When submitting inquiries through our Contact form, we collect the name, email address, and message content you provide solely to respond to your support request. We never sell, rent, or trade contact information to third-party advertisers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            4. PDF Generation & Sharing
          </h2>
          <p>
            PDF estimates are rendered client-side directly in your browser using JavaScript. No document data is sent to external generation servers. When using the Web Share API, sharing actions are executed through your operating system&apos;s native share sheet.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            5. Contact Us
          </h2>
          <p>
            If you have questions regarding this privacy policy or our local data practices, please contact us at:{" "}
            <code className="text-blue-600 dark:text-blue-400 font-bold">{SUPPORT_EMAIL}</code>.
          </p>
        </section>
      </div>
    </div>
  );
}
