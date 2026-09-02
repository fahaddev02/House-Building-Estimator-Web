import React from "react";
import { Smartphone, CheckCircle, WifiOff, BookmarkCheck, Zap, Download } from "lucide-react";
import { PLAY_STORE_URL } from "../layout/Navbar";

export default function AppPromoBanner() {
  const benefits = [
    { icon: WifiOff, label: "Calculate offline on-site" },
    { icon: BookmarkCheck, label: "Save & organize client projects" },
    { icon: Zap, label: "Instant room & wall estimates" },
    { icon: Download, label: "Generate & export PDF quotes" },
  ];

  return (
    <section className="my-12 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-slate-800 text-white shadow-2xl relative">
      {/* Glow shapes */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="lg:col-span-7 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Companion App</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Get the Paint Calculator App on Android
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Take accurate calculations directly to job sites, hardware stores, and customer meetings. The complete professional painting toolkit right in your pocket.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {benefits.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-200">
                  <div className="p-1 rounded-lg bg-blue-500/20 text-blue-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3.5 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold transition-all shadow-lg hover:shadow-xl hover:scale-102 group"
            >
              <Smartphone className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                  Download Free On
                </div>
                <div className="text-base font-extrabold leading-none">
                  Google Play Store
                </div>
              </div>
            </a>
            <span className="text-xs text-slate-400">
              Free • Android 8.0+ • No Sign-up Needed
            </span>
          </div>
        </div>

        {/* Mobile device graphic mockup */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-64 sm:w-72 bg-slate-950 rounded-[40px] p-3 border-4 border-slate-700 shadow-2xl relative">
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-3" />
            <div className="bg-slate-900 rounded-[28px] p-4 text-left border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <span className="font-bold text-white">Paint Calculator</span>
                <span className="text-emerald-400 text-[10px] font-semibold">Offline Ready</span>
              </div>
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl p-3 text-xs">
                <div className="text-blue-300 font-medium">Master Bedroom</div>
                <div className="text-lg font-bold text-white mt-0.5">49.0 m²</div>
                <div className="text-[11px] text-slate-300">Paint Needed: 11 Liters</div>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-3 text-xs space-y-1">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Paint (2 Coats)</span>
                  <span className="text-white">Rs 27,500</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Labor (49 m²)</span>
                  <span className="text-white">Rs 7,350</span>
                </div>
                <div className="border-t border-slate-700 pt-1.5 flex justify-between font-bold text-white text-xs">
                  <span>Total Budget</span>
                  <span className="text-blue-400">Rs 34,850</span>
                </div>
              </div>
              <div className="w-full py-2 bg-blue-600 rounded-lg text-center text-xs font-bold text-white">
                Export PDF Estimate
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
