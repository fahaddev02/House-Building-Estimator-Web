"use client";

import React, { useState, useMemo } from "react";
import { useSettings } from "@/lib/context/SettingsContext";
import NumberInput from "@/components/ui/NumberInput";
import ResultCard from "@/components/ui/ResultCard";
import LiveSummaryPanel from "@/components/ui/LiveSummaryPanel";
import SaveProjectModal from "@/components/ui/SaveProjectModal";
import {
  calculateSingleWallArea,
  calculateMultipleWallsArea,
  calculateRoomWallArea,
  calculateTotalOpeningsArea,
  calculatePaintableWallArea,
  WallItem,
  OpeningItem,
} from "@/lib/calculations/wallCalculator";
import { toBaseLength } from "@/lib/calculations/unitConversion";
import { validateFields, focusFirstInvalidField, ValidationErrors } from "@/lib/utils/validation";
import { Ruler, Plus, Trash2, DoorOpen, LayoutGrid, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";

type WallMode = "single" | "multiple" | "room";

export default function WallCalculatorPage() {
  const { unitSystem, lengthUnit, areaUnit } = useSettings();

  // Mode Selection
  const [mode, setMode] = useState<WallMode>("room");

  // Single Wall State
  const [singleName, setSingleName] = useState("");
  const [singleWidth, setSingleWidth] = useState<string>("");
  const [singleHeight, setSingleHeight] = useState<string>("");

  // Multiple Walls State
  const [multipleWalls, setMultipleWalls] = useState<
    Array<{ id: string; name: string; width: string; height: string }>
  >([
    { id: "w-1", name: "Wall 1", width: "", height: "" },
    { id: "w-2", name: "Wall 2", width: "", height: "" },
  ]);

  // Complete Room State
  const [roomLength, setRoomLength] = useState<string>("");
  const [roomWidth, setRoomWidth] = useState<string>("");
  const [roomHeight, setRoomHeight] = useState<string>("");

  // Openings State (Doors & Windows)
  const [openings, setOpenings] = useState<
    Array<{ id: string; type: "door" | "window" | "custom"; name: string; width: string; height: string; quantity: string }>
  >([]);

  // Validation & Calculation Result state
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasCalculated, setHasCalculated] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  // Clear specific error on field change
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

  // Convert raw inputs to standard base unit for calculation
  const getStandardLength = (valStr: string) => {
    const n = parseFloat(valStr);
    return isNaN(n) ? 0 : toBaseLength(n, lengthUnit);
  };

  // Compute live calculations
  const grossWallArea = useMemo(() => {
    if (mode === "single") {
      const w = getStandardLength(singleWidth);
      const h = getStandardLength(singleHeight);
      return calculateSingleWallArea(w, h);
    } else if (mode === "multiple") {
      const parsedWalls: WallItem[] = multipleWalls.map((w) => ({
        id: w.id,
        name: w.name,
        width: getStandardLength(w.width),
        height: getStandardLength(w.height),
      }));
      return calculateMultipleWallsArea(parsedWalls);
    } else {
      const l = getStandardLength(roomLength);
      const w = getStandardLength(roomWidth);
      const h = getStandardLength(roomHeight);
      return calculateRoomWallArea(l, w, h);
    }
  }, [mode, singleWidth, singleHeight, multipleWalls, roomLength, roomWidth, roomHeight, lengthUnit]);

  const totalOpeningsArea = useMemo(() => {
    const parsedOpenings: OpeningItem[] = openings.map((op) => ({
      id: op.id,
      type: op.type,
      name: op.name,
      width: getStandardLength(op.width),
      height: getStandardLength(op.height),
      quantity: parseInt(op.quantity) || 0,
    }));
    return calculateTotalOpeningsArea(parsedOpenings);
  }, [openings, lengthUnit]);

  const paintableArea = useMemo(() => {
    return calculatePaintableWallArea(grossWallArea, totalOpeningsArea);
  }, [grossWallArea, totalOpeningsArea]);

  const isFormFilled = grossWallArea > 0;

  // Add multiple wall row
  const addWallRow = () => {
    const newIdx = multipleWalls.length + 1;
    setMultipleWalls((prev) => [
      ...prev,
      { id: `w-${Date.now()}`, name: `Wall ${newIdx}`, width: "", height: "" },
    ]);
  };

  // Remove multiple wall row
  const removeWallRow = (id: string) => {
    if (multipleWalls.length <= 1) return;
    setMultipleWalls((prev) => prev.filter((w) => w.id !== id));
  };

  // Add opening
  const addOpening = (type: "door" | "window" | "custom") => {
    const defaultDims: Record<string, { w: string; h: string; name: string }> = {
      door: { w: unitSystem === "metric" ? "0.9" : "3", h: unitSystem === "metric" ? "2.1" : "7", name: "Standard Door" },
      window: { w: unitSystem === "metric" ? "1.2" : "4", h: unitSystem === "metric" ? "1.5" : "5", name: "Standard Window" },
      custom: { w: "", h: "", name: "Custom Opening" },
    };
    const def = defaultDims[type];
    setOpenings((prev) => [
      ...prev,
      {
        id: `op-${Date.now()}`,
        type,
        name: def.name,
        width: def.w,
        height: def.h,
        quantity: "1",
      },
    ]);
  };

  const removeOpening = (id: string) => {
    setOpenings((prev) => prev.filter((op) => op.id !== id));
  };

  // Form Validation & Submission
  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const rules: any[] = [];

    if (mode === "single") {
      rules.push(
        { fieldKey: "singleWidth", fieldName: "Wall Width", value: singleWidth, required: true, domId: "singleWidth" },
        { fieldKey: "singleHeight", fieldName: "Wall Height", value: singleHeight, required: true, domId: "singleHeight" }
      );
    } else if (mode === "multiple") {
      multipleWalls.forEach((w, idx) => {
        rules.push(
          { fieldKey: `wall_${w.id}_width`, fieldName: `${w.name || "Wall " + (idx + 1)} Width`, value: w.width, required: true, domId: `wall_${w.id}_width` },
          { fieldKey: `wall_${w.id}_height`, fieldName: `${w.name || "Wall " + (idx + 1)} Height`, value: w.height, required: true, domId: `wall_${w.id}_height` }
        );
      });
    } else {
      rules.push(
        { fieldKey: "roomLength", fieldName: "Room Length", value: roomLength, required: true, domId: "roomLength" },
        { fieldKey: "roomWidth", fieldName: "Room Width", value: roomWidth, required: true, domId: "roomWidth" },
        { fieldKey: "roomHeight", fieldName: "Wall Height", value: roomHeight, required: true, domId: "roomHeight" }
      );
    }

    // Openings validation
    openings.forEach((op, idx) => {
      rules.push(
        { fieldKey: `op_${op.id}_width`, fieldName: `${op.name || "Opening"} Width`, value: op.width, required: true, domId: `op_${op.id}_width` },
        { fieldKey: `op_${op.id}_height`, fieldName: `${op.name || "Opening"} Height`, value: op.height, required: true, domId: `op_${op.id}_height` },
        { fieldKey: `op_${op.id}_qty`, fieldName: `${op.name || "Opening"} Quantity`, value: op.quantity, required: true, domId: `op_${op.id}_qty` }
      );
    });

    const validation = validateFields(rules);
    if (!validation.isValid) {
      setErrors(validation.errors);
      focusFirstInvalidField(validation.firstErrorId);
      return;
    }

    setErrors({});
    setHasCalculated(true);

    // Smooth scroll to results
    const resultElement = document.getElementById("wall-results-section");
    if (resultElement) {
      resultElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRecalculate = () => {
    setHasCalculated(false);
    focusFirstInvalidField(mode === "room" ? "roomLength" : mode === "single" ? "singleWidth" : "wall_w-1_width");
  };

  const sharePayload = {
    title: "Wall Area & Paintable Area Estimate",
    area: `${paintableArea.toFixed(1)} ${areaUnit}`,
    customSummary: `Total Wall Area: ${grossWallArea.toFixed(1)} ${areaUnit}\nOpenings Deducted: ${totalOpeningsArea.toFixed(1)} ${areaUnit}\nNet Paintable Area: ${paintableArea.toFixed(1)} ${areaUnit}`,
  };

  const pdfData = {
    projectName: singleName || (mode === "room" ? "Room Walls Estimate" : "Wall Area Estimate"),
    calculatorType: "Wall Calculator" as const,
    grossArea: `${grossWallArea.toFixed(2)} ${areaUnit}`,
    openingsSummary: `${totalOpeningsArea.toFixed(2)} ${areaUnit} (${openings.length} openings)`,
    netPaintableArea: `${paintableArea.toFixed(2)} ${areaUnit}`,
    dimensions:
      mode === "room"
        ? `Room: ${roomLength} × ${roomWidth} × ${roomHeight} ${lengthUnit}`
        : mode === "single"
        ? `Single Wall: ${singleWidth} × ${singleHeight} ${lengthUnit}`
        : `${multipleWalls.length} Custom Walls`,
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="text-left space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Ruler className="w-3.5 h-3.5" />
          <span>Surface Dimension Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Wall Area Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          Accurately calculate gross wall surface and deduct doors, windows, and custom openings to find your net paintable wall area.
        </p>
      </div>

      {/* Main Form & Live Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-8 space-y-8 text-left">
          <form onSubmit={handleCalculate} noValidate className="space-y-8">
            {/* 1. Wall Type Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                1. Select Wall Layout
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "room", label: "Complete Room", desc: "4 connected walls" },
                  { id: "single", label: "Single Wall", desc: "1 feature wall" },
                  { id: "multiple", label: "Multiple Walls", desc: "Custom wall list" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setMode(t.id as WallMode);
                      setErrors({});
                    }}
                    className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      mode === t.id
                        ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <span className="text-xs sm:text-sm font-bold">{t.label}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {t.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Wall Dimensions Input */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                2. Enter Wall Dimensions
              </h2>

              {/* Complete Room Mode */}
              {mode === "room" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <NumberInput
                      id="roomLength"
                      label="Room Length"
                      value={roomLength}
                      onChange={(v) => handleFieldChange("roomLength", v, setRoomLength)}
                      unitSuffix={lengthUnit}
                      required
                      placeholder={unitSystem === "metric" ? "5.0" : "16.0"}
                      error={errors.roomLength}
                    />
                    <NumberInput
                      id="roomWidth"
                      label="Room Width"
                      value={roomWidth}
                      onChange={(e) => handleFieldChange("roomWidth", e, setRoomWidth)}
                      unitSuffix={lengthUnit}
                      required
                      placeholder={unitSystem === "metric" ? "4.0" : "13.0"}
                      error={errors.roomWidth}
                    />
                    <NumberInput
                      id="roomHeight"
                      label="Wall Height"
                      value={roomHeight}
                      onChange={(e) => handleFieldChange("roomHeight", e, setRoomHeight)}
                      unitSuffix={lengthUnit}
                      required
                      placeholder={unitSystem === "metric" ? "3.0" : "9.0"}
                      error={errors.roomHeight}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Formula: 2 × (Length + Width) × Height
                  </p>
                </div>
              )}

              {/* Single Wall Mode */}
              {mode === "single" && (
                <div className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Wall Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={singleName}
                      onChange={(e) => setSingleName(e.target.value)}
                      placeholder="e.g., Accent Wall, North Wall"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <NumberInput
                      id="singleWidth"
                      label="Wall Width"
                      value={singleWidth}
                      onChange={(v) => handleFieldChange("singleWidth", v, setSingleWidth)}
                      unitSuffix={lengthUnit}
                      required
                      placeholder={unitSystem === "metric" ? "5.0" : "16.0"}
                      error={errors.singleWidth}
                    />
                    <NumberInput
                      id="singleHeight"
                      label="Wall Height"
                      value={singleHeight}
                      onChange={(v) => handleFieldChange("singleHeight", v, setSingleHeight)}
                      unitSuffix={lengthUnit}
                      required
                      placeholder={unitSystem === "metric" ? "3.0" : "9.0"}
                      error={errors.singleHeight}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    Formula: Width × Height
                  </p>
                </div>
              )}

              {/* Multiple Walls Mode */}
              {mode === "multiple" && (
                <div className="space-y-4">
                  {multipleWalls.map((wall, idx) => (
                    <div
                      key={wall.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={wall.name}
                          onChange={(e) => {
                            const newName = e.target.value;
                            setMultipleWalls((prev) =>
                              prev.map((w) => (w.id === wall.id ? { ...w, name: newName } : w))
                            );
                          }}
                          placeholder={`Wall ${idx + 1}`}
                          className="font-bold text-sm bg-transparent border-b border-dashed border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-600"
                        />
                        {multipleWalls.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeWallRow(wall.id)}
                            className="text-red-500 hover:text-red-700 p-1 text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <NumberInput
                          id={`wall_${wall.id}_width`}
                          label="Width"
                          value={wall.width}
                          onChange={(v) => {
                            setMultipleWalls((prev) =>
                              prev.map((w) => (w.id === wall.id ? { ...w, width: v } : w))
                            );
                            if (errors[`wall_${wall.id}_width`]) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next[`wall_${wall.id}_width`];
                                return next;
                              });
                            }
                          }}
                          unitSuffix={lengthUnit}
                          required
                          placeholder={unitSystem === "metric" ? "4.0" : "12.0"}
                          error={errors[`wall_${wall.id}_width`]}
                        />
                        <NumberInput
                          id={`wall_${wall.id}_height`}
                          label="Height"
                          value={wall.height}
                          onChange={(v) => {
                            setMultipleWalls((prev) =>
                              prev.map((w) => (w.id === wall.id ? { ...w, height: v } : w))
                            );
                            if (errors[`wall_${wall.id}_height`]) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next[`wall_${wall.id}_height`];
                                return next;
                              });
                            }
                          }}
                          unitSuffix={lengthUnit}
                          required
                          placeholder={unitSystem === "metric" ? "3.0" : "9.0"}
                          error={errors[`wall_${wall.id}_height`]}
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addWallRow}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-blue-400 dark:border-blue-700 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Wall</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Deduct Doors & Windows (Optional) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    3. Deduct Doors & Windows (Optional)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Subtract unpainted surface areas like standard doors, windows, and archways.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addOpening("door")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Door</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addOpening("window")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Window</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addOpening("custom")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Custom</span>
                  </button>
                </div>
              </div>

              {openings.length === 0 ? (
                <div className="py-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500 dark:text-slate-400">
                  No openings added. Click above to deduct doors or windows.
                </div>
              ) : (
                <div className="space-y-3">
                  {openings.map((op, idx) => (
                    <div
                      key={op.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 capitalize flex items-center gap-1.5">
                          <DoorOpen className="w-3.5 h-3.5 text-blue-500" />
                          {op.name || op.type} #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeOpening(op.id)}
                          className="text-red-500 hover:text-red-700 p-1 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <NumberInput
                          id={`op_${op.id}_width`}
                          label="Width"
                          value={op.width}
                          onChange={(v) => {
                            setOpenings((prev) =>
                              prev.map((o) => (o.id === op.id ? { ...o, width: v } : o))
                            );
                            if (errors[`op_${op.id}_width`]) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next[`op_${op.id}_width`];
                                return next;
                              });
                            }
                          }}
                          unitSuffix={lengthUnit}
                          required
                          placeholder="0.9"
                          error={errors[`op_${op.id}_width`]}
                        />
                        <NumberInput
                          id={`op_${op.id}_height`}
                          label="Height"
                          value={op.height}
                          onChange={(v) => {
                            setOpenings((prev) =>
                              prev.map((o) => (o.id === op.id ? { ...o, height: v } : o))
                            );
                            if (errors[`op_${op.id}_height`]) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next[`op_${op.id}_height`];
                                return next;
                              });
                            }
                          }}
                          unitSuffix={lengthUnit}
                          required
                          placeholder="2.1"
                          error={errors[`op_${op.id}_height`]}
                        />
                        <NumberInput
                          id={`op_${op.id}_qty`}
                          label="Quantity"
                          value={op.quantity}
                          onChange={(v) => {
                            setOpenings((prev) =>
                              prev.map((o) => (o.id === op.id ? { ...o, quantity: v } : o))
                            );
                            if (errors[`op_${op.id}_qty`]) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next[`op_${op.id}_qty`];
                                return next;
                              });
                            }
                          }}
                          required
                          min={1}
                          step={1}
                          placeholder="1"
                          error={errors[`op_${op.id}_qty`]}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calculate Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-base shadow-lg shadow-blue-500/25 transition-all"
              >
                Calculate Wall Area
              </button>
            </div>
          </form>

          {/* Results Section */}
          <div id="wall-results-section">
            {hasCalculated && (
              <ResultCard
                title="Wall Surface Area Breakdown"
                metrics={[
                  {
                    label: "Total Wall Area",
                    value: grossWallArea.toFixed(1),
                    unit: areaUnit,
                    helper: "Gross unadjusted wall surface",
                  },
                  {
                    label: "Openings Area",
                    value: totalOpeningsArea.toFixed(1),
                    unit: areaUnit,
                    helper: `${openings.length} doors/windows deducted`,
                  },
                  {
                    label: "Paintable Wall Area",
                    value: paintableArea.toFixed(1),
                    unit: areaUnit,
                    isPrimary: true,
                    helper: "Net area to purchase paint for",
                  },
                ]}
                onRecalculate={handleRecalculate}
                onSave={() => setSaveModalOpen(true)}
                sharePayload={sharePayload}
                pdfData={pdfData}
                nextAction={{
                  label: "Calculate Paint Required",
                  sublabel: `Automatically passes ${paintableArea.toFixed(1)} ${areaUnit} into Paint Calculator`,
                  href: `/paint-calculator?area=${paintableArea.toFixed(1)}&source=wall`,
                }}
              />
            )}
          </div>
        </div>

        {/* Right Column: Live Summary Sticky Panel */}
        <div className="lg:col-span-4 w-full">
          <LiveSummaryPanel
            title="WALL SUMMARY"
            isComplete={isFormFilled}
            items={[
              { label: "Layout Mode", value: mode === "room" ? "Complete Room" : mode === "single" ? "Single Wall" : "Multiple Walls" },
              { label: "Gross Wall Area", value: grossWallArea > 0 ? grossWallArea.toFixed(1) : "—", unit: grossWallArea > 0 ? areaUnit : "" },
              { label: "Total Openings", value: totalOpeningsArea > 0 ? totalOpeningsArea.toFixed(1) : "0", unit: areaUnit },
              {
                label: "Net Paintable Area",
                value: paintableArea > 0 ? paintableArea.toFixed(1) : "—",
                unit: paintableArea > 0 ? areaUnit : "",
                highlight: true,
              },
            ]}
            emptyNotice="Enter width and height to see instant calculations."
            primaryAction={
              paintableArea > 0
                ? {
                    label: "Next: Calculate Paint",
                    href: `/paint-calculator?area=${paintableArea.toFixed(1)}&source=wall`,
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
        calculatorType="wall"
        defaultName={singleName || (mode === "room" ? "Living Room Walls" : "Wall Project")}
        projectData={{
          dimensionsSummary: pdfData.dimensions,
          area: Number(paintableArea.toFixed(1)),
          areaUnit: areaUnit,
          notes: "",
        }}
      />

      {/* SEO & Educational Content */}
      <section className="pt-12 border-t border-slate-200 dark:border-slate-800 text-left space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Everything You Need to Know About Calculating Wall Area
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Learn the professional formulas used by painters and contractors to estimate wall surface without waste.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              What is Wall Area?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Wall area is the total two-dimensional surface of vertical room walls. To avoid buying excess primer and paint, it is divided into <em>Gross Wall Area</em> (total boundaries) and <em>Paintable Wall Area</em> (excluding doors, windows, and cabinets).
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              How to Calculate Wall Area
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              For a standard 4-wall rectangular room, calculate the perimeter multiplied by ceiling height: <br />
              <strong className="text-blue-600 dark:text-blue-400 font-mono text-xs">Area = 2 × (Length + Width) × Height</strong>.<br />
              For individual walls, simply multiply width by height.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Subtracting Doors & Windows
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              A typical door is 0.9m × 2.1m (~1.89 m² or 21 sq ft). A standard window is approximately 1.2m × 1.5m (~1.8 m²). Deducting these prevents over-purchasing 10% to 25% of paint on typical residential rooms.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-slate-100/70 dark:bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Frequently Asked Questions (FAQ)
          </h3>
          <div className="space-y-3 text-sm">
            <details className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <summary className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                How do I calculate wall area for an L-shaped room?
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Switch to the &quot;Multiple Walls&quot; tab. Measure each of the distinct walls around the perimeter and add their width and height individually. The calculator will automatically sum the areas.
              </p>
            </details>
            <details className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <summary className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                Does this calculator include the ceiling?
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                No, this tool focuses strictly on vertical walls. For ceilings, visit our dedicated{" "}
                <a href="/ceiling-calculator" className="text-blue-600 dark:text-blue-400 font-semibold underline">
                  Ceiling Calculator
                </a>
                . You can combine both in the Paint Calculator.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
