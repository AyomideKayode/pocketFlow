import { LandingNavbar } from '../landing/components/LandingNavbar';
import { Footer } from '../landing/components/Footer';

export const Privacy = () => {
  return (
    <div className='min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-50 font-sans selection:bg-emerald-500/30 flex flex-col'>
      <LandingNavbar />

      <main className='flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='max-w-3xl mx-auto space-y-12'>
          {/* Header */}
          <div className='text-center space-y-4'>
            <h1 className='text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white'>
              Privacy Policy
            </h1>
            <p className='text-gray-500 dark:text-slate-400'>Last updated: February 2026</p>
          </div>

          <div className='prose prose-gray dark:prose-invert prose-lg max-w-none text-gray-600 dark:text-slate-300 space-y-8'>
            <section>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Overview</h2>
              <p>
                PocketFlow is built to help individuals understand their
                finances while keeping their information private and under their
                control.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Information You Provide
              </h2>
              <p>We store only the data you choose to enter, such as:</p>
              <ul className='list-disc pl-6 space-y-2 marker:text-emerald-500'>
                <li>Transactions</li>
                <li>Bills</li>
                <li>Budgets</li>
                <li>Account preferences</li>
              </ul>
            </section>

            <section>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Authentication
              </h2>
              <p>
                Authentication is handled securely through trusted providers
                (Google, GitHub, Email). We do not see or store your passwords.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                How Your Data Is Used
              </h2>
              <p>
                Your information is used solely to provide the PocketFlow
                service: calculations, reminders, and visualizations.
              </p>
              <ul className='list-disc pl-6 space-y-2 marker:text-emerald-500'>
                <li>We do not sell data.</li>
                <li>We do not share data with advertisers.</li>
                <li>We do not use your information for marketing profiling.</li>
              </ul>
            </section>

            <section>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Data Ownership
              </h2>
              <p>
                Your data belongs to you. You may export or delete it at any
                time.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Security</h2>
              <p>
                We apply industry-standard security practices to protect stored
                information. No system is perfect, but safeguarding your data is
                a priority.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Data Retention
              </h2>
              <p>
                We retain your data only for as long as your account is active
                or as needed to provide you services. If you delete your
                account, your data is removed from our active databases.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Data Deletion & User Rights
              </h2>
              <p>
                You have the right to access, correct, export, or delete your
                personal data. You can delete your account directly within the
                settings or request assistance by contacting support.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Third-Party Services
              </h2>
              <p>
                We use trusted third-party services for essential
                infrastructure, such as authentication (Firebase), hosting
                (Vercel), and database management (MongoDB). These providers
                adhere to strict data protection standards.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                Children's Privacy
              </h2>
              <p>
                PocketFlow is not intended for use by children under the age of
                13. We do not knowingly collect personal information from
                children.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Changes</h2>
              <p>
                If this policy changes, updates will be reflected on this page.
              </p>
            </section>

            <section>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>Contact</h2>
              <p>
                Questions? Reach out at:{' '}
                <a
                  href='mailto:ayomidekay7@gmail.com'
                  className='text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300'
                >
                  ayomidekay7@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
