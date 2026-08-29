import React, { useEffect, useState } from "react";

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fading,   setFading]   = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFading(true);
          setTimeout(() => { if (onFinish) onFinish(); }, 500);
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
      className={`fixed inset-0 z-50 bg-[#070F1E] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Clean, no glow blobs, no glassmorphism */}
      <div className="flex flex-col items-center gap-7 text-center">

        {/* Logo — plain, no animated glow ring */}
        <img
          src="/logo.png"
          alt="BE-Clean"
          className="h-36 sm:h-52 w-auto object-contain"
        />

        {/* Brand identity lines */}
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-400">
            BE PAKISTANI · BUY PAKISTANI
          </p>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            Manufacturing · Rawalpindi · Since 2016
          </p>
        </div>

        {/* Minimal progress bar — single amber line, no gradient rainbow */}
        <div className="w-36 sm:w-52">
          <div className="h-px w-full bg-[#131F36] rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
