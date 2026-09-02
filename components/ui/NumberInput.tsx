"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface NumberInputProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  unitSuffix?: string;
  placeholder?: string;
  min?: number;
  step?: string | number;
  error?: string;
  helperText?: string;
  disabled?: boolean;
}

export default function NumberInput({
  id,
  label,
  value,
  onChange,
  required = false,
  unitSuffix,
  placeholder = "0.00",
  min = 0,
  step = "any",
  error,
  helperText,
  disabled = false,
}: NumberInputProps) {
  return (
    <div className="flex flex-col space-y-1.5 text-left w-full">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          {label} {required && <span className="text-red-500 font-bold">*</span>}
        </label>
        {unitSuffix && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            {unitSuffix}
          </span>
        )}
      </div>

      <div className="relative rounded-xl shadow-2xs">
        <input
          id={id}
          name={id}
          type="number"
          inputMode="decimal"
          value={value === 0 && placeholder ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          step={step}
          disabled={disabled}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-white ${
            error
              ? "border-red-500 focus:ring-red-400/30 focus:border-red-500 bg-red-50/30 dark:bg-red-950/20"
              : "border-slate-300 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-600 hover:border-slate-400 dark:hover:border-slate-600"
          } ${disabled ? "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800" : ""}`}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1 mt-0.5 animate-in fade-in">
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
}
