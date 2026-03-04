
import React, { useState, useEffect } from 'react'

interface InputEntry {
  _id: string
  date: string
  category: 'fertilizer' | 'pesticide' | 'labor' | 'seed' | 'equipment' | 'other'
  item: string
  quantity: string
  unit: string
  cost: number
  notes: string
}

interface LivePrice {
  crop: string
  market: string
  min: string
  max: string
  modal: string
  unit: string
  date: string
}

const SCHEMES = [
  { title: 'PM-KISAN',               desc: '₹6000/year direct income support to farmers',                         status: 'Active',  icon: '💰' },
  { title: 'Fertilizer Subsidy',     desc: 'Urea at ₹242/bag (MRP), DAP at ₹1350/bag via Krishi Bhavan',         status: 'Active',  icon: '🌱' },
  { title: 'Fasal Bima Yojana',      desc: 'Crop insurance up to ₹2 lakh coverage against losses',               status: 'Active',  icon: '🛡️' },
  { title: 'Krishi Bhavan Loan',     desc: '0% interest short-term crop loans up to ₹3 lakh via Kerala Bank',    status: 'Active',  icon: '🏦' },
  { title: 'Organic Kerala Mission', desc: 'Subsidy for organic inputs and certification support',                status: 'Active',  icon: '🌿' },
  { title: 'Solar Pump Subsidy',     desc: '90% subsidy on solar water pump installation for irrigation',         status: 'Limited', icon: '☀️' },
]

const CATEGORIES = ['fertilizer','pesticide','labor','seed','equipment','other'] as const
const UNITS = ['kg', 'L', 'bags', 'days', 'nos', 'acres']

const catIcon: Record<string, string> = {
  fertilizer: '🌱', pesticide: '💊', labor: '👷', seed: '🌾', equipment: '🔧', other: '📦'
}

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function ResourceTrackerPage() {
  const [tab,           setTab]           = useState<'inputs' | 'market' | 'schemes'>('inputs')

  // Input Costs state
  const [entries,       setEntries]       = useState<InputEntry[]>([])
  const [loading,       setLoading]       = useState(false)
  const [saving,        setSaving]        = useState(false)
  const [error,         setError]         = useState('')
  const [showForm,      setShowForm]      = useState(false)
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: 'fertilizer' as typeof CATEGORIES[number],
    item: '', quantity: '', unit: 'kg', cost: '', notes: ''
  })

  // Market Prices state
  const [marketPrices,  setMarketPrices]  = useState<LivePrice[]>([])
  const [marketLoading, setMarketLoading] = useState(false)
  const [marketError,   setMarketError]   = useState('')

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
    if (tab !== 'market') return
    setMarketLoading(true)
    setMarketError('')
    fetch(`${API}/market-prices`, { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setMarketPrices(data)
        else setMarketError('Failed to load prices.')
      })
      .catch(() => setMarketError('Network error. Please try again.'))
      .finally(() => setMarketLoading(false))
  }, [tab])

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
  const deleteEntry = async (id: string) => {
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
  }, {} as Record<string, number>)

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="section-title">📊 Resource Tracker</h1>
        <p className="text-gray-500" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>വിഭവ ട്രാക്കർ</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { key: 'inputs',  label: '💰 Input Costs' },
          { key: 'market',  label: '📈 Market Prices' },
          { key: 'schemes', label: '🏛️ Schemes' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              tab === t.key ? 'border-forest-600 text-forest-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── INPUT COSTS TAB ── */}
      {tab === 'inputs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="col-span-2 p-4 text-center card sm:col-span-1 bg-forest-50 border-forest-200">
              <p className="text-2xl font-bold text-forest-700">₹{totalCost.toLocaleString('en-IN')}</p>
              <p className="mt-1 text-xs text-gray-500">Total Spent</p>
            </div>
            {(['fertilizer','pesticide','labor'] as const).map(c => (
              <div key={c} className="p-4 text-center card">
                <p className="text-lg font-bold text-gray-700">₹{(byCat[c] || 0).toLocaleString('en-IN')}</p>
                <p className="mt-1 text-xs text-gray-500 capitalize">{catIcon[c]} {c}</p>
              </div>
            ))}
          </div>

          {error && (
            <div className="p-3 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">⚠️ {error}</div>
          )}

          <button onClick={() => setShowForm(!showForm)} className="w-full btn-primary">
            {showForm ? '✕ Cancel' : '+ Add Input Cost'}
          </button>

          {showForm && (
            <div className="space-y-3 card border-forest-300">
              <h3 className="font-bold text-forest-800">Add New Entry</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-xs text-gray-500">Date</label>
                  <input type="date" value={form.date}
                    onChange={e => setForm({...form, date: e.target.value})}
                    className="text-sm input-field" />
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-500">Category</label>
                  <select value={form.category}
                    onChange={e => setForm({...form, category: e.target.value as typeof form.category})}
                    className="text-sm input-field">
                    {CATEGORIES.map(c => <option key={c} value={c}>{catIcon[c]} {c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-xs text-gray-500">Item Name</label>
                <input value={form.item}
                  onChange={e => setForm({...form, item: e.target.value})}
                  placeholder="e.g. Urea fertilizer" className="text-sm input-field" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 text-xs text-gray-500">Quantity</label>
                  <input value={form.quantity}
                    onChange={e => setForm({...form, quantity: e.target.value})}
                    placeholder="25" className="text-sm input-field" />
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-500">Unit</label>
                  <select value={form.unit}
                    onChange={e => setForm({...form, unit: e.target.value})}
                    className="text-sm input-field">
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-xs text-gray-500">Cost (₹)</label>
                  <input type="number" value={form.cost}
                    onChange={e => setForm({...form, cost: e.target.value})}
                    placeholder="500" className="text-sm input-field" />
                </div>
              </div>
              <input value={form.notes}
                onChange={e => setForm({...form, notes: e.target.value})}
                placeholder="Notes (optional)" className="text-sm input-field" />
              <button onClick={addEntry} disabled={saving}
                className="flex items-center justify-center w-full gap-2 btn-primary">
                {saving
                  ? <><div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" /> Saving…</>
                  : '✅ Save Entry'}
              </button>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-10">
              <div className="border-4 rounded-full w-7 h-7 border-forest-500 border-t-transparent animate-spin" />
              <p className="font-medium text-forest-700">Loading entries…</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <p className="mb-2 text-4xl">📋</p>
              <p>No entries yet. Start tracking your farm inputs.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map(e => (
                <div key={e._id} className="flex items-center gap-3 p-4 card">
                  <span className="text-2xl">{catIcon[e.category]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800 truncate">{e.item}</p>
                      <span className="flex-shrink-0 text-xs text-gray-600 capitalize bg-gray-100 badge">{e.category}</span>
                    </div>
                    <p className="text-xs text-gray-400">{e.date}{e.quantity && ` · ${e.quantity} ${e.unit}`}</p>
                    {e.notes && <p className="text-xs italic text-gray-400">{e.notes}</p>}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="font-bold text-forest-700">₹{e.cost.toLocaleString('en-IN')}</p>
                    <button onClick={() => deleteEntry(e._id)}
                      className="text-xs text-red-400 transition-colors hover:text-red-600">
                      delete
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
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Kerala APMC prices · data.gov.in</p>
            <span className="text-xs badge bg-forest-100 text-forest-700">Live</span>
          </div>

          {marketError && (
            <div className="p-3 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">⚠️ {marketError}</div>
          )}

          {marketLoading ? (
            <div className="flex items-center justify-center gap-3 py-10">
              <div className="border-4 rounded-full w-7 h-7 border-forest-500 border-t-transparent animate-spin" />
              <p className="font-medium text-forest-700">Loading prices…</p>
            </div>
          ) : marketPrices.length === 0 && !marketError ? (
            <div className="py-10 text-center text-gray-400">
              <p className="mb-2 text-3xl">📊</p>
              <p>No price data available today.</p>
            </div>
          ) : (
            marketPrices.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4 card">
                <div>
                  <p className="font-bold text-gray-800">{p.crop}</p>
                  <p className="text-xs text-gray-500">{p.market} · {p.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-forest-700">
                    ₹{p.modal}
                    <span className="text-sm font-normal text-gray-500">{p.unit}</span>
                  </p>
                  <p className="text-xs text-gray-400">Min ₹{p.min} – Max ₹{p.max}</p>
                </div>
              </div>
            ))
          )}

          <p className="pt-2 text-xs text-center text-gray-400">
            Source: data.gov.in · Agmarknet Kerala
          </p>
        </div>
      )}

      {/* ── SCHEMES TAB ── */}
      {tab === 'schemes' && (
        <div className="space-y-3">
          <p className="mb-2 text-sm text-gray-500">Government schemes available for Kerala farmers</p>
          {SCHEMES.map(s => (
            <div key={s.title} className="p-4 card">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{s.icon}</span>
                  <p className="font-bold text-gray-800">{s.title}</p>
                </div>
                <span className={`badge text-xs flex-shrink-0 ${
                  s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {s.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 ml-9">{s.desc}</p>
              <button className="mt-2 text-xs font-medium ml-9 text-forest-600 hover:underline">
                Learn more →
              </button>
            </div>
          ))}
          <div className="p-4 text-center card bg-forest-50 border-forest-200">
            <p className="text-sm font-medium text-forest-700">📞 Contact your local Krishi Bhavan</p>
            <p className="mt-1 text-xs text-gray-500">for personalized scheme eligibility and application help</p>
          </div>
        </div>
      )}
    </div>
  )
}