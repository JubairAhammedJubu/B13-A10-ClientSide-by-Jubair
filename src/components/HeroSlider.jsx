"use client";

import {useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Pagination, EffectFade} from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import {motion, AnimatePresence} from "framer-motion";
import {ArrowRight} from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Preserve Your",
    highlight: "Life Lessons",
    subtitle:
      "Capture meaningful experiences, wisdom, and personal growth stories that can inspire others.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
  },

  {
    id: 2,
    title: "Learn From",
    highlight: "Real Experiences",
    subtitle:
      "Discover authentic lessons shared by people from different walks of life.",
    image: "https://images.unsplash.com/photo-1491841550275-ad7854e35ca6",
  },
  {
    id: 3,
    title: "Reflect, Grow",
    highlight: "& Evolve",
    subtitle:
      "Track your personal growth journey through reflection and shared wisdom.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&q=80&auto=format&fit=crop",
  },

  {
    id: 4,
    title: "Unlock",
    highlight: "Premium Wisdom",
    subtitle:
      "Gain access to exclusive premium lessons created by experienced contributors.",
    // Single candle illuminating an open book — knowledge, insight, revelation
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1600&q=85&auto=format&fit=crop",
  },

  {
    id: 5,
    title: "Build a Better",
    highlight: "Future",
    subtitle: "Every lesson learned today creates a stronger tomorrow.",
    image:
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1600&q=80&auto=format&fit=crop",
  },
];

const HeroSlider = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative w-full h-170 md:h-190 overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{crossFade: true}}
        speed={800}
        autoplay={{delay: 3200, disableOnInteraction: false}}
        pagination={{clickable: true}}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/15" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -12}}
              transition={{duration: 0.45, ease: [0.22, 1, 0.36, 1]}}
              className="max-w-2xl space-y-4"
            >
              <motion.div
                initial={{opacity: 0, x: -14}}
                animate={{opacity: 1, x: 0}}
                transition={{delay: 0.08, duration: 0.32}}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-xs font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                No 1 Digital Life Lessons Community
              </motion.div>

              <motion.h1
                initial={{opacity: 0, y: 14}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.14, duration: 0.4}}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              >
                {slides[activeIndex]?.title}{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  {slides[activeIndex]?.highlight}
                </span>
              </motion.h1>

              <motion.p
                initial={{opacity: 0, y: 14}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.2, duration: 0.4}}
                className="text-base md:text-lg text-gray-300 max-w-lg leading-relaxed"
              >
                {slides[activeIndex]?.subtitle}
              </motion.p>

              <motion.div
                initial={{opacity: 0, y: 14}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.26, duration: 0.4}}
                className="flex items-center gap-3 pt-2"
              >
                <button
                  onClick={() => router.push("/lessons")}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-sm font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all duration-200"
                >
                  Browse Lessons
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-all duration-200"
                >
                  Upgrade for More
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
