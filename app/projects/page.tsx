"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProjects, SavedProject } from "@/lib/context/ProjectsContext";
import { useSettings } from "@/lib/context/SettingsContext";
import { formatCurrency } from "@/lib/calculations/currency";
import {
  FolderArchive,
  Search,
  ArrowUpDown,
  Plus,
  ExternalLink,
  Copy,
  Trash2,
  Edit2,
  Calendar,
  Layers,
  Sparkles,
  FileText,
} from "lucide-react";

type SortOption = "newest" | "oldest" | "highestCost" | "lowestCost";

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, deleteProject, duplicateProject, updateProject } = useProjects();
  const { currency } = useSettings();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  // Edit Modal State
  const [editingProject, setEditingProject] = useState<SavedProject | null>(null);
  const [editName, setEditName] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const filteredAndSortedProjects = useMemo(() => {
    let result = projects.filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.calculatorType.toLowerCase().includes(q) ||
        (p.notes && p.notes.toLowerCase().includes(q))
      );
    });

    result.sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortOption === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortOption === "highestCost") {
        return (b.totalCost || 0) - (a.totalCost || 0);
      } else if (sortOption === "lowestCost") {
        return (a.totalCost || 0) - (b.totalCost || 0);
      }
      return 0;
    });

    return result;
  }, [projects, searchQuery, sortOption]);

  const handleOpenProject = (project: SavedProject) => {
    if (project.calculatorType === "wall") {
      router.push(`/wall-calculator`);
    } else if (project.calculatorType === "ceiling") {
      router.push(`/ceiling-calculator`);
    } else if (project.calculatorType === "paint") {
      const params = new URLSearchParams();
      if (project.area) params.set("area", String(project.area));
      router.push(`/paint-calculator?${params.toString()}`);
    } else if (project.calculatorType === "cost") {
      const params = new URLSearchParams();
      if (project.paintQuantity) params.set("paintQuantity", String(project.paintQuantity));
      if (project.area) params.set("area", String(project.area));
      router.push(`/cost-calculator?${params.toString()}`);
    }
  };

  const handleOpenEditModal = (project: SavedProject) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditNotes(project.notes || "");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    updateProject(editingProject.id, {
      name: editName.trim() || editingProject.name,
      notes: editNotes.trim(),
    });
    setEditingProject(null);
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <FolderArchive className="w-3.5 h-3.5" />
            <span>Saved Estimates Archive</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            My Saved Projects
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Access and manage all previous painting estimates stored locally on this device.
          </p>
        </div>

        <Link
          href="/wall-calculator"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Calculation</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by project name or notes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-semibold text-slate-500">Sort by:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-600"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highestCost">Highest Cost</option>
            <option value="lowestCost">Lowest Cost</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      {filteredAndSortedProjects.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <FolderArchive className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No saved projects yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Run any calculator and click &quot;Save Result&quot; to keep your estimates organized locally in your browser.
            </p>
          </div>
          <div>
            <Link
              href="/wall-calculator"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Your First Estimate</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProjects.map((p) => {
            const dateStr = new Date(p.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                {/* Header */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                      {p.calculatorType} calculator
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <span>{dateStr}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {p.name}
                  </h3>
                </div>

                {/* Specs snapshot */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
                  {p.dimensionsSummary && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Dimensions:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {p.dimensionsSummary}
                      </span>
                    </div>
                  )}
                  {p.area !== undefined && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Area:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {p.area} {p.areaUnit || "m²"}
                      </span>
                    </div>
                  )}
                  {p.paintQuantity !== undefined && (
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Paint:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {p.paintQuantity} {p.paintUnit || "L"}
                      </span>
                    </div>
                  )}
                  {p.totalCost !== undefined && (
                    <div className="pt-1 border-t border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white">
                      <span>Cost:</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        {formatCurrency(p.totalCost, p.currency || currency)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Notes if any */}
                {p.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                    &quot;{p.notes}&quot;
                  </p>
                )}

                {/* Actions: Open, Edit, Duplicate, Delete */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => handleOpenProject(p)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Edit project name & notes"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => duplicateProject(p.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Duplicate project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete estimate "${p.name}"?`)) {
                          deleteProject(p.id);
                        }
                      }}
                      className="p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Project Name / Notes Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Edit Project Details
            </h3>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Project Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Notes
                </label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
