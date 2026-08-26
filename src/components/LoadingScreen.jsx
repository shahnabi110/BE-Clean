import React, { useEffect, useState } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Smooth progress bar simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFading(true);
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 600); // Duration matches fade transition
          return 100;
        }
        const diff = Math.floor(Math.random() * 25) + 15;
        return Math.min(prev + diff, 100);
      });
    }, 180);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#070F1E] flex flex-col items-center justify-center p-4 transition-opacity duration-600 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Subtle Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center max-w-sm text-center space-y-6">
        
        {/* Logo Container with Animated Glow */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/25 via-emerald-500/25 to-amber-500/25 rounded-2xl blur-lg animate-pulse"></div>
          <div className="relative bg-[#0F1D36]/90 border border-[#1C3056] rounded-2xl p-4 sm:p-6 shadow-2xl">
            <img
              src="/logo.png"
              alt="BE-Clean Logo"
              className="h-20 sm:h-28 w-auto object-contain drop-shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse"
            />
          </div>
        </div>

        {/* Brand Tagline */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 bg-[#0F1D36] border border-amber-500/30 rounded-full px-3 py-1 text-[10px] sm:text-xs font-bold text-amber-400">
            <Sparkles size={13} className="text-amber-400" />
            <span>BE PAKISTANI, BUY PAKISTANI</span>
          </div>
          <p className="text-xs text-slate-300 font-medium">
            10+ Years of Customer Trust & Loyalty (Since 2016)
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-48 sm:w-64 space-y-2 pt-2">
          <div className="h-1.5 w-full bg-[#0F1D36] rounded-full overflow-hidden border border-[#1C3056] p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span>Loading Experience...</span>
            <span className="text-cyan-400 font-black">{progress}%</span>
          </div>
        </div>

        {/* Verification Icon Badge */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold pt-4">
          <ShieldCheck size={13} className="text-emerald-400" />
          <span>Official Direct Rawalpindi & Islamabad Supply</span>
        </div>

      </div>
    </div>
  );
}
