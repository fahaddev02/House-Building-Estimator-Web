"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Ban,
  ExternalLink,
  MousePointerClick,
  TrendingUp,
  Layout,
  Code2,
  Image as ImageIcon,
  Search,
  X,
} from "lucide-react";

export interface AdPlacement {
  id: string;
  name: string;
  placementLocation:
    | "Home Page Hero Top"
    | "Calculator Page Top"
    | "Calculation Result Card"
    | "Sidebar Floating"
    | "Footer Banner";
  adType: "Google AdSense" | "Custom HTML" | "Image Banner";
  adCode: string;
  imageUrl?: string;
  targetUrl?: string;
  priority: number;
  isEnabled: boolean;
  impressions: number;
  clicks: number;
}

const INITIAL_ADS: AdPlacement[] = [
  {
    id: "ad-1",
    name: "Top Calculator Header Banner",
    placementLocation: "Calculator Page Top",
    adType: "Google AdSense",
    adCode: '<ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXXXXXX" data-ad-slot="123456" data-ad-format="auto"></ins>',
    priority: 1,
    isEnabled: true,
    impressions: 14500,
    clicks: 340,
  },
  {
    id: "ad-2",
    name: "Calculation Result Bottom Banner",
    placementLocation: "Calculation Result Card",
    adType: "Image Banner",
    adCode: "",
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=728&h=90&fit=crop",
    targetUrl: "https://example.com/paint-deals",
    priority: 2,
    isEnabled: true,
    impressions: 9800,
    clicks: 290,
  },
  {
    id: "ad-3",
    name: "Homepage Hero Top Sponsor",
    placementLocation: "Home Page Hero Top",
    adType: "Custom HTML",
    adCode: '<div class="p-3 bg-emerald-100 text-emerald-800 rounded text-center text-xs">Special Discount on Berger & Dulux Paints!</div>',
    priority: 3,
    isEnabled: false,
    impressions: 4200,
    clicks: 110,
  },
];

const STORAGE_KEY = "pce_ads_data_v1";

export default function AdsManagementPage() {
  const [ads, setAds] = useState<AdPlacement[]>(INITIAL_ADS);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<AdPlacement | null>(null);

  const [formData, setFormData] = useState<AdPlacement>({
    id: "",
    name: "",
    placementLocation: "Calculator Page Top",
    adType: "Google AdSense",
    adCode: "",
    imageUrl: "",
    targetUrl: "",
    priority: 1,
    isEnabled: true,
    impressions: 0,
    clicks: 0,
  });

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setAds(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load ads from localStorage", e);
    }
  }, []);

  // Save to LocalStorage
  const saveAdsToState = (newAds: AdPlacement[], message?: string) => {
    setAds(newAds);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAds));
    } catch (e) {
      console.warn("Could not save ads to localStorage", e);
    }
    if (message) {
      setToastMessage(message);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const totalImpressions = ads.reduce((sum, a) => sum + (a.impressions || 0), 0);
  const totalClicks = ads.reduce((sum, a) => sum + (a.clicks || 0), 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";
  const activeCount = ads.filter((a) => a.isEnabled).length;

  const handleOpenAdd = () => {
    setFormData({
      id: "",
      name: "",
      placementLocation: "Calculator Page Top",
      adType: "Google AdSense",
      adCode: `<!-- Google AdSense -->\n<ins class="adsbygoogle"\n     style="display:block"\n     data-ad-client="ca-pub-XXXXXXXXXXXX"\n     data-ad-slot="1234567890"\n     data-ad-format="auto"></ins>`,
      imageUrl: "",
      targetUrl: "https://",
      priority: ads.length + 1,
      isEnabled: true,
      impressions: 0,
      clicks: 0,
    });
    setEditModalOpen(true);
  };

  const handleOpenEdit = (ad: AdPlacement) => {
    setFormData({ ...ad });
    setEditModalOpen(true);
  };

  const handleOpenPreview = (ad: AdPlacement) => {
    setSelectedAd(ad);
    setPreviewModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (formData.id) {
      const updated = ads.map((a) => (a.id === formData.id ? { ...formData } : a));
      saveAdsToState(updated, "Ad placement updated successfully.");
    } else {
      const newAd: AdPlacement = {
        ...formData,
        id: "ad-" + Date.now(),
      };
      saveAdsToState([newAd, ...ads], "New ad placement created.");
    }
    setEditModalOpen(false);
  };

  const handleToggle = (ad: AdPlacement) => {
    const updated = ads.map((a) => (a.id === ad.id ? { ...a, isEnabled: !a.isEnabled } : a));
    saveAdsToState(updated, `Ad slot "${ad.name}" ${!ad.isEnabled ? "activated" : "paused"}.`);
  };

  const handleDeleteConfirm = () => {
    if (!selectedAd) return;
    const updated = ads.filter((a) => a.id !== selectedAd.id);
    saveAdsToState(updated, `Ad slot "${selectedAd.name}" deleted.`);
    setDeleteConfirmOpen(false);
    setSelectedAd(null);
  };

  const filteredAds = ads.filter((ad) => {
    const matchesSearch =
      ad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.placementLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.adType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === "all" || ad.placementLocation === locationFilter;
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-lg animate-bounce text-sm font-semibold">
          <CheckCircle className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            Ads & Monetization Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure Google AdSense slots, sponsor banners, display priority, and track live CTR performance.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-sm font-bold shadow-sm shadow-emerald-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Ad Placement
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">Total Placements</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{ads.length}</div>
            <div className="text-xs text-emerald-600 mt-0.5">{activeCount} currently active</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
            <Layout className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">Total Impressions</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalImpressions.toLocaleString()}</div>
            <div className="text-xs text-slate-400 mt-0.5">Across calculator pages</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">Total Clicks</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalClicks.toLocaleString()}</div>
            <div className="text-xs text-purple-600 mt-0.5">Direct sponsor interactions</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600">
            <MousePointerClick className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500">Average Click Rate</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{avgCtr}%</div>
            <div className="text-xs text-amber-600 mt-0.5">Standard performance</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ad slots, types, placements..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Placements</option>
            <option value="Home Page Hero Top">Home Page Hero Top</option>
            <option value="Calculator Page Top">Calculator Page Top</option>
            <option value="Calculation Result Card">Calculation Result Card</option>
            <option value="Sidebar Floating">Sidebar Floating</option>
            <option value="Footer Banner">Footer Banner</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Slot Name & Placement</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Impressions</th>
                <th className="py-3 px-4">Clicks / CTR</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredAds.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No ad placements match your search.
                  </td>
                </tr>
              ) : (
                filteredAds.map((row) => {
                  const clicks = row.clicks || 0;
                  const imps = row.impressions || 0;
                  const ctr = imps > 0 ? ((clicks / imps) * 100).toFixed(2) : "0.00";
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <Megaphone className="w-4 h-4 text-emerald-600 shrink-0" />
                          {row.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{row.placementLocation}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                          {row.adType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">#{row.priority}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">{row.impressions.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{clicks.toLocaleString()} clicks</div>
                        <div className="text-[11px] text-emerald-600 font-semibold">{ctr}% CTR</div>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggle(row)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            row.isEnabled
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {row.isEnabled ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                          {row.isEnabled ? "Active" : "Paused"}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenPreview(row)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(row)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAd(row);
                              setDeleteConfirmOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {formData.id ? "Edit Ad Placement" : "Add New Ad Placement"}
              </h2>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Placement Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Location *
                  </label>
                  <select
                    value={formData.placementLocation}
                    onChange={(e) =>
                      setFormData({ ...formData, placementLocation: e.target.value as AdPlacement["placementLocation"] })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Home Page Hero Top">Home Page Hero Top</option>
                    <option value="Calculator Page Top">Calculator Page Top</option>
                    <option value="Calculation Result Card">Calculation Result Card</option>
                    <option value="Sidebar Floating">Sidebar Floating</option>
                    <option value="Footer Banner">Footer Banner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Ad Type *
                  </label>
                  <select
                    value={formData.adType}
                    onChange={(e) =>
                      setFormData({ ...formData, adType: e.target.value as AdPlacement["adType"] })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Google AdSense">Google AdSense</option>
                    <option value="Image Banner">Image Banner</option>
                    <option value="Custom HTML">Custom HTML</option>
                  </select>
                </div>
              </div>

              {formData.adType === "Image Banner" ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl || ""}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                      Target Link URL
                    </label>
                    <input
                      type="url"
                      value={formData.targetUrl || ""}
                      onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    HTML / AdSense Code
                  </label>
                  <textarea
                    rows={4}
                    value={formData.adCode}
                    onChange={(e) => setFormData({ ...formData, adCode: e.target.value })}
                    className="w-full font-mono text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-900 text-emerald-400"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isEnabled}
                    onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  Enable ad on website
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewModalOpen && selectedAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Ad Preview: {selectedAd.name}</h2>
              <button onClick={() => setPreviewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-dashed border-slate-300 text-center">
              {selectedAd.adType === "Image Banner" && selectedAd.imageUrl ? (
                <a href={selectedAd.targetUrl || "#"} target="_blank" rel="noreferrer" className="block">
                  <img src={selectedAd.imageUrl} alt={selectedAd.name} className="w-full max-h-40 object-cover rounded-lg" />
                </a>
              ) : (
                <pre className="p-3 bg-slate-900 text-emerald-400 text-xs font-mono text-left rounded-lg overflow-x-auto whitespace-pre-wrap">
                  {selectedAd.adCode || "<!-- No ad script -->"}
                </pre>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white dark:bg-slate-800 text-xs font-bold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {deleteConfirmOpen && selectedAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Ad Placement?</h3>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete &quot;{selectedAd.name}&quot;?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
