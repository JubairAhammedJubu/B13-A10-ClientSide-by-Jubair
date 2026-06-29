"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  Lock,
  BookOpen,
  ArrowRight,
  Home,
  Info,
  MessageCircle,
  Shield,
  FileText,
  ScrollText,
} from "lucide-react";
import {FaFacebookF} from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6";
import {motion} from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-[#0e0e13] mt-auto">
      {/* --- Main body --- */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[380px_1fr]">
          {/* Brand column */}
          <div className="relative border-b md:border-b-0  px-7 py-10">
            {/* Signature accent line */}
            <span className="absolute left-0 top-8 bottom-8 w-[3px] rounded-r-full bg-indigo-500/30 dark:bg-indigo-500/40 overflow-hidden">
              <motion.span
                className="block w-full h-5 rounded-full bg-indigo-500"
                animate={{
                  y: ["-100%", "900%"],
                }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />
            </span>

            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/Image/Logo3.png"
                alt="Learnora logo"
                width={34}
                height={34}
                className="rounded-lg object-contain"
              />
              <span className="text-lg font-serif font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                Learnora
              </span>
            </Link>

            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
              A community where real life experience becomes shared wisdom.
              Write, reflect, and learn from one another.
            </p>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 text-xs text-gray-400 dark:text-gray-500">
              <MapPin className="w-3 h-3 text-indigo-400" />
              Dhaka, Bangladesh
            </span>
          </div>

          {/* Three-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {/* Navigate */}
            <div className="border-b sm:border-b-0 px-7 py-10 hidden sm:block">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400 dark:text-gray-500 mb-4">
                Navigate
              </p>
              <ul className="space-y-0.5">
                {[
                  {label: "Home", href: "/", Icon: Home},
                  {label: "Lessons", href: "/lessons", Icon: BookOpen},
                  {label: "About", href: "#", Icon: Info},
                  {label: "Contact us", href: "##", Icon: MessageCircle},
                  {label: "Upgrade Plan", href: "/privacy", Icon: Shield},
                ].map(({label, href, Icon}) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="flex items-center gap-2 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 group transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-indigo-500 transition-colors" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get in touch */}
            <div className="border-b sm:border-b-0  px-7 py-10 ">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400 dark:text-gray-500 mb-4">
                Get in touch
              </p>
              <ul className="divide-y divide-gray-100 dark:divide-gray-800/70">
                <li className="py-3 first:pt-0">
                  <a
                    href="mailto:support@learnora.com"
                    className="flex items-start gap-3 group"
                  >
                    <Mail className="w-4 h-4 mt-0.5 text-indigo-400 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">
                        Email
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        support@learnora.com
                      </p>
                    </div>
                  </a>
                </li>
                <li className="py-3">
                  <a
                    href="tel:+8801234567890"
                    className="flex items-start gap-3 group"
                  >
                    <Phone className="w-4 h-4 mt-0.5 text-indigo-400 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">
                        Phone
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        +880 1234 567890
                      </p>
                    </div>
                  </a>
                </li>
              </ul>

              {/* Social media */}
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400 dark:text-gray-500 my-2">
                Follow us
              </p>
              <div className="flex items-center gap-2 ">
                <Link
                  href="https://facebook.com/learnora"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Learnora on Facebook"
                  className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-300 dark:hover:text-indigo-400 dark:hover:border-indigo-700 transition-colors"
                >
                  <FaFacebookF className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="https://x.com/learnora"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Learnora on X"
                  className="w-8 h-8 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-400 dark:hover:text-gray-100 dark:hover:border-gray-500 transition-colors"
                >
                  <FaXTwitter className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Safe payments */}
            <div className="px-7 py-10">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-gray-400 dark:text-gray-500 mb-4">
                Safe payments
              </p>
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-md bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900/50 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Stripe
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Encrypted checkout
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed mb-3">
                  Card details are never stored. Every transaction is protected
                  with SSL.
                </p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-950/40 text-xs font-medium text-green-700 dark:text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  SSL secured
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bottom bar --- */}
      <div className="border-t border-gray-200 dark:border-gray-800/60 px-6 md:px-10 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} Learnora. All rights reserved.
        </p>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/privacy"
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Privacy policy
          </Link>
          <span className="text-gray-200 dark:text-gray-700">·</span>
          <Link
            href="/terms"
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Terms of service
          </Link>
          <span className="text-gray-200 dark:text-gray-700">·</span>
          <Link
            href="/terms-conditions"
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Terms &amp; conditions
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
