"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {motion} from "motion/react";
import {Heart, BookOpen, Lock, Star, ArrowRight, Loader2} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const API_AVATAR = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f59e0b&color=fff`;

const TOP3_CONFIG = [
  {
    rank: 1,
    emoji: "🥇",
    label: "Most Saved",
    gradient: "from-cyan-400 to-indigo-500",
    bgGradient: "bg-gradient-to-br from-gray-300 to-teal-300",
    shadow: "shadow-teal-400/50",
    border: "border-teal-300 dark:border-teal-700",
    ring: "ring-2 ring-teal-400/60",
    scale: "lg:scale-105 lg:z-10",
    btnGradient: "from-teal-300 to-gray-800",
  },
  {
    rank: 2,
    emoji: "🥈",
    label: "2nd Place",
    bgGradient: "bg-gradient-to-br from-slate-300 to-slate-500",
    shadow: "shadow-slate-400/40",
    border: "border-slate-200 dark:border-slate-700",
    ring: "ring-2 ring-slate-300/60",
    scale: "",
    btnGradient: "from-slate-400 to-slate-600",
    watermark: "from-slate-300 to-slate-500",
  },
  {
    rank: 3,
    emoji: "🥉",
    label: "3rd Place",
    bgGradient: "bg-gradient-to-br from-orange-300 to-amber-600",
    shadow: "shadow-orange-400/40",
    border: "border-orange-200 dark:border-orange-900",
    ring: "ring-2 ring-orange-300/60",
    scale: "",
    btnGradient: "from-orange-400 to-amber-600",
    watermark: "from-orange-300 to-amber-600",
  },
];

// Rank 4-6 — smaller horizontal row cards
const ROW_CONFIG = [
  {
    rank: 4,
    emoji: "4️⃣",
    label: "#4",
    color: "text-indigo-500 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    border: "border-indigo-100 dark:border-indigo-800",
    btnColor:
      "text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20",
  },
  {
    rank: 5,
    emoji: "5️⃣",
    label: "#5",
    color: "text-violet-500 dark:text-violet-400",
    bg: "bg-violet-50 dark:bg-violet-900/20",
    border: "border-violet-100 dark:border-violet-800",
    btnColor:
      "text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800 hover:bg-violet-50 dark:hover:bg-violet-900/20",
  },
  {
    rank: 6,
    emoji: "6️⃣",
    label: "#6",
    color: "text-rose-500 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-900/20",
    border: "border-rose-100 dark:border-rose-800",
    btnColor:
      "text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-900/20",
  },
];

// ── Top 3 Large Card ──────────────────────────────────────────────────────────
function TopCard({lesson, rankConfig, index, user}) {
  const isPremium = lesson.accessLevel === "premium";
  const isLocked = isPremium && (!user || !user.isPremium);
  const creatorName = lesson.creatorName || lesson.authorName || "Anonymous";
  const id = lesson._id?.toString();

  return (
    <motion.div
      initial={{opacity: 0, y: 40}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{y: -6, transition: {duration: 0.3}}}
      className={`group relative bg-white dark:bg-[#1a1d24] rounded-2xl overflow-visible
                border ${rankConfig.border}
                shadow-lg ${rankConfig.shadow}
                hover:shadow-2xl transition-all duration-500
                flex flex-col ${rankConfig.scale}`}
    >
      {/* Circular Rank Badge — upper middle, outside card */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <div
          className={`w-12 h-12 rounded-full ${rankConfig.bgGradient} shadow-lg ${rankConfig.shadow}
                    flex items-center justify-center border-4 border-white dark:border-[#0f1117]`}
        >
          <span className="text-xl leading-none">{rankConfig.emoji}</span>
        </div>
        <div
          className={`mt-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r ${rankConfig.btnGradient} text-white text-[10px] font-bold whitespace-nowrap shadow-md`}
        >
          {rankConfig.label}
        </div>
      </div>

      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-2xl shrink-0 mt-6">
        {lesson.image ? (
          <Image
            src={lesson.image}
            alt={lesson.title}
            fill
            className={`object-cover transition-all duration-700 ${
              isLocked ? "blur-md scale-110" : "group-hover:scale-105"
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white/30" />
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {isPremium && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-semibold z-10">
            <Lock className="w-3 h-3" /> Premium
          </div>
        )}

        {lesson.category && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-xs bg-black/50 text-white backdrop-blur-sm z-10">
            {lesson.category}
          </div>
        )}

        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/90 backdrop-blur-sm text-white text-xs font-bold">
          <Heart className="w-3 h-3 fill-white" />
          {lesson.favoritesCount || 0}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 relative overflow-hidden">
        {/* Watermark */}
        <div
          className={`absolute -bottom-4 -right-2 text-[80px] font-black opacity-[0.04] bg-gradient-to-b ${rankConfig.watermark} bg-clip-text text-transparent select-none pointer-events-none`}
        >
          {rankConfig.rank}
        </div>

        <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
          {lesson.title}
        </h3>

        <p
          className={`text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 ${isLocked ? "blur-sm select-none" : ""}`}
        >
          {lesson.description || ""}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <img
            src={lesson.creatorPhoto || API_AVATAR(creatorName)}
            alt={creatorName}
            className={`w-6 h-6 rounded-full object-cover ${rankConfig.ring}`}
          />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
            {creatorName}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-400" />
            {lesson.likesCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {lesson.favoritesCount || 0} saves
          </span>
        </div>

        {isLocked ? (
          <Link
            href={user ? "/pricing" : "/auth/signin"}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:opacity-90 transition-all shadow-md"
          >
            🔒 Unlock Premium
          </Link>
        ) : (
          <Link
            href={`/lessons/${id}`}
            className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r ${rankConfig.btnGradient} shadow-md hover:opacity-90 transition-all`}
          >
            Read Lesson <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}

// ── Row Card (rank 4-6) ───────────────────────────────────────────────────────
function RowCard({lesson, rankConfig, index, user}) {
  const isPremium = lesson.accessLevel === "premium";
  const isLocked = isPremium && (!user || !user.isPremium);
  const creatorName = lesson.creatorName || lesson.authorName || "Anonymous";
  const id = lesson._id?.toString();

  return (
    <motion.div
      initial={{opacity: 0, x: -20}}
      whileInView={{opacity: 1, x: 0}}
      viewport={{once: true}}
      transition={{
        duration: 0.45,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{x: 4, transition: {duration: 0.2}}}
      className={`group flex items-center gap-4 bg-white dark:bg-[#1a1d24] rounded-2xl
                border ${rankConfig.border} shadow-sm hover:shadow-md
                transition-all duration-300 p-3 overflow-hidden`}
    >
      {/* Rank badge — left side */}
      <div
        className={`w-10 h-10 rounded-xl ${rankConfig.bg} flex items-center justify-center flex-shrink-0 border ${rankConfig.border}`}
      >
        <span className={`text-sm font-black ${rankConfig.color}`}>
          #{rankConfig.rank}
        </span>
      </div>

      {/* Thumbnail */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
        {lesson.image ? (
          <Image
            src={lesson.image}
            alt={lesson.title}
            fill
            className={`object-cover transition-all duration-500 ${
              isLocked ? "blur-sm scale-110" : "group-hover:scale-105"
            }`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white/50" />
          </div>
        )}
        {isLocked && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Lock className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
          {lesson.title}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          {lesson.category && (
            <span className="text-xs text-gray-400">{lesson.category}</span>
          )}
          {lesson.emotionalTone && (
            <span className="text-xs text-gray-400 capitalize">
              · {lesson.emotionalTone}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <span className="flex items-center gap-0.5">
            <Heart className="w-3 h-3 text-rose-400" />
            {lesson.likesCount || 0}
          </span>
          <span className="flex items-center gap-0.5 font-semibold text-gray-600 dark:text-gray-300">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            {lesson.favoritesCount || 0} saves
          </span>
        </div>
      </div>

      {/* CTA */}
      {isLocked ? (
        <Link
          href={user ? "/pricing" : "/auth/signin"}
          className="flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:opacity-90 transition-all"
        >
          🔒
        </Link>
      ) : (
        <Link
          href={`/lessons/${id}`}
          className={`flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${rankConfig.btnColor}`}
        >
          Read <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function MostSavedLessons({user}) {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMostSaved = async () => {
      try {
        const res = await fetch(
          `${API}/api/lessons?perPage=500&sort=most_saved`,
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const all = Array.isArray(data.lessons) ? data.lessons : [];
        const top6 = [...all]
          .sort((a, b) => (b.favoritesCount || 0) - (a.favoritesCount || 0))
          .slice(0, 6);
        setLessons(top6);
      } catch (err) {
        console.error("Failed to fetch most saved lessons:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMostSaved();
  }, []);

  if (!isLoading && lessons.length === 0) return null;

  const top3 = lessons.slice(0, 3);
  const next3 = lessons.slice(3, 6);

  return (
    <section className="relative py-15 overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/8 dark:bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/8 dark:bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800">
            <Heart className="w-3.5 h-3.5 fill-current" />
            Community Favourites
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Most{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Saved Lessons
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
            The lessons our community saves the most — ranked by real saves from
            real readers.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Top 3 — large cards with circular rank badge */}
            {top3.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pt-6">
                {top3.map((lesson, index) => (
                  <TopCard
                    key={lesson._id?.toString() || index}
                    lesson={lesson}
                    rankConfig={TOP3_CONFIG[index]}
                    index={index}
                    user={user}
                  />
                ))}
              </div>
            )}

            {/* Divider */}
            {next3.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1d24]">
                  Also trending
                </span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
              </div>
            )}

            {/* Rank 4-6 — horizontal row cards */}
            {next3.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {next3.map((lesson, index) => (
                  <RowCard
                    key={lesson._id?.toString() || index}
                    lesson={lesson}
                    rankConfig={ROW_CONFIG[index]}
                    index={index}
                    user={user}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* View all CTA */}
        {!isLoading && lessons.length > 0 && (
          <motion.div
            initial={{opacity: 0, y: 10}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{delay: 0.4}}
            className="text-center mt-12"
          >
            <Link
              href="/lessons?sort=most_saved"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 text-sm font-medium transition-all"
            >
              Browse All Lessons
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
