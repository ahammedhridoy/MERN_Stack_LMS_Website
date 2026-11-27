import React, { useState } from "react";
import { assets } from "../../assets/assets";

const MissingKeyNotice = () => {
  const [copied, setCopied] = useState(false);

  const envSnippet = `# frontend/.env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
VITE_BACKEND_URL=http://localhost:5000
VITE_CURRENCY=$`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans text-slate-800">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-soft-xl p-6 sm:p-10 text-left">
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <img src={assets.eduka} alt="Eduka Logo" className="w-10 h-auto" />
          <div>
            <h1 className="text-lg font-bold text-slate-900">Eduka LMS</h1>
            <p className="text-xs text-slate-400">Environment Setup Required</p>
          </div>
        </div>

        {/* Notice Alert */}
        <div className="mt-6 flex items-start gap-3.5 p-4 rounded-2xl bg-amber-50 border border-amber-200/80">
          <span className="text-xl shrink-0">⚠️</span>
          <div>
            <h2 className="text-sm font-bold text-amber-900">
              Missing Clerk Publishable Key
            </h2>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              The frontend is unable to initialize authentication because{" "}
              <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono text-[11px] text-amber-900">
                VITE_CLERK_PUBLISHABLE_KEY
              </code>{" "}
              is not defined in your <code className="bg-amber-100/80 px-1.5 py-0.5 rounded font-mono text-[11px] text-amber-900">frontend/.env</code> file.
            </p>
          </div>
        </div>

        {/* Steps to resolve */}
        <div className="mt-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            How to resolve this issue in 3 quick steps:
          </h3>

          <ol className="space-y-3 text-xs sm:text-sm text-slate-600 list-decimal list-inside">
            <li className="leading-relaxed">
              Get your free key from{" "}
              <a
                href="https://dashboard.clerk.com"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-brand-600 underline hover:text-brand-800"
              >
                dashboard.clerk.com
              </a>{" "}
              (under <strong>API Keys</strong> → <strong>Publishable Key</strong>).
            </li>
            <li className="leading-relaxed">
              Create a file named{" "}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs text-slate-800">
                .env
              </code>{" "}
              inside the{" "}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs text-slate-800">
                frontend/
              </code>{" "}
              directory.
            </li>
            <li className="leading-relaxed">
              Paste the following configuration into your <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-xs text-slate-800">.env</code> and save:
            </li>
          </ol>

          {/* Snippet Card */}
          <div className="relative mt-2 bg-slate-900 rounded-2xl p-4 font-mono text-xs text-slate-200 overflow-x-auto">
            <button
              onClick={copyToClipboard}
              className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-sans font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
            <pre className="text-slate-300">
              <code>{envSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>Vite will automatically hot-reload once saved.</span>
          <a
            href="https://clerk.com/docs/quickstarts/react"
            target="_blank"
            rel="noreferrer"
            className="text-brand-600 hover:text-brand-700 font-medium"
          >
            Clerk React Docs ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default MissingKeyNotice;