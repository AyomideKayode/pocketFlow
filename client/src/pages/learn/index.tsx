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

const educationTopics: EducationTopic[] = [
  {
    id: 'budgeting',
    title: 'Budgeting Basics',
    description: 'Master the art of tracking every dollar to reach your goals.',
    icon: Wallet,
    tips: [
      'Try the 50/30/20 rule: Needs, Wants, Savings',
      'Track expenses daily to build awareness',
      'Review your budget weekly, not just monthly',
    ],
  },
  {
    id: 'emergency-fund',
    title: 'Emergency Fund',
    description: 'Build a safety net for unexpected life events.',
    icon: Shield,
    tips: [
      'Start small: Aim for $500 first',
      'Work towards 3-6 months of expenses',
      'Keep it in a separate high-yield account',
    ],
  },
  {
    id: 'debt',
    title: 'Managing Debt',
    description: 'Strategies to reduce financial burden effectively.',
    icon: TrendingUp,
    tips: [
      'Snowball method: Pay smallest debts first',
      'Avalanche method: Pay highest interest first',
      'Avoid taking on new debt while paying off old',
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
        <h1 className='text-2xl font-bold text-white flex items-center gap-2'>
          <BookOpen className='h-6 w-6 text-emerald-500' />
          Financial Education
        </h1>
        <p className='text-slate-400 mt-1'>
          Learn essential money management skills and get personalized insights.
        </p>
      </div>

      {/* Insights Section */}
      <section className='space-y-4'>
        <h2 className='text-lg font-semibold text-white flex items-center gap-2'>
          <Lightbulb className='h-5 w-5 text-yellow-400' />
          Insights from your activity
        </h2>

        {loading ? (
          <div className='flex h-32 w-full items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50'>
            <Loader2 className='h-8 w-8 animate-spin text-emerald-500' />
          </div>
        ) : error ? (
           <div className='rounded-xl border border-red-900/50 bg-red-900/10 p-6'>
             <p className='text-red-400'>{error}</p>
           </div>
        ) : insights.length === 0 ? (
          <div className='flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-slate-400'>
            <div className='rounded-full bg-emerald-500/10 p-3'>
              <CheckCircle2 className='h-6 w-6 text-emerald-500' />
            </div>
            <div>
              <p className='font-medium text-white'>All clear!</p>
              <p className='text-sm'>
                No specific insights right now. Keep tracking your finances to stay on top of things.
              </p>
            </div>
          </div>
        ) : (
          <div className='grid gap-4 md:grid-cols-2'>
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`rounded-xl border p-6 shadow-sm transition-all hover:shadow-md ${
                  insight.level === 'attention'
                    ? 'border-amber-500/50 bg-amber-500/10'
                    : 'border-blue-500/30 bg-blue-500/10'
                }`}
              >
                <div className='flex items-start gap-4'>
                  {insight.level === 'attention' ? (
                    <AlertCircle className='h-6 w-6 shrink-0 text-amber-500' />
                  ) : (
                    <Info className='h-6 w-6 shrink-0 text-blue-400' />
                  )}
                  <div>
                    <h3
                      className={`font-semibold ${
                        insight.level === 'attention'
                          ? 'text-amber-500'
                          : 'text-blue-400'
                      }`}
                    >
                      {insight.title}
                    </h3>
                    <p className='mt-1 text-sm text-slate-300'>
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
        <div className='rounded-2xl bg-gradient-to-r from-emerald-900/20 to-slate-900 border border-emerald-500/20 p-8 text-center'>
          <h2 className='text-2xl font-bold text-white mb-2'>Build Your Financial Knowledge</h2>
          <p className='text-slate-400 max-w-2xl mx-auto'>
            Mastering the fundamentals is the first step toward financial freedom. Explore these essential topics to strengthen your money management skills.
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {educationTopics.map((topic) => (
            <div
              key={topic.id}
              className='group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition-colors'
            >
              <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800 text-emerald-500 group-hover:bg-emerald-500/10 transition-colors'>
                <topic.icon className='h-6 w-6' />
              </div>
              <h3 className='mb-2 text-lg font-semibold text-white'>
                {topic.title}
              </h3>
              <p className='mb-4 text-sm text-slate-400'>
                {topic.description}
              </p>
              <ul className='space-y-2'>
                {topic.tips.map((tip, index) => (
                  <li key={index} className='flex items-start gap-2 text-sm text-slate-300'>
                    <span className='mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500' />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
