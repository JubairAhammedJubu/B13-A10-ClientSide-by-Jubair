'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Check, Zap, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

const FEATURES = [
  {
    name: 'Create lessons',
    free: '3 lessons',
    premium: 'Unlimited',
  },
  {
    name: 'Premium lesson creation',
    free: false,
    premium: true,
  },
  {
    name: 'Ad-free experience',
    free: false,
    premium: true,
  },
  {
    name: 'Priority listing',
    free: false,
    premium: true,
  },
  {
    name: 'Access premium content',
    free: false,
    premium: true,
  },
  {
    name: 'Community badge',
    free: false,
    premium: true,
  },
  {
    name: 'Lifetime access',
    free: false,
    premium: true,
  },
  {
    name: 'Priority support',
    free: false,
    premium: true,
  },
];

const PRICE_BDT = 1500;

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const session = await authClient.getSession();
        setUser(session?.data?.user || null);

        // If already premium, redirect to dashboard
        if (session?.data?.user?.isPremium) {
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('Failed to get session:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  const handleUpgrade = async () => {
    if (!user) {
      toast.error('Please log in first');
      router.push('/login');
      return;
    }

    setIsProcessing(true);

    try {
      // Get the API URL from environment or use default
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      
      console.log('📤 Sending upgrade request to:', `${apiUrl}/create-checkout-session`);
      
      const response = await fetch(
        `${apiUrl}/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            userEmail: user.email,
            userName: user.name,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Server error:', data);
        throw new Error(data.error || 'Failed to create checkout session');
      }

      console.log('✅ Checkout session created:', data);

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL provided');
      }
    } catch (error) {
      console.error('❌ Upgrade error:', error);
      toast.error(error.message || 'Failed to start payment. Please try again.');
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6">
            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              Lifetime Access
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Unlock Premium Features
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create unlimited lessons, access premium content, and get priority listing—all for a one-time payment.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#1a1d24] rounded-2xl p-8 border border-gray-200 dark:border-gray-800"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Free
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get started with the basics
              </p>
            </div>

            <div className="mb-8">
              <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                Tk 0
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Forever free, no credit card required
              </p>
            </div>

            <button
              disabled
              className="w-full py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-semibold cursor-not-allowed opacity-60"
            >
              Your Current Plan
            </button>
          </motion.div>

          {/* Premium Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 rounded-2xl p-8 border-2 border-indigo-600 dark:border-indigo-400 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold">
                <Zap className="w-3 h-3" />
                Most Popular
              </span>
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Premium
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Everything you need to create and share
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
                  Tk {PRICE_BDT}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                One-time payment, lifetime access
              </p>
            </div>

            <button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Upgrade Now
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-4">
              Secure payment powered by Stripe
            </p>
          </motion.div>
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
          <div className="p-8 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Feature Comparison
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left px-8 py-4 font-semibold text-gray-900 dark:text-gray-100">
                    Feature
                  </th>
                  <th className="text-center px-8 py-4 font-semibold text-gray-900 dark:text-gray-100">
                    Free
                  </th>
                  <th className="text-center px-8 py-4 font-semibold text-indigo-600 dark:text-indigo-400">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feature, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-8 py-4 text-gray-900 dark:text-gray-100 font-medium">
                      {feature.name}
                    </td>
                    <td className="px-8 py-4 text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {feature.free}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-4 text-center">
                      {typeof feature.premium === 'boolean' ? (
                        <Check className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto" />
                      ) : (
                        <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                          {feature.premium}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Is this a recurring subscription?',
                a: 'No, this is a one-time payment for lifetime access. You will never be charged again.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards (Visa, Mastercard, Amex) through Stripe. Your payment is secure and encrypted.',
              },
              {
                q: 'Can I get a refund?',
                a: 'If you need a refund, please contact our support team within 30 days of purchase.',
              },
              {
                q: 'Will I get a receipt?',
                a: 'Yes, you will receive an email receipt immediately after payment. You can also view it in your account settings.',
              },
              {
                q: 'When does my premium access start?',
                a: 'Your premium access starts immediately after successful payment. You can start creating premium lessons right away.',
              },
              {
                q: 'What if the payment fails?',
                a: 'If payment fails, you will be redirected to a page with more options. You can try again or contact support for help.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-[#1a1d24] rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to unlock premium features?
          </h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Upgrade to premium today and start creating unlimited lessons with priority visibility.
          </p>
          <button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="px-8 py-3 rounded-xl bg-white text-indigo-600 font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Get Premium Now
                <Zap className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}