import React from "react";
import Link from "next/link";
import { Paintbrush, Mail, Shield, FileText, Info } from "lucide-react";
import GooglePlayButton from "@/components/ui/GooglePlayButton";
import { SUPPORT_EMAIL } from "@/lib/config/site";
export { SUPPORT_EMAIL };

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-white font-bold">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Paintbrush className="w-5 h-5" />
              </div>
              <span className="text-lg">Paint Calculator</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Professional, free painting estimation tools for homeowners, painters, and contractors. Accurately estimate wall and ceiling areas, paint cans, and total project budgets.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>{SUPPORT_EMAIL}</span>
            </div>
          </div>

          {/* Calculators */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Online Calculators
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/wall-calculator"
                  className="hover:text-white transition-colors"
                >
                  Wall Area Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/ceiling-calculator"
                  className="hover:text-white transition-colors"
                >
                  Ceiling Area Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/paint-calculator"
                  className="hover:text-white transition-colors"
                >
                  Paint Quantity Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/cost-calculator"
                  className="hover:text-white transition-colors"
                >
                  Painting Cost & Material Estimator
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-white transition-colors"
                >
                  Saved Estimates & Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company & Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Android App Promotion */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Get the Mobile App
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculate on-site even without internet access. Save unlimited projects and export clean PDF estimates right from your Android device.
            </p>
            <div>
              <GooglePlayButton size="default" theme="dark" />
            </div>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
          <p className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50">
            <strong className="text-slate-300">Disclaimer:</strong> All calculations provided by Paint Calculator & Estimator are estimates designed for budgeting and guidance. Real-world paint coverage and project costs vary based on surface texture, substrate porosity, application technique (roller vs. sprayer), specific manufacturer specs, and local labor rates.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Paint Calculator & Estimator. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-300">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms</Link>
            <Link href="/contact" className="hover:text-slate-300">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
