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

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const API = apiBase.endsWith('/api') ? apiBase : apiBase.replace(/\/$/, '') + '/api'

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
        const data = await r.json().catch(() => null);

        if (!r.ok) {
          throw new Error(data?.message || data?.error || `HTTP Error: ${r.status}`);
        }
        return data;
      })
      .then(data => {
        if (Array.isArray(data)) {
          setMarketPrices(data);
        } else {
          setMarketError('Failed to load prices: Server returned invalid data format.');
        }
      })
      .catch((err) => {
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
    <div className="max-w-5xl min-h-screen px-4 py-8 mx-auto font-sans bg-gray-50">

      {/* Header */}
      <div className="mb-8 pt-12">
        <h1 className="text-3xl font-bold text-gray-900">
          Resource Tracker
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Track input costs, market prices, and government schemes
        </p>
      </div>

      {/* Segmented Tabs (Linear style) */}
      <div className="flex mb-8 border-b border-gray-200">
        {[
          { key: 'inputs',  label: 'Input Costs' },
          { key: 'market',  label: 'Market Prices' },
          { key: 'schemes', label: 'Schemes' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              tab === t.key
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
            {tab === t.key && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 rounded-t-sm" />
            )}
          </button>
        ))}
      </div>

      {/* ── INPUT COSTS TAB ── */}
      {tab === 'inputs' && (
        <div className="space-y-6">

          {/* Summary Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex flex-col p-5 bg-white border border-gray-200 shadow-sm rounded-lg sm:col-span-1">
              <p className="text-xs font-medium text-gray-500 uppercase">Total Spent</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 font-mono">
                ₹{totalCost.toLocaleString('en-IN')}
              </p>
            </div>

            {['fertilizer', 'pesticide', 'labor'].map(c => (
              <div key={c} className="flex flex-col p-5 bg-white border border-gray-200 shadow-sm rounded-lg">
                <p className="text-xs font-medium text-gray-500 uppercase">{c}</p>
                <p className="mt-1 text-xl font-bold text-gray-800 font-mono">
                  ₹{(byCat[c] || 0).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>

          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
               {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Entries</h2>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
            >
              Add Entry
            </button>
          </div>

          {/* Add Entry Modal Overlay */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
              <div className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Entry</h3>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Date</label>
                      <input type="date" value={form.date}
                        onChange={e => setForm({...form, date: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                      <select value={form.category}
                        onChange={e => setForm({...form, category: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Item Name</label>
                    <input value={form.item}
                      onChange={e => setForm({...form, item: e.target.value})}
                      placeholder="e.g. Urea fertilizer"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Quantity</label>
                      <input value={form.quantity}
                        onChange={e => setForm({...form, quantity: e.target.value})}
                        placeholder="e.g. 25"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Unit</label>
                      <select value={form.unit}
                        onChange={e => setForm({...form, unit: e.target.value})}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white">
                        {UNITS.map(u => <option key={u}>{u}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 text-sm font-medium text-gray-700">Cost (₹)</label>
                      <input type="number" value={form.cost}
                        onChange={e => setForm({...form, cost: e.target.value})}
                        placeholder="500"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Notes (Optional)</label>
                    <input value={form.notes}
                      onChange={e => setForm({...form, notes: e.target.value})}
                      placeholder="Any details..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                  </div>
                </div>

                <div className="flex justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
                  <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Cancel
                  </button>
                  <button onClick={addEntry} disabled={saving}
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2">
                    {saving ? 'Saving...' : 'Save Entry'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Entries List / Table */}
          {loading ? (
            <div className="flex justify-center py-12">
               <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-900">No entries yet</h3>
              <p className="text-sm text-gray-500 mt-1">Start tracking your farm inputs.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Item</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium">Qty</th>
                    <th className="p-4 font-medium">Cost</th>
                    <th className="p-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {entries.map(e => (
                    <tr key={e._id} className="text-sm text-gray-700 hover:bg-gray-50">
                      <td className="p-4">{new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</td>
                      <td className="p-4 font-medium text-gray-900">{e.item}
                        {e.notes && <span className="block text-xs text-gray-400 font-normal truncate max-w-[150px]">{e.notes}</span>}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 capitalize">
                          {e.category}
                        </span>
                      </td>
                      <td className="p-4">{e.quantity ? `${e.quantity} ${e.unit}` : '-'}</td>
                      <td className="p-4 font-mono font-medium">₹{e.cost.toLocaleString('en-IN')}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => deleteEntry(e._id)} className="text-gray-400 hover:text-red-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── MARKET PRICES TAB ── */}
      {tab === 'market' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Kerala APMC Prices</h2>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
              Live Updates
            </span>
          </div>

          {marketError && (
            <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md">
               {marketError}
            </div>
          )}

          {marketLoading ? (
            <div className="flex justify-center py-12">
               <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : marketPrices.length === 0 && !marketError ? (
            <div className="py-12 text-center bg-white border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-sm font-medium text-gray-900">No Data Today</h3>
              <p className="text-sm text-gray-500 mt-1">Market prices haven't been updated yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                    <th className="p-4 font-medium">Commodity</th>
                    <th className="p-4 font-medium">Market</th>
                    <th className="p-4 font-medium">Modal Price</th>
                    <th className="p-4 font-medium">Min / Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {marketPrices.map((p, i) => (
                    <tr key={i} className="text-sm text-gray-700 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{p.crop}
                        <span className="block text-xs text-gray-400 font-normal">{p.date}</span>
                      </td>
                      <td className="p-4">{p.market}</td>
                      <td className="p-4 font-mono font-medium text-emerald-700">₹{p.modal}<span className="text-gray-500 text-xs ml-1 font-sans">/{p.unit}</span></td>
                      <td className="p-4 font-mono text-gray-500 text-xs">₹{p.min} - ₹{p.max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── SCHEMES TAB ── */}
      {tab === 'schemes' && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Government Support</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {SCHEMES.map(s => (
              <div key={s.title} className="p-5 bg-white border border-gray-200 shadow-sm rounded-lg flex flex-col">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{s.title}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    s.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {s.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{s.desc}</p>
                <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 self-start">
                  Learn more →
                </button>
              </div>
            ))}
          </div>

          <div className="p-5 mt-6 text-center border border-emerald-200 bg-emerald-50 rounded-lg">
            <p className="text-sm font-semibold text-emerald-800">Contact your local Krishi Bhavan</p>
            <p className="text-sm text-emerald-600 mt-1">For personalized scheme eligibility and application help in your panchayat.</p>
          </div>
        </div>
      )}

    </div>
  )
}