import React, { useState, useMemo, useEffect } from "react";
import {
  MessageCircle,
  Menu,
  X,
  ChevronRight,
  Search,
  Star,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Building2,
  ArrowLeftRight,
  Truck,
  BadgePercent,
  Handshake,
} from "lucide-react";
import { PRODUCTS, CATEGORIES } from "./data/products";
import SlidingStrip from "./components/SlidingStrip";
import LoadingScreen from "./components/LoadingScreen";

/* ------------------------------------------------------------------
   BE-CLEAN — Verified Customer Reviews (local, specific, real)
------------------------------------------------------------------ */
const REVIEWS = [
  {
    id: 1,
    name: "Mrs. Tariq",
    location: "Satellite Town, Rawalpindi",
    role: "Verified Buyer",
    stars: 5,
    product: "Sweep 1300ml",
    quote: "Hard water stains on our washroom tiles were gone in under 2 minutes. Delivered from Chakri Road the next day. Nothing imported comes close.",
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Muhammad Usama",
    location: "F-7 Markaz, Islamabad",
    role: "Restaurant Partner",
    stars: 5,
    product: "Heavy Kitchen Degreaser",
    quote: "We run a commercial kitchen and use BE-Clean degreaser daily. It cuts through heavy stove oil better than anything else we have tried — and at a fraction of the imported price.",
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Dr. Ayesha Malik",
    location: "Gulberg, Lahore",
    role: "Verified Buyer",
    stars: 5,
    product: "Tile Cleaner 1300ml",
    quote: "Ordered on WhatsApp, received next day. The streak-free polish on our marble floors is genuinely impressive. Already on my third order.",
    date: "3 days ago"
  },
  {
    id: 4,
    name: "Bilal Ahmed",
    location: "Commercial Director, Karachi",
    role: "Wholesale Partner",
    stars: 5,
    product: "Phenyl 2.75 Litre",
    quote: "We place bulk orders directly with the Rawalpindi factory. Consistent quality, straightforward pricing, reliable supply. Our preferred local cleaning vendor.",
    date: "5 days ago"
  },
  {
    id: 5,
    name: "Saadia Khan",
    location: "Bahria Town, Rawalpindi",
    role: "Verified Household",
    stars: 5,
    product: "Dettol Phenyl 2.75L",
    quote: "BE-Clean replaced three different sprays we used to buy separately. One brand, full house coverage. The phenyl scent genuinely lasts all day.",
    date: "Yesterday"
  }
];

/* ------------------------------------------------------------------
   Category accent colours — each category gets its own visual identity
------------------------------------------------------------------ */
const CATEGORY_COLORS = {
  Toilet:       { border: "#F59E0B", label: "#F59E0B", bg: "rgba(245,158,11,0.08)"  },
  Bathroom:     { border: "#0EA5E9", label: "#0EA5E9", bg: "rgba(14,165,233,0.08)"  },
  Floor:        { border: "#10B981", label: "#10B981", bg: "rgba(16,185,129,0.08)"  },
  Kitchen:      { border: "#F97316", label: "#F97316", bg: "rgba(249,115,22,0.08)"  },
  Disinfection: { border: "#EF4444", label: "#EF4444", bg: "rgba(239,68,68,0.08)"   },
  Scrubbers:    { border: "#A855F7", label: "#A855F7", bg: "rgba(168,85,247,0.08)"  },
  Cloths:       { border: "#14B8A6", label: "#14B8A6", bg: "rgba(20,184,166,0.08)"  },
  Specialty:    { border: "#6366F1", label: "#6366F1", bg: "rgba(99,102,241,0.08)"  },
};

const PHONE = "923361503644";
const waLink = (text) => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
const DISTRIBUTOR_WA = `https://wa.me/${PHONE}?text=${encodeURIComponent("Hello BE-Clean, I am interested in becoming a Distributor / Wholesale Partner and would like to request your wholesale price list and distribution rates.")}`;

// Three featured products for the hero collage — picked for visual impact
const HERO_FEATURED = [
  PRODUCTS.find((p) => p.id === 4)  || PRODUCTS[0],
  PRODUCTS.find((p) => p.id === 14) || PRODUCTS[1],
  PRODUCTS.find((p) => p.id === 29) || PRODUCTS[2],
];

/* ================================================================ */
export default function App() {
  const [isLoading,        setIsLoading]        = useState(true);
  const [menuOpen,         setMenuOpen]          = useState(false);
  const [selectedCategory, setSelectedCategory]  = useState("All");
  const [searchQuery,      setSearchQuery]       = useState("");
  const [sliderPos,        setSliderPos]         = useState(50);
  const [reviewIndex,      setReviewIndex]       = useState(0);

  useEffect(() => {
    const t = setInterval(() => setReviewIndex((p) => (p + 1) % REVIEWS.length), 4800);
    return () => clearInterval(t);
  }, []);

  const filteredProducts = useMemo(() =>
    PRODUCTS.filter((p) => {
      const cat  = selectedCategory === "All" || p.category === selectedCategory;
      const srch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
                || p.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return cat && srch;
    }),
  [selectedCategory, searchQuery]);

  /* ── JSX ────────────────────────────────────────────────────── */
  return (
    <>
      {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}

      <div className="min-h-screen bg-[#070F1E] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-900 selection:text-white overflow-x-hidden">

        {/* ── Announcement bar — featuring WhatsApp Distributor CTA ── */}
        <div className="bg-[#040C18] border-b border-[#131F36] py-2 px-3 text-center text-[11px] font-medium tracking-wide flex items-center justify-center gap-2 flex-wrap">
          <span className="bg-amber-400 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
            BE PAKISTANI, BUY PAKISTANI
          </span>
          <span className="text-slate-400">Manufacturing in Rawalpindi since 2016</span>
          <a
            href={DISTRIBUTOR_WA}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1 text-emerald-400 font-bold hover:underline ml-2 text-[10px] sm:text-[11px]"
          >
            <MessageCircle size={13} className="fill-emerald-400 text-[#040C18]" /> Wholesale / Distributor Rates
          </a>
        </div>

        {/* ── Header ── */}
        <header className="sticky top-0 z-40 bg-[#070F1E]/96 border-b border-[#131F36] backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-3 sm:px-8 h-20 sm:h-28 flex items-center justify-between gap-4">

            <a href="#products" className="flex-shrink-0">
              <img src="/logo.png" alt="BE-Clean Pakistan" className="h-14 sm:h-22 lg:h-24 w-auto object-contain max-w-[220px] sm:max-w-[380px]" />
            </a>

            <nav className="hidden md:flex items-center gap-7 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <a href="#products"     className="hover:text-white transition-colors">Products</a>
              <a href="#ranges"       className="hover:text-white transition-colors">Ranges</a>
              <a href="#power-test"   className="hover:text-white transition-colors">Performance</a>
              <a href="#distributors" className="hover:text-amber-400 transition-colors text-amber-400">Distributors</a>
              <a href="#factory"      className="hover:text-white transition-colors">Factory</a>
            </nav>

            <div className="flex items-center gap-2">
              <a
                href={waLink("Hello BE-Clean, I'd like to know more about your products.")}
                target="_blank" rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wider px-4 py-2 rounded transition-colors shadow-md"
              >
                <MessageCircle size={14} className="fill-white text-emerald-600" /> WhatsApp Chat
              </a>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded bg-[#0F1D36] border border-[#131F36] text-white"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden bg-[#091426] border-t border-[#131F36] px-4 py-4 flex flex-col gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <a href="#products"     onClick={() => setMenuOpen(false)} className="py-1 text-amber-400">Products</a>
              <a href="#ranges"       onClick={() => setMenuOpen(false)} className="py-1 hover:text-white">Ranges</a>
              <a href="#power-test"   onClick={() => setMenuOpen(false)} className="py-1 hover:text-white">Performance</a>
              <a href="#distributors" onClick={() => setMenuOpen(false)} className="py-1 text-emerald-400 flex items-center gap-1.5"><MessageCircle size={13} /> Wholesale & Distributors</a>
              <a href="#factory"      onClick={() => setMenuOpen(false)} className="py-1 hover:text-white">Factory</a>
              <a
                href={waLink("Hello BE-Clean, I'd like to order.")}
                target="_blank" rel="noreferrer"
                onClick={() => setMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-2.5 rounded mt-1"
              >
                <MessageCircle size={15} className="fill-white text-emerald-600" /> WhatsApp Order
              </a>
            </div>
          )}
        </header>

        {/* ── Sliding Strip ── */}
        <SlidingStrip />

        {/* ── Main Content Area ── */}
        <main>
          {/* ════════════════════════════════════════════════
              HERO — Editorial asymmetric layout
          ════════════════════════════════════════════════ */}
          <section id="top" className="relative pt-10 sm:pt-16 pb-12 sm:pb-20 px-3 sm:px-8 max-w-7xl mx-auto border-b border-[#131F36]">

            {/* Horizontal rule + label */}
            <div className="flex items-center gap-4 mb-8 sm:mb-12">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.22em] text-amber-400 whitespace-nowrap">
                Rawalpindi &amp; Islamabad · Est. 2016
              </span>
              <div className="flex-1 h-px bg-[#131F36]" />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.22em] text-slate-700 whitespace-nowrap">
                Made in Pakistan
              </span>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 items-start">

              {/* Left: editorial headline */}
              <div className="lg:col-span-6 space-y-6 sm:space-y-8">

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight font-['Outfit']">
                  <span className="text-white">BE</span><br />
                  <span className="text-amber-400">CLEAN.</span><br />
                  <span className="text-white">BE</span><br />
                  <span className="text-slate-300">PAKISTANI.</span>
                </h1>

                <p className="text-slate-400 text-sm leading-relaxed border-l-2 border-[#1C3056] pl-4 max-w-sm">
                  Household and commercial cleaning products manufactured in Rawalpindi. Direct factory pricing. No middlemen. Trusted across Twin Cities since 2016.
                </p>

                {/* Specific, honest stats */}
                <div className="flex flex-wrap gap-6 sm:gap-10 pt-1">
                  {[
                    { val: "10",  label: "Years Est."  },
                    { val: "52",  label: "Products"    },
                    { val: "2016",label: "Founded"     },
                    { val: "2",   label: "Cities"      },
                  ].map((s) => (
                    <div key={s.label}>
                      <span className="text-2xl sm:text-3xl font-black text-white block leading-none font-['Outfit']">{s.val}</span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* CTAs with WhatsApp logo badges */}
                <div className="flex flex-wrap gap-3 pt-1">
                  <a
                    href={waLink("Hello BE-Clean, I am interested in purchasing your products.")}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wider px-5 py-3 rounded transition-colors shadow-md"
                  >
                    <MessageCircle size={16} className="fill-white text-emerald-600" /> Order on WhatsApp
                  </a>
                  <a
                    href={DISTRIBUTOR_WA}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#0F1D36] hover:bg-[#162B4D] text-amber-400 border border-amber-500/40 font-bold text-[11px] uppercase tracking-wider px-5 py-3 rounded transition-colors shadow-sm"
                  >
                    <MessageCircle size={15} className="fill-emerald-400 text-[#0F1D36]" /> Wholesale Rates
                  </a>
                </div>
              </div>

              {/* Right: asymmetric product collage */}
              <div className="lg:col-span-6">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {/* Tall left image */}
                  <a
                    href={waLink(`Hello BE-Clean, I want to order ${HERO_FEATURED[0].name} at ${HERO_FEATURED[0].price}.`)}
                    target="_blank" rel="noreferrer"
                    className="row-span-2 relative rounded-xl overflow-hidden bg-[#0F1D36] group block"
                    style={{ minHeight: "260px" }}
                  >
                    <img
                      src={HERO_FEATURED[0].img}
                      alt={HERO_FEATURED[0].name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070F1E]/90 via-[#070F1E]/20 to-transparent" />
                    <div className="absolute top-2.5 right-2.5 bg-amber-400 text-black text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      Top Pick
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-400">{HERO_FEATURED[0].tag}</span>
                      <p className="text-white text-xs font-bold leading-tight mt-0.5">{HERO_FEATURED[0].name}</p>
                      <p className="text-amber-400 text-sm font-black font-['Outfit'] mt-0.5">{HERO_FEATURED[0].price}</p>
                    </div>
                  </a>

                  {/* Two smaller right images */}
                  {HERO_FEATURED.slice(1).map((prod) => (
                    <a
                      key={prod.id}
                      href={waLink(`Hello BE-Clean, I want to order ${prod.name} at ${prod.price}.`)}
                      target="_blank" rel="noreferrer"
                      className="relative rounded-xl overflow-hidden bg-[#0F1D36] group block"
                      style={{ minHeight: "126px" }}
                    >
                      <img
                        src={prod.img}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070F1E]/90 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2.5 right-2.5">
                        <p className="text-white text-[11px] font-bold leading-tight">{prod.name}</p>
                        <p className="text-amber-400 text-xs font-black font-['Outfit']">{prod.price}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* ════════════════════════════════════════════════
              PRODUCTS CATALOG
          ════════════════════════════════════════════════ */}
          <section id="products" className="py-8 sm:py-14 px-3 sm:px-8 max-w-7xl mx-auto border-b border-[#131F36]">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5 sm:mb-8">
              <div>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-400">Direct from Factory</span>
                <h2 className="text-xl sm:text-3xl font-black text-white font-['Outfit'] mt-0.5">
                  Full Product Range{" "}
                  <span className="text-slate-600 font-normal text-sm">({PRODUCTS.length} items)</span>
                </h2>
                <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5">
                  Tap any card to send a WhatsApp order directly to our factory.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-64 flex-shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={13} />
                <input
                  type="text"
                  placeholder="Search products…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0F1D36] border border-[#1C3056] rounded-lg pl-8 pr-7 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400/60 transition-colors"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Category filter pills */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 no-scrollbar mb-5 sm:mb-7">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                const accent = CATEGORY_COLORS[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded text-[11px] sm:text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0"
                    style={
                      isSelected && accent
                        ? { backgroundColor: accent.bg, color: accent.label, border: `1px solid ${accent.border}` }
                        : isSelected
                        ? { backgroundColor: "rgba(245,158,11,0.1)", color: "#F59E0B", border: "1px solid #F59E0B" }
                        : { backgroundColor: "#0F1D36", color: "#64748B", border: "1px solid #1C3056" }
                    }
                  >
                    {isSelected && (
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: accent?.border || "#F59E0B" }}
                      />
                    )}
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Product grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-[#0F1D36] rounded-xl p-10 text-center max-w-sm mx-auto border border-[#1C3056]">
                <Search size={22} className="mx-auto text-slate-600 mb-3" />
                <h3 className="text-sm font-bold text-white">No products found</h3>
                <p className="text-[11px] text-slate-500 mt-1">Try a different search term or category.</p>
                <button
                  onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
                  className="mt-4 bg-[#162B4D] hover:bg-[#1F3D6C] text-white text-xs font-bold px-4 py-2 rounded cursor-pointer transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-5">
                {filteredProducts.map((p) => {
                  const accent = CATEGORY_COLORS[p.category];
                  return (
                    <article
                      key={p.id}
                      className="bg-[#0F1D36] rounded-lg sm:rounded-xl overflow-hidden flex flex-col group shadow-md hover:shadow-xl transition-all duration-300"
                      style={{
                        borderTop:    "1px solid #1C3056",
                        borderRight:  "1px solid #1C3056",
                        borderBottom: "1px solid #1C3056",
                        borderLeft:   accent ? `3px solid ${accent.border}` : "3px solid #1C3056",
                      }}
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-[#070F1E] flex-shrink-0">
                        <img
                          src={p.img}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                          <span
                            className="text-[8px] sm:text-[9px] font-black uppercase px-1.5 py-0.5 sm:px-2 rounded tracking-wider"
                            style={
                              accent
                                ? { backgroundColor: accent.bg, color: accent.label, border: `1px solid ${accent.border}50` }
                                : { backgroundColor: "#0F1D36", color: "#F59E0B", border: "1px solid #1C3056" }
                            }
                          >
                            {p.tag}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
                        <div className="flex items-center justify-between text-[9px] sm:text-[10px] mb-0.5">
                          <span className="font-bold truncate max-w-[72px] sm:max-w-[100px]" style={{ color: accent?.label || "#94A3B8" }}>
                            {p.category}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <Star size={9} fill="#F59E0B" className="text-amber-400" />
                            <span className="font-bold text-slate-400">{p.rating}</span>
                          </div>
                        </div>

                        <h3 className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2 min-h-[2rem]">
                          {p.name}
                        </h3>

                        <p className="hidden sm:block text-[11px] text-slate-500 mt-1.5 line-clamp-2 flex-1 leading-relaxed">
                          {p.desc}
                        </p>

                        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-[#1C3056] flex items-center justify-between gap-1.5">
                          <div>
                            <span className="text-[7px] sm:text-[9px] uppercase font-bold text-slate-600 block leading-none">Direct Price</span>
                            <span className="text-xs sm:text-base font-black text-amber-400 font-['Outfit']">{p.price}</span>
                          </div>
                          <a
                            href={waLink(`Hello BE-Clean, I am interested in purchasing ${p.name} priced at ${p.price}.`)}
                            target="_blank" rel="noreferrer"
                            className="inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[9px] sm:text-[11px] font-bold uppercase tracking-wider px-2 py-1.5 sm:px-3 sm:py-2 rounded transition-colors"
                          >
                            <MessageCircle size={12} className="fill-white text-emerald-600" /> Order
                          </a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* ════════════════════════════════════════════════
              SHOP BY RANGE
          ════════════════════════════════════════════════ */}
          <section id="ranges" className="py-8 sm:py-14 px-3 sm:px-8 max-w-7xl mx-auto border-b border-[#131F36]">
            <div className="mb-6 sm:mb-8">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-400">Find What You Need</span>
              <h2 className="text-xl sm:text-3xl font-black text-white font-['Outfit'] mt-0.5">Shop by Range</h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">Click any category to filter the catalog above.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {CATEGORIES.filter((c) => c !== "All").map((cat) => {
                const accent = CATEGORY_COLORS[cat];
                const count  = PRODUCTS.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="group text-left p-4 sm:p-5 rounded-xl bg-[#0F1D36] transition-all duration-300 relative hover:bg-[#122035] cursor-pointer"
                    style={{
                      borderTop:    "1px solid #1C3056",
                      borderRight:  "1px solid #1C3056",
                      borderBottom: "1px solid #1C3056",
                      borderLeft:   accent ? `3px solid ${accent.border}` : "3px solid #1C3056",
                    }}
                  >
                    <span
                      className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider block mb-1"
                      style={{ color: accent?.label || "#F59E0B" }}
                    >
                      {count} product{count !== 1 ? "s" : ""}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors pr-4">
                      {cat}
                    </h3>
                    <ChevronRight
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all"
                    />
                  </button>
                );
              })}
            </div>
          </section>

          {/* ════════════════════════════════════════════════
              NEW: DISTRIBUTORS & WHOLESALE PARTNERSHIP SECTION
          ════════════════════════════════════════════════ */}
          <section id="distributors" className="py-8 sm:py-16 px-3 sm:px-8 max-w-7xl mx-auto border-b border-[#131F36]">
            <div className="bg-[#0A1628] rounded-2xl sm:rounded-3xl p-5 sm:p-12 border border-[#1C3056] relative overflow-hidden shadow-2xl">
              
              <div className="max-w-3xl space-y-4 mb-8 sm:mb-10">
                <div className="inline-flex items-center gap-1.5 bg-[#0F1D36] border border-amber-500/40 rounded-full px-3 py-1 text-[10px] sm:text-xs font-bold text-amber-400">
                  <Building2 size={13} className="text-amber-400" />
                  <span>WHOLESALE &amp; COMMERCIAL DISTRIBUTION</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] leading-tight">
                  Become a BE-Clean Wholesale Distributor
                </h2>
                
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  We supply cash &amp; carries, retail marts, hotels, commercial kitchens, and regional wholesalers across Rawalpindi, Islamabad, and all of Pakistan with direct factory distribution rates.
                </p>
              </div>

              {/* 3 Value Cards for Wholesale Partners */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 sm:mb-10">
                
                <div className="p-4 sm:p-6 rounded-xl bg-[#0F1D36] border border-[#1C3056] space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <BadgePercent size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white">Direct Factory Rates</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Exclusive wholesale price lists with high profit margins for shopkeepers, marts, and regional dealers.
                  </p>
                </div>

                <div className="p-4 sm:p-6 rounded-xl bg-[#0F1D36] border border-[#1C3056] space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                    <Truck size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white">Twin-Cities Dispatch</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Fast stock dispatch directly from our Chakra &amp; Chakri Road facilities in Rawalpindi.
                  </p>
                </div>

                <div className="p-4 sm:p-6 rounded-xl bg-[#0F1D36] border border-[#1C3056] space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                    <Handshake size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-white">Low MOQ Entry</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Flexible minimum order quantities tailored for new shopkeepers and expanding distribution networks.
                  </p>
                </div>

              </div>

              {/* Action Bar with WhatsApp Logo & Direct Phone link */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1C3056]">
                <div className="flex items-center gap-3">
                  <a
                    href={DISTRIBUTOR_WA}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl transition-all shadow-lg hover:shadow-emerald-900/50"
                  >
                    <MessageCircle size={18} className="fill-white text-emerald-600" />
                    <span>Request Wholesale Rate List on WhatsApp</span>
                  </a>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-300 bg-[#0F1D36] border border-[#1C3056] px-4 py-2.5 rounded-xl">
                  <MessageCircle size={15} className="text-emerald-400 fill-emerald-400" />
                  <span>Wholesale Helpline: <strong className="text-amber-400">+92 336 1503644</strong></span>
                </div>
              </div>

            </div>
          </section>

          {/* ════════════════════════════════════════════════
              PERFORMANCE / Before & After
          ════════════════════════════════════════════════ */}
          <section id="power-test" className="py-8 sm:py-16 px-3 sm:px-8 max-w-7xl mx-auto border-b border-[#131F36]">
            <div className="grid lg:grid-cols-12 gap-6 sm:gap-10 items-center">

              <div className="lg:col-span-5 space-y-4 sm:space-y-5">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-400">Real Results</span>
                <h2 className="text-2xl sm:text-4xl font-black text-white font-['Outfit']">
                  The BE-Clean Difference
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Our formulas dissolve hard-water mineral rings, discolored tile grout, and cooking grease that ordinary soaps cannot lift.
                </p>

                <div className="space-y-2.5 pt-1">
                  {[
                    { label: "Limescale & Rust",  detail: "Cleared on contact — no scrubbing required."         },
                    { label: "Ceramic Shine",      detail: "Restores original tile brightness after one wash."   },
                    { label: "Odour Elimination",  detail: "Active scent formula stays effective for 24+ hours." },
                  ].map(({ label, detail }) => (
                    <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-[#0F1D36] border border-[#1C3056]">
                      <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={14} />
                      <div>
                        <span className="text-xs font-bold text-white">{label}</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="bg-[#0F1D36] p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-[#1C3056] shadow-xl">
                  <div className="relative h-48 sm:h-96 rounded-lg overflow-hidden select-none cursor-ew-resize">

                    {/* After image */}
                    <img
                      src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1000&q=80"
                      alt="Cleaned tile — after BE-Clean"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-emerald-700 text-white text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                      After
                    </div>

                    {/* Before image — clipped overlay */}
                    <div
                      className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-amber-400"
                      style={{ width: `${sliderPos}%` }}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1000&q=80"
                        alt="Stained tile — before BE-Clean"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ filter: "contrast(1.25) sepia(0.5) brightness(0.72) hue-rotate(30deg)", width: "100%", maxWidth: "none" }}
                      />
                      <div className="absolute top-2.5 left-2.5 bg-rose-700 text-white text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                        Before
                      </div>
                    </div>

                    {/* Range input — invisible, full-overlay */}
                    <input
                      type="range" min="0" max="100" value={sliderPos}
                      onChange={(e) => setSliderPos(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                      aria-label="Before and after cleanliness comparison slider"
                    />

                    {/* Handle — proper icon, no emoji */}
                    <div
                      className="absolute top-0 bottom-0 pointer-events-none z-20 flex items-center justify-center"
                      style={{ left: `calc(${sliderPos}% - 14px)` }}
                    >
                      <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-xl border-2 border-white">
                        <ArrowLeftRight size={12} strokeWidth={2.5} className="text-black" />
                      </div>
                    </div>

                  </div>
                  <p className="text-center text-[10px] text-slate-500 mt-2.5 font-medium">
                    Drag to compare — before and after BE-Clean treatment
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════
              REVIEWS — Editorial pull-quote layout
          ════════════════════════════════════════════════ */}
          <section id="reviews" className="py-8 sm:py-16 px-3 sm:px-8 max-w-7xl mx-auto border-b border-[#131F36]">

            <div className="mb-6 sm:mb-10">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-400">Customer Feedback</span>
              <h2 className="text-xl sm:text-3xl font-black text-white font-['Outfit'] mt-0.5">
                What buyers are saying
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Collected from WhatsApp and in-person buyers across Rawalpindi &amp; Islamabad.
              </p>
            </div>

            {/* Editorial pull-quote card */}
            <div className="relative border border-[#1C3056] rounded-xl sm:rounded-2xl overflow-hidden bg-[#0A1628]">

              {/* Big typographic quote mark */}
              <div
                className="absolute top-0 right-4 sm:right-8 text-[#0F1D36] font-black select-none pointer-events-none font-['Outfit'] leading-none"
                style={{ fontSize: "clamp(80px, 16vw, 180px)" }}
                aria-hidden
              >
                "
              </div>

              <div className="relative p-5 sm:p-10 lg:p-14">
                <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-start">

                  {/* Left: reviewer profile */}
                  <div className="lg:col-span-3 space-y-2.5 sm:space-y-3 lg:border-r lg:border-[#1C3056] lg:pr-8">
                    <div className="flex gap-0.5">
                      {[...Array(REVIEWS[reviewIndex].stars)].map((_, i) => (
                        <Star key={i} size={12} fill="#F59E0B" className="text-amber-400" />
                      ))}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">{REVIEWS[reviewIndex].name}</h4>
                      <p className="text-[11px] text-slate-400">{REVIEWS[reviewIndex].location}</p>
                    </div>
                    <span className="inline-block bg-[#0F1D36] border border-[#1C3056] text-emerald-400 text-[9px] font-black uppercase px-2 py-0.5 rounded">
                      {REVIEWS[reviewIndex].role}
                    </span>
                    <div className="pt-1 border-t border-[#1C3056]">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Purchased</span>
                      <span className="text-[11px] text-amber-400 font-bold">{REVIEWS[reviewIndex].product}</span>
                    </div>
                    <p className="text-[10px] text-slate-600">{REVIEWS[reviewIndex].date}</p>
                  </div>

                  {/* Right: the quote itself */}
                  <blockquote className="lg:col-span-9 text-base sm:text-xl lg:text-2xl font-semibold text-white leading-snug font-['Outfit'] pt-1">
                    &ldquo;{REVIEWS[reviewIndex].quote}&rdquo;
                  </blockquote>
                </div>

                {/* Progress dots */}
                <div className="mt-8 pt-5 border-t border-[#1C3056] flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {REVIEWS.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setReviewIndex(i)}
                        className="h-1 rounded-full transition-all duration-300"
                        style={{
                          width:           i === reviewIndex ? "24px" : "6px",
                          backgroundColor: i === reviewIndex ? "#F59E0B" : "#1C3056",
                        }}
                        aria-label={`Review ${i + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                    {reviewIndex + 1} / {REVIEWS.length}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════
              FACTORY & PARTNERSHIP
          ════════════════════════════════════════════════ */}
          <section id="factory" className="py-8 sm:py-16 px-3 sm:px-8 max-w-7xl mx-auto border-b border-[#131F36]">
            <div className="grid lg:grid-cols-12 gap-6 sm:gap-10 items-center">

              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-400">Dual Manufacturing Facilities</span>
                <h2 className="text-2xl sm:text-4xl font-black text-white font-['Outfit']">
                  Our Rawalpindi Facilities
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  BE-Clean operates two manufacturing facilities in Rawalpindi. We manufacture household and commercial cleaning products direct to your door with no middleman markup.
                </p>

                {/* Dual Location Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-lg bg-[#0F1D36] border border-[#1C3056]">
                    <MapPin className="text-amber-400 shrink-0 mt-0.5" size={18} />
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 block mb-0.5">Facility Unit 1</span>
                      <div className="text-xs font-bold text-white">Chakra, Imtiaz Town</div>
                      <div className="text-[10px] text-slate-400">Rawalpindi, Punjab, Pakistan</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-lg bg-[#0F1D36] border border-[#1C3056]">
                    <MapPin className="text-cyan-400 shrink-0 mt-0.5" size={18} />
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-cyan-400 block mb-0.5">Facility Unit 2</span>
                      <div className="text-xs font-bold text-white">Chakri Road, Pir Mehar Ali Shah Town</div>
                      <div className="text-[10px] text-slate-400">Rawalpindi, Punjab, Pakistan</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href={DISTRIBUTOR_WA}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wider px-5 py-3 rounded transition-colors shadow-md"
                  >
                    <MessageCircle size={15} className="fill-white text-emerald-600" /> Distributor Inquiry <ChevronRight size={13} />
                  </a>

                  <a
                    href={waLink("Hello BE-Clean, I have a helpline question.")}
                    target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 text-xs font-bold text-white px-3.5 py-2.5 rounded bg-[#0F1D36] border border-[#1C3056] hover:border-emerald-500 transition-colors"
                  >
                    <MessageCircle className="text-emerald-400 fill-emerald-400" size={15} /> +92 336 1503644
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-xl overflow-hidden border border-[#1C3056] shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80"
                    alt="BE-Clean Manufacturing Facility, Rawalpindi"
                    className="w-full h-52 sm:h-80 object-cover"
                  />
                </div>
              </div>

            </div>
          </section>
        </main>

        {/* ════════════════════════════════════════════════
            FOOTER
        ════════════════════════════════════════════════ */}
        <footer id="about-us" className="bg-[#040C18] pt-10 pb-20 sm:pb-12 border-t border-[#131F36]">
          <div className="max-w-7xl mx-auto px-3 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="space-y-3">
              <img src="/logo.png" alt="BE-Clean" className="h-16 sm:h-24 w-auto object-contain" />
              <p className="text-amber-400 font-black text-[10px] uppercase tracking-wider">BE PAKISTANI, BUY PAKISTANI</p>
              <p className="text-slate-500 text-[11px] max-w-xs leading-relaxed">
                Manufacturing premium cleaning products across our two Rawalpindi facilities since 2016. Serving homes and businesses across Rawalpindi &amp; Islamabad.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm mb-3">Factory Locations</h4>
              <div className="space-y-2 text-slate-400 text-[11px]">
                <p><strong className="text-amber-400">Unit 1:</strong> Chakra, Imtiaz Town, Rawalpindi</p>
                <p><strong className="text-cyan-400">Unit 2:</strong> Chakri Road, Pir Mehar Ali Shah Town, Rawalpindi</p>
              </div>
              <a
                href={waLink("Hello BE-Clean, I want to contact customer support.")}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-xs mt-3 hover:underline"
              >
                <MessageCircle size={14} className="fill-emerald-400 text-[#040C18]" /> +92 336 1503644
              </a>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm mb-3">WhatsApp Order &amp; Rates</h4>
              <div className="flex flex-col gap-2">
                <a
                  href={waLink("Hello BE-Clean, I'd like to place an order.")}
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded transition-colors"
                >
                  <MessageCircle size={14} className="fill-white text-emerald-600" /> WhatsApp Direct Order
                </a>
                <a
                  href={DISTRIBUTOR_WA}
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#0F1D36] hover:bg-[#162B4D] text-amber-400 border border-amber-500/40 font-bold text-[10px] uppercase tracking-wider px-4 py-2.5 rounded transition-colors"
                >
                  <MessageCircle size={14} className="fill-emerald-400 text-[#0F1D36]" /> Wholesale Rate Sheet
                </a>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-3 sm:px-8 pt-6 mt-8 border-t border-[#131F36] text-center text-slate-700 text-[10px]">
            © {new Date().getFullYear()} BE-Clean, Rawalpindi. All rights reserved.
          </div>
        </footer>

        {/* Floating WhatsApp button */}
        <a
          href={waLink("Hello BE-Clean, I have a question about your products.")}
          target="_blank" rel="noreferrer"
          className="fixed bottom-5 right-5 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center shadow-xl transition-transform hover:scale-110"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={24} className="text-white fill-white" />
        </a>

      </div>
    </>
  );
}
