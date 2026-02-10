import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Is PocketFlow really free?",
    answer: "Yes, completely free. No hidden fees, no premium tiers, no credit card required. We built this to help people take control of their finances, not to charge them for it."
  },
  {
    question: "Do you need access to my bank account?",
    answer: "No. PocketFlow is manual tracking only. You log your own transactions, which means we never need (or want) access to your bank credentials. Your accounts stay private."
  },
  {
    question: "What data do you collect?",
    answer: "Only what you explicitly enter: transactions, budgets, bills, and goals. We use Firebase for secure authentication, but we never sell your data, share it with third parties, or show you ads."
  },
  {
    question: "Can I import my existing data?",
    answer: "Yes! You can upload CSV files from your bank or existing spreadsheets. We'll map the columns and import your transaction history so you can start with context, not from scratch."
  },
  {
    question: "What if I have a question or need help?",
    answer: "We're a small team, but we're responsive. Reach out via the in-app feedback button or email us at ayomidekay7@gmail.com. We typically respond within 24 hours."
  },
  {
    question: "Will there be a mobile app?",
    answer: "The web app is fully responsive and works great on mobile browsers. A native iOS/Android app is on our roadmap based on user demand. Let us know if you'd use it!"
  },
  {
    question: "How is this different from Mint or YNAB?",
    answer: "PocketFlow is simpler and privacy-first. Unlike Mint, we don't connect to your bank or show ads. Unlike YNAB, we're free and don't require envelope budgeting. We're the calm middle ground for people who want visibility without complexity."
  },
  {
    question: "Can I export my data?",
    answer: "Absolutely. You can export all your transactions, budgets, and bills to CSV at any time. Your data is yours to keep, delete, or move elsewhere."
  }
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-slate-900 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Common questions
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-slate-800">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between py-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 group"
              >
                <span className={`text-lg font-medium transition-colors group-hover:text-emerald-400 ${openIndex === index ? 'text-emerald-500' : 'text-white'}`}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-slate-500 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-emerald-500' : ''}`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-slate-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
