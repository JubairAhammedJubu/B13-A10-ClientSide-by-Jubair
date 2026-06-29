"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  Loader2,
  Trash2,
  Filter,
  Star,
  Flag,
  Eye,
  EyeOff,
  Globe,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

const VISIBILITY_CONFIG = {
  public: {
    label: "Public",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: Globe,
  },
  private: {
    label: "Private",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-50 dark:bg-slate-900/20",
    border: "border-slate-200 dark:border-slate-800",
    icon: EyeOff,
  },
};

export default function ManageLessonsClient({ user }) {
  const [lessons, setLessons] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState("");
  const [filterVisibility, setFilterVisibility] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFlag, setFilterFlag] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const getToken = async () => {
    const s = await authClient.getSession();
    return s?.data?.session?.token || null;
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Guard: env var missing
    if (!apiUrl) {
      const msg = "NEXT_PUBLIC_API_URL is not set. Check your .env.local file.";
      setError(msg);
      toast.error(msg);
      setIsLoading(false);
      return;
    }

    const token = await getToken();

    // Guard: not logged in / session expired
    if (!token) {
      const msg = "No auth token — please sign out and sign back in.";
      setError(msg);
      toast.error(msg);
      setIsLoading(false);
      return;
    }

    const headers = { authorization: `Bearer ${token}` };

    try {
      const [lessonsRes, reportsRes] = await Promise.all([
        fetch(`${apiUrl}/api/admin/lessons`, { headers }),
        fetch(`${apiUrl}/api/reports`, { headers }),
      ]);

      // Handle lessons response
      if (!lessonsRes.ok) {
        let errMsg = `Lessons: HTTP ${lessonsRes.status}`;
        try {
          const errJson = await lessonsRes.json();
          errMsg = errJson.message || errMsg;
        } catch (_) {}
        throw new Error(errMsg);
      }

      // Handle reports response
      if (!reportsRes.ok) {
        let errMsg = `Reports: HTTP ${reportsRes.status}`;
        try {
          const errJson = await reportsRes.json();
          errMsg = errJson.message || errMsg;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const lessonsData = await lessonsRes.json();
      const reportsData = await reportsRes.json();

      setLessons(Array.isArray(lessonsData) ? lessonsData : []);
      setReports(Array.isArray(reportsData) ? reportsData : []);
    } catch (err) {
      console.error("[ManageLessonsClient] fetchData error:", err);
      setError(err.message);
      toast.error(err.message || "Failed to load lessons");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleFeatured = async (lessonId, featured, title) => {
    setActionLoading(lessonId + "featured");
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/lessons/${lessonId}/featured`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ featured }),
        }
      );
      if (res.ok) {
        toast.success(
          featured
            ? `"${title}" is now featured!`
            : `"${title}" removed from featured.`
        );
        setLessons((prev) =>
          prev.map((l) => (l._id === lessonId ? { ...l, featured } : l))
        );
      } else {
        const errJson = await res.json().catch(() => ({}));
        toast.error(errJson.message || "Failed to update featured status");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReviewed = async (lessonId, reviewed, title) => {
    setActionLoading(lessonId + "reviewed");
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/lessons/${lessonId}/reviewed`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reviewed }),
        }
      );
      if (res.ok) {
        toast.success(
          reviewed
            ? `"${title}" marked as reviewed.`
            : `"${title}" review removed.`
        );
        setLessons((prev) =>
          prev.map((l) => (l._id === lessonId ? { ...l, reviewed } : l))
        );
      } else {
        const errJson = await res.json().catch(() => ({}));
        toast.error(errJson.message || "Failed to update review status");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (lessonId) => {
    setActionLoading(lessonId + "delete");
    setDeleteConfirm(null);
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/lessons/${lessonId}`,
        {
          method: "DELETE",
          headers: { authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        toast.success("Lesson deleted successfully!");
        setLessons((prev) => prev.filter((l) => l._id !== lessonId));
      } else {
        const errJson = await res.json().catch(() => ({}));
        toast.error(errJson.message || "Failed to delete lesson");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setActionLoading(null);
    }
  };

  const flaggedIds = new Set(reports.map((r) => r.lessonId));
  const categories = [
    "all",
    ...new Set(lessons.map((l) => l.category).filter(Boolean)),
  ];

  const filtered = lessons.filter((l) => {
    const matchSearch = search
      ? l.title?.toLowerCase().includes(search.toLowerCase()) ||
        l.authorName?.toLowerCase().includes(search.toLowerCase()) ||
        l.category?.toLowerCase().includes(search.toLowerCase())
      : true;
    const matchVisibility =
      filterVisibility === "all"
        ? true
        : filterVisibility === "public"
        ? l.visibility === "public"
        : l.visibility !== "public";
    const matchCategory =
      filterCategory === "all" ? true : l.category === filterCategory;
    const matchFlag =
      filterFlag === "all"
        ? true
        : filterFlag === "flagged"
        ? flaggedIds.has(l._id?.toString())
        : filterFlag === "featured"
        ? l.featured === true
        : filterFlag === "reviewed"
        ? l.reviewed === true
        : true;
    return matchSearch && matchVisibility && matchCategory && matchFlag;
  });

  const counts = {
    total: lessons.length,
    public: lessons.filter((l) => l.visibility === "public").length,
    private: lessons.filter((l) => l.visibility !== "public").length,
    flagged: lessons.filter((l) => flaggedIds.has(l._id?.toString())).length,
    featured: lessons.filter((l) => l.featured).length,
  };

  // ── Error state ──────────────────────────────────────────────
  if (!isLoading && error) {
    return (
      <div className="p-6 pt-8 max-w-7xl mx-auto mt-4">
        <div className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-red-200 dark:border-red-900/50 p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
            Failed to load lessons
          </h2>
          <p className="text-sm text-red-500 dark:text-red-400 mb-6 font-mono bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-xl inline-block">
            {error}
          </p>
          <br />
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white text-sm font-semibold shadow-md mt-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-8 max-w-7xl mx-auto space-y-6 mt-4">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage Lessons
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Review, feature, or remove lessons from the platform
        </p>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-5 gap-4"
      >
        {[
          { label: "Total Lessons", value: counts.total, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20", icon: BookOpen },
          { label: "Public Lessons", value: counts.public, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20", icon: Globe },
          { label: "Private", value: counts.private, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-900/20", icon: EyeOff },
          { label: "Featured", value: counts.featured, color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/20", icon: Star },
          { label: "Flagged", value: counts.flagged, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20", icon: Flag },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex items-center gap-3`}>
            <div className="w-9 h-9 rounded-xl bg-white/60 dark:bg-black/20 flex items-center justify-center flex-shrink-0">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col gap-3"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, author or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {["all", "public", "private"].map((f) => (
            <button
              key={f}
              onClick={() => setFilterVisibility(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                filterVisibility === f
                  ? "bg-amber-500 text-white shadow-md"
                  : "bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              {f === "all" ? "All Visibility" : f}
            </button>
          ))}
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
          {[
            { value: "all", label: "All" },
            { value: "flagged", label: "🚩 Flagged" },
            { value: "featured", label: "⭐ Featured" },
            { value: "reviewed", label: "✅ Reviewed" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterFlag(f.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                filterFlag === f.value
                  ? "bg-indigo-500 text-white shadow-md"
                  : "bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400"
              }`}
            >
              {f.label}
            </button>
          ))}
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-[#1a1d24] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All Categories" : c}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800">
          <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No lessons found</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Lesson</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Author</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Visibility</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Flags</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filtered.map((lesson, i) => {
                  const isPublic = lesson.visibility === "public";
                  const visConfig = isPublic ? VISIBILITY_CONFIG.public : VISIBILITY_CONFIG.private;
                  const VisIcon = visConfig.icon;
                  const lessonId = lesson._id?.toString();
                  const isFlagged = flaggedIds.has(lessonId);
                  const reportCount = reports.filter((r) => r.lessonId === lessonId).length;

                  return (
                    <motion.tr
                      key={lessonId}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors ${isFlagged ? "bg-rose-50/30 dark:bg-rose-900/5" : ""}`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-4 h-4 text-amber-500" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[200px] flex items-center gap-1.5">
                              {lesson.title}
                              {lesson.featured && <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />}
                              {lesson.reviewed && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(lesson.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {lesson.authorName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{lesson.authorName}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[120px]">{lesson.authorEmail}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400">
                          {lesson.category || "—"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${visConfig.bg} ${visConfig.border} border`}>
                          <VisIcon className={`w-3.5 h-3.5 ${visConfig.color}`} />
                          <span className={`text-xs font-semibold ${visConfig.color}`}>{visConfig.label}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {isFlagged ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800">
                            <Flag className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                              {reportCount} report{reportCount > 1 ? "s" : ""}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/lessons/${lessonId}`}
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-500 hover:border-indigo-300 transition-all"
                            title="View lesson"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          <button
                            onClick={() => handleFeatured(lessonId, !lesson.featured, lesson.title)}
                            disabled={!!actionLoading}
                            title={lesson.featured ? "Remove from featured" : "Make featured"}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${
                              lesson.featured
                                ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100"
                                : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-yellow-50 hover:border-yellow-200 hover:text-yellow-600"
                            }`}
                          >
                            {actionLoading === lessonId + "featured" ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Star className={`w-3 h-3 ${lesson.featured ? "fill-current" : ""}`} />
                            )}
                            {lesson.featured ? "Unfeature" : "Feature"}
                          </button>

                          <button
                            onClick={() => handleReviewed(lessonId, !lesson.reviewed, lesson.title)}
                            disabled={!!actionLoading}
                            title={lesson.reviewed ? "Remove reviewed mark" : "Mark as reviewed"}
                            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${
                              lesson.reviewed
                                ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                                : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600"
                            }`}
                          >
                            {actionLoading === lessonId + "reviewed" ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <ShieldCheck className="w-3 h-3" />
                            )}
                            {lesson.reviewed ? "Reviewed" : "Review"}
                          </button>

                          <button
                            onClick={() => setDeleteConfirm(lessonId)}
                            disabled={!!actionLoading}
                            title="Delete lesson"
                            className="p-1.5 rounded-lg border border-red-100 dark:border-red-900/30 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                          >
                            {actionLoading === lessonId + "delete" ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/30">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-600 dark:text-gray-300">{filtered.length}</span>
              {" "}of{" "}
              <span className="font-semibold text-gray-600 dark:text-gray-300">{lessons.length}</span>
              {" "}lessons
            </p>
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#1a1d24] rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-gray-800"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Delete Lesson?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              This action is permanent and cannot be undone. The lesson will be removed from the platform.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={!!actionLoading}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}