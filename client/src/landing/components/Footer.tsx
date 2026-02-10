import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-16 px-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <Wallet className="h-5 w-5 text-emerald-500" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-white group-hover:text-emerald-50 transition-colors">
                PocketFlow
              </span>
            </Link>
            <p className="text-slate-500 max-w-xs leading-relaxed">
              Simple finance tracking for people who value their privacy.
            </p>
          </div>

          {/* Product */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Product
            </h4>
            <div className="flex flex-col gap-2">
              {["Dashboard", "Features", "How it Works", "Pricing"].map((item) => (
                <Link
                  key={item}
                  to="#"
                  className="text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Support
            </h4>
            <div className="flex flex-col gap-2">
              {["Help Center", "Contact Us", "Feature Requests", "Report a Bug"].map((item) => (
                <Link
                  key={item}
                  to="#"
                  className="text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Legal
            </h4>
            <div className="flex flex-col gap-2">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <Link
                  key={item}
                  to="#"
                  className="text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-600 text-sm">
          <p>© 2026 PocketFlow. Built with care.</p>
          <div className="flex items-center gap-6">
            {/* Social icons or extra links could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
};
