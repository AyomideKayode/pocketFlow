import { SEO_CONFIG } from '../config/seo';

export const StructuredData = () => {
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PocketFlow',
    applicationCategory: 'FinanceApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    operatingSystem: 'Web Browser',
    description: SEO_CONFIG.defaultDescription,
    featureList: [
      'Bill & Subscription Management',
      'Budget Tracking',
      'Spending Insights',
      'Financial Goals',
      'CSV Import/Export',
      'Email Notifications',
    ],
    screenshot: `${SEO_CONFIG.siteUrl}/og-image.jpg`,
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PocketFlow',
    url: SEO_CONFIG.siteUrl,
    logo: `${SEO_CONFIG.siteUrl}/favicon.svg`,
    description: 'Simple finance tracking for people who value their privacy.',
    sameAs: Object.values(SEO_CONFIG.social),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is PocketFlow really free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, completely free. No hidden fees, no premium tiers, no credit card required. We built this to help people take control of their finances, not to charge them for it.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you need access to my bank account?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. PocketFlow is manual tracking only. You log your own transactions, which means we never need (or want) access to your bank credentials. Your accounts stay private.',
        },
      },
      {
        '@type': 'Question',
        name: 'What data do you collect?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Only what you explicitly enter: transactions, budgets, bills, and goals. We use Firebase for secure authentication, but we never sell your data, share it with third parties, or show you ads.',
        },
      },
    ],
  };

  return (
    <>
      <script type='application/ld+json'>
        {JSON.stringify(softwareSchema)}
      </script>
      <script type='application/ld+json'>
        {JSON.stringify(organizationSchema)}
      </script>
      <script type='application/ld+json'>{JSON.stringify(faqSchema)}</script>
    </>
  );
};
