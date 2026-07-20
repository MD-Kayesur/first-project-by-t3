"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const routes = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all">
                <span className="text-white font-bold text-lg leading-none tracking-tighter">T3</span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Nexus
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden sm:flex sm:gap-1">
              {routes.map((route) => {
                const isActive = pathname === route.path;
                return (
                  <Link
                    key={route.path}
                    href={route.path}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {route.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side Actions (e.g. Profile or Login placeholder) */}
          <div className="hidden sm:flex sm:items-center sm:gap-4">
            <Link href="/auth" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup" className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-indigo-600 shadow-md transition-all">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white shadow-xl absolute w-full left-0">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {routes.map((route) => {
              const isActive = pathname === route.path;
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {route.name}
                </Link>
              );
            })}
            <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link href="/auth" onClick={() => setIsOpen(false)} className="block w-full px-4 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold text-center transition-colors hover:bg-slate-200">
                Sign In
              </Link>
              <Link href="/auth/signup" onClick={() => setIsOpen(false)} className="block w-full px-4 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-md shadow-indigo-200 text-center transition-all hover:bg-indigo-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
