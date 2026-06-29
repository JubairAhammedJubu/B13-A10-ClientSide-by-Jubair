"use client";

import {useState, useEffect} from "react";
import {motion} from "motion/react";
import Link from "next/link";
import {
  BookOpen,
  Heart,
  PenLine,
  Star,
  ArrowRight,
  Loader2,
  TrendingUp,
  Clock,
  Sparkles,
  Plus,
  Eye,
  Users,
  MessageCircle,
  Flag,
  Bookmark,
} from "lucide-react";
import {authClient, useSession} from "@/lib/auth-client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ── Reusable lesson row ──────────────────────────────────────────────────────
function LessonRow({lesson, accentColor = "amber"}) {
  const colors = {
    amber: {
      bg: "from-amber-400/20 to-orange-400/20",
      border: "border-amber-100 dark:border-amber-900/30",
      icon: "text-amber-500",
      hover: "hover:bg-amber-50/50 dark:hover:bg-amber-900/10",
      eyeHover: "hover:text-amber-500 hover:border-amber-300",
    },
    pink: {
      bg: "from-pink-400/20 to-rose-400/20",
      border: "border-pink-100 dark:border-pink-900/30",
      icon: "text-pink-500",
      hover: "hover:bg-pink-50/50 dark:hover:bg-pink-900/10",
      eyeHover: "hover:text-pink-500 hover:border-pink-300",
    },
  };
  const c = colors[accentColor] || colors.amber;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 ${c.hover} transition-colors group`}
    >
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}
      >
        <BookOpen className={`w-4 h-4 ${c.icon}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {lesson.title}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
          <Clock className="w-3 h-3" />
          <span>
            {new Date(lesson.createdAt).toLocaleDateString("en-BD", {
              day: "numeric",
              month: "short",
            })}
          </span>
          {lesson.likesCount > 0 && (
            <span className="flex items-center gap-0.5">
              <Heart className="w-3 h-3 fill-pink-400 text-pink-400" />
              {lesson.likesCount}
            </span>
          )}
          {lesson.accessLevel === "premium" && (
            <span className="flex items-center gap-0.5 text-violet-500">
              <Sparkles className="w-3 h-3" /> Premium
            </span>
          )}
          {lesson.featured && (
            <span className="flex items-center gap-0.5 text-yellow-500">
              <Star className="w-3 h-3 fill-yellow-400" /> Featured
            </span>
          )}
        </div>
      </div>
      <Link
        href={`/lessons/${lesson._id}`}
        className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 ${c.eyeHover} transition-all`}
      >
        <Eye className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function UserOverviewClient({user: serverUser}) {
  const {data: session} = useSession();
  const user = session?.user || serverUser;

  const [myLessons, setMyLessons] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [favoriteLessons, setFavoriteLessons] = useState([]);
  const [collectionStats, setCollectionStats] = useState(null);
  const [likedCount, setLikedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recent");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const s = await authClient.getSession();
      const token = s?.data?.session?.token;
      const userId = s?.data?.user?.id;

      if (!token || !userId) {
        setIsLoading(false);
        return;
      }

      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const headers = {authorization: `Bearer ${token}`};

      const [lessonsRes, favsRes, statsRes, likedRes] = await Promise.all([
        fetch(`${API}/api/lessons/user/${userId}`, {headers}),
        fetch(`${API}/api/favorites`, {headers}),
        fetch(`${API}/api/collection-stats`, {headers}),
        fetch(`${API}/api/user/liked-count`, {headers}),
      ]);

      const lessonsData = await lessonsRes.json();
      const favsData = await favsRes.json();
      const statsData = await statsRes.json();
      const likedData = await likedRes.json();

      const favsList = Array.isArray(favsData) ? favsData : [];

      // Remove duplicate favorites by lessonId
      const uniqueFavorites = [
        ...new Map(favsList.map((fav) => [fav.lessonId, fav])).values(),
      ];

      setMyLessons(Array.isArray(lessonsData) ? lessonsData : []);
      setFavorites(uniqueFavorites);
      setCollectionStats(statsData && !statsData.message ? statsData : null);
      setLikedCount(likedData.likedCount ?? 0);

      // Fetch unique lesson objects only
      if (uniqueFavorites.length > 0) {
        const lessonDetails = await Promise.all(
          uniqueFavorites.map((fav) =>
            fetch(`${API}/api/lessons/${fav.lessonId}`, {headers})
              .then((r) => r.json())
              .then((d) => d.lesson ?? null)
              .catch(() => null),
          ),
        );

        setFavoriteLessons(lessonDetails.filter(Boolean));
      } else {
        setFavoriteLessons([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  // Weekly contributions chart — last 7 days
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("en-US", {weekday: "short"});
    const dateStr = d.toISOString().split("T")[0];
    const count = myLessons.filter((l) => {
      const created = new Date(l.createdAt).toISOString().split("T")[0];
      return created === dateStr;
    }).length;
    return {day: label, lessons: count};
  });

  const recentLessons = [...myLessons]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const premiumCount = myLessons.filter(
    (l) => l.accessLevel === "premium",
  ).length;

  const uniqueFavoriteCount = new Set(favorites.map((fav) => fav.lessonId))
    .size;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 pt-8 max-w-6xl mx-auto space-y-6 mt-4">
      {/* ── Welcome Banner ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-2xl p-6 text-white"
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">
              Welcome back 👋
            </p>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-white/60 text-sm mt-1">
              {user?.isPremium
                ? "⭐ Premium member — share unlimited lessons"
                : "Free plan — upgrade to share premium lessons"}
            </p>
          </div>
          <Link
            href="/dashboard/user/add-lesson"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white text-sm font-semibold transition-all border border-white/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add New Lesson
          </Link>
        </div>
      </motion.div>

      {/* ── My Stats Grid ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.1}}
        className="grid grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {[
          {
            label: "My Lessons",
            value: myLessons.length,
            icon: BookOpen,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-900/20",
            border: "border-amber-100 dark:border-amber-800",
            href: "",
          },
          {
            label: "Saved Lessons",
            value: uniqueFavoriteCount,
            icon: Bookmark,
            color: "text-violet-600 dark:text-violet-400",
            bg: "bg-violet-50 dark:bg-violet-900/20",
            border: "border-violet-100 dark:border-violet-800",
            href: "",
          },
          {
            label: "Posts Liked",
            value: likedCount,
            icon: Heart,
            color: "text-pink-600 dark:text-pink-400",
            bg: "bg-pink-50 dark:bg-pink-900/20",
            border: "border-pink-100 dark:border-pink-800",
            href: "",
          },
        ].map((stat, i) => (
          <Link key={i} href={stat.href}>
            <div
              className={`bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border ${stat.border} shadow-sm hover:shadow-md transition-all cursor-pointer`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* ── Chart + Tabbed Lessons Panel ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Contributions Chart */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.2}}
          className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Weekly Contributions
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              Last 7 days
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={last7Days}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.2}
              />
              <XAxis dataKey="day" tick={{fontSize: 11, fill: "#9ca3af"}} />
              <YAxis
                tick={{fontSize: 11, fill: "#9ca3af"}}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#1a1d24",
                  border: "1px solid #374151",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                formatter={(value) => [
                  `${value} lesson${value !== 1 ? "s" : ""}`,
                  "Posted",
                ]}
              />
              <Area
                type="monotone"
                dataKey="lessons"
                stroke="#f59e0b"
                strokeWidth={2}
                fill="url(#userGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Tabbed: Recently Added / Favorite Posts */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.25}}
          className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                onClick={() => setActiveTab("recent")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "recent"
                    ? "bg-white dark:bg-[#1a1d24] text-amber-500 shadow-sm"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                Recently Added
              </button>
            </div>
          </div>

          {activeTab === "recent" ? (
            recentLessons.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[180px] gap-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                  <PenLine className="w-6 h-6 text-amber-400" />
                </div>
                <p className="text-sm text-gray-400">No lessons yet</p>
                <Link
                  href="/dashboard/user/add-lesson"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-semibold transition-all"
                >
                  Write your first lesson
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLessons.map((lesson) => (
                  <LessonRow
                    key={lesson._id}
                    lesson={lesson}
                    accentColor="amber"
                  />
                ))}
              </div>
            )
          ) : favoriteLessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[180px] gap-3">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <p className="text-sm text-gray-400">No saved lessons yet</p>
              <Link
                href="/lessons"
                className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white text-xs font-semibold transition-all"
              >
                Browse lessons
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {favoriteLessons.slice(0, 3).map((lesson) => (
                <LessonRow
                  key={lesson._id}
                  lesson={lesson}
                  accentColor="pink"
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Platform Overview ──────────────────────────────────────────────── */}
      {collectionStats && (
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: 0.28}}
          className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Platform Overview
            </h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              All-time totals
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              {
                label: "Total Users",
                value: collectionStats.users,
                icon: Users,
                color: "text-sky-600 dark:text-sky-400",
                bg: "bg-sky-50 dark:bg-sky-900/20",
                border: "border-sky-100 dark:border-sky-800",
              },
              {
                label: "Total Lessons",
                value: collectionStats.lessons,
                icon: BookOpen,
                color: "text-amber-600 dark:text-amber-400",
                bg: "bg-amber-50 dark:bg-amber-900/20",
                border: "border-amber-100 dark:border-amber-800",
              },
              {
                label: "Total Saves",
                value: collectionStats.favorites,
                icon: Bookmark,
                color: "text-rose-600 dark:text-rose-400",
                bg: "bg-rose-50 dark:bg-rose-900/20",
                border: "border-rose-100 dark:border-rose-800",
              },
              {
                label: "Total Comments",
                value: collectionStats.comments,
                icon: MessageCircle,
                color: "text-teal-600 dark:text-teal-400",
                bg: "bg-teal-50 dark:bg-teal-900/20",
                border: "border-teal-100 dark:border-teal-800",
              },
              {
                label: "Total Reports",
                value: collectionStats.reports,
                icon: Flag,
                color: "text-red-600 dark:text-red-400",
                bg: "bg-red-50 dark:bg-red-900/20",
                border: "border-red-100 dark:border-red-800",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`rounded-xl p-4 border ${stat.border} bg-gray-50 dark:bg-gray-800/40`}
              >
                <div
                  className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}
                >
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Quick Actions ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{delay: 0.3}}
        className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
          {[
            {
              label: "My Lessons",
              desc: "Manage your posts",
              icon: BookOpen,
              href: "/dashboard/user/my-lesson",
              color: "text-indigo-600 dark:text-indigo-400",
              bg: "bg-indigo-50 dark:bg-indigo-900/20",
              border:
                "border-indigo-100 dark:border-indigo-800 hover:border-indigo-300",
            },
            {
              label: "Saved Lessons",
              desc: "Your favorites",
              icon: Bookmark,
              href: "/dashboard/user/favorite",
              color: "text-rose-600 dark:text-rose-400",
              bg: "bg-rose-50 dark:bg-rose-900/20",
              border:
                "border-rose-100 dark:border-rose-800 hover:border-rose-300",
            },
          ].map((action, i) => (
            <Link key={i} href={action.href}>
              <div
                className={`flex flex-col gap-2 p-4 rounded-xl border ${action.border} bg-white dark:bg-[#1a1d24] hover:shadow-sm transition-all cursor-pointer`}
              >
                <div
                  className={`w-9 h-9 rounded-xl ${action.bg} flex items-center justify-center`}
                >
                  <action.icon className={`w-4 h-4 ${action.color}`} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${action.color}`}>
                    {action.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{action.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
