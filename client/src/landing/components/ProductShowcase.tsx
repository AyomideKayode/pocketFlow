import { motion } from 'framer-motion';
import csvImport from '../../assets/landing/csv-import-valid.jpg?url';
import billAdd from '../../assets/landing/bill-addModal-page.JPG?url';
import spending from '../../assets/landing/dashboard-charts.JPG?url';
import learn from '../../assets/landing/learn-education-insights.JPG?url';
import preferences from '../../assets/landing/preference-settings.JPG?url';
import { Link } from 'react-router-dom';

type HighlightType = 'glow' | 'ring' | 'arrow' | 'spotlight';

interface ShowcaseHighlightConfig {
  type: HighlightType;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  width?: string;
  height?: string;
  size?: string; // e.g. 'w-12 h-12' for ring
  delay?: number;
  label?: string; // For arrow type
}

interface ShowcaseCard {
  id: number;
  headline: string;
  subheader: string;
  image: string;
  position: 'left' | 'right';
  highlights?: ShowcaseHighlightConfig[];
}

const showcaseCards: ShowcaseCard[] = [
  {
    id: 1,
    headline: 'Add Bills Manually',
    subheader:
      "Track bills with reminders. Set once, relax forever. Know exactly what's coming.",
    image: billAdd,
    position: 'left',
    highlights: [
      {
        type: 'ring',
        top: '18%',
        right: '17%',
        width: '8%',
        height: '12%',
        delay: 0.9,
      },
    ],
  },
  {
    id: 2,
    headline: 'Understand Your Spending',
    subheader:
      'Visual insights reveal where your money actually goes. No spreadsheets, no guessing.',
    image: spending,
    position: 'right',
    highlights: [
      {
        type: 'glow',
        top: '50%',
        left: '55%',
        width: '65%',
        height: '40%',
        delay: 0.9,
      },
    ],
  },
  {
    id: 3,
    headline: 'Bring Your Data',
    subheader:
      'Start with your real financial history instantly. No blank screens, no rebuilding from memory.',
    image: csvImport,
    position: 'left',
    highlights: [
      {
        type: 'ring',
        top: '28%', // Adjust based on "Valid Records" box
        left: '34%',
        width: '30%',
        height: '20%',
        delay: 0.9,
      },
    ],
  },
  {
    id: 4,
    headline: 'Stay Informed & Learn',
    subheader:
      'See upcoming bills at a glance. Access educational insights and resources. Make better financial decisions.',
    image: learn,
    position: 'right',
    highlights: [
      {
        type: 'ring',
        top: '46%',
        left: '46%',
        width: '55%',
        height: '54%',
        delay: 0.9,
      },
    ],
  },
  {
    id: 5,
    headline: 'Your Preferences, Your Way',
    subheader:
      'Customize your profile, set your preferred currency, manage your account. Full control, zero friction.',
    image: preferences,
    position: 'left',
    highlights: [
      {
        type: 'arrow',
        label: 'Customize',
        top: '65%',
        left: '5%',
        width: '40%',
        height: '20%',
        delay: 0.6,
      },
    ],
  },
];

const ShowcaseHighlight = ({ config }: { config: ShowcaseHighlightConfig }) => {
  const { type, top, left, right, bottom, width, height, size, delay, label } =
    config;

  const style = { top, left, right, bottom, width, height };

  // Calculate translation based on anchor point
  const translateXClass = left
    ? '-translate-x-1/2'
    : right
      ? 'translate-x-1/2'
      : '-translate-x-1/2';
  const translateYClass = top
    ? '-translate-y-1/2'
    : bottom
      ? 'translate-y-1/2'
      : '-translate-y-1/2';
  const transformClass = `${translateXClass} ${translateYClass}`;

  if (type === 'glow') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
        className={`absolute ${transformClass} bg-emerald-500/20 blur-2xl rounded-full pointer-events-none z-10`}
        style={style}
      />
    );
  }

  if (type === 'ring') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className={`absolute ${transformClass} border-2 border-emerald-400 rounded-lg pointer-events-none z-10 shadow-[0_0_15px_rgba(52,211,153,0.5)] ${
          size || ''
        }`}
        style={style}
      >
        <span className='absolute inset-0 rounded-lg animate-ping opacity-75 bg-emerald-400/30' />
      </motion.div>
    );
  }

  if (type === 'spotlight') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
        className={`absolute ${transformClass} bg-radial from-white/10 to-transparent pointer-events-none z-10 mix-blend-overlay`}
        style={style}
      />
    );
  }

  if (type === 'arrow') {
    // Basic arrow implementation
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className='absolute pointer-events-none z-10 flex items-center gap-2'
        style={style}
      >
        <div className='text-emerald-400 text-sm font-mono bg-slate-900/80 px-2 py-1 rounded border border-emerald-500/30 backdrop-blur-sm'>
          {label}
        </div>
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          className='text-emerald-400'
          strokeWidth='2'
        >
          <path d='M5 12h14M12 5l7 7-7 7' />
        </svg>
      </motion.div>
    );
  }

  return null;
};

export default function ProductShowcase() {
  return (
    <section
      id='features'
      className='relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-slate-950'
    >
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
                  className='w-full h-auto object-cover relative z-0'
                />

                {/* Highlights */}
                {card.highlights?.map((highlight, hIndex) => (
                  <ShowcaseHighlight key={hIndex} config={highlight} />
                ))}

                {/* Subtle glow behind image */}
                <div className='absolute inset-0 bg-linear-to-r from-emerald-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none' />
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
