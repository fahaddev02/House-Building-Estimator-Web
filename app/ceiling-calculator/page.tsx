"use client";

import React, { useState, useMemo } from "react";
import { useSettings } from "@/lib/context/SettingsContext";
import NumberInput from "@/components/ui/NumberInput";
import ResultCard from "@/components/ui/ResultCard";
import LiveSummaryPanel from "@/components/ui/LiveSummaryPanel";
import SaveProjectModal from "@/components/ui/SaveProjectModal";
import {
  calculateRectangularCeilingArea,
  calculateSquareCeilingArea,
  calculateCustomCeilingArea,
  CeilingSection,
} from "@/lib/calculations/ceilingCalculator";
import { toBaseLength } from "@/lib/calculations/unitConversion";
import { validateFields, focusFirstInvalidField, ValidationErrors } from "@/lib/utils/validation";
import { Maximize2, Plus, Trash2, HelpCircle } from "lucide-react";

type CeilingShape = "rectangle" | "square" | "custom";

export default function CeilingCalculatorPage() {
  const { unitSystem, lengthUnit, areaUnit } = useSettings();

  const [shape, setShape] = useState<CeilingShape>("rectangle");

  // Rectangle
  const [rectLength, setRectLength] = useState<string>("");
  const [rectWidth, setRectWidth] = useState<string>("");

  // Square
  const [squareSide, setSquareSide] = useState<string>("");

  // Custom Sections
  const [sections, setSections] = useState<
    Array<{ id: string; name: string; length: string; width: string }>
  >([
    { id: "sec-1", name: "Section 1", length: "", width: "" },
    { id: "sec-2", name: "Section 2", length: "", width: "" },
  ]);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasCalculated, setHasCalculated] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

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

  const getStandardLength = (valStr: string) => {
    const n = parseFloat(valStr);
    return isNaN(n) ? 0 : toBaseLength(n, lengthUnit);
  };

  // Live calculation
  const ceilingArea = useMemo(() => {
    if (shape === "rectangle") {
      const l = getStandardLength(rectLength);
      const w = getStandardLength(rectWidth);
      return calculateRectangularCeilingArea(l, w);
    } else if (shape === "square") {
      const s = getStandardLength(squareSide);
      return calculateSquareCeilingArea(s);
    } else {
      const parsed: CeilingSection[] = sections.map((s) => ({
        id: s.id,
        name: s.name,
        length: getStandardLength(s.length),
        width: getStandardLength(s.width),
      }));
      return calculateCustomCeilingArea(parsed);
    }
  }, [shape, rectLength, rectWidth, squareSide, sections, lengthUnit]);

  const isFormFilled = ceilingArea > 0;

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      { id: `sec-${Date.now()}`, name: `Section ${prev.length + 1}`, length: "", width: "" },
    ]);
  };

  const removeSection = (id: string) => {
    if (sections.length <= 1) return;
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const rules: any[] = [];
    if (shape === "rectangle") {
      rules.push(
        { fieldKey: "rectLength", fieldName: "Length", value: rectLength, required: true, domId: "rectLength" },
        { fieldKey: "rectWidth", fieldName: "Width", value: rectWidth, required: true, domId: "rectWidth" }
      );
    } else if (shape === "square") {
      rules.push(
        { fieldKey: "squareSide", fieldName: "Side Length", value: squareSide, required: true, domId: "squareSide" }
      );
    } else {
      sections.forEach((sec, idx) => {
        rules.push(
          { fieldKey: `sec_${sec.id}_length`, fieldName: `${sec.name || "Section " + (idx + 1)} Length`, value: sec.length, required: true, domId: `sec_${sec.id}_length` },
          { fieldKey: `sec_${sec.id}_width`, fieldName: `${sec.name || "Section " + (idx + 1)} Width`, value: sec.width, required: true, domId: `sec_${sec.id}_width` }
        );
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

    const resultElement = document.getElementById("ceiling-results-section");
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRecalculate = () => {
    setHasCalculated(false);
    focusFirstInvalidField(shape === "rectangle" ? "rectLength" : shape === "square" ? "squareSide" : "sec_sec-1_length");
  };

  const sharePayload = {
    title: "Ceiling Surface Area Estimate",
    area: `${ceilingArea.toFixed(1)} ${areaUnit}`,
    customSummary: `Ceiling Shape: ${shape.toUpperCase()}\nTotal Ceiling Area: ${ceilingArea.toFixed(1)} ${areaUnit}`,
  };

  const pdfData = {
    projectName: "Ceiling Area Estimate",
    calculatorType: "Ceiling Calculator" as const,
    grossArea: `${ceilingArea.toFixed(2)} ${areaUnit}`,
    netPaintableArea: `${ceilingArea.toFixed(2)} ${areaUnit}`,
    dimensions:
      shape === "rectangle"
        ? `Rectangle: ${rectLength} × ${rectWidth} ${lengthUnit}`
        : shape === "square"
        ? `Square: ${squareSide} × ${squareSide} ${lengthUnit}`
        : `${sections.length} Custom Sections`,
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="text-left space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Maximize2 className="w-3.5 h-3.5" />
          <span>Ceiling Dimension Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Ceiling Area Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          Quickly compute square, rectangular, or irregular multi-section ceiling surface areas for painting, drywall, or plastering.
        </p>
      </div>

      {/* Main Form & Live Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-8 space-y-8 text-left">
          <form onSubmit={handleCalculate} noValidate className="space-y-8">
            {/* 1. Shape Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                1. Select Ceiling Shape
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "rectangle", label: "Rectangle", desc: "Length × Width" },
                  { id: "square", label: "Square", desc: "Equal sides" },
                  { id: "custom", label: "Custom / L-Shape", desc: "Multi-section ceiling" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setShape(s.id as CeilingShape);
                      setErrors({});
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      shape === s.id
                        ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">{s.label}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {s.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Ceiling Dimensions Input */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                2. Enter Ceiling Dimensions
              </h2>

              {shape === "rectangle" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <NumberInput
                      id="rectLength"
                      label="Length"
                      value={rectLength}
                      onChange={(v) => handleFieldChange("rectLength", v, setRectLength)}
                      unitSuffix={lengthUnit}
                      required
                      placeholder={unitSystem === "metric" ? "5.0" : "16.0"}
                      error={errors.rectLength}
                    />
                    <NumberInput
                      id="rectWidth"
                      label="Width"
                      value={rectWidth}
                      onChange={(v) => handleFieldChange("rectWidth", v, setRectWidth)}
                      unitSuffix={lengthUnit}
                      required
                      placeholder={unitSystem === "metric" ? "4.0" : "13.0"}
                      error={errors.rectWidth}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Formula: Area = Length × Width
                  </p>
                </div>
              )}

              {shape === "square" && (
                <div className="space-y-4">
                  <div className="max-w-xs">
                    <NumberInput
                      id="squareSide"
                      label="Side Length"
                      value={squareSide}
                      onChange={(v) => handleFieldChange("squareSide", v, setSquareSide)}
                      unitSuffix={lengthUnit}
                      required
                      placeholder={unitSystem === "metric" ? "4.0" : "14.0"}
                      error={errors.squareSide}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Formula: Area = Side × Side
                  </p>
                </div>
              )}

              {shape === "custom" && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Break down complex, L-shaped, or T-shaped ceilings into rectangular sections.
                  </p>
                  {sections.map((sec, idx) => (
                    <div
                      key={sec.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                          {sec.name || `Section ${idx + 1}`}
                        </span>
                        {sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSection(sec.id)}
                            className="text-red-500 hover:text-red-700 p-1 text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <NumberInput
                          id={`sec_${sec.id}_length`}
                          label="Length"
                          value={sec.length}
                          onChange={(v) => {
                            setSections((prev) =>
                              prev.map((s) => (s.id === sec.id ? { ...s, length: v } : s))
                            );
                            if (errors[`sec_${sec.id}_length`]) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next[`sec_${sec.id}_length`];
                                return next;
                              });
                            }
                          }}
                          unitSuffix={lengthUnit}
                          required
                          placeholder={unitSystem === "metric" ? "4.0" : "12.0"}
                          error={errors[`sec_${sec.id}_length`]}
                        />
                        <NumberInput
                          id={`sec_${sec.id}_width`}
                          label="Width"
                          value={sec.width}
                          onChange={(v) => {
                            setSections((prev) =>
                              prev.map((s) => (s.id === sec.id ? { ...s, width: v } : s))
                            );
                            if (errors[`sec_${sec.id}_width`]) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next[`sec_${sec.id}_width`];
                                return next;
                              });
                            }
                          }}
                          unitSuffix={lengthUnit}
                          required
                          placeholder={unitSystem === "metric" ? "3.0" : "10.0"}
                          error={errors[`sec_${sec.id}_width`]}
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addSection}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-blue-400 dark:border-blue-700 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Section</span>
                  </button>
                </div>
              )}
            </div>

            {/* Calculate CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base shadow-lg shadow-blue-500/25 transition-all"
              >
                Calculate Ceiling Area
              </button>
            </div>
          </form>

          {/* Results Section */}
          <div id="ceiling-results-section">
            {hasCalculated && (
              <ResultCard
                title="Ceiling Area Result"
                metrics={[
                  {
                    label: "Ceiling Area",
                    value: ceilingArea.toFixed(1),
                    unit: areaUnit,
                    isPrimary: true,
                    helper: "Total overhead ceiling surface area",
                  },
                ]}
                onRecalculate={handleRecalculate}
                onSave={() => setSaveModalOpen(true)}
                sharePayload={sharePayload}
                pdfData={pdfData}
                nextAction={{
                  label: "Calculate Paint Required",
                  sublabel: `Automatically passes ${ceilingArea.toFixed(1)} ${areaUnit} into Paint Calculator`,
                  href: `/paint-calculator?area=${ceilingArea.toFixed(1)}&source=ceiling`,
                }}
              />
            )}
          </div>
        </div>

        {/* Right Column: Live Summary Sticky Panel */}
        <div className="lg:col-span-4 w-full">
          <LiveSummaryPanel
            title="CEILING SUMMARY"
            isComplete={isFormFilled}
            items={[
              { label: "Ceiling Shape", value: shape === "rectangle" ? "Rectangle" : shape === "square" ? "Square" : "Custom Sections" },
              {
                label: "Ceiling Area",
                value: ceilingArea > 0 ? ceilingArea.toFixed(1) : "—",
                unit: ceilingArea > 0 ? areaUnit : "",
                highlight: true,
              },
            ]}
            emptyNotice="Enter ceiling dimensions to view real-time calculations."
            primaryAction={
              ceilingArea > 0
                ? {
                    label: "Next: Calculate Paint Required",
                    href: `/paint-calculator?area=${ceilingArea.toFixed(1)}&source=ceiling`,
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
        calculatorType="ceiling"
        defaultName="Ceiling Project"
        projectData={{
          dimensionsSummary: pdfData.dimensions,
          area: Number(ceilingArea.toFixed(1)),
          areaUnit: areaUnit,
          notes: "",
        }}
      />

      {/* Educational SEO Content */}
      <section className="pt-12 border-t border-slate-200 dark:border-slate-800 text-left space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            How to Calculate Ceiling Area Accurately
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Professional advice for estimating overhead ceiling drywall, paint cans, and primer coverage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Standard Rectangular Ceilings
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              For most residential rooms, ceiling area is identical to floor area. Simply measure the longest wall (length) and adjacent wall (width) at floor level: <br />
              <strong className="text-blue-600 dark:text-blue-400 font-mono text-xs">Area = Length × Width</strong>.<br />
              Example: A 5m by 4m room has a 20 m² (215 sq ft) ceiling.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Irregular or Multi-Section Ceilings
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              For hallways or open-concept living rooms that feature L-shapes or alcoves, divide the room into separate rectangular zones. Measure each rectangle&apos;s length and width, then sum the areas.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-slate-100/70 dark:bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Ceiling Area FAQs
          </h3>
          <div className="space-y-3 text-sm">
            <details className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <summary className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                Do I need to climb a ladder to measure the ceiling?
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                In flat ceiling rooms, no! The floor dimensions exactly match flat ceiling dimensions, so you can measure floor perimeter comfortably.
              </p>
            </details>
            <details className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <summary className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                How many coats of paint does a ceiling need?
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Most ceilings need 1 to 2 coats of flat white ceiling paint. If covering a darker color or water stain, apply a stain-blocking primer first followed by 2 coats of paint.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
