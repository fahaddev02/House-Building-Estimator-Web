import React from "react";
import Link from "next/link";
import { Paintbrush, CheckCircle2, ShieldCheck, Users, ArrowRight } from "lucide-react";
import GooglePlayButton from "@/components/ui/GooglePlayButton";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 text-left">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Paintbrush className="w-3.5 h-3.5" />
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          About Paint Calculator & Estimator
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          The trusted companion for homeowners, professional painters, and general contractors who need instant, accurate material estimates without tedious spreadsheets.
        </p>
      </div>

      {/* Core Mission */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Why We Built Paint Calculator
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Painting projects often lead to one of two expensive mistakes: running out of paint mid-job (causing lap marks and color batch mismatches), or purchasing three extra gallons of expensive specialty paint that ends up collecting dust in a garage.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>Paint Calculator & Estimator</strong> was designed from the ground up to solve this problem. By combining precise geometric room formulas, opening deductions (doors & windows), manufacturer spreading rates, and realistic 10% wastage factors, we empower you to budget materials and labor with 100% confidence.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              For Homeowners & DIYers
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Take room measurements to your local paint or home improvement store knowing exactly how many cans to purchase.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              For Contractors & Painters
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Create professional, itemized PDF quotes on-site with labor rates and material breakdowns that impress clients.
            </p>
          </div>
        </div>
      </div>

      {/* What we calculate */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          What the Application Calculates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">01. Wall Areas</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Net Paintable Wall Area</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculates room perimeters and single walls while automatically deducting standard doors, windows, and custom openings.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">02. Ceilings</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ceiling Surface Area</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Computes square, rectangular, or irregular multi-section ceiling surface areas for primer and drywall estimates.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider">03. Paint Quantities</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Liters & Gallons Needed</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Factors coats, spreading coverage, and wastage margins into recommended whole-can purchase quantities.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">04. Project Budgets</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Complete Itemized Costs</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Estimates paints, primers, contractor labor rates, and consumables with support for multiple global currencies.
            </p>
          </div>
        </div>
      </div>

      {/* Cross-platform & Android App */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold">Companion Mobile App for Android</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Need offline calculations on job sites with zero cell service? Download our companion Android app on Google Play to store unlimited estimates directly on your phone.
        </p>
        <div>
          <GooglePlayButton size="default" theme="dark" />
        </div>
      </div>
    </div>
  );
}
