import { motion } from 'framer-motion';
import csvImport from '../../assets/landing/csv-import-valid.jpg?url';
import billAdd from '../../assets/landing/bill-addModal-page.JPG?url';
import spending from '../../assets/landing/dashboard-charts.JPG?url';
import learn from '../../assets/landing/learn-education-insights.JPG?url';
import preferences from '../../assets/landing/preference-settings.JPG?url';
import { Link } from 'react-router-dom';

interface ShowcaseCard {
  id: number;
  headline: string;
  subheader: string;
  image: string;
  position: 'left' | 'right';
}

const showcaseCards: ShowcaseCard[] = [
  {
    id: 1,
    headline: 'Add Bills Manually',
    subheader:
      "Track bills with reminders. Set once, relax forever. Know exactly what's coming.",
    image: billAdd,
    position: 'left',
  },
  {
    id: 2,
    headline: 'Understand Your Spending',
    subheader:
      'Visual insights reveal where your money actually goes. No spreadsheets, no guessing.',
    image: spending,
    position: 'right',
  },
  {
    id: 3,
    headline: 'Bring Your Data',
    subheader:
      'Start with your real financial history instantly. No blank screens, no rebuilding from memory.',
    image: csvImport,
    position: 'left',
  },
  {
    id: 4,
    headline: 'Stay Informed & Learn',
    subheader:
      'See upcoming bills at a glance. Access educational insights and resources. Make better financial decisions.',
    image: learn,
    position: 'right',
  },
  {
    id: 5,
    headline: 'Your Preferences, Your Way',
    subheader:
      'Customize your profile, set your preferred currency, manage your account. Full control, zero friction.',
    image: preferences,
    position: 'left',
  },
];

export default function ProductShowcase() {
  return (
    <section className='relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-slate-950'>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: '-100px' }}
        className='max-w-5xl mx-auto text-center mb-20'
      >
        <h2 className='text-4xl sm:text-5xl font-bold text-white mb-6'>
          Control Your Money.
          <br />
          <span className='text-emerald-400'>Simply.</span>
        </h2>
        <p className='text-lg text-slate-300 max-w-2xl mx-auto'>
          Five features designed to make financial management effortless.
        </p>
      </motion.div>

      {/* Showcase cards */}
      <div className='max-w-6xl mx-auto space-y-20'>
        {showcaseCards.map((card, index) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true, margin: '-100px' }}
            className={`flex flex-col ${
              card.position === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'
            } gap-8 lg:gap-16 items-center`}
          >
            {/* Text content */}
            <div className='flex-1 flex flex-col justify-center'>
              <h3 className='text-3xl sm:text-4xl font-bold text-white mb-4'>
                {card.headline}
              </h3>
              <p className='text-lg text-slate-300 leading-relaxed'>
                {card.subheader}
              </p>
            </div>

            {/* Image */}
            <div className='flex-1'>
              <motion.div
                className='relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/50 shadow-xl shadow-emerald-900/10'
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={card.image}
                  alt={card.headline}
                  className='w-full h-auto object-cover'
                />
                {/* Subtle glow behind image */}
                <div className='absolute inset-0 bg-linear-to-r from-emerald-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300' />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true, margin: '-100px' }}
        className='max-w-3xl mx-auto mt-24 text-center'
      >
        <h3 className='text-2xl sm:text-3xl font-bold text-white mb-8'>
          Ready to take control?
        </h3>

        <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto font-mono justify-center mb-8'>
          <Link
            to='/auth?mode=signup'
            className='inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-linear-to-r from-emerald-500 to-emerald-600 rounded-xl hover:from-emerald-400 hover:to-emerald-500 shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02]'
          >
            Create Free Account
          </Link>
          <Link
            to='/auth?mode=login'
            className='inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-slate-300 border border-slate-700 rounded-xl hover:text-white hover:border-emerald-500/50 hover:bg-slate-900 transition-all'
          >
            Sign in
          </Link>
        </div>

        {/* Trust signals */}
        <div className='grid grid-cols-2 sm:flex sm:flex-row gap-4 text-sm text-slate-400 justify-center'>
          <div className='flex items-center gap-2'>
            <span className='text-emerald-400 font-semibold'>✓</span>
            <span>Free forever</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-emerald-400 font-semibold'>✓</span>
            <span>No credit card required</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-emerald-400 font-semibold'>✓</span>
            <span>Your data stays private</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
