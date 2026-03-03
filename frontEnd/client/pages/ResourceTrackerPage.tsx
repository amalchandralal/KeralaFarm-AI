import React, { useState, useEffect } from 'react'

interface InputEntry {
  id: string
  date: string
  category: 'fertilizer' | 'pesticide' | 'labor' | 'seed' | 'equipment' | 'other'
  item: string
  quantity: string
  unit: string
  cost: number
  notes: string
}

interface MarketPrice {
  crop: string
  price: string
  unit: string
  trend: 'up' | 'down' | 'stable'
  change: string
}

const MARKET_PRICES: MarketPrice[] = [
  { crop: 'Coconut',    price: '₹22',   unit: '/piece',  trend: 'up',     change: '+₹2' },
  { crop: 'Paddy',      price: '₹2183', unit: '/quintal',trend: 'stable', change: '0' },
  { crop: 'Banana',     price: '₹28',   unit: '/kg',     trend: 'down',   change: '-₹3' },
  { crop: 'Tapioca',    price: '₹14',   unit: '/kg',     trend: 'up',     change: '+₹1' },
  { crop: 'Rubber',     price: '₹165',  unit: '/kg',     trend: 'up',     change: '+₹5' },
  { crop: 'Pepper',     price: '₹480',  unit: '/kg',     trend: 'stable', change: '0' },
  { crop: 'Ginger',     price: '₹55',   unit: '/kg',     trend: 'down',   change: '-₹5' },
  { crop: 'Tomato',     price: '₹32',   unit: '/kg',     trend: 'up',     change: '+₹4' },
]

const SCHEMES = [
  { title: 'PM-KISAN', desc: '₹6000/year direct income support to farmers', link: '#', status: 'Active', icon: '💰' },
  { title: 'Fertilizer Subsidy', desc: 'Urea at ₹242/bag (MRP), DAP at ₹1350/bag via Krishi Bhavan', link: '#', status: 'Active', icon: '🌱' },
  { title: 'Fasal Bima Yojana', desc: 'Crop insurance up to ₹2 lakh coverage against losses', link: '#', status: 'Active', icon: '🛡️' },
  { title: 'Krishi Bhavan Loan', desc: '0% interest short-term crop loans up to ₹3 lakh via Kerala Bank', link: '#', status: 'Active', icon: '🏦' },
  { title: 'Organic Kerala Mission', desc: 'Subsidy for organic inputs and certification support', link: '#', status: 'Active', icon: '🌿' },
  { title: 'Solar Pump Subsidy', desc: '90% subsidy on solar water pump installation for irrigation', link: '#', status: 'Limited', icon: '☀️' },
]

const CATEGORIES = ['fertilizer','pesticide','labor','seed','equipment','other'] as const
const UNITS = ['kg', 'L', 'bags', 'days', 'nos', 'acres']

const trendIcon  = { up: '📈', down: '📉', stable: '➡️' }
const trendColor = { up: 'text-green-600', down: 'text-red-600', stable: 'text-gray-500' }

export default function ResourceTrackerPage() {
  const [tab, setTab] = useState<'inputs' | 'market' | 'schemes'>('inputs')
  const [entries, setEntries] = useState<InputEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem('farm_inputs') || '[]') } catch { return [] }
  })
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], category: 'fertilizer' as const, item: '', quantity: '', unit: 'kg', cost: '', notes: '' })

  useEffect(() => {
    localStorage.setItem('farm_inputs', JSON.stringify(entries))
  }, [entries])

  const addEntry = () => {
    if (!form.item || !form.cost) return
    const entry: InputEntry = { ...form, id: Date.now().toString(), cost: Number(form.cost) }
    setEntries(prev => [entry, ...prev])
    setForm({ date: new Date().toISOString().split('T')[0], category: 'fertilizer', item: '', quantity: '', unit: 'kg', cost: '', notes: '' })
    setShowForm(false)
  }

  const deleteEntry = (id: string) => setEntries(prev => prev.filter(e => e.id !== id))

  const totalCost = entries.reduce((sum, e) => sum + e.cost, 0)
  const byCat = CATEGORIES.reduce((acc, c) => {
    acc[c] = entries.filter(e => e.category === c).reduce((s, e) => s + e.cost, 0)
    return acc
  }, {} as Record<string, number>)

  const catIcon: Record<string, string> = { fertilizer: '🌱', pesticide: '💊', labor: '👷', seed: '🌾', equipment: '🔧', other: '📦' }

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
              tab === t.key ? 'border-forest-600 text-forest-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* INPUT COSTS TAB */}
      {tab === 'inputs' && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card text-center p-4 col-span-2 sm:col-span-1 bg-forest-50 border-forest-200">
              <p className="text-2xl font-bold text-forest-700">₹{totalCost.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500 mt-1">Total Spent</p>
            </div>
            {(['fertilizer','pesticide','labor'] as const).map(c => (
              <div key={c} className="card text-center p-4">
                <p className="text-lg font-bold text-gray-700">₹{byCat[c].toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-500 mt-1 capitalize">{catIcon[c]} {c}</p>
              </div>
            ))}
          </div>

          <button onClick={() => setShowForm(!showForm)} className="btn-primary w-full">
            {showForm ? '✕ Cancel' : '+ Add Input Cost'}
          </button>

          {/* Add Form */}
          {showForm && (
            <div className="card border-forest-300 space-y-3">
              <h3 className="font-bold text-forest-800">Add New Entry</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input-field text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value as typeof form.category})} className="input-field text-sm">
                    {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{catIcon[c]} {c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Item Name</label>
                <input value={form.item} onChange={e => setForm({...form, item: e.target.value})} placeholder="e.g. Urea fertilizer" className="input-field text-sm" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Quantity</label>
                  <input value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} placeholder="25" className="input-field text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Unit</label>
                  <select value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} className="input-field text-sm">
                    {UNITS.map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Cost (₹)</label>
                  <input type="number" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} placeholder="500" className="input-field text-sm" />
                </div>
              </div>
              <input value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Notes (optional)" className="input-field text-sm" />
              <button onClick={addEntry} className="btn-primary w-full">✅ Save Entry</button>
            </div>
          )}

          {/* Entries List */}
          {entries.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">📋</p>
              <p>No entries yet. Start tracking your farm inputs.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map(e => (
                <div key={e.id} className="card flex items-center gap-3 p-4">
                  <span className="text-2xl">{catIcon[e.category]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800 truncate">{e.item}</p>
                      <span className="badge bg-gray-100 text-gray-600 text-xs capitalize flex-shrink-0">{e.category}</span>
                    </div>
                    <p className="text-xs text-gray-400">{e.date} {e.quantity && `· ${e.quantity} ${e.unit}`}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-forest-700">₹{e.cost.toLocaleString('en-IN')}</p>
                    <button onClick={() => deleteEntry(e.id)} className="text-xs text-red-400 hover:text-red-600">delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MARKET PRICES TAB */}
      {tab === 'market' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Kerala APMC prices · Updated today</p>
            <span className="badge bg-forest-100 text-forest-700 text-xs">Live</span>
          </div>
          {MARKET_PRICES.map(p => (
            <div key={p.crop} className="card flex items-center justify-between p-4">
              <div>
                <p className="font-bold text-gray-800">{p.crop}</p>
                <p className="text-xs text-gray-500">per {p.unit.replace('/', '')}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-forest-700">{p.price}<span className="text-sm font-normal text-gray-500">{p.unit}</span></p>
                <p className={`text-xs font-medium ${trendColor[p.trend]}`}>{trendIcon[p.trend]} {p.change !== '0' ? p.change : 'Stable'}</p>
              </div>
            </div>
          ))}
          <p className="text-xs text-gray-400 text-center pt-2">Prices are indicative. Check local Krishi Bhavan for exact rates.</p>
        </div>
      )}

      {/* SCHEMES TAB */}
      {tab === 'schemes' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 mb-2">Government schemes available for Kerala farmers</p>
          {SCHEMES.map(s => (
            <div key={s.title} className="card p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{s.icon}</span>
                  <p className="font-bold text-gray-800">{s.title}</p>
                </div>
                <span className={`badge text-xs flex-shrink-0 ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {s.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm ml-9">{s.desc}</p>
              <button className="ml-9 mt-2 text-forest-600 text-xs font-medium hover:underline">
                Learn more →
              </button>
            </div>
          ))}
          <div className="card bg-forest-50 border-forest-200 p-4 text-center">
            <p className="text-sm font-medium text-forest-700">📞 Contact your local Krishi Bhavan</p>
            <p className="text-xs text-gray-500 mt-1">for personalized scheme eligibility and application help</p>
          </div>
        </div>
      )}
    </div>
  )
}
