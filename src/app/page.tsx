"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-900 text-white selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-violet-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[50%] bg-fuchsia-600/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-20 lg:py-32">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-2xl">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold tracking-wide text-emerald-400 uppercase">
            T3 Stack Ready
          </span>
        </div>

        {/* Hero Content */}
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]">
            Build Faster with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
              Modern Architecture.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-medium">
            A production-ready starting point featuring tRPC, Tailwind CSS, Prisma, and Next.js App Router. Scalable from day one.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link 
              href="/products" 
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              Explore Products
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <a 
              href="https://create.t3.gg/" 
              target="_blank" 
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-bold text-lg backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2"
            >
              Read Docs
            </a>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full">
          {[
            {
              icon: "⚡️",
              title: "End-to-End Typesafe",
              desc: "tRPC seamlessly connects your backend and frontend with zero boilerplate."
            },
            {
              icon: "🎨",
              title: "Tailwind Styling",
              desc: "Rapidly build modern user interfaces without ever leaving your HTML."
            },
            {
              icon: "🗄️",
              title: "Prisma ORM",
              desc: "Next-generation ORM for Node.js and TypeScript. Intuitive data modeling."
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors backdrop-blur-sm group">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Section 1: How it Works */}
        <div className="mt-32 w-full text-center">
          <h2 className="text-4xl font-bold text-white mb-6">How It Works</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12">
            Experience a seamless workflow from start to finish. Our platform is designed to make your journey as smooth as possible.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['1. Discover', '2. Build', '3. Deploy'].map((step, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <h4 className="text-xl font-semibold text-emerald-400 mb-2">{step}</h4>
                <p className="text-slate-400 text-sm">Everything you need to get started and scale your next big idea.</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Testimonials */}
        <div className="mt-32 w-full">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: "Sarah J.", role: "Frontend Developer", text: "This T3 stack boilerplate saved me weeks of setup time. Highly recommended!" },
              { name: "Michael T.", role: "CTO", text: "The perfect balance of productivity and type safety. Our team loves it." }
            ].map((testimonial, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-serif">"</div>
                <p className="text-slate-300 text-lg mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <span className="text-emerald-400 text-sm">{testimonial.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Pricing */}
        <div className="mt-32 w-full text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Simple Pricing</h2>
          <p className="text-slate-400 mb-12 max-w-xl mx-auto">Start for free, upgrade when you need to.</p>
          <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
            {[
              { name: "Starter", price: "Free", features: ["Core features", "Community support", "1 Project"] },
              { name: "Pro", price: "$29/mo", features: ["Everything in Starter", "Priority support", "Unlimited Projects"], highlighted: true }
            ].map((plan, i) => (
              <div key={i} className={`flex-1 p-8 rounded-3xl border ${plan.highlighted ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-white/[0.02] border-white/[0.05]'}`}>
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-black text-white mb-6">{plan.price}</div>
                <ul className="space-y-4 text-left mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center text-slate-300">
                      <span className="text-emerald-400 mr-2">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-bold transition-colors ${plan.highlighted ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
