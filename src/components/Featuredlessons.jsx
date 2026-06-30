"use client";

import {useEffect, useState, useCallback} from "react";
import Image from "next/image";
import Link from "next/link";
import {motion, AnimatePresence} from "motion/react";
import {
  Sparkles,
  ArrowRight,
  Heart,
  BookOpen,
  Lock,
  Star,
  Crown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_AVATAR = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366F1&color=fff`;

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const PER_PAGE = 6;

const TONE_COLORS = {
  happy: {
    from: "from-amber-400",
    to: "to-orange-400",
    light: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
  },
  sad: {
    from: "from-blue-400",
    to: "to-indigo-500",
    light: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
  },
  hopeful: {
    from: "from-emerald-400",
    to: "to-teal-500",
    light: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  reflective: {
    from: "from-violet-400",
    to: "to-purple-500",
    light: "bg-violet-50 dark:bg-violet-900/20",
    text: "text-violet-600 dark:text-violet-400",
  },
  grateful: {
    from: "from-rose-400",
    to: "to-pink-500",
    light: "bg-rose-50 dark:bg-rose-900/20",
    text: "text-rose-600 dark:text-rose-400",
  },
  motivated: {
    from: "from-cyan-400",
    to: "to-sky-500",
    light: "bg-cyan-50 dark:bg-cyan-900/20",
    text: "text-cyan-600 dark:text-cyan-400",
  },
};

const DEFAULT_TONE = {
  from: "from-indigo-400",
  to: "to-violet-500",
  light: "bg-indigo-50 dark:bg-indigo-900/20",
  text: "text-indigo-600 dark:text-indigo-400",
};

function getTone(emotionalTone) {
  return TONE_COLORS[emotionalTone?.toLowerCase()] || DEFAULT_TONE;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-[#1a1d24] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
      <div className="h-48 bg-gray-100 dark:bg-gray-800" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-1/3" />
        <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-full w-4/5" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-full" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-2/3" />
        <div className="flex gap-2 pt-2">
          <div className="h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-800" />
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-24 self-center" />
        </div>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function LessonCard({lesson, user}) {
  const isPremium = lesson.accessLevel === "premium";
  const isLocked = isPremium && (!user || !user.isPremium);
  const id = lesson._id?.toString();
  const creatorName = lesson.creatorName || lesson.authorName || "Anonymous";

  return (
    <motion.div
      variants={{
        hidden: {opacity: 0, y: 36},
        visible: {
          opacity: 1,
          y: 0,
          transition: {duration: 0.01, ease: [0.22, 1, 0.36, 1]},
        },
      }}
      whileHover={{y: -6}}
      className="group bg-white dark:bg-[#1a1d24] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* ── Image ── */}
      <div className="relative h-48 overflow-hidden shrink-0">
        {lesson.image ? (
          <Image
            src={lesson.image}
            alt={lesson.title}
            fill
            className={`object-cover transition-all duration-500 ${
              isLocked ? "blur-md scale-110" : "group-hover:scale-105"
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-white/40" />
          </div>
        )}

        {/* Lock overlay */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white px-4 text-center">
            <Lock className="w-8 h-8 mb-2" />
            <p className="text-sm font-semibold">Premium Content</p>
            <p className="text-xs opacity-80">Upgrade to unlock full lesson</p>
          </div>
        )}

        {/* Top-left: featured */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/90 backdrop-blur-sm text-xs font-bold text-white shadow-md">
            <Star className="w-3 h-3 fill-white" />
            Featured
          </span>
        </div>

        {/* Top-right: emotional tone */}
        {lesson.emotionalTone && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur capitalize">
            {lesson.emotionalTone}
          </div>
        )}

        {/* Bottom-left: category */}
        {lesson.category && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs bg-black/50 text-white backdrop-blur">
            {lesson.category}
          </div>
        )}

        {/* Netflix-style fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* ── Body ── */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 line-clamp-2">
          {lesson.title}
        </h3>

        <p
          className={`text-sm mt-2 text-gray-500 dark:text-gray-400 line-clamp-2 transition ${isLocked ? "blur-sm" : ""}`}
        >
          {lesson.description || ""}
        </p>

        {/* Creator */}
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <img
            src={lesson.creatorPhoto || API_AVATAR(creatorName)}
            alt={creatorName}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span>{creatorName}</span>
          {lesson.creatorIsPremium && (
            <span className="text-[10px] text-amber-500 font-medium ml-1">
              ✦ Premium User
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            {lesson.likesCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5" />
            {lesson.favoritesCount || 0}
          </span>
        </div>

        <div className="flex-1" />

        {/* Action */}
        <div className="mt-4 flex items-center justify-between">
          {isLocked ? (
            <>
              <Link
                href={user ? "/pricing" : "/auth/signin"}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:opacity-90 transition"
              >
                🔒 Unlock Premium
              </Link>
              <span className="text-xs text-yellow-500 font-medium">
                Preview Locked
              </span>
            </>
          ) : (
            <Link
              href={`/lessons/${id}`}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-violet-500 text-white hover:opacity-90 transition"
            >
              See Details →
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({page, totalPages, onChange}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({length: totalPages}, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Prev */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d24] text-gray-500 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold transition-all
            ${
              p === page
                ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/40 border-transparent"
                : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d24] text-gray-600 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d24] text-gray-500 dark:text-gray-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Featuredlessons({user}) {
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API}/api/lessons?perPage=500`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const all = Array.isArray(data.lessons) ? data.lessons : [];
        setAllLessons(all.filter((l) => l.featured === true));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const totalPages = Math.ceil(allLessons.length / PER_PAGE);
  const currentSlice = allLessons.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handlePageChange = useCallback((p) => {
    setPage(p);
    // Smooth scroll back to section top
    document
      .getElementById("featured-lessons")
      ?.scrollIntoView({behavior: "smooth", block: "start"});
  }, []);

  if (!loading && allLessons.length === 0) return null;

  return (
    <section
      id="featured-lessons"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15"
    >
      {/* Header */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
        transition={{duration: 0.6}}
        className="text-center mb-14"
      >
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800">
          <Sparkles className="w-3.5 h-3.5" />
          Editor&apos;s Picks
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Featured{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
            Life Lessons
          </span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base">
          Hand-picked by our moderators — stories and insights worth reading
          right now.
        </p>
      </motion.div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({length: PER_PAGE}).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            variants={{
              hidden: {},
              visible: {transition: {staggerChildren: 0.08}},
            }}
            initial="hidden"
            animate="visible"
            exit={{opacity: 0, y: -10, transition: {duration: 0.2}}}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {currentSlice.map((lesson, i) => (
              <LessonCard
                key={lesson._id?.toString() || i}
                lesson={lesson}
                user={user}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination + meta */}
      {!loading && allLessons.length > 0 && (
        <div className="flex flex-col items-center gap-4 mt-10">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-600 dark:text-gray-300">
              {(page - 1) * PER_PAGE + 1}–
              {Math.min(page * PER_PAGE, allLessons.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-600 dark:text-gray-300">
              {allLessons.length}
            </span>{" "}
            featured lessons
          </p>

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />

          {/* Explore all CTA */}
          <motion.div
            initial={{opacity: 0, y: 10}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{delay: 0.2}}
            className="mt-4"
          >
            <Link
              href="/lessons"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Explore all lessons
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      )}
    </section>
  );
}
