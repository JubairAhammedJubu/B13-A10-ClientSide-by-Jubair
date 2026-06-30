'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reason, setReason] = useState('');

  useEffect(() => {
    const cancelReason = searchParams.get('reason') || 'cancelled';
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReason(cancelReason);
  }, [searchParams]);

  const reasonMessages = {
    cancelled: 'You cancelled the payment process.',
    failed: 'Your payment could not be processed.',
    timeout: 'The payment session timed out.',
    unknown: 'Something went wrong during payment.',
  };

  const message = reasonMessages[reason] || reasonMessages.unknown;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full"
      >
        <div className="bg-white dark:bg-[#1a1d24] rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center shadow-lg">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mb-6 flex justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
          </motion.div>

          {/* Content */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Payment {reason === 'failed' ? 'Failed' : 'Cancelled'}
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {message}
          </p>

          {/* Troubleshooting */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 mb-8 text-left border border-amber-200 dark:border-amber-900/50">
            <div className="flex gap-3 mb-4">
              <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-3">
                  What can you do?
                </h3>
                <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                  <li>• Make sure your card details are correct</li>
                  <li>• Check that your card is not expired</li>
                  <li>• Ensure you have sufficient balance</li>
                  <li>• Contact your bank if the issue persists</li>
                  <li>• Try a different payment method</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-8 text-sm border border-blue-200 dark:border-blue-900/50">
            <p className="text-blue-800 dark:text-blue-200">
              <span className="font-semibold">Good news:</span> No money was charged. You can try again anytime.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/pricing')}
              className="block w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="block w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back Home
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Still having issues?
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Contact our support team at{' '}
              <a href="mailto:support@ghurni.com" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                support@learnora.com
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}