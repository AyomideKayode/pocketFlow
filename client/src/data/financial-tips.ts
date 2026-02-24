export const FINANCIAL_TIPS = [
  {
    id: 1,
    title: 'Review Your Subscriptions',
    tip: 'Check your subscriptions monthly to catch unused services. The average person wastes $200/year on forgotten subscriptions.',
    category: 'saving',
  },
  {
    id: 2,
    title: '50/30/20 Rule',
    tip: 'Allocate 50% of income to needs, 30% to wants, and 20% to savings and debt repayment for balanced finances.',
    category: 'budgeting',
  },
  {
    id: 3,
    title: 'Emergency Fund First',
    tip: 'Before investing or paying extra on debt, build a 3-6 month emergency fund. Financial security starts with a safety net.',
    category: 'saving',
  },
  {
    id: 4,
    title: 'Automate Your Savings',
    tip: 'Set up automatic transfers to savings on payday. Paying yourself first makes saving effortless and consistent.',
    category: 'saving',
  },
  {
    id: 5,
    title: 'Track Every Expense',
    tip: 'Small purchases add up. Tracking everything reveals spending patterns and helps you make informed decisions.',
    category: 'budgeting',
  },
  {
    id: 6,
    title: 'Pay Bills on Time',
    tip: 'Set up bill reminders or auto-pay to avoid late fees and protect your credit score. Consistency is key.',
    category: 'bills',
  },
  {
    id: 7,
    title: 'Compare Before Big Purchases',
    tip: 'For purchases over $100, research alternatives and wait 24 hours. Impulse buys often lead to regret.',
    category: 'spending',
  },
  {
    id: 8,
    title: 'Review Your Budget Monthly',
    tip: 'Life changes monthly. Adjust your budget to reflect new goals, income changes, or unexpected expenses.',
    category: 'budgeting',
  },
];

// Get a tip based on day of year (changes daily)
export const getDailyTip = () => {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
    86400000,
  );
  const index = dayOfYear % FINANCIAL_TIPS.length;
  return FINANCIAL_TIPS[index];
};
