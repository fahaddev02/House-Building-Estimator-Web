"use client";

import React from "react";
import { Calculator, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export interface LiveSummaryItem {
  label: string;
  value: string | number;
  unit?: string;
  highlight?: boolean;
}

interface LiveSummaryPanelProps {
  title?: string;
  items: LiveSummaryItem[];
  isComplete: boolean;
  emptyNotice?: string;
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

export default function LiveSummaryPanel({
  title = "YOUR ESTIMATE",
  items,
  isComplete,
  emptyNotice = "Enter dimensions above to see real-time estimates.",
  primaryAction,
}: LiveSummaryPanelProps) {
  return (
    <aside className="sticky top-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none transition-all">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
            <Calculator className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            {title}
          </h3>
        </div>
        {isComplete && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" />
            Live
          </span>
        )}
      </div>

      <div className="py-4 space-y-3.5">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex items-baseline justify-between transition-colors ${
              item.highlight
                ? "bg-blue-50/80 dark:bg-blue-950/40 -mx-3 px-3 py-2 rounded-xl border border-blue-100 dark:border-blue-900/50"
                : ""
            }`}
          >
            <span
              className={`text-sm ${
                item.highlight
                  ? "font-bold text-blue-900 dark:text-blue-200"
                  : "text-slate-600 dark:text-slate-400 font-medium"
              }`}
            >
              {item.label}
            </span>
            <div className="text-right">
              <span
                className={`text-base font-extrabold ${
                  item.highlight
                    ? "text-blue-600 dark:text-blue-400 text-lg"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {item.value}
              </span>
              {item.unit && (
                <span className="ml-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {item.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isComplete && (
        <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300">
          {emptyNotice}
        </div>
      )}

      {primaryAction && isComplete && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          {primaryAction.href ? (
            <Link
              href={primaryAction.href}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all group"
            >
              <span>{primaryAction.label}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <button
              onClick={primaryAction.onClick}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all group"
            >
              <span>{primaryAction.label}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
