import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import dashboardHero from '../../assets/landing/dashboard-hero.jpg';

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-24 px-4 overflow-hidden">
      {/* Background with noise texture (optional, skipped for simplicity) */}
      <div className="absolute inset-0 bg-slate-950 -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center z-10 relative">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-accent font-bold tracking-tight text-white max-w-4xl mb-6 leading-tight"
        >
          Never miss a bill. <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            Never wonder where your money went.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed"
        >
          Track expenses, monitor bills, and understand your spending — all in one calm, secure place. No complexity. No bank access required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto font-mono"
        >
          <Link
            to="/auth?mode=signup"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl hover:from-emerald-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02]"
          >
            Create Free Account
          </Link>
          <Link
            to="/auth?mode=login"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-slate-300 border border-slate-700 rounded-xl hover:text-white hover:border-emerald-500/50 hover:bg-slate-900 transition-all"
          >
            View Demo
          </Link>
        </motion.div>

        {/* Dashboard Screenshot with perspective tilt */}
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="mt-24 relative w-full max-w-5xl perspective-1000"
        >
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50 shadow-2xl shadow-emerald-900/20 transform-gpu rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out">
             {/* Glow effect behind */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-purple-500/20 blur-2xl opacity-50 -z-10" />

            <img
              src={dashboardHero}
              alt="PocketFlow Dashboard"
              className="w-full h-auto object-cover rounded-2xl"
              loading="eager"
            />

            {/* Overlay gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
