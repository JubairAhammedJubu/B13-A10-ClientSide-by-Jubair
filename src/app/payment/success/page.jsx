'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, ArrowRight } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        const userId = searchParams.get('userId');

        if (!sessionId || !userId) {
          toast.error('Missing payment information');
          router.push('/pricing');
          return;
        }

        // Get the current session
        const session = await authClient.getSession();
        setUser(session?.data?.user || null);

        // Verify payment with backend
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(
          `${apiUrl}/api/verify-payment?session_id=${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${session?.data?.session?.token}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setVerified(true);
          toast.success('Payment verified! Welcome to Premium!');
          window.dispatchEvent(new Event("user-updated"));
          
          // Refresh user session to update premium status
          await authClient.getSession();
        } else {
          toast.error('Payment verification failed');
          router.push('/pricing');
        }
      } catch (error) {
        console.error('Verification error:', error);
        toast.error('Failed to verify payment');
      } finally {
        setVerifying(false);
        setLoading(false);
      }
    };

    verifyPayment();
  }, [router, searchParams]);

  if (loading || verifying) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!verified) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex items-center justify-center px-4">
      <motion.div
        initial={{opacity: 0, scale: 0.9}}
        animate={{opacity: 1, scale: 1}}
        className="max-w-lg w-full"
      >
        <div className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-lg">
          {/* Success Icon */}
          <motion.div
            initial={{scale: 0}}
            animate={{scale: 1}}
            transition={{delay: 0.2, type: "spring"}}
            className="mb-6 flex justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </motion.div>

          {/* Content */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Payment Successful!
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
            Welcome to Premium,{" "}
            <span className="font-semibold">{user?.name || "Member"}</span>! 🎉
          </p>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your premium access is now active. You can create unlimited lessons,
            access premium content, and enjoy all exclusive features.
          </p>

          {/* Features List */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Your premium benefits:
            </h3>
            <ul className="space-y-3">
              {[
                "Create unlimited lessons",
                "Access premium content from other users",
                "Get priority listing in public lessons",
                "Ad-free experience",
                "Community badge on your profile",
                "Lifetime access — no recurring charges",
              ].map((benefit, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Receipt Info */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-8 text-sm">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              A receipt has been sent to{" "}
              <span className="font-semibold">{user?.email}</span>
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              You can view your invoice anytime in account settings.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link
              href="/dashboard/user/add-lesson"
              className="block w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              Create Your First Premium Lesson
              <Zap className="w-4 h-4" />
            </Link>
            <Link
              href="/lessons"
              className="block w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2"
            >
              Explore All Lessons
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Support */}
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-8">
            Have questions? Contact our{" "}
            <a
              href="mailto:support@ghurni.com"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              support team
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}