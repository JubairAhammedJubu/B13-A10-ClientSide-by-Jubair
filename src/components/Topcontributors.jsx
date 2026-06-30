"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {motion} from "motion/react";
import {
  Trophy,
  BookOpen,
  Crown,
  Sparkles,
  TrendingUp,
  Medal,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Rank config ──────────────────────────────────────────────────────────────

const RANK = [
  {
    pos: 1,
    icon: Trophy,
    gradient: "from-amber-400 to-yellow-500",
    ring: "ring-amber-400/60",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-cyan-200 dark:border-amber-800/50",
    shadow: "shadow-amber-200/60 dark:shadow-amber-900/40",
    size: "w-24 h-24",
    label: "🥇",
  },
  {
    pos: 2,
    icon: Medal,
    gradient: "from-slate-300 to-slate-400",
    ring: "ring-slate-300/60",
    bg: "bg-slate-50 dark:bg-slate-800/40",
    text: "text-slate-600 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700/50",
    shadow: "shadow-slate-200/60 dark:shadow-slate-900/40",
    size: "w-20 h-20",
    label: "🥈",
  },
  {
    pos: 3,
    icon: Medal,
    gradient: "from-orange-300 to-amber-500",
    ring: "ring-orange-400/60",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-200 dark:border-orange-800/50",
    shadow: "shadow-orange-200/60 dark:shadow-orange-900/40",
    size: "w-20 h-20",
    label: "🥉",
  },
];

const getRank = (i) => RANK[i] || null;

// ─── Avatar ───────────────────────────────────────────────────────────────────

function Avatar({photo, name, size = "w-14 h-14", ring = ""}) {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "?")}&background=6366F1&color=fff&bold=true`;
  return (
    <div
      className={`${size} rounded-full overflow-hidden ring-2 ${ring || "ring-indigo-300/50"} shrink-0`}
    >
      <Image
        src={photo || fallback}
        alt={name || "contributor"}
        width={96}
        height={96}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = fallback;
        }}
      />
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonPodium() {
  return (
    <div className="flex items-end justify-center gap-4 mb-10">
      {[20, 28, 20].map((h, i) => (
        <div
          key={i}
          className={`flex flex-col items-center gap-3`}
          style={{paddingBottom: i === 1 ? 0 : 24}}
        >
          <div
            className={`${i === 1 ? "w-24 h-24" : "w-20 h-20"} rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse`}
          />
          <div className="w-20 h-3 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
          <div
            className={`w-full ${i === 1 ? "h-28" : "h-20"} rounded-t-2xl bg-gray-100 dark:bg-gray-800 animate-pulse`}
            style={{width: 96}}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Podium (top 3) ───────────────────────────────────────────────────────────

function Podium({top3}) {
  // Straight 1 → 2 → 3 order, tallest bar for #1
  const heightMap = {0: "h-36", 1: "h-24", 2: "h-20"};

  return (
    <div className="flex items-end justify-center gap-3 sm:gap-6 mb-12">
      {top3.map((c, idx) => {
        const rank = getRank(idx);
        if (!c || !rank) return null;
        const isFirst = idx === 0;

        return (
          <motion.div
            key={c.creatorEmail}
            initial={{opacity: 0, y: 40}}
            animate={{opacity: 1, y: 0}}
            transition={{
              delay: 0.1 + idx * 0.1,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col items-center gap-2"
          >
            {/* Avatar + badges */}
            <div className="relative">
              <Avatar
                photo={c.creatorPhoto}
                name={c.creatorName}
                size={rank.size}
                ring={rank.ring}
              />
              {/* Rank emoji */}
              <span className="absolute -top-5 right-7 text-2xl leading-none">
                {rank.label}
              </span>
              {/* Premium crown */}
              {c.isPremium && (
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-md">
                  <Crown className="w-3 h-3 text-white" />
                </span>
              )}
            </div>

            {/* Name + count */}
            <div className="text-center">
              <p
                className={`font-bold truncate max-w-[88px] ${isFirst ? "text-sm text-gray-900 dark:text-gray-100" : "text-xs text-gray-700 dark:text-gray-300"}`}
              >
                {c.creatorName?.split(" ")[0]}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">
                {c.count} lessons
              </p>
            </div>

            {/* Podium block */}
            <div
              className={`w-20 sm:w-24 ${heightMap[idx]} rounded-t-2xl flex items-start justify-center pt-3
                bg-gradient-to-b ${rank.gradient} shadow-lg ${rank.shadow}`}
            >
              <span className="text-white font-black text-xl">#{idx + 1}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function TopContributors() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLessons, setTotalLessons] = useState(0);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await fetch(`${API}/api/lessons?perPage=500`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const all = Array.isArray(data.lessons) ? data.lessons : [];

        // Filter: last 7 days
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7);

        const weekly = all.filter((l) => new Date(l.createdAt) >= cutoff);
        setTotalLessons(weekly.length);

        // Group by creator email
        const map = {};
        weekly.forEach((l) => {
          const key = l.creatorEmail;
          if (!key) return;
          if (!map[key]) {
            map[key] = {
              creatorName: l.creatorName || "Anonymous",
              creatorEmail: l.creatorEmail || "",
              creatorPhoto: l.creatorPhoto || "",
              isPremium: l.creatorIsPremium || false,
              count: 0,
            };
          }
          map[key].count++;
          if (l.creatorIsPremium) map[key].isPremium = true;
        });

        const sorted = Object.values(map)
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);

        // Enrich with fresh user data (photo + isPremium) from user collection
        const emails = sorted.map((c) => c.creatorEmail).filter(Boolean);
        if (emails.length > 0) {
          try {
            const profilesRes = await fetch(`${API}/api/users/profiles`, {
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({emails}),
            });
            if (profilesRes.ok) {
              const profiles = await profilesRes.json();
              const profileMap = {};
              profiles.forEach((p) => {
                profileMap[p.email] = p;
              });
              sorted.forEach((c) => {
                const p = profileMap[c.creatorEmail];
                if (p) {
                  // prefer user collection image over lesson-stored photo
                  if (p.image) c.creatorPhoto = p.image;
                  if (p.isPremium) c.isPremium = true;
                  if (p.name) c.creatorName = p.name;
                }
              });
            }
          } catch (_) {
          }
        }

        setContributors(sorted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContributors();
  }, []);

  if (!loading && contributors.length === 0) return null;

  const top3 = contributors.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15">
      {/* ── Header ── */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        whileInView={{opacity: 1, y: 0}}
        viewport={{once: true}}
        transition={{duration: 0.6}}
        className="text-center mb-14"
      >
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
          <TrendingUp className="w-3.5 h-3.5" />
          This Week&apos;s Leaderboard
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Top{" "}
          <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
            Contributors
          </span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base">
          The most active lesson creators this week — sharing wisdom that moves
          the community forward.
        </p>

        {/* Weekly summary pill */}
        {!loading && (
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            animate={{opacity: 1, scale: 1}}
            transition={{delay: 0.3}}
            className="inline-flex items-center gap-2 mt-5 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-cyan-400/10 border border-indigo-200 dark:border-indigo-800/50 text-sm font-medium text-indigo-700 dark:text-indigo-300"
          >
            <Sparkles className="w-4 h-4" />
            {totalLessons} lessons published this week by {contributors.length}{" "}
            contributors
          </motion.div>
        )}
      </motion.div>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto">
        {/* Podium */}
        {loading ? (
          <SkeletonPodium />
        ) : top3.length > 0 ? (
          <Podium top3={top3} />
        ) : null}

        {/* Empty */}
        {!loading && contributors.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400 dark:text-gray-500 text-sm">
              No lessons published this week yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
