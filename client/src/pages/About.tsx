import { LandingNavbar } from '../landing/components/LandingNavbar';
import { Footer } from '../landing/components/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className='min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-50 font-sans selection:bg-emerald-500/30 flex flex-col'>
      <LandingNavbar />

      <main className='grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='max-w-3xl mx-auto space-y-16'>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='text-center space-y-6'
          >
            <h1 className='text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white'>
              Why PocketFlow exists
            </h1>
            <p className='text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed'>
              A personal project built to bring clarity to personal finance,
              without the noise.
            </p>
          </motion.div>

          {/* The Story */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
              The Story
            </h2>
            <div className='prose prose-gray dark:prose-invert prose-lg text-gray-600 dark:text-slate-300 leading-relaxed'>
              <p>
                Development began in late 2025, sparked by a simple,
                uncomfortable question.
              </p>
              <p>
                During the festive holidays, after family gatherings and
                celebrations, I noticed my spending had quietly increased.
                Nothing dramatic. Just small payments stacking up. Meals here.
                Gifts there. Subscriptions humming in the background.
              </p>
              <p>And then came the moment everyone knows:</p>
              <blockquote className='border-l-4 border-emerald-500 pl-4 italic text-gray-800 dark:text-slate-200 my-6'>
                “Where did my money actually go?”
              </blockquote>
              <p>
                I wanted a place where I could record income and expenses, check
                what happened last week or last month, and feel oriented again.
                Not judged. Not overwhelmed. Just informed.
              </p>
              <p>
                Most tools I tried were either too complex, required bank
                access, or pushed me toward financial systems I didn’t want.
              </p>
              <p>So I built something calmer.</p>
            </div>
          </section>

          {/* The Mission */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
              The Mission
            </h2>
            <div className='prose prose-gray dark:prose-invert prose-lg text-gray-600 dark:text-slate-300 leading-relaxed'>
              <p>
                PocketFlow is designed to give you visibility without intrusion.
              </p>
              <ul className='list-disc pl-6 space-y-2 marker:text-emerald-500'>
                <li>No ads.</li>
                <li>No selling data.</li>
                <li>No mandatory bank connections.</li>
              </ul>
              <p>
                Just a clear picture of your financial movement, built from
                information you choose to provide.
              </p>
            </div>
          </section>

          {/* The Philosophy */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
              The Philosophy
            </h2>
            <div className='prose prose-gray dark:prose-invert prose-lg text-gray-600 dark:text-slate-300 leading-relaxed'>
              <p>
                Money is stressful enough. Software should reduce anxiety, not
                add to it.
              </p>
              <p>Every feature in PocketFlow follows a few principles:</p>
              <ul className='list-disc pl-6 space-y-2 marker:text-emerald-500'>
                <li>
                  <strong className='text-gray-900 dark:text-white'>
                    Clarity over cleverness
                  </strong>
                </li>
                <li>
                  <strong className='text-gray-900 dark:text-white'>
                    Privacy by default
                  </strong>
                </li>
                <li>
                  <strong className='text-gray-900 dark:text-white'>
                    Helpful, not judgmental
                  </strong>
                </li>
                <li>
                  <strong className='text-gray-900 dark:text-white'>
                    Simple before powerful
                  </strong>
                </li>
              </ul>
            </div>
          </section>

          {/* The Builder Note */}
          <section className='bg-gray-50 dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-8 space-y-6'>
            <h2 className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
              A Note from the Founder
            </h2>
            <div className='prose prose-gray dark:prose-invert prose-lg text-gray-600 dark:text-slate-300 leading-relaxed'>
              <p>
                PocketFlow is built and maintained by a founder and builder who
                cares deeply about financial transparency and user privacy.
              </p>
              <p>
                I use PocketFlow every day to manage my own finances. This
                "dogfooding" ensures that the tool remains practical, reliable,
                and focused on real-world needs.
              </p>
              <p>
                The goal is steady, thoughtful improvement — shaped by my own
                usage and real user feedback. If something feels confusing or
                could work better, I want to hear about it.
              </p>
            </div>
          </section>

          {/* Forward Looking */}
          <section className='space-y-6'>
            <h2 className='text-2xl font-bold text-emerald-600 dark:text-emerald-400'>
              Looking Forward
            </h2>
            <div className='prose prose-gray dark:prose-invert prose-lg text-gray-600 dark:text-slate-300 leading-relaxed'>
              <p>Today PocketFlow focuses on manual tracking and awareness.</p>
              <p>
                In the future, we may explore additional integrations and
                smarter automation — but only if they maintain the same
                commitment to privacy, control, and simplicity.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className='pt-8 flex flex-col items-center text-center space-y-6'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Ready to find clarity?
            </h2>
            <p className='text-gray-600 dark:text-slate-400 max-w-lg'>
              Join others who are taking control of their financial life with a
              simple, private tool.
            </p>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link
                to='/auth?mode=signup'
                className='bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-semibold px-8 py-3 rounded-lg shadow-sm dark:shadow-lg dark:shadow-emerald-500/20 transition-all transform hover:scale-[1.02]'
              >
                Create your free account
              </Link>
              <Link
                to='/auth?mode=login'
                className='text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white font-medium px-8 py-3 transition-colors border border-gray-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-500 rounded-lg'
              >
                Sign In
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
