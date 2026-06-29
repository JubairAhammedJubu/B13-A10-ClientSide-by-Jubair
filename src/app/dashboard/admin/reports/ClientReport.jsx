"use client";

import {useEffect, useState, useCallback} from "react";
import {motion, AnimatePresence} from "motion/react";
import {authClient} from "@/lib/auth-client";
import {
  Shield,
  Trash2,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  BookOpen,
  Loader2,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({toasts}) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{opacity: 0, x: 40}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: 40}}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-white text-sm font-medium shadow-lg max-w-xs
              ${t.type === "success" ? "bg-emerald-500" : t.type === "error" ? "bg-rose-500" : "bg-indigo-500"}`}
          >
            {t.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  danger,
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          className="fixed inset-0 z-[9000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{opacity: 0, scale: 0.95, y: 10}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.95, y: 10}}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-bg-gray-900 rounded-2xl p-7 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className={danger ? "text-rose-500" : "text-amber-500"}>
                <AlertTriangle className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
              {description}
            </p>
            <div className="flex gap-2.5 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-bg-gray-900 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all shadow-sm
                  ${
                    danger
                      ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200 dark:shadow-rose-900/30"
                      : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200 dark:shadow-emerald-900/30"
                  }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Reports Detail Modal ─────────────────────────────────────────────────────

function ReportsModal({open, lessonTitle, reports, onClose}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          className="fixed inset-0 z-[9000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{opacity: 0, scale: 0.95, y: 10}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.95, y: 10}}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-bg-gray-900 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">
                  {reports.length} Report{reports.length !== 1 ? "s" : ""}
                </p>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug">
                  {lessonTitle}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ml-3 shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 flex flex-col gap-3 pr-1">
              {reports.length === 0 ? (
                <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-10">
                  No reports found.
                </p>
              ) : (
                reports.map((r, i) => (
                  <div
                    key={r._id || i}
                    className="bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/50 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {(r.reportedUserEmail?.[0] || "?").toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {r.reportedUserEmail || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {r.timestamp
                            ? new Date(r.timestamp).toLocaleString()
                            : "—"}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-2.5 leading-relaxed">
                      {r.reason || "No reason provided"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Severity badge helper ────────────────────────────────────────────────────

function SeverityBadge({count}) {
  if (count >= 5)
    return (
      <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 font-bold text-sm">
        {count}
      </span>
    );
  if (count >= 2)
    return (
      <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 font-bold text-sm">
        {count}
      </span>
    );
  return (
    <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 font-bold text-sm">
      {count}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClientReport({user}) {
  const [token, setToken] = useState(null);
  const [groupedReports, setGroupedReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [toastId, setToastId] = useState(0);

  const [detailModal, setDetailModal] = useState({
    open: false,
    lessonTitle: "",
    reports: [],
  });
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: null,
    lessonId: null,
    lessonTitle: "",
  });

  // ── Toast helper ───────────────────────────────────────────────────────────

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, {id, message, type}]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchReports = useCallback(
    async (tok) => {
      setLoading(true);
      try {
        const [reportsRes, lessonsRes] = await Promise.all([
          fetch(`${API}/api/reports`, {
            headers: {Authorization: `Bearer ${tok}`},
          }),
          fetch(`${API}/api/admin/lessons`, {
            headers: {Authorization: `Bearer ${tok}`},
          }),
        ]);
        if (!reportsRes.ok) throw new Error("Failed to fetch reports");
        if (!lessonsRes.ok) throw new Error("Failed to fetch lessons");

        const reportsData = await reportsRes.json();
        const lessonsData = await lessonsRes.json();

        const lessonMap = {};
        lessonsData.forEach((l) => {
          lessonMap[l._id?.toString()] = l;
        });

        const groups = {};
        reportsData.forEach((r) => {
          const id = r.lessonId?.toString();
          if (!id) return;
          if (!groups[id])
            groups[id] = {
              lessonId: id,
              lesson: lessonMap[id] || null,
              reports: [],
            };
          groups[id].reports.push(r);
        });

        setGroupedReports(
          Object.values(groups).sort(
            (a, b) => b.reports.length - a.reports.length,
          ),
        );
      } catch (err) {
        addToast(err.message || "Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    },
    [addToast],
  );

  useEffect(() => {
    const init = async () => {
      const s = await authClient.getSession();
      const tok = s?.data?.session?.token;
      setToken(tok);
      if (tok) fetchReports(tok);
      else {
        setLoading(false);
        addToast("No auth token found", "error");
      }
    };
    init();
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────

  const handleDeleteLesson = async () => {
    const {lessonId, lessonTitle} = confirmModal;
    try {
      // /purge atomically deletes the lesson document + all its lessonReports
      const res = await fetch(`${API}/api/admin/lessons/${lessonId}/purge`, {
        method: "DELETE",
        headers: {Authorization: `Bearer ${token}`},
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Delete failed");
      }
      const data = await res.json();
      setGroupedReports((prev) => prev.filter((g) => g.lessonId !== lessonId));
      addToast(
        `"${lessonTitle}" deleted — ${data.deletedReports ?? 0} report${data.deletedReports !== 1 ? "s" : ""} also removed.`,
        "success",
      );
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setConfirmModal({
        open: false,
        type: null,
        lessonId: null,
        lessonTitle: "",
      });
    }
  };

  const handleIgnore = async () => {
    const {lessonId} = confirmModal;
    try {
      // Uses dedicated server-side bulk-delete; falls back to per-report deletes
      const res = await fetch(
        `${API}/api/admin/lessons/${lessonId}/clear-reports`,
        {
          method: "DELETE",
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      if (!res.ok) {
        const group = groupedReports.find((g) => g.lessonId === lessonId);
        if (group) {
          await Promise.allSettled(
            group.reports
              .filter((r) => r._id)
              .map((r) =>
                fetch(`${API}/api/reports/${r._id}`, {
                  method: "DELETE",
                  headers: {Authorization: `Bearer ${token}`},
                }),
              ),
          );
        }
      }
      setGroupedReports((prev) => prev.filter((g) => g.lessonId !== lessonId));
      addToast("All reports cleared. Lesson remains live.", "success");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setConfirmModal({
        open: false,
        type: null,
        lessonId: null,
        lessonTitle: "",
      });
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p-4 pt-6 max-w-6xl mx-auto space-y-6">
      {/* ── Banner (mirrors Overview welcome banner) ── */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        className="relative overflow-hidden bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 rounded-2xl p-6 text-white"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-white/80" />
              <span className="text-white/80 text-sm font-medium">
                Moderation
              </span>
            </div>
            <h1 className="text-2xl font-bold">Reported Lessons</h1>
            <p className="text-white/70 text-sm mt-1">
              Review community flags and take action
            </p>
          </div>
          {!loading && (
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-xl border border-white/20 text-white text-sm font-semibold whitespace-nowrap self-start sm:self-center">
              <AlertTriangle className="w-4 h-4" />
              {groupedReports.length} lesson
              {groupedReports.length !== 1 ? "s" : ""} flagged
            </div>
          )}
        </div>
      </motion.div>

      {/* ── Summary stat cards ── */}
      {!loading && groupedReports.length > 0 && (
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.1}}
          className="grid grid-cols-2 gap-4"
        >
          {[
            {
              label: "Flagged Lessons",
              value: groupedReports.length,
              color: "text-rose-600 dark:text-rose-400",
              bg: "bg-rose-50 dark:bg-rose-900/20",
              border: "border-rose-100 dark:border-rose-800/50",
              Icon: AlertTriangle,
            },
            {
              label: "Total Reports",
              value: groupedReports.reduce((s, g) => s + g.reports.length, 0),
              color: "text-amber-600 dark:text-amber-400",
              bg: "bg-amber-50 dark:bg-amber-900/20",
              border: "border-amber-100 dark:border-amber-800/50",
              Icon: AlertCircle,
            },

          ].map(({label, value, color, bg, border, Icon}, i) => (
            <div
              key={i}
              className={`bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border ${border} shadow-sm`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
                {label}
              </p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* ── Table card ── */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.15}}
        className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Loading reports…
            </p>
          </div>
        ) : groupedReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              No reported lessons
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Everything looks clean.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700/50">
                  {[
                    "#",
                    "Lesson",
                    "Author",
                    "Reports",
                    "Access",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap
                        ${i === 0 ? "text-left w-10" : i === 5 ? "text-right" : i >= 2 ? "text-center" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groupedReports.map((group, idx) => {
                  const lesson = group.lesson;
                  return (
                    <motion.tr
                      key={group.lessonId}
                      initial={{opacity: 0, y: 6}}
                      animate={{opacity: 1, y: 0}}
                      transition={{delay: idx * 0.04}}
                      className="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      {/* # */}
                      <td className="px-4 py-4 text-xs text-gray-400 dark:text-gray-500">
                        {idx + 1}
                      </td>

                      {/* Lesson */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {lesson?.image ? (
                            <img
                              src={lesson.image}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100 dark:border-gray-700"
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                              <BookOpen className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate max-w-30 md:max-w-55">
                              {lesson?.title || (
                                <span className="italic text-gray-400">
                                  Lesson deleted
                                </span>
                              )}
                            </p>
                            {lesson?.category && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                {lesson.category}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="px-4 py-4 text-center">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {lesson?.authorName || lesson?.creatorName || "—"}
                        </p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
                          {lesson?.authorEmail || lesson?.creatorEmail || ""}
                        </p>
                      </td>

                      {/* Reports count */}
                      <td className="px-4 py-4 text-center">
                        <SeverityBadge count={group.reports.length} />
                      </td>

                      {/* Access */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`text-[11px] font-semibold px-3 py-1 rounded-full capitalize
                          ${
                            lesson?.accessLevel === "premium"
                              ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                              : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                          }`}
                        >
                          {lesson?.accessLevel || "free"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* View */}
                          <button
                            onClick={() =>
                              setDetailModal({
                                open: true,
                                lessonTitle: lesson?.title || group.lessonId,
                                reports: group.reports,
                              })
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>

                          {/* Ignore */}
                          <button
                            onClick={() =>
                              setConfirmModal({
                                open: true,
                                type: "ignore",
                                lessonId: group.lessonId,
                                lessonTitle: lesson?.title || group.lessonId,
                              })
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Ignore
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() =>
                              setConfirmModal({
                                open: true,
                                type: "delete",
                                lessonId: group.lessonId,
                                lessonTitle: lesson?.title || group.lessonId,
                              })
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-xs font-medium hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-800/50 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ── Modals ── */}
      <ReportsModal
        open={detailModal.open}
        lessonTitle={detailModal.lessonTitle}
        reports={detailModal.reports}
        onClose={() =>
          setDetailModal({open: false, lessonTitle: "", reports: []})
        }
      />

      <ConfirmModal
        open={confirmModal.open}
        title={
          confirmModal.type === "delete" ? "Delete Lesson?" : "Ignore Reports?"
        }
        description={
          confirmModal.type === "delete"
            ? `"${confirmModal.lessonTitle}" will be permanently removed from the platform. This cannot be undone.`
            : `All reports for "${confirmModal.lessonTitle}" will be cleared. The lesson will remain live and visible to users.`
        }
        confirmLabel={
          confirmModal.type === "delete" ? "Delete Lesson" : "Clear Reports"
        }
        danger={confirmModal.type === "delete"}
        onConfirm={
          confirmModal.type === "delete" ? handleDeleteLesson : handleIgnore
        }
        onCancel={() =>
          setConfirmModal({
            open: false,
            type: null,
            lessonId: null,
            lessonTitle: "",
          })
        }
      />

      <Toast toasts={toasts} />
    </div>
  );
}
