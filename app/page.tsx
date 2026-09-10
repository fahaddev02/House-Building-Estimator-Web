import React from "react";
import Link from "next/link";
import {
  Ruler,
  Maximize2,
  Paintbrush,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  FileDown,
  Calculator,
  Layers,
  Sparkles,
  HelpCircle,
  Users,
} from "lucide-react";
import HeroIllustration from "@/components/ui/HeroIllustration";
import AppPromoBanner from "@/components/ui/AppPromoBanner";
import GooglePlayButton from "@/components/ui/GooglePlayButton";

export default function HomePage() {
  const calculatorCards = [
    {
      id: "wall",
      title: "Wall Calculator",
      description: "Calculate wall surface and paintable area.",
      longDesc:
        "Supports single walls, multiple perimeter walls, and complete rectangular rooms. Deduct doors, windows, and custom openings.",
      buttonLabel: "Calculate Wall Area",
      href: "/wall-calculator",
      icon: Ruler,
      color: "from-blue-600 to-indigo-600",
      accent: "text-blue-600 dark:text-blue-400",
      badge: "Most Popular",
    },
    {
      id: "ceiling",
      title: "Ceiling Calculator",
      description: "Calculate ceiling surface area quickly.",
      longDesc:
        "Supports rectangular, square, or complex multi-section ceilings. Ideal for drywallers, plasterers, and ceiling paint estimation.",
      buttonLabel: "Calculate Ceiling Area",
      href: "/ceiling-calculator",
      icon: Maximize2,
      color: "from-emerald-600 to-teal-600",
      accent: "text-emerald-600 dark:text-emerald-400",
      badge: "Quick Estimate",
    },
    {
      id: "paint",
      title: "Paint Calculator",
      description: "Find out how much paint you need.",
      longDesc:
        "Determine required paint cans in liters or gallons based on coverage rate, coats, and wastage allowances. Never run short or overbuy.",
      buttonLabel: "Calculate Paint",
      href: "/paint-calculator",
      icon: Paintbrush,
      color: "from-amber-500 to-orange-600",
      accent: "text-amber-500 dark:text-amber-400",
      badge: "Smart Volume",
    },
    {
      id: "cost",
      title: "Cost Calculator",
      description: "Estimate your complete painting cost.",
      longDesc:
        "Comprehensive project budget calculator factoring in wall paint, primer, contractor labor rates, and extra sundries/materials.",
      buttonLabel: "Calculate Cost",
      href: "/cost-calculator",
      icon: DollarSign,
      color: "from-purple-600 to-violet-600",
      accent: "text-purple-600 dark:text-purple-400",
      badge: "Complete Budget",
    },
  ];

  const personas = [
    { title: "Homeowners & DIYers", desc: "Plan home renovation budgets and buy exact paint cans without contractor markups." },
    { title: "Professional Painters", desc: "Produce itemized quotes with square footage, coats, and labor on job sites." },
    { title: "General Contractors", desc: "Estimate complete material requirements and labor allocations for new construction." },
    { title: "Interior Designers", desc: "Coordinate wall finishes, accent areas, and precise color coverage for client specs." },
  ];

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* 1. HERO SECTION */}
      <section className="relative pt-4 pb-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & CTAs */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Professional Online Painting Suite</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Calculate Paint, Materials & Cost{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                With Confidence
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-normal">
              Accurately calculate wall area, ceiling area, paint quantity and painting costs in seconds. No guesswork, no wasted paint, no budget surprises.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/wall-calculator"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-xl shadow-blue-600/25 hover:shadow-2xl hover:shadow-blue-600/35 transition-all group"
              >
                <span>Start Calculating</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <GooglePlayButton size="large" theme="dark" />
            </div>

            {/* Trust points */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Free Calculators</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Metric & Imperial Units</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Downloadable PDF Quotes</span>
              </div>
            </div>
          </div>

          {/* Right Hero Illustration */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <HeroIllustration className="w-full max-w-md lg:max-w-none" />
          </div>
        </div>
      </section>

      {/* 2. CALCULATOR CARDS SECTION */}
      <section className="space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Calculator className="w-3.5 h-3.5" />
            <span>Independent Calculation Tools</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Everything You Need for Your Painting Project
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Four specialized calculators built for accuracy. Use them individually or pass your measurements seamlessly from one tool to the next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {calculatorCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6 group hover:border-blue-500/40"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      {card.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
                      {card.description}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {card.longDesc}
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href={card.href}
                    className="w-full inline-flex items-center justify-between px-6 py-3.5 rounded-xl bg-slate-900 text-white hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 font-bold text-sm transition-colors group/btn shadow-xs"
                  >
                    <span>{card.buttonLabel}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. WHO IS THIS FOR? TARGET PERSONAS */}
      <section className="bg-slate-100/60 dark:bg-slate-900/40 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 space-y-8 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <Users className="w-3.5 h-3.5" />
            <span>Built For Everyone in Painting</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Trusted by Professionals & DIY Enthusiasts
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Whether you are painting a single bedroom wall or quoting an entire 5,000 sq ft commercial facility, our calculations scale to match your standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personas.map((p, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 space-y-2 shadow-2xs"
            >
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {p.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. APP PROMO BANNER */}
      <AppPromoBanner />

      {/* 5. GENERAL FAQ SECTION */}
      <section className="text-left space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Answers to Common Questions</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white">
              How do I calculate wall area?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              For a rectangular room, measure length, width, and ceiling height. The wall area formula is: <code className="text-blue-600 dark:text-blue-400">2 × (Length + Width) × Height</code>. Then subtract the area of doors and windows.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white">
              How much paint do I need for a room?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Multiply net paintable surface area by the number of coats (standard is 2 coats), divide by the paint manufacturer&apos;s coverage rate (typically 10 m²/L or 350 sq ft/gal), and add a 10% wastage allowance.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Does the calculator subtract windows and doors?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes! Our Wall Calculator includes dedicated deduction tools for standard doors (0.9m × 2.1m), windows (1.2m × 1.5m), and custom openings so you never overpay for paint.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Can I save my estimate and export a PDF?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes, all four calculators allow you to save your calculations locally in the browser under &quot;Saved Projects&quot; as well as download professional, branded PDF quotes with cost breakdowns.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
