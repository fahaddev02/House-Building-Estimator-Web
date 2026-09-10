"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "@/lib/context/SettingsContext";
import { useProjects } from "@/lib/context/ProjectsContext";
import {
  Paintbrush,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Smartphone,
  FolderArchive,
  Ruler,
  DollarSign,
  Maximize2,
} from "lucide-react";
import { CURRENCIES, CurrencyCode } from "@/lib/calculations/currency";
import { GOOGLE_PLAY_STORE_URL, PLAY_STORE_URL } from "@/lib/config/site";
export { GOOGLE_PLAY_STORE_URL, PLAY_STORE_URL };

export default function Navbar() {
  const pathname = usePathname();
  const {
    unitSystem,
    setUnitSystem,
    lengthUnit,
    setLengthUnit,
    currency,
    setCurrency,
    theme,
    setTheme,
  } = useSettings();
  const { projects } = useProjects();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/wall-calculator", label: "Wall Calculator", icon: Ruler },
    { href: "/ceiling-calculator", label: "Ceiling Calculator", icon: Maximize2 },
    { href: "/paint-calculator", label: "Paint Calculator", icon: Paintbrush },
    { href: "/cost-calculator", label: "Cost Calculator", icon: DollarSign },
    {
      href: "/projects",
      label: "Saved Projects",
      icon: FolderArchive,
      badge: projects.length > 0 ? projects.length : undefined,
    },
  ];

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-slate-900/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group font-bold text-slate-900 dark:text-white"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Paintbrush className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-extrabold tracking-tight leading-tight">
                Paint Calculator
              </span>
              <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 tracking-wider uppercase">
                & Estimator
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                  {link.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.5 text-[11px] font-semibold rounded-full bg-blue-600 text-white leading-none">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Controls & CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Unit Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setUnitSystem("metric")}
                className={`px-2.5 py-1 rounded transition-all ${
                  unitSystem === "metric"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
                title="Metric System (m, m², L)"
              >
                Metric (m)
              </button>
              <button
                onClick={() => setUnitSystem("imperial")}
                className={`px-2.5 py-1 rounded transition-all ${
                  unitSystem === "imperial"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
                title="Imperial System (ft, sq ft, gal)"
              >
                Imperial (ft)
              </button>
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Select Currency"
              >
                {Object.keys(CURRENCIES).map((c) => (
                  <option key={c} value={c}>
                    {CURRENCIES[c as CurrencyCode].symbol} ({c})
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={cycleTheme}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
              title={`Current theme: ${theme}. Click to switch.`}
              aria-label="Toggle theme"
            >
              {theme === "light" && <Sun className="w-4 h-4 text-amber-500" />}
              {theme === "dark" && <Moon className="w-4 h-4 text-blue-400" />}
              {theme === "system" && <Monitor className="w-4 h-4" />}
            </button>

            {/* Download App CTA */}
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-xs transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Download App</span>
            </a>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={cycleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle theme"
            >
              {theme === "light" && <Sun className="w-4 h-4 text-amber-500" />}
              {theme === "dark" && <Moon className="w-4 h-4 text-blue-400" />}
              {theme === "system" && <Monitor className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          {/* Quick links */}
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {Icon && <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-600 text-white">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Unit & Currency Controls for mobile */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Measurement Units
              </span>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold">
                <button
                  onClick={() => setUnitSystem("metric")}
                  className={`px-3 py-1 rounded transition-all ${
                    unitSystem === "metric"
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Metric (m)
                </button>
                <button
                  onClick={() => setUnitSystem("imperial")}
                  className={`px-3 py-1 rounded transition-all ${
                    unitSystem === "imperial"
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Imperial (ft)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Currency
              </span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-lg px-3 py-1.5 cursor-pointer"
              >
                {Object.keys(CURRENCIES).map((c) => (
                  <option key={c} value={c}>
                    {CURRENCIES[c as CurrencyCode].symbol} ({c})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Download App CTA */}
          <div className="pt-2">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors"
            >
              <Smartphone className="w-4 h-4" />
              <span>Download Android App</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
