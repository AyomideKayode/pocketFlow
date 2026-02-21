import { motion } from 'framer-motion';
import {
  XCircle,
  CheckCircle,
  ArrowRight,
  ArrowDown,
  Dot,
  Check,
} from 'lucide-react';

export const ProblemRelief = () => {
  return (
    <section className='py-24 bg-gray-50 dark:bg-slate-950 relative overflow-hidden'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='text-center mb-16'
        >
          <h2 className='text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4'>
            From financial chaos to financial clarity
          </h2>
        </motion.div>

        <div className='grid grid-cols-1 lg:grid-cols-11 gap-8 items-center'>
          {/* Before Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='lg:col-span-5 bg-linear-to-br from-red-50 to-red-100 dark:from-red-900/10 dark:to-red-950/10 border border-red-200 dark:border-red-900/20 rounded-2xl p-8 md:p-12 relative overflow-hidden group hover:border-red-300 dark:hover:border-red-900/40 transition-colors shadow-sm dark:shadow-none'
          >
            <div className='absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-red-500/10 rounded-full blur-2xl' />

            <div className='flex items-center gap-3 mb-6'>
              <XCircle className='h-8 w-8 text-red-600 dark:text-red-500' />
              <h3 className='text-2xl font-bold text-red-700 dark:text-red-400'>
                The usual mess
              </h3>
            </div>

            <ul className='space-y-4'>
              {[
                'Late payment fees from forgotten bills',
                'Subscriptions charging you unnoticed',
                'Uncertainty about what you can safely spend',
                'Guessing how much you spent on food',
                'Spreadsheets you abandoned in February',
              ].map((item, i) => (
                <li
                  key={i}
                  className='flex items-start gap-3 text-red-900 dark:text-slate-400'
                >
                  <Dot className='h-6 w-6 text-red-400 dark:text-red-700 mt-0.5 shrink-0' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Arrow */}
          <div className='lg:col-span-1 flex justify-center py-4 lg:py-0'>
            <ArrowRight className='hidden lg:block h-12 w-12 text-gray-300 dark:text-slate-700' />
            <ArrowDown className='block lg:hidden h-12 w-12 text-gray-300 dark:text-slate-700' />
          </div>

          {/* After Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='lg:col-span-5 bg-linear-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/10 dark:to-emerald-950/10 border border-emerald-200 dark:border-emerald-900/20 rounded-2xl p-8 md:p-12 relative overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-500/30 transition-colors shadow-lg shadow-emerald-900/5'
          >
            <div className='absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl' />

            <div className='flex items-center gap-3 mb-6'>
              <CheckCircle className='h-8 w-8 text-emerald-600 dark:text-emerald-500' />
              <h3 className='text-2xl font-bold text-emerald-700 dark:text-emerald-400'>
                The PocketFlow way
              </h3>
            </div>

            <ul className='space-y-4'>
              <li className='flex items-start gap-3 text-emerald-900 dark:text-white'>
                <Check className='h-5 w-5 text-emerald-600 dark:text-emerald-500 mt-1 shrink-0' />
                <span>
                  See every{' '}
                  <span className='font-bold text-emerald-700 dark:text-emerald-200'>
                    upcoming bill
                  </span>{' '}
                  before it hits
                </span>
              </li>
              <li className='flex items-start gap-3 text-emerald-900 dark:text-white'>
                <Check className='h-5 w-5 text-emerald-600 dark:text-emerald-500 mt-1 shrink-0' />
                <span>Know exactly what's draining your account</span>
              </li>
              <li className='flex items-start gap-3 text-emerald-900 dark:text-white'>
                <Check className='h-5 w-5 text-emerald-600 dark:text-emerald-500 mt-1 shrink-0' />
                <span>
                  Budgets that show{' '}
                  <span className='font-bold text-emerald-700 dark:text-emerald-200'>
                    real-time progress
                  </span>
                </span>
              </li>
              <li className='flex items-start gap-3 text-emerald-900 dark:text-white'>
                <Check className='h-5 w-5 text-emerald-600 dark:text-emerald-500 mt-1 shrink-0' />
                <span>Spending patterns you can actually understand</span>
              </li>
              <li className='flex items-start gap-3 text-emerald-900 dark:text-white'>
                <Check className='h-5 w-5 text-emerald-600 dark:text-emerald-500 mt-1 shrink-0' />
                <span>
                  All your finance data in{' '}
                  <span className='font-bold text-emerald-700 dark:text-emerald-200'>
                    one secure place
                  </span>
                </span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
