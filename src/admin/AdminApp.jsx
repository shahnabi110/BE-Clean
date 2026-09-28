import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { PRODUCTS } from '../data/products';
import {
  Lock,
  LogOut,
  Building2,
  Package,
  Plus,
  Save,
  Copy,
  ExternalLink,
  Check,
  AlertCircle,
  Sparkles,
  Search,
  Trash2
} from 'lucide-react';

export const ADMIN_PATH = '/be-portal';

export default function AdminApp() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submittingAuth, setSubmittingAuth] = useState(false);

  // Admin state
  const [activeTab, setActiveTab] = useState('distributors'); // 'distributors' | 'products'
  const [products, setProducts] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState(null);
  const [prices, setPrices] = useState({}); // { product_id: numeric_price }
  
  // Action status messages
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [copiedLink, setCopiedLink] = useState(false);

  // New item inputs
  const [newDistributorName, setNewDistributorName] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [newProductUnit, setNewProductUnit] = useState('1 Bottle');

  // Search filter
  const [productSearch, setProductSearch] = useState('');

  // 1. Inject noindex meta tag
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';

    return () => {
      if (meta) meta.content = 'index, follow';
    };
  }, []);

  // 2. Check Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 3. Load Products & Distributors
  const loadProducts = useCallback(async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('sort', { ascending: true })
      .order('name', { ascending: true });
    if (!error && data) {
      setProducts(data);
    }
  }, []);

  const loadDistributors = useCallback(async () => {
    const { data, error } = await supabase
      .from('distributors')
      .select('*')
      .order('name', { ascending: true });
    if (!error && data) {
      setDistributors(data);
      if (data.length > 0 && !selectedDistributor) {
        setSelectedDistributor(data[0]);
      }
    }
  }, [selectedDistributor]);

  useEffect(() => {
    if (session) {
      loadProducts();
      loadDistributors();
    }
  }, [session, loadProducts, loadDistributors]);

  // 4. Load Prices for selected distributor
  const loadPricesForDistributor = useCallback(async (distributorId) => {
    if (!distributorId) return;
    const { data, error } = await supabase
      .from('prices')
      .select('product_id, price')
      .eq('distributor_id', distributorId);
    
    if (!error && data) {
      const priceMap = {};
      data.forEach((p) => {
        priceMap[p.product_id] = p.price;
      });
      setPrices(priceMap);
    }
  }, []);

  useEffect(() => {
    if (selectedDistributor) {
      loadPricesForDistributor(selectedDistributor.id);
    }
  }, [selectedDistributor, loadPricesForDistributor]);

  // Auth Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setSubmittingAuth(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setAuthError(error.message);
    }
    setSubmittingAuth(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Seed Products from Website Catalog
  const handleSeedProducts = async () => {
    if (!session) return;
    setStatusMsg({ type: 'info', text: 'Seeding products from catalog...' });

    // Map PRODUCTS from src/data/products.js
    const productsToInsert = PRODUCTS.map((p, index) => ({
      name: p.name,
      unit: p.name.toLowerCase().includes('litre') ? '1 Litre' : '1 Bottle',
      sort: index + 1
    }));

    const { data, error } = await supabase.from('products').insert(productsToInsert).select();

    if (error) {
      setStatusMsg({ type: 'error', text: `Failed to seed products: ${error.message}` });
    } else {
      setStatusMsg({ type: 'success', text: `Successfully seeded ${data.length} products!` });
      loadProducts();
    }
  };

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const { error } = await supabase.from('products').insert([
      { name: newProductName.trim(), unit: newProductUnit.trim(), sort: products.length + 1 }
    ]);

    if (error) {
      setStatusMsg({ type: 'error', text: `Error adding product: ${error.message}` });
    } else {
      setStatusMsg({ type: 'success', text: `Product "${newProductName}" added!` });
      setNewProductName('');
      loadProducts();
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      setStatusMsg({ type: 'error', text: `Error deleting product: ${error.message}` });
    } else {
      setStatusMsg({ type: 'success', text: `Product "${name}" deleted.` });
      loadProducts();
    }
  };

  // Add Distributor
  const handleAddDistributor = async (e) => {
    e.preventDefault();
    if (!newDistributorName.trim()) return;

    const { data, error } = await supabase
      .from('distributors')
      .insert([{ name: newDistributorName.trim() }])
      .select();

    if (error) {
      setStatusMsg({ type: 'error', text: `Error adding distributor: ${error.message}` });
    } else if (data && data[0]) {
      setStatusMsg({ type: 'success', text: `Distributor "${newDistributorName}" created!` });
      setNewDistributorName('');
      loadDistributors();
      setSelectedDistributor(data[0]);
    }
  };

  // Save Rates
  const handleSaveRates = async () => {
    if (!selectedDistributor) return;
    setStatusMsg({ type: 'info', text: 'Saving rates...' });

    const priceRows = Object.entries(prices)
      .filter(([_, priceVal]) => priceVal !== '' && priceVal !== null && !isNaN(priceVal))
      .map(([productId, priceVal]) => ({
        distributor_id: selectedDistributor.id,
        product_id: productId,
        price: parseFloat(priceVal)
      }));

    // 1. Upsert prices
    const { error: priceError } = await supabase
      .from('prices')
      .upsert(priceRows, { onConflict: 'distributor_id,product_id' });

    if (priceError) {
      setStatusMsg({ type: 'error', text: `Error saving rates: ${priceError.message}` });
      return;
    }

    // 2. Update distributor's updated_at
    const { error: distError } = await supabase
      .from('distributors')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', selectedDistributor.id);

    if (distError) {
      setStatusMsg({ type: 'error', text: `Error updating timestamp: ${distError.message}` });
    } else {
      setStatusMsg({ type: 'success', text: `Rates saved successfully for ${selectedDistributor.name}!` });
      loadDistributors();
    }
  };

  // Utility helpers
  const getRateLink = () => {
    if (!selectedDistributor) return '';
    return `${window.location.origin}/rates/${selectedDistributor.token}`;
  };

  const handleCopyLink = () => {
    const link = getRateLink();
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2400);
  };

  const getWhatsAppLink = () => {
    const link = getRateLink();
    const text = `Hello ${selectedDistributor?.name || 'Partner'}, here is your official BE-Clean wholesale rate list:\n${link}`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070F1E] flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  // ── UNAUTHENTICATED LOGIN SCREEN ───────────────────────────────────
  if (!session) {
    return (
      <div className="min-h-screen bg-[#070F1E] text-slate-100 flex items-center justify-center p-4 selection:bg-amber-900 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-full max-w-md bg-[#0F1D36] border border-[#1C3056] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 mb-3">
              <Lock size={22} />
            </div>
            <h1 className="text-2xl font-black text-white font-['Outfit'] tracking-tight">BE-Clean Admin Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Authorized business owner login</p>
          </div>

          {authError && (
            <div className="mb-5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@beclean.pk"
                className="w-full bg-[#070F1E] border border-[#1C3056] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#070F1E] border border-[#1C3056] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submittingAuth}
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
            >
              {submittingAuth ? 'Signing in...' : 'Sign In to Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── AUTHENTICATED ADMIN DASHBOARD ─────────────────────────────────
  return (
    <div className="min-h-screen bg-[#070F1E] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-900 selection:text-white">
      
      {/* Admin Top Header */}
      <header className="bg-[#040C18] border-b border-[#131F36] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-amber-400 text-black font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">ADMIN</span>
            <h1 className="text-base font-bold text-white font-['Outfit'] hidden sm:inline">BE-Clean Admin Portal</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 hidden md:inline">{session.user.email}</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-[#0F1D36] hover:bg-[#162B4D] text-slate-300 border border-[#1C3056] text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        
        {/* Banner Alert Feedback */}
        {statusMsg.text && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between text-xs font-medium ${
              statusMsg.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : statusMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMsg.type === 'error' ? (
                <AlertCircle size={16} />
              ) : (
                <Check size={16} />
              )}
              <span>{statusMsg.text}</span>
            </div>
            <button onClick={() => setStatusMsg({ type: '', text: '' })} className="text-slate-400 hover:text-white text-xs font-bold">
              Dismiss
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#131F36] mb-6">
          <button
            onClick={() => setActiveTab('distributors')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'distributors'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Building2 size={16} />
            <span>Distributors &amp; Rate Lists</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Package size={16} />
            <span>Products Catalog ({products.length})</span>
          </button>
        </div>

        {/* ── TAB 1: DISTRIBUTORS & RATES MANAGER ───────────────────────── */}
        {activeTab === 'distributors' && (
          <div className="grid lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Distributor Selector & Add Distributor */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Add New Distributor */}
              <div className="bg-[#0F1D36] border border-[#1C3056] rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus size={16} className="text-amber-400" /> Add Distributor
                </h3>
                <form onSubmit={handleAddDistributor} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Distributor Name (e.g. Metro Mart)"
                    value={newDistributorName}
                    onChange={(e) => setNewDistributorName(e.target.value)}
                    className="flex-1 bg-[#070F1E] border border-[#1C3056] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* Distributor List */}
              <div className="bg-[#0F1D36] border border-[#1C3056] rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Partner ({distributors.length})
                </h3>

                {distributors.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center">No distributors added yet.</p>
                ) : (
                  <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                    {distributors.map((d) => {
                      const isSelected = selectedDistributor?.id === d.id;
                      return (
                        <button
                          key={d.id}
                          onClick={() => setSelectedDistributor(d)}
                          className={`w-full text-left p-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-400 text-amber-400'
                              : 'bg-[#070F1E] border-[#1C3056] text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <span className="truncate">{d.name}</span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            {new Date(d.updated_at).toLocaleDateString()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Rate Grid & Actions for Selected Distributor */}
            <div className="lg:col-span-8">
              {selectedDistributor ? (
                <div className="bg-[#0F1D36] border border-[#1C3056] rounded-xl p-5 sm:p-6 shadow-sm space-y-6">
                  
                  {/* Distributor Header & Action Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#131F36] pb-5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Editing Rates For</span>
                      <h2 className="text-xl font-black text-white font-['Outfit']">{selectedDistributor.name}</h2>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Last saved: {new Date(selectedDistributor.updated_at).toLocaleString()}
                      </p>
                    </div>

                    {/* Quick Link Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleCopyLink}
                        className="inline-flex items-center gap-1.5 bg-[#070F1E] hover:bg-[#122035] text-slate-300 border border-[#1C3056] text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                      </button>

                      <a
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                      >
                        WhatsApp Link
                      </a>

                      <a
                        href={`/rates/${selectedDistributor.token}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#162B4D] hover:bg-[#1F3D6C] text-amber-400 border border-amber-500/30 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                      >
                        <ExternalLink size={14} />
                        <span>Preview</span>
                      </a>
                    </div>
                  </div>

                  {/* Product Search & Save Rate List Button */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search products in rate list..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full bg-[#070F1E] border border-[#1C3056] rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      onClick={handleSaveRates}
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all shadow-md cursor-pointer whitespace-nowrap"
                    >
                      <Save size={15} />
                      <span>Save Rates</span>
                    </button>
                  </div>

                  {/* Price Grid Table */}
                  {products.length === 0 ? (
                    <div className="text-center py-10 bg-[#070F1E] rounded-xl border border-[#1C3056]">
                      <Package size={24} className="mx-auto text-slate-600 mb-2" />
                      <p className="text-xs text-slate-400">No products in database catalog.</p>
                      <button
                        onClick={handleSeedProducts}
                        className="mt-3 text-xs font-bold text-amber-400 hover:underline inline-flex items-center gap-1"
                      >
                        <Sparkles size={14} /> Seed products from website catalog
                      </button>
                    </div>
                  ) : (
                    <div className="border border-[#1C3056] rounded-xl overflow-hidden bg-[#070F1E]">
                      <div className="max-h-[480px] overflow-y-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#0B172B] text-slate-400 uppercase tracking-wider text-[10px] font-bold sticky top-0 border-b border-[#1C3056]">
                            <tr>
                              <th className="px-4 py-3">Product</th>
                              <th className="px-4 py-3">Unit</th>
                              <th className="px-4 py-3 text-right">Wholesale Rate (Rs.)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#131F36]">
                            {filteredProducts.map((p) => {
                              const val = prices[p.id] !== undefined ? prices[p.id] : '';
                              return (
                                <tr key={p.id} className="hover:bg-[#0F1D36]/60 transition-colors">
                                  <td className="px-4 py-2.5 font-bold text-white">{p.name}</td>
                                  <td className="px-4 py-2.5 text-slate-400">{p.unit}</td>
                                  <td className="px-4 py-2.5 text-right">
                                    <div className="inline-flex items-center gap-1">
                                      <span className="text-slate-500 text-[11px]">Rs.</span>
                                      <input
                                        type="number"
                                        step="1"
                                        min="0"
                                        placeholder="0"
                                        value={val}
                                        onChange={(e) => {
                                          setPrices({ ...prices, [p.id]: e.target.value });
                                        }}
                                        className="w-24 bg-[#0F1D36] border border-[#1C3056] focus:border-amber-400 rounded px-2 py-1 text-right text-xs font-bold text-amber-400 focus:outline-none"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="bg-[#0F1D36] border border-[#1C3056] rounded-xl p-10 text-center">
                  <Building2 size={32} className="mx-auto text-slate-600 mb-3" />
                  <h3 className="text-sm font-bold text-white">Select a Distributor</h3>
                  <p className="text-xs text-slate-400 mt-1">Choose a distributor partner from the left menu to view and edit their custom rate list.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── TAB 2: PRODUCTS CATALOG MANAGER ────────────────────────────── */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F1D36] border border-[#1C3056] rounded-xl p-5">
              <div>
                <h3 className="text-base font-bold text-white font-['Outfit']">Database Products Catalog</h3>
                <p className="text-xs text-slate-400 mt-0.5">Manage products and units for distributor rate lists.</p>
              </div>

              <button
                onClick={handleSeedProducts}
                className="inline-flex items-center gap-2 bg-[#162B4D] hover:bg-[#1F3D6C] text-amber-400 border border-amber-500/40 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles size={16} />
                <span>Seed from Website Catalog</span>
              </button>
            </div>

            {/* Add New Product Form */}
            <div className="bg-[#0F1D36] border border-[#1C3056] rounded-xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Add Custom Product</h4>
              <form onSubmit={handleAddProduct} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="Product Name (e.g. Washroom Cleaner 500ml)"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="flex-1 bg-[#070F1E] border border-[#1C3056] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  required
                  placeholder="Unit (e.g. 1 Bottle, Carton of 12)"
                  value={newProductUnit}
                  onChange={(e) => setNewProductUnit(e.target.value)}
                  className="w-full sm:w-48 bg-[#070F1E] border border-[#1C3056] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                >
                  Add Product
                </button>
              </form>
            </div>

            {/* Product List Table */}
            <div className="bg-[#0F1D36] border border-[#1C3056] rounded-xl overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B172B] text-slate-400 uppercase tracking-wider text-[10px] font-bold sticky top-0 border-b border-[#1C3056]">
                    <tr>
                      <th className="px-4 py-3">Product Name</th>
                      <th className="px-4 py-3">Packaging Unit</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#131F36]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#070F1E]/50 transition-colors">
                        <td className="px-4 py-3 font-bold text-white">{p.name}</td>
                        <td className="px-4 py-3 text-slate-400">{p.unit}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
