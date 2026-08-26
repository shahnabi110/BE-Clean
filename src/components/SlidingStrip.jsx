import React from 'react';
import { PRODUCTS } from '../data/products';

export default function SlidingStrip() {
  // Select a rich subset of product images for the marquee
  const marqueeProducts = PRODUCTS.filter((p, i) => i % 2 === 0);

  return (
    <section className="w-full bg-[#091326] border-b border-[#1A2E4D] py-1.5 sm:py-3 overflow-hidden select-none relative group">
      {/* Soft gradient fade on left and right edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-r from-[#070F1E] via-[#070F1E]/80 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 bg-gradient-to-l from-[#070F1E] via-[#070F1E]/80 to-transparent z-10 pointer-events-none"></div>

      {/* Marquee Track (Duplicated for seamless loop) */}
      <div className="flex gap-2.5 sm:gap-6 w-max animate-marquee group-hover:[animation-play-state:paused] items-center">
        {[...marqueeProducts, ...marqueeProducts].map((item, idx) => (
          <a
            key={`${item.id}-${idx}`}
            href="#products"
            className="flex-shrink-0 flex items-center gap-2 bg-[#0F1F38] hover:bg-[#162D50] border border-[#1E3A5F] hover:border-cyan-400/70 rounded-lg sm:rounded-xl p-1 sm:p-2 transition-all duration-300 transform hover:scale-105 shadow-md"
            title={`${item.name} - ${item.price}`}
          >
            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-md sm:rounded-lg overflow-hidden bg-[#070F1E] shrink-0 border border-[#1E3A5F]">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="pr-1.5 hidden sm:block">
              <div className="text-[11px] font-bold text-slate-200 truncate max-w-[120px]">{item.name}</div>
              <div className="text-xs font-black text-amber-400 font-['Outfit']">{item.price}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
