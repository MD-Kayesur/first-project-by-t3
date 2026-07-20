"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("If an account exists with that email, a reset link has been sent.");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to send reset email.");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="text-white font-bold text-xl leading-none tracking-tighter">T3</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Enter your email address and we will send you a link to reset your password.
          </p>
        </div>

        {status === "success" && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm text-center font-medium">
            {message}
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm text-center font-medium">
            {message}
          </div>
        )}

        {status !== "success" && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email-address" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-4 py-3 border border-slate-200 placeholder-slate-400 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md shadow-indigo-500/30 transition-all hover:shadow-lg hover:shadow-indigo-500/40 disabled:opacity-70"
              >
                {status === "loading" ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center text-sm">
          <Link href="/auth" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
            &larr; Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
