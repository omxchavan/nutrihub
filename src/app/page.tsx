import { ArrowRight, Sparkles, Brain, ActivitySquare } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="min-h-dvh pt-24 pb-12 flex flex-col justify-center relative overflow-hidden">
      {/* Clear background for clean UI */}


      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 mt-12">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl clay-panel mb-6">
            <Sparkles className="w-4 h-4 text-[var(--color-brand-green)] font-bold" />
            <span className="text-sm font-bold text-[var(--color-brand-green)]">AI Powered</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-slate-800">
            The Future of <br />
            <span className="text-gradient">Nutrition Intelligence</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto lg:mx-0 font-medium">
            Scan your food, track your macros, and get personalized AI diet coaching based on your body goals—with a beautiful soft clay experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <SignedOut>
              <Link href="/sign-up" className="px-8 py-4 clay-btn-primary text-lg flex items-center justify-center gap-2 font-bold">
                Start Tracking Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="px-8 py-4 clay-btn-primary text-lg flex items-center justify-center gap-2 font-bold shadow-sm">
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            </SignedIn>
          </div>
        </div>

        <div className="flex-1 w-full max-w-lg relative">
          {/* Floating cards showcase */}
          <div className="relative h-[500px] w-full mt-10 lg:mt-0">
            {/* Main Center Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm clay-card p-6 z-20 animate-[float_6s_ease-in-out_infinite]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-slate-500 text-sm font-bold/80">Daily Calories</h3>
                  <div className="text-3xl font-extrabold mt-1 text-slate-800">1,840 <span className="text-lg text-slate-400">/ 2500</span></div>
                </div>
                <div className="w-12 h-12 rounded-2xl border-4 border-[var(--color-brand-green)] flex items-center justify-center text-xs font-bold shadow-sm text-slate-700 bg-white">
                  73%
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1 text-slate-600 font-bold">
                    <span>Protein</span>
                    <span>120g / 180g</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-[var(--color-brand-orange)] w-[66%] rounded-full shadow-sm"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1 text-slate-600 font-bold">
                    <span>Carbs</span>
                    <span>200g / 250g</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-[var(--color-brand-green)] w-[80%] rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Floating Card 1 */}
            <div className="absolute top-[10%] -right-4 lg:-right-12 clay-panel p-4 z-30 animate-[float_5s_ease-in-out_infinite_1s]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-brand-orange)]/20 rounded-xl">
                  <Brain className="w-5 h-5 text-[var(--color-brand-orange)]" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold">AI Insight</div>
                  <div className="text-sm font-extrabold text-slate-800">Increase protein intake</div>
                </div>
              </div>
            </div>

            {/* Small Floating Card 2 */}
            <div className="absolute bottom-[20%] -left-4 lg:-left-12 clay-panel p-4 z-30 animate-[float_7s_ease-in-out_infinite_2s]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-brand-green)]/20 rounded-xl">
                  <ActivitySquare className="w-5 h-5 text-[var(--color-brand-green)]" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-bold">Meal Scanned</div>
                  <div className="text-sm font-extrabold text-slate-800">Grilled Salmon Salad</div>
                  <div className="text-xs text-[var(--color-brand-green)] font-bold mt-1">+45g Protein</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
