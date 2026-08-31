import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { PRODUCTS } from '../data/products';

const WhatsAppIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`inline-block shrink-0 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.461c-1.884 0-3.647-.507-5.166-1.39l-.37-.217-3.837 1.006 1.024-3.74-.24-.382a10.87 10.87 0 0 1-1.666-5.836c0-6.012 4.89-10.902 10.902-10.902 2.91 0 5.648 1.134 7.706 3.194a10.84 10.84 0 0 1 3.191 7.708c0 6.013-4.89 10.903-10.902 10.903m0-20.003C5.932 1.84 1 6.772 1 12.843c0 2.298.705 4.437 1.91 6.208L1 23l4.088-1.072c1.71 1.06 3.731 1.674 5.922 1.674 6.072 0 11.003-4.932 11.003-11.003 0-2.939-1.144-5.702-3.224-7.783A10.94 10.94 0 0 0 12.051 1.84z" />
  </svg>
);

const PHONE = "923361503644";
const waLink = (name, price) =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent(`Hello BE-Clean, I want to order ${name} (${price}).`)}`;

// Select 12 featured products across various categories
const FEATURED_PRODUCTS = PRODUCTS.filter((_, i) => i % 4 === 0).slice(0, 12);

export default function SlidingStrip() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const total = FEATURED_PRODUCTS.length;
  const containerRef = useRef(null);

  // Check viewport width for responsive 3D values
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigation handlers
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  // Autoplay with pause on hover/drag
  useEffect(() => {
    if (isHovered || isDragging) return;
    const timer = setInterval(() => {
      handleNext();
    }, 3600);
    return () => clearInterval(timer);
  }, [isHovered, isDragging, handleNext]);

  // Mouse & Touch Drag Handlers
  const handleStart = (clientX) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragOffset(0);
  };

  const handleMove = (clientX) => {
    if (!isDragging) return;
    const delta = clientX - dragStartX;
    setDragOffset(delta);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = 35;
    if (dragOffset < -threshold) {
      handleNext();
    } else if (dragOffset > threshold) {
      handlePrev();
    }
    setDragOffset(0);
  };

  // Mouse events
  const onMouseDown = (e) => handleStart(e.clientX);
  const onMouseMove = (e) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => {
    if (isDragging) handleEnd();
    setIsHovered(false);
  };

  // Touch events
  const onTouchStart = (e) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e) => handleMove(e.touches[0].clientX);
  const onTouchEnd = () => handleEnd();

  // Compute 3D transforms for card based on relative index offset
  const getCardStyle = (index) => {
    let offset = index - activeIndex;

    // Handle wrap-around for smooth looping visuals
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const absOffset = Math.abs(offset);

    // Ultra-sleek responsive position steps for mobile vs desktop
    const translateXStep = isMobile ? 90 : 230;
    const rotateYAngle   = isMobile ? 10 : 22;
    const translateZStep = isMobile ? 70 : 160;

    let translateX = offset * translateXStep + dragOffset * 0.4;
    let rotateY = 0;
    let translateZ = 0;
    let scale = 1;
    let opacity = 1;
    let zIndex = 10 - absOffset;
    let shadow = '0 8px 20px -4px rgba(0, 0, 0, 0.4)';

    if (offset === 0) {
      // Center card — focused, sleek & clean
      rotateY = dragOffset * 0.05;
      translateZ = isMobile ? 15 : 30;
      scale = isMobile ? 1.02 : 1.08;
      opacity = 1;
      zIndex = 30;
      shadow = '0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 25px rgba(245, 158, 11, 0.12)';
    } else if (offset > 0) {
      // Right side cards
      rotateY = -rotateYAngle * Math.min(absOffset, 2);
      translateZ = -translateZStep * absOffset;
      scale = Math.max(0.65, 1 - absOffset * (isMobile ? 0.12 : 0.14));
      opacity = Math.max(0.2, 0.82 - absOffset * 0.25);
      shadow = '0 10px 25px -6px rgba(0, 0, 0, 0.5)';
    } else {
      // Left side cards
      rotateY = rotateYAngle * Math.min(absOffset, 2);
      translateZ = -translateZStep * absOffset;
      scale = Math.max(0.65, 1 - absOffset * (isMobile ? 0.12 : 0.14));
      opacity = Math.max(0.2, 0.82 - absOffset * 0.25);
      shadow = '0 10px 25px -6px rgba(0, 0, 0, 0.5)';
    }

    // Hide cards beyond visible threshold
    if (absOffset > 2.2) {
      opacity = 0;
      pointerEvents: 'none';
    }

    return {
      style: {
        transform: `translate3d(${translateX}px, 0px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        zIndex,
        boxShadow: shadow,
        transition: isDragging
          ? 'none'
          : 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 650ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 650ms cubic-bezier(0.22, 1, 0.36, 1)',
      },
      absOffset,
      offset,
    };
  };

  return (
    <section className="relative w-full py-4 sm:py-14 bg-[#070F1E] overflow-hidden select-none border-b border-[#131F36]">

      {/* Section label */}
      <div className="max-w-7xl mx-auto px-4 mb-2 sm:mb-6 text-center">
        <span className="text-[9px] sm:text-xs font-black uppercase tracking-[0.25em] text-amber-400">
          Featured Product Showcase
        </span>
      </div>

      {/* 3D Perspective Stage Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[220px] sm:h-[380px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ perspective: isMobile ? '600px' : '1100px' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >

        {/* 3D Track */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {FEATURED_PRODUCTS.map((prod, index) => {
            const { style, offset } = getCardStyle(index);
            const isCenter = offset === 0;

            return (
              <div
                key={prod.id}
                onClick={() => {
                  if (!isCenter) setActiveIndex(index);
                }}
                className={`absolute w-[145px] sm:w-[270px] bg-[#0F1D36] rounded-lg sm:rounded-2xl border border-[#1C3056] overflow-hidden flex flex-col transition-colors duration-300 ${
                  isCenter ? 'border-amber-500/50 cursor-default' : 'cursor-pointer hover:border-slate-500'
                }`}
                style={style}
              >
                {/* Product Image with subtle parallax inner shift */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#050B15]">
                  <img
                    src={prod.img}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out"
                    style={{
                      transform: `translateX(${offset * -8}px) scale(1.06)`,
                    }}
                    loading="lazy"
                  />
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2">
                    <span className="bg-[#070F1E]/90 border border-[#1C3056] text-amber-400 text-[7px] sm:text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                      {prod.tag}
                    </span>
                  </div>
                </div>

                {/* Card Content Details */}
                <div className="p-2 sm:p-4 flex flex-col justify-between flex-1 bg-[#0F1D36]">
                  <div>
                    <div className="flex items-center justify-between text-[8px] sm:text-[10px] text-slate-400 mb-0.5 sm:mb-1">
                      <span className="font-semibold text-slate-300 truncate max-w-[70px] sm:max-w-[120px]">{prod.category}</span>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        <Star size={9} fill="currentColor" />
                        <span className="font-bold">{prod.rating}</span>
                      </div>
                    </div>
                    <h4 className="text-[10px] sm:text-sm font-bold text-white leading-tight line-clamp-1">
                      {prod.name}
                    </h4>
                  </div>

                  <div className="mt-1.5 sm:mt-3 pt-1.5 sm:pt-2.5 border-t border-[#1C3056] flex items-center justify-between">
                    <div>
                      <span className="text-[6px] sm:text-[8px] uppercase font-bold text-slate-500 block leading-none">Price</span>
                      <span className="text-[10px] sm:text-base font-black text-amber-400 font-['Outfit']">{prod.price}</span>
                    </div>

                    <a
                      href={waLink(prod.name, prod.price)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-0.5 sm:gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[8px] sm:text-[10px] font-bold uppercase tracking-wider px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded transition-colors shadow"
                    >
                      <WhatsAppIcon size={12} className="text-white" /> <span className="hidden sm:inline">Order</span>
                    </a>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Navigation Arrow Controls */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mt-1 sm:mt-4 z-20 relative">
        <button
          onClick={handlePrev}
          aria-label="Previous Product"
          className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#0F1D36] border border-[#1C3056] hover:border-amber-400 text-slate-300 hover:text-amber-400 flex items-center justify-center transition-all cursor-pointer shadow"
        >
          <ChevronLeft size={15} />
        </button>

        {/* Carousel Indicators */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {FEATURED_PRODUCTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="h-1 sm:h-1.5 rounded-full transition-all duration-300 cursor-pointer"
              style={{
                width: i === activeIndex ? '16px' : '5px',
                backgroundColor: i === activeIndex ? '#F59E0B' : '#1C3056',
              }}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next Product"
          className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#0F1D36] border border-[#1C3056] hover:border-amber-400 text-slate-300 hover:text-amber-400 flex items-center justify-center transition-all cursor-pointer shadow"
        >
          <ChevronRight size={15} />
        </button>
      </div>

    </section>
  );
}
