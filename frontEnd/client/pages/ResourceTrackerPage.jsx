import React, { useState, useEffect } from 'react'

const SCHEMES = [
  { title: 'PM-KISAN',               desc: '₹6000/year direct income support to farmers',                    status: 'Active' },
  { title: 'Fertilizer Subsidy',     desc: 'Urea at ₹242/bag (MRP), DAP at ₹1350/bag via Krishi Bhavan',      status: 'Active' },
  { title: 'Fasal Bima Yojana',      desc: 'Crop insurance up to ₹2 lakh coverage against losses',            status: 'Active' },
  { title: 'Krishi Bhavan Loan',     desc: '0% interest short-term crop loans up to ₹3 lakh via Kerala Bank', status: 'Active' },
  { title: 'Organic Kerala Mission', desc: 'Subsidy for organic inputs and certification support',            status: 'Active' },
  { title: 'Solar Pump Subsidy',     desc: '90% subsidy on solar water pump installation for irrigation',      status: 'Limited' },
]

const CATEGORIES = ['fertilizer', 'pesticide', 'labor', 'seed', 'equipment', 'other']
const UNITS = ['kg', 'L', 'bags', 'days', 'nos', 'acres']

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function ResourceTrackerPage() {
  const [tab, setTab] = useState('inputs')

  // Input Costs state
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'fertilizer',
    item: '', quantity: '', unit: 'kg', cost: '', notes: ''
  })

  // Market Prices state
  const [marketPrices, setMarketPrices] = useState([])
  const [marketLoading, setMarketLoading] = useState(false)
  const [marketError, setMarketError] = useState('')

  // ── Load input entries ──
  useEffect(() => {
    if (tab !== 'inputs') return
    setLoading(true)
    setError('')
    fetch(`${API}/input-entries`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setEntries(data)
        else setError('Failed to load entries. Please login.')
      })
      .catch(() => setError('Network error. Please try again.'))
      .finally(() => setLoading(false))
  }, [tab])

  // ── Load market prices ──
  useEffect(() => {
    if (tab !== 'market') return;
    setMarketLoading(true);
    setMarketError('');

    fetch(`${API}/market-prices`, { credentials: 'include' })
      .then(async (r) => {
        const data = await r.json().catch(() => null); // Catch JSON parsing errors

        if (!r.ok) {
          // If status is 401, 500, etc., throw the backend's error message
          throw new Error(data?.message || data?.error || `HTTP Error: ${r.status}`);
        }
        return data;
      })
      .then(data => {
        if (Array.isArray(data)) {
          setMarketPrices(data);
        } else {
          console.error("Expected array but got:", data);
          setMarketError('Failed to load prices: Server returned invalid data format.');
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setMarketError(err.message || 'Network error. Please try again.');
      })
      .finally(() => setMarketLoading(false));
  }, [tab]);

  // ── Add entry ──
  const addEntry = async () => {
    if (!form.item.trim() || !form.cost) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`${API}/input-entries`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, cost: Number(form.cost) }),
      })
      const data = await res.json()
      if (res.ok) {
        setEntries(prev => [data, ...prev])
        setForm({
          date: new Date().toISOString().split('T')[0],
          category: 'fertilizer', item: '', quantity: '', unit: 'kg', cost: '', notes: ''
        })
        setShowForm(false)
      } else {
        setError(data.error || 'Failed to save entry.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete entry ──
  const deleteEntry = async (id) => {
    try {
      await fetch(`${API}/input-entries/${id}`, { method: 'DELETE', credentials: 'include' })
      setEntries(prev => prev.filter(e => e._id !== id))
    } catch {
      setError('Failed to delete entry.')
    }
  }

  const totalCost = entries.reduce((sum, e) => sum + e.cost, 0)
  const byCat = CATEGORIES.reduce((acc, c) => {
    acc[c] = entries.filter(e => e.category === c).reduce((s, e) => s + e.cost, 0)
    return acc
  }, {})

  return (
    <div className="max-w-5xl min-h-screen px-4 py-8 mx-auto bg-gray-50/50">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Resource Tracker
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Track input costs, market prices, and government schemes
        </p>
      </div>

      {/* Segmented Tabs */}
      <div className="flex max-w-2xl p-1 mb-8 space-x-1 bg-gray-200/60 rounded-xl">
        {[
          { key: 'inputs',  label: 'Input Costs' },
          { key: 'market',  label: 'Market Prices' },
          { key: 'schemes', label: 'Schemes' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              tab === t.key
                ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── INPUT COSTS TAB ── */}
      {tab === 'inputs' && (
        <div className="space-y-6 animate-fade-in">

          {/* Summary Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col items-center justify-center col-span-2 p-6 text-center border shadow-sm bg-emerald-50 border-emerald-100 rounded-2xl sm:col-span-1">
              <p className="text-3xl font-extrabold tracking-tight text-emerald-700">
                ₹{totalCost.toLocaleString('en-IN')}
              </p>
              <p className="mt-1.5 text-xs font-semibold text-emerald-600 uppercase tracking-wider">Total Spent</p>
            </div>

            {['fertilizer', 'pesticide', 'labor'].map(c => (
              <div key={c} className="p-5 text-center transition-shadow bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
                <p className="text-xl font-bold tracking-tight text-gray-800">
                  ₹{(byCat[c] || 0).toLocaleString('en-IN')}
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 capitalize bg-gray-50 px-2 py-1 rounded-md">
                  {c}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">
               <svg className="flex-shrink-0 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
               <p>{error}</p>
            </div>
          )}

          {/* Form Toggle Button */}
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center w-full gap-2 px-6 py-3 text-sm font-bold text-white transition-all duration-200 shadow-md sm:w-auto bg-emerald-600 rounded-xl hover:bg-emerald-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Input Cost
            </button>
          )}

          {/* Add Entry Form Card */}
          {showForm && (
            <div className="relative p-6 overflow-hidden bg-white border border-gray-100 shadow-lg rounded-2xl shadow-emerald-900/5 animate-fade-in">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>

              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900">Add New Entry</h3>
                <button onClick={() => setShowForm(false)} className="text-gray-400 transition-colors hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block mb-1.5 text-sm font-semibold text-gray-700">Date</label>
                    <input type="date" value={form.date}
                      onChange={e => setForm({...form, date: e.target.value})}
                      className="block w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all sm:text-sm" />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-semibold text-gray-700">Category</label>
                    <select value={form.category}
                      onChange={e => setForm({...form, category: e.target.value})}
                      className="block w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all sm:text-sm appearance-none">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-gray-700">Item Name</label>
                  <input value={form.item}
                    onChange={e => setForm({...form, item: e.target.value})}
                    placeholder="e.g. Urea fertilizer"
                    className="block w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all sm:text-sm" />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div>
                    <label className="block mb-1.5 text-sm font-semibold text-gray-700">Quantity</label>
                    <input value={form.quantity}
                      onChange={e => setForm({...form, quantity: e.target.value})}
                      placeholder="e.g. 25"
                      className="block w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all sm:text-sm" />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-semibold text-gray-700">Unit</label>
                    <select value={form.unit}
                      onChange={e => setForm({...form, unit: e.target.value})}
                      className="block w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all sm:text-sm appearance-none">
                      {UNITS.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-semibold text-gray-700">Cost (₹)</label>
                    <input type="number" value={form.cost}
                      onChange={e => setForm({...form, cost: e.target.value})}
                      placeholder="e.g. 500"
                      className="block w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all sm:text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block mb-1.5 text-sm font-semibold text-gray-700">Notes (Optional)</label>
                  <input value={form.notes}
                    onChange={e => setForm({...form, notes: e.target.value})}
                    placeholder="Any additional details..."
                    className="block w-full px-4 py-2.5 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all sm:text-sm" />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={addEntry} disabled={saving}
                    className="px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 bg-emerald-600 border border-transparent rounded-xl hover:bg-emerald-700 shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2">
                    {saving ? (
                      <><div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" /> Saving…</>
                    ) : 'Save Entry'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Entries List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-emerald-600">
               <div className="w-8 h-8 border-4 rounded-full border-emerald-500 border-t-transparent animate-spin" />
               <p className="font-semibold">Loading entries…</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-16 text-center bg-white border border-gray-100 border-dashed rounded-2xl">
              <h3 className="mb-1 text-lg font-bold text-gray-900">No entries yet</h3>
              <p className="text-sm text-gray-500">Start tracking your farm inputs to see insights.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map(e => (
                <div key={e._id} className="flex flex-col gap-4 p-4 transition-shadow bg-white border border-gray-100 shadow-sm sm:flex-row sm:items-center rounded-2xl hover:shadow-md group">

                  <div className="flex items-center flex-1 min-w-0 gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-base font-bold text-gray-900 truncate">{e.item}</p>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                          {e.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {e.quantity && <span className="mx-1.5 text-gray-300">•</span>}
                        {e.quantity && `${e.quantity} ${e.unit}`}
                      </p>
                      {e.notes && <p className="mt-1 text-sm italic text-gray-400 line-clamp-1">{e.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full gap-4 pt-3 mt-2 border-t sm:justify-end sm:w-auto sm:pt-0 sm:border-0 border-gray-50 sm:mt-0">
                    <p className="text-lg font-extrabold text-emerald-700">₹{e.cost.toLocaleString('en-IN')}</p>
                    <button onClick={() => deleteEntry(e._id)}
                      className="p-2 text-gray-400 transition-colors rounded-lg hover:bg-red-50 hover:text-red-600 focus:outline-none"
                      title="Delete entry">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MARKET PRICES TAB ── */}
      {tab === 'market' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200/60">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-gray-900">Kerala APMC Prices</h2>
              <p className="text-sm text-gray-500">Source: data.gov.in</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
              <span className="w-1.5 h-1.5 mr-1.5 bg-emerald-600 rounded-full animate-pulse"></span>
              Live Updates
            </span>
          </div>

          {marketError && (
            <div className="flex items-center gap-3 p-4 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">
               <svg className="flex-shrink-0 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
               <p>{marketError}</p>
            </div>
          )}

          {marketLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 text-emerald-600">
               <div className="w-8 h-8 border-4 rounded-full border-emerald-500 border-t-transparent animate-spin" />
               <p className="font-semibold">Fetching latest prices…</p>
            </div>
          ) : marketPrices.length === 0 && !marketError ? (
            <div className="py-16 text-center bg-white border border-gray-100 border-dashed rounded-2xl">
              <h3 className="mb-1 text-lg font-bold text-gray-900">No Data Today</h3>
              <p className="text-sm text-gray-500">Market prices haven't been updated yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {marketPrices.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-5 transition-shadow bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md">
                  <div>
                    <p className="text-base font-extrabold text-gray-900">{p.crop}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <p className="text-sm font-medium text-gray-600">{p.market}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 ml-6">{p.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-emerald-700">
                      ₹{p.modal}
                      <span className="ml-1 text-sm font-medium text-gray-500">/{p.unit}</span>
                    </p>
                    <p className="mt-1 text-xs font-medium text-gray-400">Min ₹{p.min} <span className="mx-1">•</span> Max ₹{p.max}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── SCHEMES TAB ── */}
      {tab === 'schemes' && (
        <div className="space-y-4 animate-fade-in">
          <div className="pb-2 mb-4 border-b border-gray-200/60">
             <h2 className="text-lg font-bold text-gray-900">Government Support</h2>
             <p className="text-sm text-gray-500">Active subsidies and schemes for Kerala farmers</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {SCHEMES.map(s => (
              <div key={s.title} className="p-5 transition-all bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md group">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <p className="text-base font-extrabold text-gray-900">{s.title}</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset flex-shrink-0 ${
                    s.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                      : 'bg-amber-50 text-amber-700 ring-amber-600/20'
                  }`}>
                    {s.status}
                  </span>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-gray-600">{s.desc}</p>
                <button className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 group/btn">
                  Learn more
                  <svg className="w-4 h-4 transition-transform transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-2 p-6 mt-6 text-center border bg-emerald-50 border-emerald-100 rounded-2xl">
            <p className="text-base font-bold text-emerald-900">Contact your local Krishi Bhavan</p>
            <p className="text-sm text-emerald-700/80">For personalized scheme eligibility and application help in your panchayat.</p>
          </div>
        </div>
      )}

    </div>
  )
}