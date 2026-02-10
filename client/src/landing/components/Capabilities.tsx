import { motion } from 'framer-motion';
import { CalendarCheck, Target, BarChart3, Trophy } from 'lucide-react';

const features = [
  {
    icon: CalendarCheck,
    title: "Never miss a payment",
    description: "See all your bills and subscriptions in one timeline. Get reminded before due dates. Mark them paid with a tap.",
    color: "from-emerald-500 to-emerald-600"
  },
  {
    icon: Target,
    title: "Stay within your limits",
    description: "Set monthly budgets by category. Watch real-time progress bars. Get alerts before you overspend.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: BarChart3,
    title: "Understand where it goes",
    description: "Visual breakdowns by category. Trends over time. Clear answers to 'how much did I spend on…'",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Trophy,
    title: "Build your future",
    description: "Set savings goals. Track progress automatically. Get notified when you hit milestones.",
    color: "from-amber-500 to-amber-600"
  }
];

export const Capabilities = () => {
  return (
    <section className="py-24 bg-slate-900 relative">
      <div className="absolute inset-0 bg-slate-950/50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Everything you need. Nothing you don't.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Focus on what matters without the clutter. PocketFlow gives you the essential tools to master your money.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl hover:bg-slate-800 transition-colors group"
            >
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
