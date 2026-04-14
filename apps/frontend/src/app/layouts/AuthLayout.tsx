import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

function AuthMarketingPanel() {
  //* States

  //* Custom hooks

  //* Refs

  //* Helper functions

  //* Life cycle hooks

  //* Handlers

  //* JSX
  return (
    <div className="relative hidden min-h-full flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#152238] via-[#1c3558] to-[#142a45] p-8 lg:flex">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 top-16 h-[22rem] w-[22rem] rounded-full border border-white/[0.08]" />
        <div className="absolute bottom-32 left-6 h-40 w-px bg-gradient-to-b from-teal-400/50 to-transparent" />
        <div className="absolute bottom-20 left-10 h-24 w-px bg-gradient-to-b from-white/20 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center gap-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.97] p-6 shadow-2xl shadow-black/20 backdrop-blur-sm lg:p-7">
          <div className="mb-4 flex items-center gap-3">
            <div
              className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 ring-2 ring-white"
              aria-hidden
            />
            <div>
              <p className="text-sm font-semibold text-[#1e3a5f]">Elysian Logic</p>
              <p className="text-xs text-gray-500">Head of Talent Acquisition</p>
            </div>
          </div>
          <blockquote
            className="text-xl font-semibold leading-snug text-[#1e3a5f] lg:text-2xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            &ldquo;The platform transforms how we perceive human potential.&rdquo;
          </blockquote>
          <div className="mt-5 inline-flex rounded-full bg-teal-500/15 px-3 py-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-800">
              Validated strategy
            </span>
          </div>
        </div>

        <div className="ml-auto max-w-[280px] rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">
              Network growth
            </span>
            <svg
              className="h-4 w-4 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-blue-400 to-blue-600" />
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-white/70">
            92% match accuracy achieved this quarter.
          </p>
        </div>
      </div>

      <p className="relative z-10 text-right text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
        Intelligence for global enterprise
      </p>
    </div>
  );
}

/**
 * Split-screen auth: white form panel (left) + dark marketing panel (right), 50:50.
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  //* States

  //* Custom hooks

  //* Refs

  //* Helper functions

  //* Life cycle hooks

  //* Handlers

  //* JSX
  return (
    <div className="flex min-h-screen">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
        {children}
      </div>
      <AuthMarketingPanel />
    </div>
  );
};
