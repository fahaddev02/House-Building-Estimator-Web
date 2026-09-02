"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CurrencyCode, CURRENCIES } from "../calculations/currency";
import { UnitSystem, AreaUnit, VolumeUnit, LengthUnit } from "../calculations/unitConversion";

export interface SettingsState {
  unitSystem: UnitSystem;
  lengthUnit: LengthUnit;
  areaUnit: AreaUnit;
  volumeUnit: VolumeUnit;
  currency: CurrencyCode;
  theme: "light" | "dark" | "system";
  setUnitSystem: (system: UnitSystem) => void;
  setLengthUnit: (unit: LengthUnit) => void;
  setCurrency: (currency: CurrencyCode) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
}

const defaultSettings: SettingsState = {
  unitSystem: "metric",
  lengthUnit: "m",
  areaUnit: "m²",
  volumeUnit: "L",
  currency: "PKR",
  theme: "system",
  setUnitSystem: () => {},
  setLengthUnit: () => {},
  setCurrency: () => {},
  setTheme: () => {},
};

const SettingsContext = createContext<SettingsState>(defaultSettings);

const STORAGE_KEY = "paint_calc_settings";

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>("metric");
  const [lengthUnit, setLengthUnitState] = useState<LengthUnit>("m");
  const [currency, setCurrencyState] = useState<CurrencyCode>("PKR");
  const [theme, setThemeState] = useState<"light" | "dark" | "system">("system");
  const [isMounted, setIsMounted] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.unitSystem) setUnitSystemState(parsed.unitSystem);
        if (parsed.lengthUnit) setLengthUnitState(parsed.lengthUnit);
        if (parsed.currency) setCurrencyState(parsed.currency);
        if (parsed.theme) setThemeState(parsed.theme);
      }
    } catch (e) {
      console.warn("Could not read settings from localStorage", e);
    }
    setIsMounted(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ unitSystem, lengthUnit, currency, theme })
      );
    } catch (e) {
      console.warn("Could not save settings to localStorage", e);
    }
  }, [unitSystem, lengthUnit, currency, theme, isMounted]);

  // Apply dark mode class to <html>
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const setUnitSystem = (system: UnitSystem) => {
    setUnitSystemState(system);
    setLengthUnitState(system === "metric" ? "m" : "ft");
  };

  const setLengthUnit = (unit: LengthUnit) => {
    setLengthUnitState(unit);
  };

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
  };

  const setTheme = (t: "light" | "dark" | "system") => {
    setThemeState(t);
  };

  const areaUnit: AreaUnit = unitSystem === "metric" ? "m²" : "sq ft";
  const volumeUnit: VolumeUnit = unitSystem === "metric" ? "L" : "gal";

  return (
    <SettingsContext.Provider
      value={{
        unitSystem,
        lengthUnit,
        areaUnit,
        volumeUnit,
        currency,
        theme,
        setUnitSystem,
        setLengthUnit,
        setCurrency,
        setTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
