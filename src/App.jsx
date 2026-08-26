import React, { useState, useMemo, useEffect } from "react";
import {
  MessageCircle,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Droplets,
  SprayCan,
  Shield,
  Search,
  Star,
  Sparkles,
  Award,
  Truck,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Building2,
  Clock,
  ThumbsUp,
  Quote
} from "lucide-react";
import { PRODUCTS, CATEGORIES } from "./data/products";
import SlidingStrip from "./components/SlidingStrip";

/* ------------------------------------------------------------------
   BE-CLEAN — Verified Customer Reviews
------------------------------------------------------------------ */
const REVIEWS = [
  {
    id: 1,
    name: "Mrs. Tariq",
    location: "Satellite Town, Rawalpindi",
    role: "Verified Buyer",
    stars: 5,
    product: "Sweep 1300ml",
    quote: "The hard water stains on our washroom tiles were gone within 2 minutes! Delivered directly from the Chakri Road facility within 24 hours. Excellent local product!",
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Muhammad Usama",
    location: "F-7 Markaz, Islamabad",
    role: "Restaurant Partner",
    stars: 5,
    product: "Kitchen cleaner",
    quote: "BE-Clean kitchen cleaner cuts through heavy stove oil better than expensive imported brands. Outstanding quality for commercial kitchens in twin cities.",
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Dr. Ayesha Malik",
    location: "Gulberg III, Lahore",
    role: "Verified Buyer",
    stars: 5,
    product: "Tile 1300ml",
    quote: "Ordered via WhatsApp and received the products the next day. The fresh scent and streak-free polish are top notch. Highly recommended!",
    date: "3 days ago"
  },
  {
    id: 4,
    name: "Bilal Ahmed",
    location: "Commercial Director, Karachi",
    role: "Wholesale Partner",
    stars: 5,
    product: "Phynl 2.75",
    quote: "We place bulk orders directly with their Rawalpindi factory. The floor disinfectant phenyl keeps marble surfaces sparkling with hospital grade hygiene.",
    date: "5 days ago"
  },
  {
    id: 5,
    name: "Saadia & Hamza Khan",
    location: "Bahria Town, Rawalpindi",
    role: "Verified Household",
    stars: 5,
    product: "Dettol 2.75",
    quote: "BE-Clean products replaced 3 different sprays in our home. Cuts grease effortlessly and leaves a lasting ocean breeze scent!",
    date: "Yesterday"
  }
];

const PHONE = "923361503644";
const waLink = (text) => `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
const RETAIL_PARTNER_WA_LINK = `https://wa.me/${PHONE}?text=${encodeURIComponent("Hello BE-Clean, I'd like to become a retail partner and place a bulk order.")}`;

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sliderPos, setSliderPos] = useState(50);
  
  // Hero spotlight active tab index
  const [activeSpotlight, setActiveSpotlight] = useState(0);

  // Reviews slider active index & auto-play timer
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIndex((prev) => (prev + 1) % REVIEWS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const spotlightItems = [
    {
      prod: PRODUCTS.find(p => p.id === 4) || PRODUCTS[0], // Sweep 1300ml
      headline: "Kills 99.9% Bacteria in 1 Flush",
      tagline: "Heavy-Duty Toilet Gel Formula"
    },
    {
      prod: PRODUCTS.find(p => p.id === 18) || PRODUCTS[1], // Tile 1300ml
      headline: "Dissolves Limescale & Taps Rust",
      tagline: "Extreme Hard-Water Stain Active Gel"
    },
    {
      prod: PRODUCTS.find(p => p.id === 30) || PRODUCTS[2], // Kitchen cleaner
      headline: "Cuts Stove Grease & Chimney Oil",
      tagline: "Chef-Grade Heavy Degreaser"
    }
  ];

  // Filter products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const activeItem = spotlightItems[activeSpotlight].prod;

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-neutral-800 selection:text-white overflow-x-hidden">
      
      {/* ---------------- Top Announcement Bar ---------------- */}
      <div className="bg-neutral-900 border-b border-neutral-800 text-[11px] sm:text-xs py-2 px-3 sm:px-4 text-center text-neutral-300 font-medium flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap">
        <span className="bg-amber-400 text-black text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider shadow">
          BE PAKISTANI, BUY PAKISTANI
        </span>
        <span className="font-semibold text-neutral-200">
          Serving Rawalpindi & Islamabad Since 2016 — 10+ Years Trust
        </span>
        <a
          href={RETAIL_PARTNER_WA_LINK}
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-flex items-center gap-1 text-emerald-400 font-bold hover:underline ml-1"
        >
          <Building2 size={13} /> Become a Retail Partner
        </a>
      </div>

      {/* ---------------- Header Navigation ---------------- */}
      <header className="sticky top-0 z-40 bg-black/95 border-b border-neutral-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-8 h-16 sm:h-24 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <a href="#products" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="BE-Clean Pakistan Logo"
              className="h-10 sm:h-16 lg:h-20 w-auto object-contain max-w-[170px] sm:max-w-[320px] drop-shadow-md"
            />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-neutral-300">
            <a href="#products" className="hover:text-amber-400 transition-colors">Products Catalog</a>
            <a href="#top" className="hover:text-white transition-colors">About Us / Overview</a>
            <a href="#power-test" className="hover:text-white transition-colors">Before / After</a>
            <a href="#factory" className="hover:text-white transition-colors">Our Factory</a>
          </nav>

          {/* Right WhatsApp Header CTA */}
          <div className="flex items-center gap-2">
            <a
              href={waLink("Hello BE-Clean, I'd like to know more about your products.")}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg transition-colors"
            >
              <MessageCircle size={15} /> WhatsApp Order
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {menuOpen && (
          <div className="md:hidden bg-neutral-950 border-t border-neutral-800 px-4 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-wider text-neutral-300">
            <a href="#products" onClick={() => setMenuOpen(false)} className="py-1.5 text-amber-400">Products Catalog</a>
            <a href="#top" onClick={() => setMenuOpen(false)} className="py-1.5 hover:text-white">About Us / Overview</a>
            <a href="#power-test" onClick={() => setMenuOpen(false)} className="py-1.5 hover:text-white">Before / After Clean Test</a>
            <a href="#factory" onClick={() => setMenuOpen(false)} className="py-1.5 hover:text-white">Factory Details</a>
            <a
              href={RETAIL_PARTNER_WA_LINK}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
              className="py-1.5 text-amber-400 flex items-center gap-2"
            >
              <Building2 size={16} /> Become a Retail Partner
            </a>
            <a
              href={waLink("Hello BE-Clean, I'd like to order products.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-lg mt-1"
            >
              <MessageCircle size={16} /> WhatsApp Order
            </a>
          </div>
        )}
      </header>

      {/* ---------------- 1. Horizontal Sliding Image Strip (Top of Page) ---------------- */}
      <SlidingStrip />

      {/* ---------------- 2. Products Catalog Section (Moved Immediately After Sliding Strip) ---------------- */}
      <section id="products" className="py-6 sm:py-14 px-3 sm:px-8 max-w-7xl mx-auto border-b border-neutral-900">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6 mb-5 sm:mb-8">
          <div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-400">Complete Product Lineup</span>
            <h2 className="text-xl sm:text-4xl font-black text-white font-['Outfit'] mt-0.5">
              Explore Our Products ({PRODUCTS.length})
            </h2>
            <p className="text-neutral-400 text-[11px] sm:text-sm mt-0.5">
              Tap "Order" on any card to send a pre-filled WhatsApp inquiry.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-7 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-4 no-scrollbar mb-4 sm:mb-8">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-amber-400 text-black font-extrabold"
                    : "bg-neutral-900 text-neutral-300 border border-neutral-800 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product Grid - 2 columns on Mobile, 4 columns on Desktop */}
        {filteredProducts.length === 0 ? (
          <div className="bg-neutral-900 rounded-xl p-6 sm:p-12 text-center my-6 max-w-md mx-auto border border-neutral-800">
            <Search size={28} className="mx-auto text-neutral-600 mb-2" />
            <h3 className="text-xs sm:text-base font-bold text-white">No products found</h3>
            <p className="text-[11px] sm:text-xs text-neutral-400 mt-1">Try adjusting your search keywords.</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="mt-3 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
            {filteredProducts.map((p) => (
              <article
                key={p.id}
                className="bg-neutral-900 rounded-lg sm:rounded-2xl overflow-hidden border border-neutral-800 flex flex-col hover:border-neutral-700 transition-all duration-300 group"
              >
                {/* Product Image Container */}
                <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-neutral-950">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3">
                    <span className="bg-black/90 border border-neutral-800 text-amber-400 text-[8px] sm:text-[10px] font-extrabold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded uppercase tracking-wider">
                      {p.tag}
                    </span>
                  </div>
                </div>

                {/* Product Card Details */}
                <div className="p-2.5 sm:p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-neutral-400 mb-0.5 sm:mb-1">
                    <span className="font-semibold text-neutral-400 truncate max-w-[70px] sm:max-w-[90px]">{p.category}</span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star size={10} fill="currentColor" />
                      <span className="font-bold">{p.rating}</span>
                    </div>
                  </div>

                  {/* Product Title */}
                  <h3 className="text-xs sm:text-base font-extrabold text-white leading-tight sm:leading-snug line-clamp-2 min-h-[1.8rem] sm:min-h-[2.5rem]">
                    {p.name}
                  </h3>
                  
                  {/* Product Description */}
                  <p className="hidden sm:block text-xs text-neutral-400 mt-1.5 line-clamp-2 flex-1 leading-relaxed">
                    {p.desc}
                  </p>

                  {/* Price & Order Action */}
                  <div className="mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-neutral-800 flex items-center justify-between gap-1.5">
                    <div>
                      <span className="text-[7px] sm:text-[10px] uppercase font-bold text-neutral-500 block leading-none">Price</span>
                      <span className="text-xs sm:text-lg font-black text-amber-400 font-['Outfit'] price">{p.price}</span>
                    </div>

                    <a
                      href={waLink(`Hello BE-Clean, I am interested in purchasing ${p.name} priced at ${p.price}.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] sm:text-xs font-bold uppercase tracking-wider px-2 py-1.5 sm:px-3.5 sm:py-2.5 rounded-md sm:rounded-lg transition-colors"
                    >
                      <MessageCircle size={12} /> Order
                    </a>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}

      </section>

      {/* ---------------- 3. Hero Section (Pushed Below Products Catalog) ---------------- */}
      <section id="top" className="relative pt-8 pb-12 sm:pt-16 sm:pb-20 px-3 sm:px-8 max-w-7xl mx-auto border-b border-neutral-900">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-10 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            <div className="inline-flex items-center gap-1.5 bg-neutral-900 border border-amber-500/40 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-bold text-amber-400">
              <Award size={14} className="text-amber-400 shrink-0" />
              <span>BE PAKISTANI, BUY PAKISTANI — SINCE 2016</span>
            </div>

            <h1 className="text-2xl sm:text-5xl font-black text-white tracking-tight leading-tight sm:leading-[1.15] font-['Outfit']">
              10 YEARS OF TRUST IN <br className="hidden sm:inline" />
              <span className="text-amber-400">RAWALPINDI & ISLAMABAD</span>
            </h1>

            <p className="text-neutral-400 text-xs sm:text-base max-w-2xl font-normal leading-relaxed">
              BE-Clean is proud to manufacture trusted washroom and household cleaning solutions. <strong className="text-white">Serving Rawalpindi & Islamabad market for over 10 Years (Since 2016)</strong> with thousands of loyal customers and commercial partners.
            </p>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg sm:rounded-xl p-2.5 sm:p-3.5">
                <Award className="text-amber-400 shrink-0" size={16} />
                <span className="text-[10px] sm:text-xs font-bold text-neutral-200">10+ Years Trust</span>
              </div>
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg sm:rounded-xl p-2.5 sm:p-3.5">
                <Shield className="text-emerald-400 shrink-0" size={16} />
                <span className="text-[10px] sm:text-xs font-bold text-neutral-200">99.9% Germ Kill</span>
              </div>
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg sm:rounded-xl p-2.5 sm:p-3.5">
                <ThumbsUp className="text-blue-400 shrink-0" size={16} />
                <span className="text-[10px] sm:text-xs font-bold text-neutral-200">Loyal Customers</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap gap-2.5 sm:gap-4 pt-2">
              <a
                href={waLink("Hello BE-Clean, I am interested in purchasing your products.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider px-4 py-3 sm:px-7 sm:py-4 rounded-xl transition-colors"
              >
                <MessageCircle size={16} /> Order on WhatsApp
              </a>
              <a
                href={RETAIL_PARTNER_WA_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-bold text-[10px] sm:text-xs uppercase tracking-wider px-4 py-3 sm:px-6 sm:py-4 rounded-xl transition-colors"
              >
                <Building2 size={16} className="text-amber-400" /> Retail Partner
              </a>
            </div>

          </div>

          {/* Hero Right Visual: Brand Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="bg-neutral-900 rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-800 p-3.5 sm:p-6 space-y-3 sm:space-y-5 shadow-2xl relative">
              
              {/* Mascot Brand Header */}
              <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-2.5 sm:pb-4">
                <div className="flex items-center gap-2">
                  <img
                    src="/logo.png"
                    alt="BE-Clean Mascot"
                    className="h-10 sm:h-16 w-auto object-contain bg-white/10 rounded-lg p-1 border border-neutral-800"
                  />
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-white">Clean My Pakistan</h3>
                    <span className="text-[9px] sm:text-[10px] text-amber-400 font-bold flex items-center gap-1">
                      <Award size={11} /> 10+ Years Loyalty (Since 2016)
                    </span>
                  </div>
                </div>

                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[8px] sm:text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  Verified Power
                </span>
              </div>

              {/* Interactive Tabs Selector */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-black rounded-xl border border-neutral-800 text-[10px] sm:text-[11px] font-bold">
                {spotlightItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSpotlight(idx)}
                    className={`py-1 sm:py-2 px-1 rounded-lg text-center transition-all cursor-pointer truncate ${
                      activeSpotlight === idx
                        ? "bg-amber-400 text-black font-extrabold shadow"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {item.prod.category}
                  </button>
                ))}
              </div>

              {/* Dynamic Product Spotlight Frame */}
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 h-36 sm:h-52 group">
                <img
                  src={activeItem.img}
                  alt={activeItem.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                
                <div className="absolute top-2 left-2 bg-black/80 border border-neutral-700 text-amber-400 text-[8px] sm:text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  {activeItem.tag}
                </div>

                <div className="absolute bottom-2 left-2 right-2 space-y-0.5">
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    {spotlightItems[activeSpotlight].tagline}
                  </span>
                  <h4 className="text-xs sm:text-base font-extrabold text-white leading-tight">
                    {spotlightItems[activeSpotlight].headline}
                  </h4>
                  <p className="text-[9px] sm:text-xs text-neutral-300 line-clamp-1">{activeItem.name}</p>
                </div>
              </div>

              {/* Live Metric Stats */}
              <div className="grid grid-cols-3 gap-1.5 py-1 text-center border-y border-neutral-800 text-[10px]">
                <div className="p-1 sm:p-2 rounded-lg bg-neutral-950 border border-neutral-800/60">
                  <Shield size={12} className="mx-auto text-emerald-400 mb-0.5" />
                  <div className="font-black text-white text-[10px] sm:text-xs">99.9%</div>
                  <div className="text-[7px] sm:text-[9px] text-neutral-400 uppercase font-semibold">Germ Protection</div>
                </div>
                <div className="p-1 sm:p-2 rounded-lg bg-neutral-950 border border-neutral-800/60">
                  <Clock size={12} className="mx-auto text-amber-400 mb-0.5" />
                  <div className="font-black text-white text-[10px] sm:text-xs">60 Sec</div>
                  <div className="text-[7px] sm:text-[9px] text-neutral-400 uppercase font-semibold">Active Action</div>
                </div>
                <div className="p-1 sm:p-2 rounded-lg bg-neutral-950 border border-neutral-800/60">
                  <ThumbsUp size={12} className="mx-auto text-blue-400 mb-0.5" />
                  <div className="font-black text-white text-[10px] sm:text-xs">5,000+</div>
                  <div className="text-[7px] sm:text-[9px] text-neutral-400 uppercase font-semibold">Homes Served</div>
                </div>
              </div>

              {/* Bottom Direct WhatsApp Order */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[8px] uppercase font-bold text-neutral-500 block">Direct Price</span>
                  <span className="text-sm sm:text-xl font-black text-amber-400 font-['Outfit']">{activeItem.price}</span>
                </div>
                
                <a
                  href={waLink(`Hello BE-Clean, I want to order ${activeItem.name} priced at ${activeItem.price}.`)}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[9px] sm:text-xs uppercase px-3 sm:px-5 py-2 sm:py-3 rounded-lg flex items-center gap-1 transition-colors shadow-lg"
                >
                  <MessageCircle size={13} /> Order
                </a>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ---------------- "How Can We Help You?" Cards ---------------- */}
      <section className="py-8 sm:py-16 px-3 sm:px-8 max-w-7xl mx-auto border-b border-neutral-900">
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-10 space-y-1 sm:space-y-2">
          <h2 className="text-xl sm:text-3xl font-black text-white font-['Outfit']">How can we help you?</h2>
          <p className="text-neutral-400 text-xs sm:text-sm">
            BE-Clean offers a full range of products for every washroom and household cleaning need.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 sm:gap-6">
          {[
            { icon: Droplets, title: "Toilet Cleaning", desc: "Deep-clean liquids and gels that keep bowls fresh, stainless, and germ-free." },
            { icon: SprayCan, title: "Bathroom & Surface", desc: "Surface, drain, and tile solutions for a spotless, streak-free washroom." },
            { icon: Shield, title: "Hospital Disinfection", desc: "Hospital-grade formulas that protect your family and home from 99.9% germs." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-neutral-900 border border-neutral-800 rounded-xl sm:rounded-2xl p-4 sm:p-7 text-center hover:border-neutral-700 transition-colors">
              <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto rounded-lg sm:rounded-xl bg-neutral-950 border border-neutral-800 text-amber-400 flex items-center justify-center">
                <Icon size={20} className="sm:w-6 sm:h-6" />
              </div>
              <h3 className="mt-3 sm:mt-5 font-bold text-white text-xs sm:text-base">{title}</h3>
              <p className="mt-1 sm:mt-2 text-[11px] sm:text-xs text-neutral-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Interactive Before & After Power Test ---------------- */}
      <section id="power-test" className="py-8 sm:py-16 px-3 sm:px-8 max-w-7xl mx-auto border-b border-neutral-900">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-10 items-center">
          
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-400">Proven Performance</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-['Outfit']">
              The BE-Clean Difference
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Our active formulas break down hard-water mineral rings, discolored tile grout, and grease that ordinary soaps fail to lift.
            </p>
            
            <div className="space-y-2 sm:space-y-3 pt-1">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-neutral-300"><strong>Instant Dissolve:</strong> Clears limescale and rust on contact.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-neutral-300"><strong>Shine Shield:</strong> Restores original tile and ceramic shine.</p>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                <p className="text-xs text-neutral-300"><strong>Fresh Fragrance:</strong> Neutralizes odors with lasting freshness.</p>
              </div>
            </div>
          </div>

          {/* Interactive Drag Slider */}
          <div className="lg:col-span-7">
            <div className="bg-neutral-900 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-neutral-800">
              <div className="relative h-48 sm:h-96 rounded-lg sm:rounded-xl overflow-hidden select-none cursor-ew-resize">
                
                {/* Clean Image (Base) */}
                <img
                  src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1000&q=80"
                  alt="Clean tile surface"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5 bg-emerald-700 text-white text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                  After BE-Clean
                </div>

                {/* Stained Image Overlay (Clipped) */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-amber-400"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1000&q=80"
                    alt="Stained tile surface"
                    className="absolute inset-0 w-full h-full object-cover filter contrast-125 sepia-50 brightness-75 hue-rotate-30"
                    style={{ width: '100%', maxWidth: 'none' }}
                  />
                  <div className="absolute top-2.5 left-2.5 bg-rose-700 text-white text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                    Before Treatment
                  </div>
                </div>

                {/* Slider Input */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                  aria-label="Before and after cleanliness slider"
                />

                {/* Slider Divider Handle */}
                <div
                  className="absolute top-0 bottom-0 pointer-events-none z-20 flex items-center justify-center"
                  style={{ left: `calc(${sliderPos}% - 12px)` }}
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-400 text-black flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-lg">
                    ↔
                  </div>
                </div>

              </div>

              <p className="text-center text-[10px] sm:text-xs text-neutral-400 mt-2">
                Drag slider to compare surface before & after BE-Clean treatment
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ---------------- Sliding Verified Customer Reviews Section ---------------- */}
      <section id="reviews" className="py-8 sm:py-16 px-3 sm:px-8 max-w-7xl mx-auto border-b border-neutral-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-10">
          <div>
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-400">Verified Customer Voice</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-['Outfit'] mt-0.5">
              Trusted by 5,000+ Pakistani Homes
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-0.5">
              Real feedback sliding live from verified buyers across Twin Cities.
            </p>
          </div>

          <div className="flex items-center gap-2.5 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 shrink-0 self-start md:self-auto">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-white">4.9 out of 5.0</div>
              <div className="text-[9px] text-neutral-400 font-bold">1,250+ Verified Ratings</div>
            </div>
          </div>
        </div>

        {/* Sliding Single Review Showcase */}
        <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl sm:rounded-3xl p-4 sm:p-12 overflow-hidden shadow-2xl">
          <Quote className="absolute top-3 right-3 sm:top-6 sm:right-8 text-neutral-800/80 pointer-events-none opacity-20 sm:opacity-100" size={50} />

          <div className="relative z-10 space-y-3 sm:space-y-6 max-w-4xl">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(REVIEWS[reviewIndex].stars)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-neutral-400">({REVIEWS[reviewIndex].stars}.0)</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-[9px] sm:text-xs font-extrabold px-2 py-0.5 sm:px-3 sm:py-1 rounded">
                  {REVIEWS[reviewIndex].role}
                </span>
                <span className="text-[9px] sm:text-xs text-neutral-500 font-medium">{REVIEWS[reviewIndex].date}</span>
              </div>
            </div>

            {/* Main Review Quote */}
            <blockquote className="text-xs sm:text-2xl font-semibold text-white leading-relaxed font-['Outfit'] min-h-[3rem] sm:min-h-[5rem] flex items-center">
              "{REVIEWS[reviewIndex].quote}"
            </blockquote>

            {/* Reviewer & Product Details */}
            <div className="pt-3 sm:pt-6 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs sm:text-base font-extrabold text-white">{REVIEWS[reviewIndex].name}</h4>
                <p className="text-[9px] sm:text-xs text-neutral-400 font-medium">{REVIEWS[reviewIndex].location}</p>
              </div>

              <div className="bg-black/60 border border-neutral-800 rounded-lg px-2.5 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-xs">
                <span className="text-neutral-500 font-bold uppercase block text-[7px] sm:text-[9px]">Purchased Item</span>
                <span className="text-amber-400 font-bold text-[9px] sm:text-xs">{REVIEWS[reviewIndex].product}</span>
              </div>
            </div>
          </div>

          {/* Automated Progress Indicator Line */}
          <div className="mt-4 sm:mt-8 pt-3 sm:pt-6 border-t border-neutral-800/60 flex items-center justify-between relative z-10 text-[9px] sm:text-[11px] font-bold text-neutral-400">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE VERIFIED FEEDBACK STREAM</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-amber-400 font-extrabold">{reviewIndex + 1}</span>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-400">{REVIEWS.length}</span>
            </div>
          </div>

        </div>
      </section>

      {/* ---------------- Factory & Retail Partnership Section ---------------- */}
      <section id="factory" className="py-8 sm:py-16 px-3 sm:px-8 max-w-7xl mx-auto border-b border-neutral-900">
        <div className="bg-neutral-900 rounded-2xl sm:rounded-3xl p-5 sm:p-12 border border-neutral-800">
          <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-amber-400">Manufacturing Facility</span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-['Outfit']">
                Chakri Road Facility — Rawalpindi
              </h2>
              <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                BE-Clean has been serving the Rawalpindi & Islamabad market <strong className="text-white">Since 2016</strong>. With 10+ years of loyal customer trust, we manufacture premium household and commercial cleaning products from our facility on Chakri Road, Rawalpindi.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                  <MapPin className="text-amber-400 shrink-0" size={18} />
                  <div>
                    <div className="text-xs font-bold text-white">Chakri Road, Rawalpindi</div>
                    <div className="text-[10px] sm:text-[11px] text-neutral-400">Punjab, Pakistan</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-neutral-950 border border-neutral-800">
                  <PhoneCall className="text-emerald-400 shrink-0" size={18} />
                  <div>
                    <div className="text-xs font-bold text-white">+92 336 1503644</div>
                    <div className="text-[10px] sm:text-[11px] text-neutral-400">Helpline / Bulk WhatsApp</div>
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <a
                  href={RETAIL_PARTNER_WA_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider px-5 py-3 sm:px-7 sm:py-4 rounded-xl transition-colors"
                >
                  <Building2 size={16} /> Become a Retail Partner <ChevronRight size={14} />
                </a>
              </div>

            </div>

            <div className="lg:col-span-5">
              <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-neutral-800">
                <img
                  src="https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80"
                  alt="Be-Clean Rawalpindi Facility"
                  className="w-full h-44 sm:h-72 object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer id="about-us" className="bg-black pt-10 pb-20 sm:pb-12 border-t border-neutral-900 text-neutral-400 text-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-2 sm:space-y-3">
            <img
              src="/logo.png"
              alt="BE-Clean Logo"
              className="h-10 sm:h-20 w-auto object-contain"
            />
            <p className="text-amber-400 font-bold text-[10px] sm:text-xs uppercase">
              BE PAKISTANI, BUY PAKISTANI
            </p>
            <p className="text-neutral-400 text-[11px] sm:text-xs max-w-xs leading-relaxed">
              Serving Rawalpindi & Islamabad since 2016 — 10 years of loyal customer trust. Facility located on Chakri Road, Rawalpindi.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs sm:text-sm mb-2 sm:mb-3">Contact Information</h4>
            <p className="text-neutral-400 text-[11px] sm:text-xs">Chakri Road, Rawalpindi, Punjab, Pakistan</p>
            <p className="text-neutral-400 mt-1 font-bold text-amber-400 text-xs sm:text-sm">+92 336 1503644</p>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs sm:text-sm mb-2 sm:mb-3">Get in Touch</h4>
            <a
              href={waLink("Hello BE-Clean, I'd like to place a bulk order.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] sm:text-xs px-4 py-2.5 rounded-lg transition-colors"
            >
              <MessageCircle size={14} /> Chat on WhatsApp
            </a>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-8 pt-6 mt-8 sm:mt-12 border-t border-neutral-900 text-center text-neutral-500 text-[10px] sm:text-[11px]">
          © {new Date().getFullYear()} BE-Clean. All rights reserved.
        </div>
      </footer>

      {/* ---------------- Floating WhatsApp Button ---------------- */}
      <a
        href={waLink("Hello BE-Clean, I have a question about your products.")}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} className="text-white sm:w-7 sm:h-7" />
      </a>

    </div>
  );
}
