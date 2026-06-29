"use client";

import {motion} from "motion/react";
import {BookHeart, Lightbulb, Users, ShieldCheck} from "lucide-react";

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: BookHeart,
      title: "Preserve Your Story",
      description:
        "Life is full of lessons worth remembering. Writing them down transforms fleeting experiences into lasting wisdom you can return to anytime.",
      gradient: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/20",
    },
    {
      id: 2,
      icon: Lightbulb,
      title: "Accelerate Your Growth",
      description:
        "Learning from others' mistakes and wins is the fastest shortcut to personal growth. Why repeat errors when wisdom is already out there?",
      gradient: "from-yellow-500 to-amber-500",
      shadow: "shadow-yellow-500/20",
    },
    {
      id: 3,
      icon: Users,
      title: "Inspire a Community",
      description:
        "Your story matters more than you think. A single shared lesson can shift someone's perspective, spark a breakthrough, or prevent a costly mistake.",
      gradient: "from-orange-500 to-rose-500",
      shadow: "shadow-orange-500/20",
    },
    {
      id: 4,
      icon: ShieldCheck,
      title: "Build a Wiser Future",
      description:
        "Collective wisdom compounds over time. Every lesson shared adds to a growing library of human insight — making the world a little smarter, together.",
      gradient: "from-rose-500 to-pink-500",
      shadow: "shadow-rose-500/20",
    },
  ];

  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {staggerChildren: 0.12},
    },
  };

  const itemVariants = {
    hidden: {opacity: 0, y: 30},
    visible: {
      opacity: 1,
      y: 0,
      transition: {duration: 0.6, ease: [0.22, 1, 0.36, 1]},
    },
  };

  return (
    <section className="relative py-15 overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800">
            Why It Matters
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Why Learning From{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Life Matters
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
            Personal wisdom is the most underrated resource in the world.
            Here&apos;s why preserving and sharing it changes everything.
          </p>
        </motion.div>

        {/* 4 Benefit Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{once: true, amount: 0.1}}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              whileHover={{y: -6, transition: {duration: 0.02}}}
              className="group relative bg-white dark:bg-[#1a1d24] rounded-2xl p-6
                                border border-gray-100 dark:border-gray-800
                                shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.3)]
                                hover:shadow-[0_16px_48px_rgba(245,158,11,0.15)] dark:hover:shadow-[0_16px_48px_rgba(245,158,11,0.15)]
                                transition-all duration-500 overflow-hidden"
            >
              {/* Hover bg glow */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500 rounded-2xl`}
              />

              {/* Icon */}
              <div
                className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} ${feature.shadow} shadow-lg flex items-center justify-center mb-5`}
              >
                <feature.icon className="w-5 h-5 text-white" />
              </div>

              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover underline */}
              <div
                className={`mt-5 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${feature.gradient} rounded-full transition-all duration-500 ease-out`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6, delay: 0.3}}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            {value: "1000+", label: "Lessons Shared"},
            {value: "500+", label: "Active Learners"},
            {value: "98%", label: "Found It Helpful"},
            {value: "4.9★", label: "Community Rating"},
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center p-5 rounded-2xl bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 shadow-sm"
            >
              <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
