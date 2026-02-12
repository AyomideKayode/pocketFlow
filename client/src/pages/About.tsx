import { LandingNavbar } from '../landing/components/LandingNavbar';
import { Footer } from '../landing/components/Footer';
import { motion } from 'framer-motion';

export const About = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30 flex flex-col">
      <LandingNavbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Why PocketFlow exists
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              A personal project built to bring clarity to personal finance, without the noise.
            </p>
          </motion.div>

          {/* The Story */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-400">The Story</h2>
            <div className="prose prose-invert prose-lg text-slate-300 leading-relaxed">
              <p>
                PocketFlow started with a simple, uncomfortable question.
              </p>
              <p>
                During the holidays, after family gatherings and celebrations, I noticed my spending had quietly increased. Nothing dramatic. Just small payments stacking up. Meals here. Gifts there. Subscriptions humming in the background.
              </p>
              <p>
                And then came the moment everyone knows:
              </p>
              <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-slate-200 my-6">
                “Where did my money actually go?”
              </blockquote>
              <p>
                I wanted a place where I could record income and expenses, check what happened last week or last month, and feel oriented again. Not judged. Not overwhelmed. Just informed.
              </p>
              <p>
                Most tools I tried were either too complex, required bank access, or pushed me toward financial systems I didn’t want.
              </p>
              <p>
                So I built something calmer.
              </p>
            </div>
          </section>

          {/* The Mission */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-400">The Mission</h2>
            <div className="prose prose-invert prose-lg text-slate-300 leading-relaxed">
              <p>
                PocketFlow is designed to give you visibility without intrusion.
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-emerald-500">
                <li>No ads.</li>
                <li>No selling data.</li>
                <li>No mandatory bank connections.</li>
              </ul>
              <p>
                Just a clear picture of your financial movement, built from information you choose to provide.
              </p>
            </div>
          </section>

          {/* The Philosophy */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-400">The Philosophy</h2>
            <div className="prose prose-invert prose-lg text-slate-300 leading-relaxed">
              <p>
                Money is stressful enough. Software should reduce anxiety, not add to it.
              </p>
              <p>
                Every feature in PocketFlow follows a few principles:
              </p>
              <ul className="list-disc pl-6 space-y-2 marker:text-emerald-500">
                <li><strong className="text-white">Clarity over cleverness</strong></li>
                <li><strong className="text-white">Privacy by default</strong></li>
                <li><strong className="text-white">Helpful, not judgmental</strong></li>
                <li><strong className="text-white">Simple before powerful</strong></li>
              </ul>
            </div>
          </section>

          {/* The Builder Note */}
          <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-emerald-400">A Note from the Builder</h2>
            <div className="prose prose-invert prose-lg text-slate-300 leading-relaxed">
              <p>
                PocketFlow is built and maintained by an independent software engineer who cares deeply about financial transparency and user privacy.
              </p>
              <p>
                The goal is steady, thoughtful improvement — shaped by real user feedback.
              </p>
              <p>
                If something feels confusing or could work better, I want to hear about it.
              </p>
            </div>
          </section>

          {/* Forward Looking */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-400">Looking Forward</h2>
            <div className="prose prose-invert prose-lg text-slate-300 leading-relaxed">
              <p>
                Today PocketFlow focuses on manual tracking and awareness.
              </p>
              <p>
                In the future, we may explore additional integrations and smarter automation — but only if they maintain the same commitment to privacy, control, and simplicity.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
