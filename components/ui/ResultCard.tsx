"use client";

import React, { useState } from "react";
import {
  Download,
  Share2,
  Bookmark,
  RotateCcw,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { shareEstimate, ShareEstimatePayload } from "@/lib/utils/share";
import { generateEstimatePdf, PdfEstimateData } from "@/lib/utils/pdfExport";

export interface MetricItem {
  label: string;
  value: string | number;
  unit?: string;
  isPrimary?: boolean;
  helper?: string;
}

interface ResultCardProps {
  title: string;
  metrics: MetricItem[];
  onRecalculate: () => void;
  onSave: () => void;
  sharePayload: ShareEstimatePayload;
  pdfData: PdfEstimateData;
  nextAction?: {
    label: string;
    href: string;
    sublabel?: string;
  };
}

export default function ResultCard({
  title,
  metrics,
  onRecalculate,
  onSave,
  sharePayload,
  pdfData,
  nextAction,
}: ResultCardProps) {
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const handleShare = async () => {
    const res = await shareEstimate(sharePayload);
    setShareStatus(res.message);
    setTimeout(() => {
      setShareStatus(null);
    }, 3500);
  };

  const handlePdfDownload = () => {
    setPdfGenerating(true);
    try {
      generateEstimatePdf(pdfData);
    } catch (e) {
      console.error("PDF generation failed", e);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setPdfGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-blue-500/20 dark:border-blue-500/30 p-6 sm:p-8 shadow-xl shadow-blue-500/5 text-left space-y-6 animate-in fade-in slide-in-from-bottom-3">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Calculation Summary
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full">
          <Check className="w-3.5 h-3.5" />
          <span>Calculated</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl transition-all ${
              metric.isPrimary
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 sm:col-span-2 lg:col-span-1"
                : "bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-800"
            }`}
          >
            <div
              className={`text-xs font-bold uppercase tracking-wider ${
                metric.isPrimary
                  ? "text-blue-100"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {metric.label}
            </div>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span
                className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  metric.isPrimary
                    ? "text-white"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                {metric.value}
              </span>
              {metric.unit && (
                <span
                  className={`text-sm font-semibold ${
                    metric.isPrimary
                      ? "text-blue-100"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {metric.unit}
                </span>
              )}
            </div>
            {metric.helper && (
              <div
                className={`mt-1 text-xs ${
                  metric.isPrimary
                    ? "text-blue-100/80"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {metric.helper}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons: Recalculate, Save Result, Share, Download PDF */}
      <div className="pt-2 flex flex-wrap items-center gap-2.5">
        <button
          onClick={onRecalculate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          title="Reset or adjust inputs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Recalculate</span>
        </button>

        <button
          onClick={onSave}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Save Result</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>

        <button
          onClick={handlePdfDownload}
          disabled={pdfGenerating}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{pdfGenerating ? "Generating..." : "Download PDF"}</span>
        </button>
      </div>

      {shareStatus && (
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 animate-in fade-in">
          {shareStatus}
        </div>
      )}

      {/* Next Flow Button (e.g. Calculate Paint, Calculate Cost) */}
      {nextAction && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <Link
            href={nextAction.href}
            className="w-full inline-flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/25 transition-all group"
          >
            <div className="text-left">
              <div className="text-[11px] uppercase tracking-wider text-blue-200 font-semibold">
                Next Step
              </div>
              <div className="text-base sm:text-lg font-extrabold leading-tight">
                {nextAction.label}
              </div>
              {nextAction.sublabel && (
                <div className="text-xs text-blue-100 mt-0.5">
                  {nextAction.sublabel}
                </div>
              )}
            </div>
            <div className="p-2.5 rounded-xl bg-white/20 group-hover:bg-white/30 group-hover:translate-x-1.5 transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
