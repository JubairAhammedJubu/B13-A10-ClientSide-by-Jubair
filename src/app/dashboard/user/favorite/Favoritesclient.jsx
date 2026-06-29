"use client";

import {useState, useEffect, useMemo} from "react";
import {motion, AnimatePresence} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  BookOpen,
  Trash2,
  ExternalLink,
  Loader2,
  Search,
  Filter,
  X,
  ChevronDown,
  Sparkles,
  Tag,
  Smile,
  Clock,
  Star,
  SlidersHorizontal,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";
import {authClient} from "@/lib/auth-client";

// ── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "All",
  "Mindset",
  "Relationships",
  "Career",
  "Personal Growth",
  "Mistakes Learned",
];

const EMOTIONAL_TONES = [
  "All",
  "Motivational",
  "Realization",
  "Sad",
  "Gratitude",
];

const ACCESS_LEVEL_CONFIG = {
  free: {
    label: "Free",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  premium: {
    label: "Premium",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-200 dark:border-violet-800",
    icon: Sparkles,
  },
};

// ── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800">
      {[140, 80, 80, 60, 60, 100].map((w, i) => (
        <td key={i} className="px-4 py-3.5">
          <div
            className="h-4 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
            style={{width: w}}
          />
        </td>
      ))}
    </tr>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({hasFilters, onClear}) {
  return (
    <tr>
      <td colSpan={6} className="px-4 py-20 text-center">
        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-16 h-16 rounded-2xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
            <Heart className="w-7 h-7 text-pink-300" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
            {hasFilters
              ? "No lessons match your filters"
              : "No saved lessons yet"}
          </p>
          {hasFilters ? (
            <button
              onClick={onClear}
              className="text-xs text-pink-500 hover:text-pink-400 font-semibold underline underline-offset-2"
            >
              Clear filters
            </button>
          ) : (
            <Link
              href="/lessons"
              className="text-xs px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-semibold transition-all"
            >
              Browse lessons
            </Link>
          )}
        </motion.div>
      </td>
    </tr>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function FavoritesClient() {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [tone, setTone] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

 
  // ── Fetch favorites + lesson details ────────────────────────────────────────
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const s = await authClient.getSession();
        const token = s?.data?.session?.token;
        if (!token) return;

        const API = process.env.NEXT_PUBLIC_API_URL;
        const headers = {authorization: `Bearer ${token}`};

        const favsRes = await fetch(`${API}/api/favorites`, {headers});
        const favsData = await favsRes.json();
        const favsList = Array.isArray(favsData) ? favsData : [];

        if (favsList.length === 0) {
          setLessons([]);
          setIsLoading(false);
          return;
        }

        // Fetch full lesson details in parallel
        const details = await Promise.all(
          favsList.map((fav) =>
            fetch(`${API}/api/lessons/${fav.lessonId}`, {headers})
              .then((r) => r.json())
              .then((d) =>
                d.lesson ? {...d.lesson, savedAt: fav.createdAt} : null,
              )
              .catch(() => null),
          ),
        );

        // Deduplicate by _id
        const seen = new Set();
        const unique = details.filter((l) => {
          if (!l || seen.has(String(l._id))) return false;
          seen.add(String(l._id));
          return true;
        });

        setLessons(unique);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load favorites");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ── Remove from favorites ────────────────────────────────────────────────────
  const handleRemove = async (lessonId) => {
    setRemovingId(lessonId);
    try {
      const s = await authClient.getSession();
      const token = s?.data?.session?.token;
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const res = await fetch(`${API}/api/favorites/${lessonId}`, {
        method: "DELETE",
        headers: {authorization: `Bearer ${token}`},
      });

      if (res.ok) {
        setLessons((prev) => prev.filter((l) => l._id !== lessonId));
        toast.success("Removed from favorites");
      } else {
        toast.error("Failed to remove");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setRemovingId(null);
    }
  };

  // ── Filtered data ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return lessons.filter((l) => {
      const matchSearch =
        !search ||
        l.title?.toLowerCase().includes(search.toLowerCase()) ||
        l.creatorName?.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || l.category === category;
      const matchTone = tone === "All" || l.emotionalTone === tone;
      return matchSearch && matchCat && matchTone;
    });
  }, [lessons, search, category, tone]);

  const hasFilters = search || category !== "All" || tone !== "All";

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setTone("All");
  };

  // ── Active filter chips ──────────────────────────────────────────────────────
  const chips = [
    ...(category !== "All"
      ? [{label: category, onRemove: () => setCategory("All")}]
      : []),
    ...(tone !== "All" ? [{label: tone, onRemove: () => setTone("All")}] : []),
  ];

  return (
    <div className="p-6 pt-8 max-w-6xl mx-auto mt-4 space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.div initial={{opacity: 0, y: 16}} animate={{opacity: 1, y: 0}}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
            <Heart className="w-5 h-5 text-pink-500 fill-pink-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Saved Lessons
          </h1>
          {!isLoading && (
            <span className="ml-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400">
              {filtered.length} of {lessons.length}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 ml-12">
          Lessons you&apos;ve bookmarked for later
        </p>
      </motion.div>

      {/* ── Search & Filters ────────────────────────────────────────────────── */}
      <motion.div
        initial={{opacity: 0, y: 16}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.05}}
        className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4 space-y-3"
      >
        {/* Search bar + filter toggle */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or creator…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/30 focus:border-pink-400 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              showFilters || hasFilters
                ? "border-pink-400 text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20"
                : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasFilters && (
              <span className="w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center">
                {chips.length}
              </span>
            )}
          </button>
        </div>

        {/* Expanded filter dropdowns */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{opacity: 0, height: 0}}
              animate={{opacity: 1, height: "auto"}}
              exit={{opacity: 0, height: 0}}
              className="overflow-hidden"
            >
              <div className="pt-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Category */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                    <Tag className="w-3 h-3" /> Category
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400/30 focus:border-pink-400 transition-all"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Emotional Tone */}
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">
                    <Smile className="w-3 h-3" /> Emotional Tone
                  </label>
                  <div className="relative">
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400/30 focus:border-pink-400 transition-all capitalize"
                    >
                      {EMOTIONAL_TONES.map((t) => (
                        <option key={t} className="capitalize">
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filter chips */}
        {chips.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            {chips.map((chip, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-400 text-xs font-semibold"
              >
                {chip.label}
                <button
                  onClick={chip.onRemove}
                  className="hover:text-pink-800 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              onClick={clearFilters}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2"
            >
              Clear all
            </button>
          </div>
        )}
      </motion.div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{opacity: 0, y: 16}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.1}}
        className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {/* Head */}
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Lesson
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Tone
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Likes
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Saved On
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Loading skeletons */}
              {isLoading &&
                Array.from({length: 5}).map((_, i) => <SkeletonRow key={i} />)}

              {/* Empty state */}
              {!isLoading && filtered.length === 0 && (
                <EmptyState hasFilters={!!hasFilters} onClear={clearFilters} />
              )}

              {/* Rows */}
              {!isLoading &&
                filtered.map((lesson, idx) => {
                  const access =
                    ACCESS_LEVEL_CONFIG[lesson.accessLevel] ||
                    ACCESS_LEVEL_CONFIG.free;
                  const AccessIcon = access.icon;
                  const isRemoving = removingId === lesson._id;

                  return (
                    <motion.tr
                      key={lesson._id}
                      initial={{opacity: 0, x: -10}}
                      animate={{opacity: 1, x: 0}}
                      exit={{opacity: 0, x: 10}}
                      transition={{delay: idx * 0.03}}
                      className="border-b border-gray-50 dark:border-gray-800/60 hover:bg-pink-50/30 dark:hover:bg-pink-900/5 transition-colors group"
                    >
                      {/* Lesson info */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
                            {lesson.image ? (
                              <Image
                                src={lesson.image}
                                alt={lesson.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[180px]">
                              {lesson.title}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-[180px]">
                              by {lesson.creatorName}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-medium whitespace-nowrap">
                          <Tag className="w-3 h-3" />
                          {lesson.category}
                        </span>
                      </td>

                      {/* Emotional tone */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-medium capitalize whitespace-nowrap">
                          <Smile className="w-3 h-3" />
                          {lesson.emotionalTone}
                        </span>
                      </td>

                      {/* Likes */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1 text-pink-500">
                          <Heart className="w-3.5 h-3.5 fill-pink-400" />
                          <span className="font-semibold text-sm">
                            {lesson.likesCount ?? 0}
                          </span>
                        </div>
                      </td>

                      {/* Saved on */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          {lesson.savedAt
                            ? new Date(lesson.savedAt).toLocaleDateString(
                                "en-BD",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-center gap-2">
                          {/* View details */}
                          <Link
                            href={`/lessons/${lesson._id}`}
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-indigo-500 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                            title="View lesson"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>

                          {/* Remove from favorites */}
                          <button
                            onClick={() => handleRemove(lesson._id)}
                            disabled={isRemoving}
                            className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                            title="Remove from favorites"
                          >
                            {isRemoving ? (
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

        {/* Footer row */}
        {!isLoading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                {filtered.length}
              </span>{" "}
              saved lesson{filtered.length !== 1 ? "s" : ""}
            </p>
            <Link
              href="/lessons"
              className="text-xs text-pink-500 hover:text-pink-400 font-semibold flex items-center gap-1"
            >
              <BookOpen className="w-3 h-3" />
              Browse more lessons
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
