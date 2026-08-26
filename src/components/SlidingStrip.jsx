import React from 'react';
import { PRODUCTS } from '../data/products';

export default function SlidingStrip() {
  // Select a rich subset of product images for the marquee
  const marqueeProducts = PRODUCTS.filter((p, i) => i % 2 === 0);

  return (
    <section className="w-full bg-neutral-950 border-b border-neutral-800/80 py-3 overflow-hidden select-none relative group">
      {/* Soft gradient fade on left and right edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none"></div>

      {/* Marquee Track (Duplicated for seamless loop) */}
      <div className="flex gap-4 sm:gap-6 w-max animate-marquee group-hover:[animation-play-state:paused] items-center">
        {[...marqueeProducts, ...marqueeProducts].map((item, idx) => (
          <a
            key={`${item.id}-${idx}`}
            href="#products"
            className="flex-shrink-0 flex items-center gap-3 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-800/80 hover:border-amber-400/60 rounded-xl p-1.5 sm:p-2 transition-all duration-300 transform hover:scale-105"
            title={`${item.name} - ${item.price}`}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-black shrink-0 border border-neutral-800">
              <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="pr-2 hidden sm:block">
              <div className="text-[11px] font-bold text-neutral-200 truncate max-w-[120px]">{item.name}</div>
              <div className="text-xs font-black text-amber-400 font-['Outfit']">{item.price}</div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
