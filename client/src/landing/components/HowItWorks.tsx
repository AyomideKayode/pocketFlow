import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';

const steps = [
  {
    number: "01",
    title: "Add your info",
    description: "Manually log expenses, set up recurring bills, create budgets by category. Import CSV if you have historical data."
  },
  {
    number: "02",
    title: "Get Visibility",
    description: "Your dashboard shows income vs expenses, spending by category, upcoming bills, and budget progress — all in real-time."
  },
  {
    number: "03",
    title: "Stay on Track",
    description: "Receive email alerts for budget limits, upcoming bills, and goal achievements. Review patterns and adjust your habits."
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Three steps to financial clarity
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row items-start justify-center gap-8 md:gap-4">
          {steps.map((step, index) => (
            <div key={index} className="contents">
              {/* Step Item */}
              <motion.div
                className="flex flex-col items-center flex-1 max-w-sm mx-auto w-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/5">
                  <span className="text-2xl font-bold text-emerald-500">{step.number}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>

              {/* Arrow Connector */}
              {index < steps.length - 1 && (
                <>
                  <div className="hidden md:flex items-center justify-center pt-8 w-12 shrink-0 text-slate-700">
                    <ArrowRight className="h-8 w-8" />
                  </div>
                  <div className="md:hidden flex items-center justify-center py-4 w-full text-slate-700">
                    <ArrowDown className="h-8 w-8" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
