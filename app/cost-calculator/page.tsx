"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSettings } from "@/lib/context/SettingsContext";
import NumberInput from "@/components/ui/NumberInput";
import ResultCard from "@/components/ui/ResultCard";
import LiveSummaryPanel from "@/components/ui/LiveSummaryPanel";
import SaveProjectModal from "@/components/ui/SaveProjectModal";
import {
  calculatePaintCost,
  calculatePrimerCost,
  calculateLaborCost,
  calculateMaterialsCost,
  calculateTotalProjectCost,
  MaterialItem,
} from "@/lib/calculations/costCalculator";
import { formatCurrency } from "@/lib/calculations/currency";
import { validateFields, focusFirstInvalidField, ValidationErrors } from "@/lib/utils/validation";
import { DollarSign, Plus, Trash2, CheckCircle2, ShieldCheck, HelpCircle } from "lucide-react";

function CostCalculatorContent() {
  const searchParams = useSearchParams();
  const { currency, volumeUnit, areaUnit } = useSettings();

  // 1. Paint Cost
  const [paintQuantity, setPaintQuantity] = useState<string>("");
  const [paintUnitPrice, setPaintUnitPrice] = useState<string>("");

  // 2. Primer Toggle & Costs
  const [includePrimer, setIncludePrimer] = useState<boolean>(false);
  const [primerQuantity, setPrimerQuantity] = useState<string>("");
  const [primerUnitPrice, setPrimerUnitPrice] = useState<string>("");

  // 3. Labor Method
  const [laborType, setLaborType] = useState<"rate" | "total">("rate");
  const [paintableArea, setPaintableArea] = useState<string>("");
  const [laborRate, setLaborRate] = useState<string>("");
  const [fixedLaborTotal, setFixedLaborTotal] = useState<string>("");

  // 4. Additional Materials
  const [materials, setMaterials] = useState<MaterialItem[]>([
    { id: "mat-1", name: "Roller & Frame", quantity: 2, unitPrice: 0 },
    { id: "mat-2", name: "Masking Tape", quantity: 3, unitPrice: 0 },
  ]);

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasCalculated, setHasCalculated] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  // Read URL query parameters from previous steps (Paint Calculator or Wall Calculator)
  useEffect(() => {
    const pq = searchParams.get("paintQuantity");
    if (pq && !isNaN(parseFloat(pq))) {
      setPaintQuantity(pq);
    }
    const area = searchParams.get("area");
    if (area && !isNaN(parseFloat(area))) {
      setPaintableArea(area);
    }
  }, [searchParams]);

  // Set default pricing hints if PKR or USD
  useEffect(() => {
    if (currency === "PKR" && !paintUnitPrice) {
      setPaintUnitPrice("2500");
      setLaborRate("150");
    } else if (currency === "USD" && !paintUnitPrice) {
      setPaintUnitPrice("45");
      setLaborRate("2.5");
    }
  }, [currency]);

  // Calculations
  const calculatedPaintCost = useMemo(() => {
    return calculatePaintCost(parseFloat(paintQuantity) || 0, parseFloat(paintUnitPrice) || 0);
  }, [paintQuantity, paintUnitPrice]);

  const calculatedPrimerCost = useMemo(() => {
    return calculatePrimerCost(
      includePrimer,
      parseFloat(primerQuantity) || 0,
      parseFloat(primerUnitPrice) || 0
    );
  }, [includePrimer, primerQuantity, primerUnitPrice]);

  const calculatedLaborCost = useMemo(() => {
    return calculateLaborCost(
      parseFloat(paintableArea) || 0,
      parseFloat(laborRate) || 0,
      laborType === "total",
      parseFloat(fixedLaborTotal) || 0
    );
  }, [paintableArea, laborRate, laborType, fixedLaborTotal]);

  const calculatedMaterialsCost = useMemo(() => {
    return calculateMaterialsCost(materials);
  }, [materials]);

  const breakdown = useMemo(() => {
    return calculateTotalProjectCost(
      calculatedPaintCost,
      calculatedPrimerCost,
      calculatedLaborCost,
      calculatedMaterialsCost
    );
  }, [calculatedPaintCost, calculatedPrimerCost, calculatedLaborCost, calculatedMaterialsCost]);

  const isFormFilled = calculatedPaintCost > 0;

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

  const addMaterialRow = (presetName = "Supplies") => {
    setMaterials((prev) => [
      ...prev,
      {
        id: `mat-${Date.now()}`,
        name: presetName,
        quantity: 1,
        unitPrice: 0,
      },
    ]);
  };

  const removeMaterialRow = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMaterialItem = (id: string, field: keyof MaterialItem, val: any) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: val } : m))
    );
    const errKey = `mat_${id}_${field}`;
    if (errors[errKey]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[errKey];
        return next;
      });
    }
  };

  const handleCalculate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const rules: any[] = [
      { fieldKey: "paintQuantity", fieldName: "Paint Quantity", value: paintQuantity, required: true, domId: "paintQuantity" },
      { fieldKey: "paintUnitPrice", fieldName: "Price per Unit", value: paintUnitPrice, required: true, domId: "paintUnitPrice" },
    ];

    if (includePrimer) {
      rules.push(
        { fieldKey: "primerQuantity", fieldName: "Primer Quantity", value: primerQuantity, required: true, domId: "primerQuantity" },
        { fieldKey: "primerUnitPrice", fieldName: "Primer Unit Price", value: primerUnitPrice, required: true, domId: "primerUnitPrice" }
      );
    }

    if (laborType === "rate") {
      rules.push(
        { fieldKey: "paintableArea", fieldName: "Paintable Area", value: paintableArea, required: true, domId: "paintableArea" },
        { fieldKey: "laborRate", fieldName: "Labor Rate", value: laborRate, required: true, domId: "laborRate" }
      );
    } else {
      rules.push(
        { fieldKey: "fixedLaborTotal", fieldName: "Total Labor Cost", value: fixedLaborTotal, required: true, domId: "fixedLaborTotal" }
      );
    }

    // Validate materials
    materials.forEach((m) => {
      rules.push(
        { fieldKey: `mat_${m.id}_name`, fieldName: "Material Name", value: m.name, required: true, domId: `mat_${m.id}_name` },
        { fieldKey: `mat_${m.id}_qty`, fieldName: `${m.name} Quantity`, value: m.quantity, required: true, min: 0.1, domId: `mat_${m.id}_qty` },
        { fieldKey: `mat_${m.id}_price`, fieldName: `${m.name} Price`, value: m.unitPrice, required: true, min: 0, domId: `mat_${m.id}_price` }
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

    const resultEl = document.getElementById("cost-results-section");
    if (resultEl) resultEl.scrollIntoView({ behavior: "smooth" });
  };

  const handleRecalculate = () => {
    setHasCalculated(false);
    focusFirstInvalidField("paintQuantity");
  };

  const sharePayload = {
    title: "Complete Painting Cost Estimate",
    area: paintableArea ? `${paintableArea} ${areaUnit}` : undefined,
    paintRequired: `${paintQuantity} ${volumeUnit}`,
    labor: formatCurrency(breakdown.laborCost, currency),
    materials: formatCurrency(breakdown.materialsCost, currency),
    total: formatCurrency(breakdown.totalCost, currency),
    customSummary: `Paint Cost: ${formatCurrency(breakdown.paintCost, currency)}\nPrimer Cost: ${formatCurrency(breakdown.primerCost, currency)}\nLabor: ${formatCurrency(breakdown.laborCost, currency)}\nMaterials: ${formatCurrency(breakdown.materialsCost, currency)}\nTotal Estimated Cost: ${formatCurrency(breakdown.totalCost, currency)}`,
  };

  const pdfData = {
    projectName: "Full Painting Cost & Material Estimate",
    calculatorType: "Cost Calculator" as const,
    currency,
    paintCost: formatCurrency(breakdown.paintCost, currency),
    primerCost: includePrimer ? formatCurrency(breakdown.primerCost, currency) : undefined,
    laborCost: formatCurrency(breakdown.laborCost, currency),
    materialsCost: breakdown.materialsCost > 0 ? formatCurrency(breakdown.materialsCost, currency) : undefined,
    materialsList: materials
      .filter((m) => m.quantity > 0 && m.unitPrice > 0)
      .map((m) => ({
        name: m.name,
        quantity: String(m.quantity),
        unitPrice: formatCurrency(m.unitPrice, currency),
        total: formatCurrency(m.quantity * m.unitPrice, currency),
      })),
    totalCost: formatCurrency(breakdown.totalCost, currency),
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-left space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <DollarSign className="w-3.5 h-3.5" />
          <span>Project Budget & Material Cost Estimator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Painting Cost Calculator
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-3xl leading-relaxed">
          Accurately calculate your total painting project budget including wall paints, primer sealer, contractor labor, and consumable sundries.
        </p>
      </div>

      {/* Main Form & Live Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-8 space-y-8 text-left">
          <form onSubmit={handleCalculate} noValidate className="space-y-8">
            {/* 1. Paint Cost Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>1. Paint Cost</span>
                <span className="text-xs font-normal text-blue-600 dark:text-blue-400">
                  Subtotal: {formatCurrency(calculatedPaintCost, currency)}
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <NumberInput
                  id="paintQuantity"
                  label="Paint Quantity Required"
                  value={paintQuantity}
                  onChange={(v) => handleFieldChange("paintQuantity", v, setPaintQuantity)}
                  unitSuffix={volumeUnit}
                  required
                  placeholder="11"
                  error={errors.paintQuantity}
                  helperText="Auto-populated if coming from Paint Calculator"
                />
                <NumberInput
                  id="paintUnitPrice"
                  label={`Price per ${volumeUnit === "L" ? "Liter" : "Gallon"}`}
                  value={paintUnitPrice}
                  onChange={(v) => handleFieldChange("paintUnitPrice", v, setPaintUnitPrice)}
                  unitSuffix={currency}
                  required
                  placeholder="2500"
                  error={errors.paintUnitPrice}
                />
              </div>
            </div>

            {/* 2. Primer Section (Toggle) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    2. Primer / Sealer (Optional)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Recommended for fresh drywall, repairs, or drastic color changes.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePrimer}
                    onChange={(e) => setIncludePrimer(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {includePrimer ? "Included" : "Excluded"}
                  </span>
                </label>
              </div>

              {includePrimer && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <NumberInput
                    id="primerQuantity"
                    label="Primer Quantity"
                    value={primerQuantity}
                    onChange={(v) => handleFieldChange("primerQuantity", v, setPrimerQuantity)}
                    unitSuffix={volumeUnit}
                    required
                    placeholder="5"
                    error={errors.primerQuantity}
                  />
                  <NumberInput
                    id="primerUnitPrice"
                    label={`Primer Price per ${volumeUnit}`}
                    value={primerUnitPrice}
                    onChange={(v) => handleFieldChange("primerUnitPrice", v, setPrimerUnitPrice)}
                    unitSuffix={currency}
                    required
                    placeholder="1000"
                    error={errors.primerUnitPrice}
                  />
                </div>
              )}
            </div>

            {/* 3. Labor Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  3. Labor Estimation
                </h2>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setLaborType("rate");
                      setErrors({});
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      laborType === "rate"
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Rate per {areaUnit}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLaborType("total");
                      setErrors({});
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      laborType === "total"
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs font-bold"
                        : "text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    Fixed / Total Labor
                  </button>
                </div>
              </div>

              {laborType === "rate" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <NumberInput
                    id="paintableArea"
                    label="Paintable Area"
                    value={paintableArea}
                    onChange={(v) => handleFieldChange("paintableArea", v, setPaintableArea)}
                    unitSuffix={areaUnit}
                    required
                    placeholder="49"
                    error={errors.paintableArea}
                  />
                  <NumberInput
                    id="laborRate"
                    label={`Labor Rate per ${areaUnit}`}
                    value={laborRate}
                    onChange={(v) => handleFieldChange("laborRate", v, setLaborRate)}
                    unitSuffix={`${currency}/${areaUnit}`}
                    required
                    placeholder={currency === "PKR" ? "150" : "2.5"}
                    error={errors.laborRate}
                  />
                </div>
              ) : (
                <div className="max-w-md">
                  <NumberInput
                    id="fixedLaborTotal"
                    label="Total Agreed Labor Cost"
                    value={fixedLaborTotal}
                    onChange={(v) => handleFieldChange("fixedLaborTotal", v, setFixedLaborTotal)}
                    unitSuffix={currency}
                    required
                    placeholder="8000"
                    error={errors.fixedLaborTotal}
                  />
                </div>
              )}
            </div>

            {/* 4. Additional Materials Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    4. Additional Materials & Supplies
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Brushes, rollers, drop cloths, sandpaper, and wall putty.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["Brush", "Roller", "Tape", "Putty", "Sandpaper", "Plastic Sheet"].map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => addMaterialRow(name)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {materials.length === 0 ? (
                <div className="py-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500">
                  No extra supplies added. Click buttons above to add materials.
                </div>
              ) : (
                <div className="space-y-3">
                  {materials.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                    >
                      <div className="sm:col-span-5">
                        <input
                          id={`mat_${m.id}_name`}
                          type="text"
                          value={m.name}
                          onChange={(e) => updateMaterialItem(m.id, "name", e.target.value)}
                          placeholder="Item Name"
                          className="w-full px-3 py-2 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          id={`mat_${m.id}_qty`}
                          type="number"
                          value={m.quantity === 0 ? "" : m.quantity}
                          onChange={(e) => updateMaterialItem(m.id, "quantity", parseFloat(e.target.value) || 0)}
                          placeholder="Qty"
                          min={0}
                          step="any"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          id={`mat_${m.id}_price`}
                          type="number"
                          value={m.unitPrice === 0 ? "" : m.unitPrice}
                          onChange={(e) => updateMaterialItem(m.id, "unitPrice", parseFloat(e.target.value) || 0)}
                          placeholder={`Price (${currency})`}
                          min={0}
                          step="any"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeMaterialRow(m.id)}
                          className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
                Calculate Total Project Cost
              </button>
            </div>
          </form>

          {/* Results Card */}
          <div id="cost-results-section">
            {hasCalculated && (
              <ResultCard
                title="Complete Cost Estimate"
                metrics={[
                  {
                    label: "Total Estimated Cost",
                    value: formatCurrency(breakdown.totalCost, currency),
                    isPrimary: true,
                    helper: "Combined materials, paint, and labor",
                  },
                  {
                    label: "Paint Cost",
                    value: formatCurrency(breakdown.paintCost, currency),
                    helper: `${paintQuantity} ${volumeUnit} paint`,
                  },
                  {
                    label: "Labor Cost",
                    value: formatCurrency(breakdown.laborCost, currency),
                    helper: laborType === "rate" ? `${paintableArea} ${areaUnit} @ ${currency} ${laborRate}` : "Agreed lump sum",
                  },
                  {
                    label: "Primer Cost",
                    value: formatCurrency(breakdown.primerCost, currency),
                    helper: includePrimer ? `${primerQuantity} ${volumeUnit} primer` : "Not included",
                  },
                  {
                    label: "Additional Supplies",
                    value: formatCurrency(breakdown.materialsCost, currency),
                    helper: `${materials.length} supply items`,
                  },
                ]}
                onRecalculate={handleRecalculate}
                onSave={() => setSaveModalOpen(true)}
                sharePayload={sharePayload}
                pdfData={pdfData}
              />
            )}
          </div>
        </div>

        {/* Right Live Summary Sticky Panel */}
        <div className="lg:col-span-4 w-full">
          <LiveSummaryPanel
            title="COST SUMMARY"
            isComplete={isFormFilled}
            items={[
              { label: "Paint Material", value: formatCurrency(breakdown.paintCost, currency) },
              ...(includePrimer
                ? [{ label: "Primer Material", value: formatCurrency(breakdown.primerCost, currency) }]
                : []),
              { label: "Labor Application", value: formatCurrency(breakdown.laborCost, currency) },
              { label: "Consumable Supplies", value: formatCurrency(breakdown.materialsCost, currency) },
              {
                label: "ESTIMATED TOTAL",
                value: formatCurrency(breakdown.totalCost, currency),
                highlight: true,
              },
            ]}
            emptyNotice="Enter paint quantity and unit prices to generate a cost estimate."
          />
        </div>
      </div>

      {/* Save Project Modal */}
      <SaveProjectModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        calculatorType="cost"
        defaultName="Painting Budget Estimate"
        projectData={{
          dimensionsSummary: paintableArea ? `Area: ${paintableArea} ${areaUnit}` : undefined,
          paintQuantity: parseFloat(paintQuantity) || 0,
          paintUnit: volumeUnit,
          totalCost: breakdown.totalCost,
          currency: currency,
          materials: materials.map((m) => ({
            name: m.name,
            quantity: m.quantity,
            unitPrice: m.unitPrice,
          })),
          notes: `Labor: ${formatCurrency(breakdown.laborCost, currency)}, Paint: ${formatCurrency(breakdown.paintCost, currency)}`,
        }}
      />

      {/* Educational SEO Content & FAQs */}
      <section className="pt-12 border-t border-slate-200 dark:border-slate-800 text-left space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            How to Accurately Estimate Painting Project Costs
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A comprehensive breakdown of where painting dollars go and how contractors price residential and commercial painting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              What Affects Painting Cost?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Labor typically accounts for <strong>60% to 80%</strong> of a professional painting contractor&apos;s bill. Surface prep (patching holes, scraping peeling paint, masking trim, sanding) takes more hours than rolling actual paint. Premium paint lines cost more upfront but save money by covering in fewer coats.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Lump Sum vs. Per-Square-Foot / Meter Pricing
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Contractors charging by unit area (e.g. Rs 150/m² or $2.50/sq ft) usually include 2 coats of paint application. If substantial drywall repairs or tall scaffold heights are required, contractors prefer fixed lump-sum bids.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-slate-100/70 dark:bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Painting Cost Estimation FAQs
          </h3>
          <div className="space-y-3 text-sm">
            <details className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <summary className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                Can I switch currencies for international projects?
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Yes! Use the Currency Selector in the top navigation bar. You can switch between PKR, USD, EUR, GBP, AED, SAR, and more at any time.
              </p>
            </details>
            <details className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <summary className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                How can I share this estimate with my client or painter?
              </summary>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Click &quot;Download PDF&quot; to export a professional branded quote document, or click &quot;Share&quot; to send an instant summary via WhatsApp, SMS, or copy to your clipboard.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function CostCalculatorPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading Cost Calculator...</div>}>
      <CostCalculatorContent />
    </Suspense>
  );
}
