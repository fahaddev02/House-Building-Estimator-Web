"use client";

import React, { useState } from "react";
import { X, Check, BookmarkCheck, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useProjects, SavedProject, CalculatorType } from "@/lib/context/ProjectsContext";

interface SaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorType: CalculatorType;
  defaultName: string;
  projectData: Omit<SavedProject, "id" | "date" | "name" | "calculatorType">;
}

export default function SaveProjectModal({
  isOpen,
  onClose,
  calculatorType,
  defaultName,
  projectData,
}: SaveProjectModalProps) {
  const { saveProject } = useProjects();
  const [name, setName] = useState(defaultName);
  const [notes, setNotes] = useState(projectData.notes || "");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a project name");
      return;
    }
    try {
      saveProject({
        ...projectData,
        name: name.trim(),
        notes: notes.trim(),
        calculatorType,
      });
      setSavedSuccess(true);
    } catch (err) {
      setError("Failed to save project. Please check localStorage availability.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {savedSuccess ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
              <BookmarkCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Project Saved Successfully!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Your estimate &quot;{name}&quot; is saved in your browser&apos;s local storage.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Close
              </button>
              <Link
                href="/projects"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-sm"
              >
                <span>View Projects</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Save Project Estimate
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Save your calculated dimensions and estimate for future reference.
              </p>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Project / Room Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                placeholder="e.g., Master Bedroom, Living Room Walls"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                  error
                    ? "border-red-500 focus:ring-red-400/20"
                    : "border-slate-300 dark:border-slate-700 focus:ring-blue-500/20 focus:border-blue-600"
                }`}
                autoFocus
              />
              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="e.g., Paint brand: Dulux Velvet Matte, Contractor contact, etc."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div className="font-semibold text-slate-700 dark:text-slate-300">
                Estimate Snapshot:
              </div>
              {projectData.dimensionsSummary && <div>{projectData.dimensionsSummary}</div>}
              {projectData.area !== undefined && (
                <div>Area: {projectData.area} {projectData.areaUnit || "m²"}</div>
              )}
              {projectData.paintQuantity !== undefined && (
                <div>Paint: {projectData.paintQuantity} {projectData.paintUnit || "L"}</div>
              )}
              {projectData.totalCost !== undefined && (
                <div>Cost: {projectData.currency || "PKR"} {projectData.totalCost.toLocaleString()}</div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md transition-all"
              >
                Save Project
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
