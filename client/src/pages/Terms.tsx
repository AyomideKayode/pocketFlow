import { LandingNavbar } from '../landing/components/LandingNavbar';
import { Footer } from '../landing/components/Footer';

export const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30 flex flex-col">
      <LandingNavbar />

      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Terms of Service
            </h1>
            <p className="text-slate-400">Last updated: February 2026</p>
          </div>

          <div className="prose prose-invert prose-lg max-w-none text-slate-300 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Acceptance</h2>
              <p>
                By using PocketFlow, you agree to these terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Service Description</h2>
              <p>
                PocketFlow provides tools for personal financial tracking and education. It is not a bank, investment advisor, or financial institution.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">No Financial Advice</h2>
              <p>
                Information provided by PocketFlow is for awareness and educational purposes only. It does not constitute professional financial advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">User Responsibilities</h2>
              <p>
                You are responsible for the accuracy of the information you enter and for keeping your account credentials secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Availability</h2>
              <p>
                We aim for reliability but cannot guarantee uninterrupted service. We are not liable for any downtime or data loss.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <p>
                PocketFlow is provided "as-is" without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
              <p>
                You may stop using the service at any time. We reserve the right to suspend or terminate accounts that misuse the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Changes</h2>
              <p>
                These terms may evolve as the product grows. Continued use of the service implies acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact</h2>
              <p>
                Questions about the terms? Reach out via email at: <a href="mailto:ayomidekay7@gmail.com" className="text-emerald-400 hover:text-emerald-300">ayomidekay7@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
