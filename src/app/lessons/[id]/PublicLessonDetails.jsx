'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Heart, Bookmark, Flag, ChevronLeft, Lock, Sparkles,
    User as UserIcon, Calendar, Tag, Smile, Eye, Clock,
    Share2, Send, RefreshCcw,
} from 'lucide-react';
import { Link2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

const TONE_STYLES = {
    motivational: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400' },
    gratitude: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400' },
    realization: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-600 dark:text-indigo-400' },
    sad: { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-600 dark:text-rose-400' },
};

const REPORT_REASONS = [
    'Spam or misleading',
    'Hate speech or harassment',
    'Inappropriate content',
    'Plagiarized content',
    'False information',
    'Other',
];

function getToneStyle(tone) {
    return TONE_STYLES[tone?.toLowerCase()] || TONE_STYLES.realization;
}

function formatCount(n) {
    if (!n) return '0';
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return `${n}`;
}

function formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });
}

function estimateReadingTime(text) {
    if (!text) return 1;
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
}

// Report Modal
function ReportModal({ onClose, onSubmit }) {
    const [reason, setReason] = useState(REPORT_REASONS[0]);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        setSubmitting(true);
        await onSubmit(reason);
        setSubmitting(false);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-sm bg-white dark:bg-[#1a1d24] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 p-5"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <Flag className="w-4 h-4 text-red-500" /> Report this lesson
                </h3>
                <label className="text-sm text-gray-500 dark:text-gray-400 mb-1.5 block">
                    Reason
                </label>
                <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full mb-4 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200"
                >
                    {REPORT_REASONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default function PublicLessonDetails({ lesson, user, canAccess }) {
    const router = useRouter();

    const [liked, setLiked] = useState(lesson.likes?.includes(user?.id) || false);
    const [likesCount, setLikesCount] = useState(lesson.likesCount || 0);
    const [saved, setSaved] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showShare, setShowShare] = useState(false);

    // ✅ FIX: Better author lesson count state management
    const [authorLessonCount, setAuthorLessonCount] = useState(0);
    const [authorLessonLoading, setAuthorLessonLoading] = useState(true);
    const [authorLessonError, setAuthorLessonError] = useState(null);

    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [postingComment, setPostingComment] = useState(false);
    const [favoritesCount, setFavoritesCount] = useState(lesson.favoritesCount || 0);

    const [related, setRelated] = useState([]);

    // Static-per-load view count, per spec
    // eslint-disable-next-line react-hooks/purity
    const viewsCount = useMemo(() => Math.floor(Math.random() * 10000), []);

    const tone = getToneStyle(lesson.emotionalTone);
    const readingTime = estimateReadingTime(lesson.description);
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const getToken = async () => {
        const session = await authClient.getSession();
        return session?.data?.session?.token;
    };

    
    useEffect(() => {
        if (!lesson.creatorEmail) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAuthorLessonCount(0);
            setAuthorLessonLoading(false);
            return;
        }

        setAuthorLessonLoading(true);
        setAuthorLessonError(null);

        const fetchAuthorLessons = async () => {
            try {
                const encodedEmail = encodeURIComponent(lesson.creatorEmail);
                const url = `${process.env.NEXT_PUBLIC_API_URL}/api/lessons/by-creator/${encodedEmail}`;
                
                console.log('📚 Fetching author lessons from:', url);

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log('📊 Response status:', response.status);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                console.log('✅ Author lessons data:', data);

                const count = Array.isArray(data) ? data.length : 0;
                setAuthorLessonCount(count);
                setAuthorLessonError(null);
            } catch (error) {
                console.error('❌ Author lessons fetch failed:', error.message);
                setAuthorLessonError(error.message);
                setAuthorLessonCount(0);
            } finally {
                setAuthorLessonLoading(false);
            }
        };

        fetchAuthorLessons();
    }, [lesson.creatorEmail]);

    // Related lessons
    useEffect(() => {
        if (!lesson._id) return;
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${lesson._id}/related`)
            .then((res) => res.json())
            .then((data) => setRelated(Array.isArray(data) ? data.slice(0, 6) : []))
            .catch(() => setRelated([]));
    }, [lesson._id]);

    // Comments
    useEffect(() => {
        if (!lesson._id) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCommentsLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${lesson._id}/comments`)
            .then((res) => res.json())
            .then((data) => setComments(Array.isArray(data) ? data : []))
            .catch(() => setComments([]))
            .finally(() => setCommentsLoading(false));
    }, [lesson._id]);

    const handleLike = async () => {
        if (!user) {
            toast.error('Please log in to like');
            router.push("/auth/signin");
            return;
        }
        if (isLiking) return;
        setIsLiking(true);

        const nextLiked = !liked;
        setLiked(nextLiked);
        setLikesCount((c) => c + (nextLiked ? 1 : -1));

        try {
            const token = await getToken();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${lesson._id}/like`,
                { method: 'PATCH', headers: { authorization: `Bearer ${token}` } },
            );
            const data = await res.json();
            setLiked(data.liked);
            setLikesCount(data.likesCount);
        } catch (err) {
            console.error(err);
            setLiked(!nextLiked);
            setLikesCount((c) => c + (nextLiked ? -1 : 1));
            toast.error('Something went wrong');
        } finally {
            setIsLiking(false);
        }
    };

    const handleSave = async () => {
      if (!user) {
        toast.error("Please log in to save lessons");
        router.push("/auth/signin");
        return;
      }

      const nextSaved = !saved;
      setSaved(nextSaved);
      setFavoritesCount((c) => c + (nextSaved ? 1 : -1)); // ✅ এটা যোগ করো

      try {
        const token = await getToken();
        const method = nextSaved ? "POST" : "DELETE";
        const url = nextSaved
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/favorites`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/favorites/${lesson._id}`;

        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body:
            method === "POST"
              ? JSON.stringify({lessonId: lesson._id})
              : undefined,
        });

        const data = await res.json();
        if (!res.ok) throw new Error("Request failed");

        // Already saved ছিল — count rollback
        if (data.message === "Already saved") {
          setSaved(true);
          setFavoritesCount((c) => c - 1);
          return;
        }

        toast.success(
          nextSaved ? "Saved to favorites" : "Removed from favorites",
        );
      } catch (err) {
        console.error(err);
        setSaved(!nextSaved);
        setFavoritesCount((c) => c + (nextSaved ? -1 : 1)); // rollback
        toast.error("Something went wrong");
      }
    };

    const handleReportSubmit = async (reason) => {
        if (!user) {
            toast.error('Please log in to report');
            setShowReport(false);
            router.push("/auth/signin");
            return;
        }
        try {
            const token = await getToken();
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ lessonId: lesson._id, reason }),
            });
            toast.success('Report submitted. Thank you.');
            setShowReport(false);
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong');
        }
    };

    const handlePostComment = async () => {
        if (!user) {
            toast.error('Please log in to comment');
            router.push("/auth/signin");
            return;
        }
        if (!commentText.trim()) return;

        setPostingComment(true);
        try {
            const token = await getToken();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${lesson._id}/comments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ text: commentText }),
                },
            );
            const data = await res.json();
            if (data.success) {
                setComments((c) => [data.comment, ...c]);
                setCommentText('');
            } else {
                toast.error(data.message || 'Could not post comment');
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong');
        } finally {
            setPostingComment(false);
        }
    };

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden bg-gray-200 dark:bg-gray-800">
          {lesson.image ? (
            <Image
              src={lesson.image}
              alt={lesson.title}
              fill
              className="object-cover"
              priority
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0f1117] via-black/20 to-black/10" />

          <Link
            href="/lessons"
            className="absolute top-20 left-4 sm:left-8 flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white text-sm font-medium hover:bg-black/50 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>

          {lesson.emotionalTone && (
            <div
              className={`absolute top-20 right-4 sm:right-8 flex items-center gap-2 px-3 py-1.5 rounded-full ${tone.bg} border border-white/20 backdrop-blur-md`}
            >
              <Smile className={`w-4 h-4 ${tone.text}`} />
              <span className={`text-sm font-semibold capitalize ${tone.text}`}>
                {lesson.emotionalTone}
              </span>
            </div>
          )}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 pb-16 relative z-10 space-y-6">
          {/* 1. Lesson Information */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="bg-white dark:bg-[#1a1d24] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                {lesson.title}
              </h1>
              {lesson.accessLevel === "premium" && (
                <span className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Premium
                </span>
              )}
            </div>

            {lesson.category && (
              <div className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                <Tag className="w-3.5 h-3.5" />
                <span className="capitalize">{lesson.category}</span>
              </div>
            )}

            {canAccess ? (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {lesson.description}
              </p>
            ) : (
              <div className="relative">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4 select-none blur-sm">
                  {lesson.description ||
                    "This is a premium lesson with deep insight, written from real lived experience."}
                </p>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-t from-white dark:from-[#1a1d24] via-white/90 dark:via-[#1a1d24]/90 to-transparent">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    This lesson is for premium members
                  </p>
                  <Link
                    href="/pricing"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-bold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all"
                  >
                    Upgrade to Premium
                  </Link>
                </div>
              </div>
            )}
          </motion.div>

          {/* 2. Lesson Metadata */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.05}}
            className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <div>
                  <p className="text-xs text-gray-400">Created</p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {formatDate(lesson.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCcw className="w-4 h-4 text-indigo-500" />
                <div>
                  <p className="text-xs text-gray-400">Last Updated</p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {formatDate(lesson.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-500" />
                <div>
                  <p className="text-xs text-gray-400">Visibility</p>
                  <p className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                    {lesson.visibility || "public"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <div>
                  <p className="text-xs text-gray-400">Reading Time</p>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {readingTime} min
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 3. Author Section - FIXED */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.1}}
            className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 relative">
              {lesson.creatorPhoto ? (
                <Image
                  src={lesson.creatorPhoto}
                  alt={lesson.creatorName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-gray-900 dark:text-gray-100">
                  {lesson.creatorName || "Anonymous"}
                </p>
                {/* ✅ Add this badge */}
                {lesson.creatorIsPremium && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                    <Sparkles className="w-3 h-3" />
                    Premium
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">
                {authorLessonCount} lesson{authorLessonCount === 1 ? "" : "s"}{" "}
                created
              </p>
            </div>
          </motion.div>

          {/* 4 & 5. Stats + Interaction Buttons */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.15}}
            className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-6 mb-5 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-400" />{" "}
                {formatCount(likesCount)} Likes
              </span>
              <span className="flex items-center gap-1.5">
                <Bookmark className="w-4 h-4 text-indigo-400" />{" "}
                {formatCount(favoritesCount)} Favorites
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-gray-400" />{" "}
                {formatCount(viewsCount)} Views
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  liked
                    ? "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400"
                    : "bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-rose-300"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${liked ? "fill-rose-500 text-rose-500" : ""}`}
                />
                {liked ? "Liked" : "Like"}
              </button>

              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  saved
                    ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400"
                    : "bg-gray-50 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-300"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${saved ? "fill-indigo-500 text-indigo-500" : ""}`}
                />
                {saved ? "Saved" : "Save"}
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShare((s) => !s)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-indigo-300 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                {showShare && (
                  <div className="absolute top-full mt-2 left-0 flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 shadow-lg z-10">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on Facebook"
                      className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold hover:opacity-90"
                    >
                      f
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(lesson.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on X / Twitter"
                      className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold hover:opacity-90"
                    >
                      X
                    </a>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(`${lesson.title} ${shareUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on WhatsApp"
                      className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold hover:opacity-90"
                    >
                      W
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Share on LinkedIn"
                      className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold hover:opacity-90"
                    >
                      in
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        toast.success("Link copied");
                      }}
                      title="Copy link"
                      className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:opacity-90"
                    >
                      <Link2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (!user) {
                    toast.error("Please log in to report");
                    router.push("/auth/signin");
                    return;
                  }
                  setShowReport(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-sm font-medium text-gray-500 dark:text-gray-400 hover:border-red-300 hover:text-red-500 transition-all ml-auto"
              >
                <Flag className="w-4 h-4" />
                Report
              </button>
            </div>
          </motion.div>

          {/* 6. Comments */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.2}}
            className="bg-white dark:bg-[#1a1d24] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              Comments ({comments.length})
            </h2>

            <div className="flex items-start gap-3 mb-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  user ? "Share your thoughts..." : "Log in to comment"
                }
                disabled={!user}
                rows={2}
                className="flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 resize-none disabled:opacity-60"
              />
              <button
                onClick={handlePostComment}
                disabled={!user || postingComment || !commentText.trim()}
                className="px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {commentsLoading ? (
              <p className="text-sm text-gray-400">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-gray-400">
                No comments yet. Be the first to share your thoughts.
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c._id} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 relative">
                      {c.userPhoto ? (
                        <Image
                          src={c.userPhoto}
                          alt={c.userName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                          {c.userName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(c.createdAt)}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* 7. Similar & Recommended Lessons */}
          {related.length > 0 && (
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.25}}
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                Similar Lessons
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link
                    key={r._id}
                    href={`/lessons/${r._id}`}
                    className="group bg-white dark:bg-[#1a1d24] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="relative h-32 bg-gray-100 dark:bg-gray-800">
                      {r.image && (
                        <Image
                          src={r.image}
                          alt={r.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 line-clamp-1">
                        {r.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 capitalize">
                        {r.category} · {r.emotionalTone}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {showReport && (
          <ReportModal
            onClose={() => setShowReport(false)}
            onSubmit={handleReportSubmit}
          />
        )}
      </div>
    );
}