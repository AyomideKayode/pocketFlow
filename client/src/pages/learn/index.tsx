import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
import {
  BookOpen,
  AlertCircle,
  Info,
  Lightbulb,
  Shield,
  TrendingUp,
  RefreshCw,
  Calendar,
  CreditCard,
  CheckCircle2,
  Wallet,
  Loader2,
  PiggyBankIcon,
  TrendingDown,
  Target,
  GraduationCap,
} from 'lucide-react';

interface Insight {
  id: string;
  title: string;
  message: string;
  level: 'info' | 'attention';
}

interface EducationTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  tips: string[];
}

interface Resource {
  id: string;
  category: 'reading' | 'course' | 'tip';
  title: string;
  description?: string;
}

const educationTopics: EducationTopic[] = [
  {
    id: 'budgeting',
    title: 'Budgeting Basics',
    description: 'Master the fundamentals of creating and maintaining a budget to reach your goals.',
    icon: Wallet,
    tips: [
      'Start with the 50/30/20 rule: 50% needs, 30% wants, 20% savings',
      'Track every expense daily for at least one month to understand your spending patterns',
      'Set realistic budget limits for each category based on your income',
      'Review your budget weekly, not just monthly',
      'Use the budgeting tool in PocketFlow to simplify the process and stay on track',
    ],
  },
  {
    id: 'emergency-fund',
    title: 'Emergency Fund',
    description: 'Build a safety net for unexpected life events. Why you need savings and how to get started.',
    icon: PiggyBankIcon,
    tips: [
      'Start small: Aim for 3-6 months of living expenses in your emergency fund',
      'Automate your savings by setting up automatic transfers: PiggyVest, Cowrywise, or your bank’s auto-transfer feature can help',
      'Keep emergency funds in a high-yield savings account for easy access',
      'Only use emergency funds for true emergencies, not wants',
    ],
  },
  {
    id: 'debt',
    title: 'Managing Debt',
    description: 'Strategies to reduce financial burden effectively.',
    icon: TrendingDown,
    tips: [
      'List all debts with interest rates and balances to understand your situation',
      'Snowball method: Pay smallest debts first',
      'Avalanche method: Pay highest interest first',
      'Avoid taking on new debt while paying off existing debt',
      'Consider debt consolidation if it lowers your interest rates and simplifies payments',
    ],
  },
  {
    id: 'recurring',
    title: 'Recurring Expenses',
    description: 'Understanding the silent budget killers.',
    icon: RefreshCw,
    tips: [
      'Audit your subscriptions every 3 months',
      'Calculate annual costs of monthly fees',
      'Cancel services you haven’t used in 30 days',
    ],
  },
  {
    id: 'irregular',
    title: 'Irregular Costs',
    description: 'Planning for car repairs, gifts, and holidays.',
    icon: Calendar,
    tips: [
      'Use sinking funds for known future costs',
      'Estimate annual costs and save monthly',
      'Prioritize these over impulse purchases',
    ],
  },
  {
    id: 'subscriptions',
    title: 'Subscription Awareness',
    description: 'Don’t pay for what you don’t use.',
    icon: CreditCard,
    tips: [
      'Check bank statements for forgotten charges',
      'Set reminders before free trials end',
      'Negotiate rates for services like internet',
    ],
  },
  {
    id: 'investing',
    title: 'Introduction to Investing',
    description: 'Basic concepts for growing your wealth over time.',
    icon: TrendingUp,
    tips: [
      'Early investment allows compounding to work across time',
      'Stocks, bonds, and mutual funds represent different investment types with different characteristics',
      'Portfolio diversification spreads your exposure across different investments',
      'Index funds offer a straightforward way to start investing with lower costs',
      'A long-term investing perspective can help you stay grounded through market changes',
    ],
  },
  {
    id: 'protecting-finances',
    title: 'Protecting Your Finances',
    description: 'Insurance and security tips to safeguard your wealth.',
    icon: Shield,
    tips: [
      'Adequate health insurance helps protect against unexpected medical costs',
      'Life insurance can provide for those who depend on your income',
      'Strong passwords and credit monitoring help protect your identity',
      'Annual insurance reviews ensure your coverage matches your current needs',
      'Estate planning with a will and power of attorney provides clarity for loved ones',
    ],
  },
  {
    id: 'financial-goals',
    title: 'Setting Financial Goals',
    description: 'How to set and achieve goals that matter to you.',
    icon: Target,
    tips: [
      'SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) provide a useful framework',
      'Different timeframes help organize goals: short-term (< 1 year), medium-term (1-5 years), long-term (5+ years)',
      'Breaking larger goals into smaller milestones makes them manageable and progress trackable',
      'Visualizing goals with charts or vision boards can serve as motivation',
      'Celebrating milestones builds momentum on your financial journey',
    ],
  },
];

const additionalResources: Resource[] = [
  // Recommended Reading
  {
    id: 'book-tmm',
    category: 'reading',
    title: 'The Total Money Makeover',
    description: 'by Dave Ramsey',
  },
  {
    id: 'book-ymoyl',
    category: 'reading',
    title: 'Your Money or Your Life',
    description: 'by Vicki Robin',
  },
  {
    id: 'book-spw',
    category: 'reading',
    title: 'The Simple Path to Wealth',
    description: 'by JL Collins',
  },
  // Online Courses
  {
    id: 'course-khan',
    category: 'course',
    title: 'Khan Academy: Personal Finance',
  },
  {
    id: 'course-coursera',
    category: 'course',
    title: 'Coursera: Financial Planning',
  },
  {
    id: 'course-edx',
    category: 'course',
    title: 'edX: Introduction to Investments',
  },
  // Pro Tips
  {
    id: 'tip-payself',
    category: 'tip',
    title: 'Pay yourself first - automate savings before spending',
  },
  {
    id: 'tip-review',
    category: 'tip',
    title: 'Review your finances weekly, not just monthly',
  },
  {
    id: 'tip-inflation',
    category: 'tip',
    title: 'Avoid lifestyle inflation as your income grows',
  },
];

export const Learn: React.FC = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const token = await user.getIdToken();
        const apiBaseUrl =
          import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

        const response = await fetch(`${apiBaseUrl}/insights`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch insights');
        }

        const data = await response.json();
        setInsights(data);
      } catch (err) {
        console.error('Error fetching insights:', err);
        setError('Could not load insights at this time.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [user]);

  return (
    <div className='space-y-8 animate-in fade-in duration-500 pb-10'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2'>
          <BookOpen className='h-6 w-6 text-emerald-600 dark:text-emerald-500' />
          Financial Education
        </h1>
        <p className='text-gray-500 dark:text-slate-400 mt-1'>
          Learn essential money management skills and get personalized insights.
        </p>
      </div>

      {/* Insights Section */}
      <section className='space-y-4'>
        <h2 className='text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
          <Lightbulb className='h-5 w-5 text-yellow-500 dark:text-yellow-400' />
          Insights from your activity
        </h2>

        {loading ? (
          <div className='flex h-32 w-full items-center justify-center rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm dark:shadow-none'>
            <Loader2 className='h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-500' />
          </div>
        ) : error ? (
          <div className='rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-6'>
            <p className='text-red-600 dark:text-red-400'>{error}</p>
          </div>
        ) : insights.length === 0 ? (
          <div className='flex items-center gap-4 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 text-gray-500 dark:text-slate-400 shadow-sm dark:shadow-none'>
            <div className='rounded-full bg-emerald-100 dark:bg-emerald-500/10 p-3'>
              <CheckCircle2 className='h-6 w-6 text-emerald-600 dark:text-emerald-500' />
            </div>
            <div>
              <p className='font-medium text-gray-900 dark:text-white'>All clear!</p>
              <p className='text-sm'>
                No specific insights right now. Keep tracking your finances to
                stay on top of things.
              </p>
            </div>
          </div>
        ) : (
          <div className='grid gap-4 md:grid-cols-2'>
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`rounded-xl border p-6 shadow-sm transition-all hover:shadow-md ${insight.level === 'attention'
                  ? 'border-amber-200 dark:border-amber-500/50 bg-amber-50 dark:bg-amber-500/10'
                  : 'border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10'
                  }`}
              >
                <div className='flex items-start gap-4'>
                  {insight.level === 'attention' ? (
                    <AlertCircle className='h-6 w-6 shrink-0 text-amber-600 dark:text-amber-500' />
                  ) : (
                    <Info className='h-6 w-6 shrink-0 text-blue-600 dark:text-blue-400' />
                  )}
                  <div>
                    <h3
                      className={`font-semibold ${insight.level === 'attention'
                        ? 'text-amber-800 dark:text-amber-500'
                        : 'text-blue-800 dark:text-blue-400'
                        }`}
                    >
                      {insight.title}
                    </h3>
                    <p className='mt-1 text-sm text-gray-700 dark:text-slate-300'>
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Education Content */}
      <section className='space-y-6'>
        <div className='rounded-2xl bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-900/20 dark:to-slate-900 border border-emerald-200 dark:border-emerald-500/20 p-8 text-center'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            Build Your Financial Knowledge
          </h2>
          <p className='text-gray-600 dark:text-slate-400 max-w-2xl mx-auto'>
            Mastering the fundamentals is the first step toward financial
            freedom. Explore these essential topics to strengthen your money
            management skills.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {educationTopics.map((topic) => (
            <div
              key={topic.id}
              className='group relative overflow-hidden rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 hover:border-gray-300 dark:hover:border-slate-700 transition-colors shadow-sm dark:shadow-none'
            >
              <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-500 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 transition-colors'>
                <topic.icon className='h-6 w-6' />
              </div>
              <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-white'>
                {topic.title}
              </h3>
              <p className='mb-4 text-sm text-gray-500 dark:text-slate-400'>{topic.description}</p>
              <ul className='space-y-2'>
                {topic.tips.map((tip, index) => (
                  <li
                    key={index}
                    className='flex items-start gap-2 text-sm text-gray-700 dark:text-slate-300'
                  >
                    <span className='mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500' />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Additional Resources */}
      <section className='space-y-6'>
        <div className='rounded-2xl border border-gray-200 dark:border-slate-700/50 bg-gray-50 dark:bg-slate-800/30 p-8 text-center'>
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            Additional Resources
          </h2>
          <p className='text-gray-600 dark:text-slate-400 max-w-2xl mx-auto'>
            Continue your learning journey with recommended books, courses, and pro tips from experts.
          </p>
        </div>

        {/* Recommended Reading */}
        <div className='space-y-4'>
          <div className='flex items-center gap-3'>
            <BookOpen className='h-5 w-5 text-blue-600 dark:text-blue-400' />
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Recommended Reading</h3>
          </div>
          <div className='grid gap-3 md:grid-cols-3'>
            {additionalResources
              .filter((r) => r.category === 'reading')
              .map((resource) => (
                <div
                  key={resource.id}
                  className='rounded-lg border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/5 p-4 hover:border-blue-300 dark:hover:border-blue-500/50 transition-colors'
                >
                  <h4 className='font-semibold text-gray-900 dark:text-white text-sm'>{resource.title}</h4>
                  {resource.description && (
                    <p className='text-xs text-gray-500 dark:text-slate-400 mt-1'>{resource.description}</p>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Online Courses */}
        <div className='space-y-4'>
          <div className='flex items-center gap-3'>
            <GraduationCap className='h-5 w-5 text-emerald-600 dark:text-emerald-400' />
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Online Courses</h3>
          </div>
          <div className='grid gap-3 md:grid-cols-3'>
            {additionalResources
              .filter((r) => r.category === 'course')
              .map((resource) => (
                <div
                  key={resource.id}
                  className='rounded-lg border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/5 p-4 hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-colors'
                >
                  <h4 className='font-semibold text-gray-900 dark:text-white text-sm'>{resource.title}</h4>
                </div>
              ))}
          </div>
        </div>

        {/* Pro Tips */}
        <div className='space-y-4'>
          <div className='flex items-center gap-3'>
            <Lightbulb className='h-5 w-5 text-amber-500 dark:text-amber-400' />
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Pro Tips</h3>
          </div>
          <div className='grid gap-3 md:grid-cols-3'>
            {additionalResources
              .filter((r) => r.category === 'tip')
              .map((resource) => (
                <div
                  key={resource.id}
                  className='rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/5 p-4 hover:border-amber-300 dark:hover:border-amber-500/50 transition-colors'
                >
                  <h4 className='font-semibold text-gray-900 dark:text-white text-sm'>{resource.title}</h4>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};
