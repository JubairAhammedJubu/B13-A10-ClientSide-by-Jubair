"use client";

import {motion} from "motion/react";
import {Star, Quote} from "lucide-react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Ayesha Rahman",
    occupation: "Software Engineer",
    image: "https://i.pravatar.cc/150?img=47",
    rating: 5,
    message:
      "This platform changed how I reflect on my experiences. I wrote about a failed startup and got hundreds of people saying it helped them avoid the same mistakes. Sharing wisdom here feels genuinely meaningful.",
    tag: "Personal Growth",
  },
  {
    id: 2,
    name: "Tanvir Hossain",
    occupation: "High School Teacher",
    image: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    message:
      "I've read thousands of self-help books but nothing hits like real stories from real people. The lessons here are raw, honest, and actually useful. I recommend it to all my students.",
    tag: "Education",
  },
  {
    id: 3,
    name: "Sadia Islam",
    occupation: "Freelance Designer",
    image: "https://i.pravatar.cc/150?img=5",
    rating: 4,
    message:
      "As someone who moved abroad alone at 22, I wish I had found this earlier. Reading others' experiences about loneliness and resilience made me feel less alone. Now I contribute my own stories too.",
    tag: "Relationships",
  },
  {
    id: 4,
    name: "Rafiq Ullah",
    occupation: "Entrepreneur & Mentor",
    image: "https://i.pravatar.cc/150?img=60",
    rating: 5,
    message:
      "I've been mentoring young founders for years. This platform lets me share structured lessons that reach thousands — far beyond what one-on-one sessions can do. Premium access is absolutely worth it.",
    tag: "Career",
  },
];

function StarRating({rating}) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({length: 5}).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 transition-colors ${
            i < rating
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 dark:text-gray-700 fill-gray-200 dark:fill-gray-700"
          }`}
        />
      ))}
    </div>
  );
}

function TestimonialCard({testimonial, index}) {
  return (
    <motion.div
      initial={{opacity: 0, y: 30}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true}}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{y: -5, transition: {duration: 0.25}}}
      className="group relative bg-white dark:bg-[#1a1d24] rounded-2xl p-6
                border border-gray-100 dark:border-gray-800
                shadow-sm hover:shadow-xl hover:shadow-amber-500/10
                transition-all duration-500 flex flex-col"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

      {/* Top row — quote icon + star rating */}
      <div className="flex items-start justify-between mb-5">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center border border-amber-100 dark:border-amber-800 shrink-0">
          <Quote className="w-5 h-5 text-amber-500" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={testimonial.rating} />
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {testimonial.rating}.0 / 5.0
          </span>
        </div>
      </div>

      {/* Message */}
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 mb-6">
        &ldquo;{testimonial.message}&rdquo;
      </p>

      {/* Tag */}
      <div className="mb-5">
        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800">
          {testimonial.tag}
        </span>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-800 mb-4" />

      {/* User info — image, name, occupation */}
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            width={44}
            height={44}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-amber-200 dark:ring-amber-800"
          />

        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
            {testimonial.name}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
            {testimonial.occupation}
          </p>
        </div>
      </div>

      {/* Bottom accent line on hover */}
      <div className="absolute bottom-0 left-6 right-6 h-0.5 w-0 group-hover:w-[calc(100%-3rem)] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500 ease-out" />
    </motion.div>
  );
}

export default function AdvertiseSection() {
  const avgRating = (
    TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length
  ).toFixed(1);

  return (
    <section className="relative py-15 overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/8 dark:bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/8 dark:bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800">
            <Star className="w-3.5 h-3.5 fill-current" />
            Community Voices
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            What Our{" "}
            <span className="bg-linear-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
              Community Says
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-base leading-relaxed">
            Real people. Real lessons. Real impact. Here&apos;s what members say
            about sharing and discovering wisdom on our platform.
          </p>

          {/* Average rating pill */}
          <motion.div
            initial={{opacity: 0, scale: 0.9}}
            whileInView={{opacity: 1, scale: 1}}
            viewport={{once: true}}
            transition={{delay: 0.2}}
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full bg-white dark:bg-[#1a1d24] border border-gray-100 dark:border-gray-800 shadow-sm"
          >
            <div className="flex items-center gap-0.5">
              {Array.from({length: 5}).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-amber-400 fill-amber-400"
                />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {avgRating}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              average from {TESTIMONIALS.length} members
            </span>
          </motion.div>
        </motion.div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TESTIMONIALS.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
