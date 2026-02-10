import { motion } from 'framer-motion';
import { XCircle, CheckCircle, ArrowRight, ArrowDown } from 'lucide-react';

export const ProblemRelief = () => {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            From financial chaos to financial clarity
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-8 items-center">
          {/* Before Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 bg-gradient-to-br from-red-900/10 to-red-950/10 border border-red-900/20 rounded-2xl p-8 md:p-12 relative overflow-hidden group hover:border-red-900/40 transition-colors"
          >
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-red-500/10 rounded-full blur-2xl" />

            <div className="flex items-center gap-3 mb-6">
              <XCircle className="h-8 w-8 text-red-500" />
              <h3 className="text-2xl font-bold text-red-400">The usual mess</h3>
            </div>

            <ul className="space-y-4">
              {[
                "Late payment fees from forgotten bills",
                "Subscriptions charging you unnoticed",
                "Panic wondering if you can afford it",
                "Guessing how much you spent on food",
                "Spreadsheets you abandoned in February"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-400">
                  <XCircle className="h-5 w-5 text-red-900/50 mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Arrow */}
          <div className="lg:col-span-1 flex justify-center py-4 lg:py-0">
            <ArrowRight className="hidden lg:block h-12 w-12 text-slate-700" />
            <ArrowDown className="block lg:hidden h-12 w-12 text-slate-700" />
          </div>

          {/* After Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 bg-gradient-to-br from-emerald-900/10 to-emerald-950/10 border border-emerald-900/20 rounded-2xl p-8 md:p-12 relative overflow-hidden group hover:border-emerald-500/30 transition-colors shadow-lg shadow-emerald-900/5"
          >
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
              <h3 className="text-2xl font-bold text-emerald-400">The PocketFlow way</h3>
            </div>

            <ul className="space-y-4">
              {[
                "See every upcoming bill before it hits",
                "Know exactly what's draining your account",
                "Budgets that show real-time progress",
                "Spending patterns you can actually understand",
                "All your finance data in one secure place"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-white">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
