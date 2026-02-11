import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Building2 } from 'lucide-react';

const badges = [
  {
    icon: ShieldCheck,
    title: 'Firebase Auth',
    description:
      'Industry-leading authentication. Your credentials never touch our servers.',
  },
  {
    icon: Lock,
    title: 'Your data stays yours',
    description:
      'We never sell your data. No third-party tracking. No ads. Ever.',
  },
  {
    icon: Building2,
    title: 'No bank login required',
    description:
      "Manual tracking means you're in control. We never need access to your accounts.",
  },
];

export const TrustSecurity = () => {
  return (
    <section className='py-24 bg-slate-900 relative'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='mb-16'
        >
          <h2 className='text-3xl md:text-5xl font-bold tracking-tight text-white mb-6'>
            Your data. Your control. Your privacy.
          </h2>
          <p className='text-lg text-slate-400 max-w-2xl mx-auto'>
            PocketFlow takes security seriously. We use industry-standard
            encryption and never ask for your bank login. Your financial data
            stays yours.
          </p>
        </motion.div>

        <div className='flex flex-col md:flex-row justify-center gap-12 md:gap-8'>
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className='flex flex-col items-center text-center max-w-sm mx-auto'
            >
              <div className='h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6'>
                <badge.icon className='h-8 w-8 text-emerald-500' />
              </div>
              <h3 className='text-xl font-bold text-white mb-3'>
                {badge.title}
              </h3>
              <p className='text-slate-400 leading-relaxed'>
                {badge.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
