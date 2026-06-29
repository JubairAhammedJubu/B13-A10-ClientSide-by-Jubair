"use client";

import Link from "next/link";
import {motion, useAnimationControls} from "framer-motion";
import {ArrowLeft, BookOpen, Compass} from "lucide-react";
import {useEffect, useState} from "react";

const glitchVariants = {
  idle: {x: 0, y: 0, opacity: 1, skewX: 0},
  glitch: {
    x: [0, -4, 6, -2, 0],
    skewX: [0, -3, 2, -1, 0],
    opacity: [1, 0.7, 1, 0.85, 1],
    transition: {duration: 0.35, ease: "easeInOut"},
  },
};

function GlitchDigit({
  children,
  delay = 0,
  color = "from-indigo-400 to-violet-400",
}) {
  const controls = useAnimationControls();

  useEffect(() => {
    let timeout;
    const loop = () => {
      timeout = setTimeout(
        async () => {
          await controls.start("glitch");
          await controls.start("idle");
          loop();
        },
        1000 + delay * 600 + Math.random() * 1200,
      );
    };
    loop();
    return () => clearTimeout(timeout);
  }, [controls, delay]);

  return (
    <motion.span
      variants={glitchVariants}
      animate={controls}
      initial="idle"
      className={`inline-block bg-gradient-to-b ${color} bg-clip-text text-transparent select-none`}
      style={{fontVariantNumeric: "tabular-nums"}}
    >
      {children}
    </motion.span>
  );
}

const orbData = [
  {
    size: 420,
    x: "-10%",
    y: "-20%",
    color: "rgba(99,102,241,0.12)",
    duration: 18,
  },
  {
    size: 300,
    x: "70%",
    y: "55%",
    color: "rgba(167,139,250,0.10)",
    duration: 22,
  },
  {
    size: 200,
    x: "55%",
    y: "-15%",
    color: "rgba(34,211,238,0.08)",
    duration: 15,
  },
];

const containerVariants = {
  hidden: {},
  visible: {transition: {staggerChildren: 0.12}},
};

const itemVariants = {
  hidden: {opacity: 0, y: 24, filter: "blur(6px)"},
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {duration: 0.55, ease: [0.22, 1, 0.36, 1]},
  },
};

const lineVariants = {
  hidden: {scaleX: 0, originX: 0},
  visible: {
    scaleX: 1,
    transition: {delay: 0.7, duration: 0.6, ease: [0.22, 1, 0.36, 1]},
  },
};

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center py-6 px-4 overflow-hidden bg-gray-50 dark:bg-black">
      {/* Ambient orbs */}
      {orbData.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={{scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8]}}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {mounted && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col items-center text-center max-w-xl w-full gap-0"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Error 404
            </span>
          </motion.div>

          {/* Giant glitch 404 */}
          <motion.div
            variants={itemVariants}
            className="flex items-center leading-none mb-2"
            style={{
              fontSize: "clamp(7rem, 22vw, 14rem)",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              fontFamily: "system-ui",
            }}
          >
            <GlitchDigit
              delay={0}
              color="from-indigo-400 via-violet-400 to-indigo-500"
            >
              4
            </GlitchDigit>
            <GlitchDigit
              delay={1}
              color="from-violet-400 via-fuchsia-400 to-violet-500"
            >
              0
            </GlitchDigit>
            <GlitchDigit
              delay={2}
              color="from-cyan-400 via-indigo-400 to-cyan-500"
            >
              4
            </GlitchDigit>
          </motion.div>

          {/* Divider line */}
          <motion.div
            variants={itemVariants}
            className="w-full mb-8 flex items-center gap-4"
          >
            <motion.div
              variants={lineVariants}
              className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
            />
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <motion.div
              variants={lineVariants}
              className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
            />
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-white leading-tight mb-4"
          >
            This lesson{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                doesn&apos;t exist
              </span>
              <motion.span
                variants={lineVariants}
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              />
            </span>
          </motion.h1>

          {/* Body */}
          <motion.p
            variants={itemVariants}
            className="text-gray-400 leading-relaxed mb-10 max-w-sm text-sm"
          >
            The page you&apos;re looking for has wandered off the syllabus. It may
            have been moved, deleted, or never written in the first place.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.03] transition-all duration-200 w-full sm:w-auto justify-center"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              Back to Home
            </Link>

            <Link
              href="/lessons"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-700 dark:text-gray-300 hover:text-gray-500 dark:hover:text-white text-sm font-medium transition-all duration-200 w-full sm:w-auto justify-center"
            >
              <Compass className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Explore Lessons
            </Link>
          </motion.div>

          {/* Footer tag */}
          <motion.p
            variants={itemVariants}
            className="mt-12 text-xs text-gray-600 tracking-widest uppercase"
          >
            Learnora · Share Wisdom. Inspire Growth.
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}
