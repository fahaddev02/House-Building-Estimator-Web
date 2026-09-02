"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSettings } from "@/lib/context/SettingsContext";
import NumberInput from "@/components/ui/NumberInput";
import ResultCard from "@/components/ui/ResultCard";
import LiveSummaryPanel from "@/components/ui/LiveSummaryPanel";
import SaveProjectModal from "@/components/ui/SaveProjectModal";
import {
  calculateBasePaintRequired,
  calculatePaintWithWastage,
  calculateRecommendedPurchaseQuantity,
  calculateFullPaintRequirement,
} from "@/lib/calculations/paintCalculator";
import {
  convertCoverage,
  COVERAGE_M2_PER_L_TO_SQFT_PER_GAL,
} from "@/lib/calculations/unitConversion";
import { validateFields, focusFirstInvalidField, ValidationErrors } from "@/lib/utils/validation";
import { Paintbrush, Check, ChevronRight, HelpCircle, Layers, Sparkles } from "lucide-react";

function PaintCalculatorContent() {
  const searchParams = useSearchParams();
  const { unitSystem, areaUnit, volumeUnit } = useSettings();

  // Area Mode: direct enter or helper
  const [areaMode, setAreaMode] = useState<"direct" | "helper">("direct");
  const [surfaceArea, setSurfaceArea] = useState<string>("");

  // Helper mode state (Wall / Ceiling / Both)
  const [helperType, setHelperType] = useState<"wall" | "ceiling" | "both">("wall");
  const [helperWallLength, setHelperWallLength] = useState("");
  const [helperWallWidth, setHelperWallWidth] = useState("");
  const [helperWallHeight, setHelperWallHeight] = useState("");
  const [helperCeilingLength, setHelperCeilingLength] = useState("");
  const [helperCeilingWidth, setHelperCeilingWidth] = useState("");

  // Paint Settings
  // Metric defaults: 10 m²/L; Imperial defaults: ~400 sq ft/gal
  const [coveragePreset, setCoveragePreset] = useState<string>("10");
  const [customCoverage, setCustomCoverage] = useState<string>("");

  const [coatsPreset, setCoatsPreset] = useState<string>("2");
  const [customCoats, setCustomCoats] = useState<string>("");

  const [wastagePreset, setWastagePreset] = useState<string>("10");
  const [customWastage, setCustomWastage] = useState<string>("");

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasCalculated, setHasCalculated] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  // Read URL query params passed from Wall or Ceiling Calculator
  useEffect(() => {
    const areaParam = searchParams.get("area");
    if (areaParam && !isNaN(parseFloat(areaParam))) {
      setSurfaceArea(areaParam);
      setAreaMode("direct");
      setHasCalculated(true);
    }
  }, [searchParams]);

  // Adjust coverage presets when unit system changes
  useEffect(() => {
    if (unitSystem === "imperial") {
      setCoveragePreset("350");
    } else {
      setCoveragePreset("10");
    }
  }, [unitSystem]);

  // Active numeric settings
  const effectiveArea = useMemo(() => {
    if (areaMode === "direct") {
      const n = parseFloat(surfaceArea);
      return isNaN(n) ? 0 : n;
    } else {
      // Calculate from helper
      let total = 0;
      const wl = parseFloat(helperWallLength) || 0;
      const ww = parseFloat(helperWallWidth) || 0;
      const wh = parseFloat(helperWallHeight) || 0;
      const cl = parseFloat(helperCeilingLength) || 0;
      const cw = parseFloat(helperCeilingWidth) || 0;

      if (helperType === "wall" || helperType === "both") {
        total += 2 * (wl + ww) * wh;
      }
      if (helperType === "ceiling" || helperType === "both") {
        total += cl * cw;
      }
      return total;
    }
  }, [
    areaMode,
    surfaceArea,
    helperType,
    helperWallLength,
    helperWallWidth,
    helperWallHeight,
    helperCeilingLength,
    helperCeilingWidth,
  ]);

  const effectiveCoverage = useMemo(() => {
    if (coveragePreset === "custom") {
      const n = parseFloat(customCoverage);
      return isNaN(n) ? 0 : n;
    }
    return parseFloat(coveragePreset) || 10;
  }, [coveragePreset, customCoverage]);

  const effectiveCoats = useMemo(() => {
    if (coatsPreset === "custom") {
      const n = parseInt(customCoats);
      return isNaN(n) ? 0 : n;
    }
    return parseInt(coatsPreset) || 2;
  }, [coatsPreset, customCoats]);

  const effectiveWastage = useMemo(() => {
    if (wastagePreset === "custom") {
      const n = parseFloat(customWastage);
      return isNaN(n) ? 0 : n;
    }
    return parseFloat(wastagePreset) || 10;
  }, [wastagePreset, customWastage]);

  // Pure engine calculations
  const paintResults = useMemo(() => {
    return calculateFullPaintRequirement(
      effectiveArea,
      effectiveCoverage,
      effectiveCoats,
      effectiveWastage
    );
  }, [effectiveArea, effectiveCoverage, effectiveCoats, effectiveWastage]);

  const isFormFilled = effectiveArea > 0 && effectiveCoverage > 0 && effectiveCoats > 0;

  const handleFieldChange = (key: string, value: string, setter: (v: string) => void) => {
    setter(value);
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const rules: any[] = [];
    if (areaMode === "direct") {
      rules.push({
        fieldKey: "surfaceArea",
        fieldName: "Surface Area",
        value: surfaceArea,
        required: true,
        domId: "surfaceArea",
      });
    } else {
      if (helperType === "wall" || helperType === "both") {
        rules.push(
          { fieldKey: "helperWallLength", fieldName: "Room Length", value: helperWallLength, required: true, domId: "helperWallLength" },
          { fieldKey: "helperWallWidth", fieldName: "Room Width", value: helperWallWidth, required: true, domId: "helperWallWidth" },
          { fieldKey: "helperWallHeight", fieldName: "Wall Height", value: helperWallHeight, required: true, domId: "helperWallHeight" }
        );
      }
      if (helperType === "ceiling" || helperType === "both") {
        rules.push(
          { fieldKey: "helperCeilingLength", fieldName: "Ceiling Length", value: helperCeilingLength, required: true, domId: "helperCeilingLength" },
          { fieldKey: "helperCeilingWidth", fieldName: "Ceiling Width", value: helperCeilingWidth, required: true, domId: "helperCeilingWidth" }
        );
      }
    }

    if (coveragePreset === "custom") {
      rules.push({
        fieldKey: "customCoverage",
        fieldName: "Paint Coverage",
        value: customCoverage,
        required: true,
        domId: "customCoverage",
      });
    }

    if (coatsPreset === "custom") {
      rules.push({
        fieldKey: "customCoats",
        fieldName: "Number of Coats",
        value: customCoats,
        required: true,
        domId: "customCoats",
      });
    }

    if (wastagePreset === "custom") {
      rules.push({
        fieldKey: "customWastage",
        fieldName: "Wastage Percentage",
        value: customWastage,
        required: true,
        domId: "customWastage",
      });
    }

    const validation = validateFields(rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      focusFirstInvalidField(validation.firstErrorId);
      return;
    }

    setErrors({});
    setHasCalculated(true);

    const resultEl = document.getElementById("paint-results-section");
    if (resultEl) resultEl.scrollIntoView({ behavior: "smooth" });
  };

  const handleRecalculate = () => {
    setHasCalculated(false);
    focusFirstInvalidField(areaMode === "direct" ? "surfaceArea" : "helperWallLength");
  };

  const coverageUnit = unitSystem === "metric" ? "m²/L" : "sq ft/gal";

  const sharePayload = {
    title: "Paint Requirement Estimate",
    area: `${effectiveArea.toFixed(1)} ${areaUnit}`,
    paintRequired: `${paintResults.recommendedPurchase} ${volumeUnit} (${paintResults.paintWithWastage} ${volumeUnit} exact)`,
    customSummary: `Coats: ${effectiveCoats}\nCoverage: ${effectiveCoverage} ${coverageUnit}\nWastage: ${effectiveWastage}%`,
  };

  const pdfData = {
    projectName: "Paint Volume Estimate",
    calculatorType: "Paint Calculator" as const,
    netPaintableArea: `${effectiveArea.toFixed(2)} ${areaUnit}`,
    coverage: `${effectiveCoverage} ${coverageUnit}`,
    coats: `${effectiveCoats} coats`,
    wastage: `${effectiveWastage}% allowance`,
    basePaint: `${paintResults.basePaint} ${volumeUnit}`,
    recommendedPaint: `${paintResults.recommendedPurchase} ${volumeUnit}`,
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="text-left space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Paintbrush className="w-3.5 h-3.5" />
          <span>Quantity Estimation Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Paint Quantity Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          Find out exactly how many liters or gallons of paint you need based on surface area, manufacturer spread rate, number of coats, and wastage allowance.
        </p>
      </div>

      {/* Main Form & Live Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-8 space-y-8 text-left">
          <form onSubmit={handleCalculate} noValidate className="space-y-8">
            {/* 1. Surface Area Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  1. Surface Area to Paint
                </h2>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setAreaMode("direct");
                      setErrors({});
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      areaMode === "direct"
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Enter Area Directly
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAreaMode("helper");
                      setErrors({});
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      areaMode === "helper"
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Calculate Area
                  </button>
                </div>
              </div>

              {areaMode === "direct" ? (
                <div className="space-y-3">
                  <div className="max-w-md">
                    <NumberInput
                      id="surfaceArea"
                      label="Total Paintable Surface Area"
                      value={surfaceArea}
                      onChange={(v) => handleFieldChange("surfaceArea", v, setSurfaceArea)}
                      unitSuffix={areaUnit}
                      required
                      placeholder={unitSystem === "metric" ? "49.0" : "500.0"}
                      error={errors.surfaceArea}
                      helperText="If you already used the Wall or Ceiling calculator, this was auto-populated."
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Helper sub-toggle */}
                  <div className="flex gap-2">
                    {[
                      { id: "wall", label: "Wall Area" },
                      { id: "ceiling", label: "Ceiling Area" },
                      { id: "both", label: "Both (Walls + Ceiling)" },
                    ].map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setHelperType(h.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                          helperType === h.id
                            ? "bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>

                  {(helperType === "wall" || helperType === "both") && (
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                      <div className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                        Room Wall Dimensions:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <NumberInput
                          id="helperWallLength"
                          label="Length"
                          value={helperWallLength}
                          onChange={(v) => handleFieldChange("helperWallLength", v, setHelperWallLength)}
                          required
                          placeholder="5.0"
                          error={errors.helperWallLength}
                        />
                        <NumberInput
                          id="helperWallWidth"
                          label="Width"
                          value={helperWallWidth}
                          onChange={(v) => handleFieldChange("helperWallWidth", v, setHelperWallWidth)}
                          required
                          placeholder="4.0"
                          error={errors.helperWallWidth}
                        />
                        <NumberInput
                          id="helperWallHeight"
                          label="Height"
                          value={helperWallHeight}
                          onChange={(v) => handleFieldChange("helperWallHeight", v, setHelperWallHeight)}
                          required
                          placeholder="3.0"
                          error={errors.helperWallHeight}
                        />
                      </div>
                    </div>
                  )}

                  {(helperType === "ceiling" || helperType === "both") && (
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                      <div className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                        Ceiling Dimensions:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <NumberInput
                          id="helperCeilingLength"
                          label="Length"
                          value={helperCeilingLength}
                          onChange={(v) => handleFieldChange("helperCeilingLength", v, setHelperCeilingLength)}
                          required
                          placeholder="5.0"
                          error={errors.helperCeilingLength}
                        />
                        <NumberInput
                          id="helperCeilingWidth"
                          label="Width"
                          value={helperCeilingWidth}
                          onChange={(v) => handleFieldChange("helperCeilingWidth", v, setHelperCeilingWidth)}
                          required
                          placeholder="4.0"
                          error={errors.helperCeilingWidth}
                        />
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-xl text-xs font-bold text-blue-900 dark:text-blue-200 flex justify-between">
                    <span>Calculated Area:</span>
                    <span>{effectiveArea.toFixed(1)} {areaUnit}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Paint Settings (Coverage, Coats, Wastage) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                2. Paint Application Settings
              </h2>

              {/* Paint Coverage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Paint Coverage Rate <span className="text-red-500 font-bold">*</span>
                  </label>
                  <span className="text-xs text-slate-500">{coverageUnit}</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {unitSystem === "metric"
                    ? ["8", "10", "12", "custom"].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            setCoveragePreset(val);
                            if (errors.customCoverage) setErrors((prev) => ({ ...prev, customCoverage: "" }));
                          }}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            coveragePreset === val
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {val === "custom" ? "Custom" : `${val} m²/L`}
                        </button>
                      ))
                    : ["300", "350", "400", "custom"].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            setCoveragePreset(val);
                            if (errors.customCoverage) setErrors((prev) => ({ ...prev, customCoverage: "" }));
                          }}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            coveragePreset === val
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {val === "custom" ? "Custom" : `${val} sq ft`}
                        </button>
                      ))}
                </div>

                {coveragePreset === "custom" && (
                  <div className="max-w-xs pt-2">
                    <NumberInput
                      id="customCoverage"
                      label="Custom Coverage Rate"
                      value={customCoverage}
                      onChange={(v) => handleFieldChange("customCoverage", v, setCustomCoverage)}
                      unitSuffix={coverageUnit}
                      required
                      placeholder={unitSystem === "metric" ? "10.5" : "380"}
                      error={errors.customCoverage}
                    />
                  </div>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Typical latex wall paints cover 10 m²/L (~350-400 sq ft/gal). Check your paint can label.
                </p>
              </div>

              {/* Number of Coats */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Number of Coats <span className="text-red-500 font-bold">*</span>
                </label>

                <div className="grid grid-cols-4 gap-2">
                  {["1", "2", "3", "custom"].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setCoatsPreset(val);
                        if (errors.customCoats) setErrors((prev) => ({ ...prev, customCoats: "" }));
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        coatsPreset === val
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {val === "custom" ? "Custom" : `${val} Coat${val === "1" ? "" : "s"}`}
                    </button>
                  ))}
                </div>

                {coatsPreset === "custom" && (
                  <div className="max-w-xs pt-2">
                    <NumberInput
                      id="customCoats"
                      label="Custom Number of Coats"
                      value={customCoats}
                      onChange={(v) => handleFieldChange("customCoats", v, setCustomCoats)}
                      required
                      min={1}
                      step={1}
                      placeholder="4"
                      error={errors.customCoats}
                    />
                  </div>
                )}
              </div>

              {/* Wastage Allowance */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Wastage Allowance <span className="text-red-500 font-bold">*</span>
                </label>

                <div className="grid grid-cols-4 gap-2">
                  {["5", "10", "15", "custom"].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setWastagePreset(val);
                        if (errors.customWastage) setErrors((prev) => ({ ...prev, customWastage: "" }));
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        wastagePreset === val
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {val === "custom" ? "Custom" : `${val}%`}
                    </button>
                  ))}
                </div>

                {wastagePreset === "custom" && (
                  <div className="max-w-xs pt-2">
                    <NumberInput
                      id="customWastage"
                      label="Custom Wastage (%)"
                      value={customWastage}
                      onChange={(v) => handleFieldChange("customWastage", v, setCustomWastage)}
                      unitSuffix="%"
                      required
                      min={0}
                      placeholder="12"
                      error={errors.customWastage}
                    />
                  </div>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  10% extra is industry standard to account for roller saturation, spills, porous drywall, and touch-ups.
                </p>
              </div>
            </div>

            {/* Calculate CTA Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base shadow-lg shadow-blue-500/25 transition-all"
              >
                Calculate Paint Required
              </button>
            </div>
          </form>

          {/* Result Section */}
          <div id="paint-results-section">
            {hasCalculated && (
              <ResultCard
                title="Paint Quantity Recommendation"
                metrics={[
                  {
                    label: "Recommended Paint",
                    value: paintResults.recommendedPurchase,
                    unit: volumeUnit,
                    isPrimary: true,
                    helper: "Rounded up for whole can purchase",
                  },
                  {
                    label: "Base Paint Required",
                    value: paintResults.basePaint,
                    unit: volumeUnit,
                    helper: "Exact volume without wastage",
                  },
                  {
                    label: "With Wastage Factor",
                    value: paintResults.paintWithWastage,
                    unit: volumeUnit,
                    helper: `${effectiveWastage}% margin included`,
                  },
                  {
                    label: "Coverage Rate",
                    value: effectiveCoverage,
                    unit: coverageUnit,
                  },
                  {
                    label: "Coats Applied",
                    value: effectiveCoats,
                    unit: "coats",
                  },
                ]}
                onRecalculate={handleRecalculate}
                onSave={() => setSaveModalOpen(true)}
                sharePayload={sharePayload}
                pdfData={pdfData}
                nextAction={{
                  label: "Calculate Painting Project Cost",
                  sublabel: `Automatically passes ${paintResults.recommendedPurchase} ${volumeUnit} paint to the Cost Calculator`,
                  href: `/cost-calculator?paintQuantity=${paintResults.recommendedPurchase}&area=${effectiveArea.toFixed(1)}`,
                }}
              />
            )}
          </div>
        </div>

        {/* Right Column: Live Summary Sticky Panel */}
        <div className="lg:col-span-4 w-full">
          <LiveSummaryPanel
            title="PAINT SUMMARY"
            isComplete={isFormFilled}
            items={[
              { label: "Surface Area", value: effectiveArea > 0 ? effectiveArea.toFixed(1) : "—", unit: effectiveArea > 0 ? areaUnit : "" },
              { label: "Coats", value: effectiveCoats },
              { label: "Coverage", value: `${effectiveCoverage} ${coverageUnit}` },
              { label: "Wastage Allowance", value: `${effectiveWastage}%` },
              {
                label: "Recommended Paint",
                value: paintResults.recommendedPurchase > 0 ? paintResults.recommendedPurchase : "—",
                unit: paintResults.recommendedPurchase > 0 ? volumeUnit : "",
                highlight: true,
              },
            ]}
            emptyNotice="Enter area and paint settings to see instant paint requirements."
            primaryAction={
              paintResults.recommendedPurchase > 0
                ? {
                    label: "Next: Calculate Cost",
                    href: `/cost-calculator?paintQuantity=${paintResults.recommendedPurchase}&area=${effectiveArea.toFixed(1)}`,
                  }
                : undefined
            }
          />
        </div>
      </div>

      {/* Save Project Modal */}
      <SaveProjectModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        calculatorType="paint"
        defaultName="Paint Estimation"
        projectData={{
          area: Number(effectiveArea.toFixed(1)),
          areaUnit: areaUnit,
          paintQuantity: paintResults.recommendedPurchase,
          paintUnit: volumeUnit,
          notes: `Coats: ${effectiveCoats}, Coverage: ${effectiveCoverage} ${coverageUnit}, Wastage: ${effectiveWastage}%`,
        }}
      />

      {/* Educational Content & FAQ */}
      <section className="pt-12 border-t border-slate-200 dark:border-slate-800 text-left space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            How Paint Quantities and Spreading Rates Work
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Learn the exact science behind spreading rate, coat opacity, and wastage margins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              How Much Paint Do I Need?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              The universal formula: <br />
              <strong className="text-blue-600 dark:text-blue-400 font-mono text-xs">
                Paint = (Area × Coats ÷ Coverage) × (1 + Wastage)
              </strong>.<br />
              For example: 49 m² with 2 coats at 10 m²/L plus 10% wastage equals 10.78 Liters, meaning you should purchase 11 Liters.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Understanding Paint Coverage
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard wall emulsion delivers 10 to 12 m²/L on smooth, primed plaster. Textured masonry, unprimed drywall, and popcorn textures absorb significantly more paint, lowering coverage to 6 to 8 m²/L.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              How Many Coats Should I Apply?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Two coats provide maximum durability, uniform color depth, and wash resistance. One coat is only recommended when refreshing the exact same color. Drastic transitions (e.g. dark red to white) may require 1 coat primer + 2 coats paint.
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-slate-100/70 dark:bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Paint Calculator FAQs
          </h3>
          <div className="space-y-3 text-sm">
            <details className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <summary className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                Why is a 10% wastage allowance recommended?
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Paint rollers retain up to 0.5 liters of liquid paint in the fabric nap. Paint is also lost on tray edges, masking tape edges, and slight substrate absorption. Plus, having a small leftover jar ensures easy future touch-ups.
              </p>
            </details>
            <details className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <summary className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                Can I estimate primer in this calculator?
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes! You can calculate primer as 1 coat with 10 to 12 m²/L coverage, or enable the dedicated Primer option on the Cost Calculator page.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function PaintCalculatorPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Paint Calculator...</div>}>
      <PaintCalculatorContent />
    </Suspense>
  );
}
