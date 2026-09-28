import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Printer, AlertCircle, PhoneCall, Building2 } from 'lucide-react';

const PHONE = "923361503644";

export default function RatesPage({ token }) {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [distributorName, setDistributorName] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

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

  // 2. Fetch rate data via RPC function get_rates(p_token)
  useEffect(() => {
    async function fetchRates() {
      if (!token) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const { data, error: rpcError } = await supabase.rpc('get_rates', {
          p_token: token
        });

        if (rpcError || !data || data.length === 0) {
          setError(true);
        } else {
          setRates(data);
          setDistributorName(data[0].distributor_name);
          setUpdatedAt(data[0].updated_at);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchRates();
  }, [token]);

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-PK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070F1E] flex items-center justify-center text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  // ── INVALID TOKEN / EMPTY RATE LIST STATE ─────────────────────────
  if (error || rates.length === 0) {
    return (
      <div className="min-h-screen bg-[#070F1E] text-slate-100 flex items-center justify-center p-4 selection:bg-amber-900 selection:text-white font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-full max-w-md bg-[#0F1D36] border border-[#1C3056] rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 mb-4">
            <AlertCircle size={24} />
          </div>

          <h1 className="text-xl font-bold text-white font-['Outfit'] mb-2">Rate List Unavailable</h1>
          
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            This rate list is not available or may have expired. Please contact BE-Clean directly for an updated link.
          </p>

          <a
            href={`https://wa.me/${PHONE}?text=${encodeURIComponent('Hello BE-Clean, I tried to access my wholesale rate list link but it is not available. Please send me a new link.')}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20"
          >
            <PhoneCall size={16} />
            <span>Contact BE-Clean Helpline</span>
          </a>
        </div>
      </div>
    );
  }

  // ── VALID RATE LIST VIEW ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#070F1E] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-900 selection:text-white p-4 sm:p-8">
      
      {/* Print-specific style block */}
      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card {
            background: #ffffff !important;
            border: 1px solid #cccccc !important;
            color: #000000 !important;
            box-shadow: none !important;
          }
          .print-table {
            color: #000000 !important;
          }
          .print-table th {
            background-color: #f3f4f6 !important;
            color: #000000 !important;
          }
          .print-table td {
            border-bottom: 1px solid #e5e7eb !important;
            color: #000000 !important;
          }
          .print-badge {
            color: #000000 !important;
            border: 1px solid #000000 !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Actions bar (hidden during print) */}
        <div className="no-print flex items-center justify-between gap-4 bg-[#0F1D36] border border-[#1C3056] rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-black font-black text-[9px] uppercase px-2 py-0.5 rounded tracking-wider">OFFICIAL</span>
            <span className="text-xs text-slate-300 font-bold hidden sm:inline">BE-Clean Wholesale Partner Rates</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-[#162B4D] hover:bg-[#1F3D6C] text-amber-400 border border-amber-500/40 text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>

            <a
              href={`https://wa.me/${PHONE}?text=${encodeURIComponent(`Hello BE-Clean, I am viewing the rate list prepared for ${distributorName} and have a wholesale order inquiry.`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-md"
            >
              WhatsApp Support
            </a>
          </div>
        </div>

        {/* Rate List Main Document Card */}
        <div className="print-card bg-[#0F1D36] border border-[#1C3056] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#1C3056] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 size={18} className="text-amber-400" />
                <span className="text-xs font-black uppercase tracking-widest text-amber-400">BE-Clean Rawalpindi</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">Wholesale Rate List</h1>
              <p className="text-xs text-slate-400 mt-1">Direct Factory Rates &amp; Distribution Pricing</p>
            </div>

            <div className="sm:text-right">
              <span className="print-badge inline-block bg-[#070F1E] border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase px-3 py-1 rounded-full mb-1">
                Prepared For: {distributorName}
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Last Updated: {formattedDate}</p>
            </div>
          </div>

          {/* Rate Table */}
          <div className="overflow-x-auto">
            <table className="print-table w-full text-left text-xs">
              <thead className="bg-[#070F1E] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-[#1C3056]">
                <tr>
                  <th className="px-4 py-3.5">#</th>
                  <th className="px-4 py-3.5">Product Name</th>
                  <th className="px-4 py-3.5">Packaging Unit</th>
                  <th className="px-4 py-3.5 text-right">Wholesale Rate (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#131F36]">
                {rates.map((item, index) => (
                  <tr key={item.product_id || index} className="hover:bg-[#070F1E]/40 transition-colors">
                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{index + 1}</td>
                    <td className="px-4 py-3 font-bold text-white text-sm">{item.product_name}</td>
                    <td className="px-4 py-3 text-slate-400">{item.unit}</td>
                    <td className="px-4 py-3 text-right font-black text-amber-400 font-['Outfit'] text-base">
                      Rs. {Number(item.price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-[#1C3056] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <p>Manufactured by BE-Clean Rawalpindi · Twin Cities Supply</p>
            <p className="font-bold text-slate-400">Helpline: +92 336 1503644</p>
          </div>

        </div>

      </div>

    </div>
  );
}
