import React, { useState, useEffect } from 'react'

interface Guide {
  id: string
  title: string
  titleMal: string
  category: string
  icon: string
  size: string
  content: string[]
  downloaded?: boolean
}

const GUIDES: Guide[] = [
  {
    id: 'paddy-pest',
    title: 'Paddy Pest Management',
    titleMal: 'നെൽകൃഷി കീട നിയന്ത്രണം',
    category: 'Pest Control',
    icon: '🌾',
    size: '120 KB',
    content: [
      ' Stem Borer: Apply Chlorpyrifos 2.5ml per liter of water. Spray at evening.',
      ' Leaf Folder: Use Monocrotophos 1.6ml/L. Avoid spraying during flowering.',
      ' Blast Disease: Apply Tricyclazole 0.6g/L or Isoprothiolane 1.5ml/L.',
      ' Brown Plant Hopper: Drain field for 3-4 days. Apply Buprofezin 1ml/L.',
      ' Spray Schedule: First spray at 30 days, second at 60 days after transplanting.',
      ' Safety: Wear gloves and mask. Do not spray before rain.',
    ]
  },
  {
    id: 'coconut-care',
    title: 'Coconut Tree Care Guide',
    titleMal: 'തെങ്ങ് പരിചരണ മാർഗദർശി',
    category: 'Crop Care',
    icon: '🥥',
    size: '95 KB',
    content: [
      ' Fertilizer: Apply 1.3 kg Urea + 2 kg Super Phosphate + 3.5 kg MOP per tree per year.',
      ' Rhinoceros Beetle: Fill crown with sand + Naphthalene balls. Apply Carbaryl dust.',
      ' Bud Rot: Apply Bordeaux mixture (1%) to crown during monsoon. Repeat monthly.',
      ' Irrigation: 200 liters per tree per week in summer. Reduce in monsoon.',
      ' Pruning: Remove dead fronds regularly. Keep 30-35 green fronds on tree.',
      ' Intercropping: Banana, pepper, or cocoa can be grown under coconut trees.',
    ]
  },
  {
    id: 'banana-guide',
    title: 'Banana Cultivation Guide',
    titleMal: 'വാഴക്കൃഷി മാർഗദർശി',
    category: 'Crop Guide',
    icon: '🍌',
    size: '88 KB',
    content: [
      ' Planting: Use disease-free suckers. Plant at 1.8m × 1.8m spacing.',
      ' Panama Wilt: No chemical cure. Remove infected plants. Use Grandnaine variety.',
      ' Sigatoka: Spray Mancozeb 2g/L or Propiconazole 1ml/L at 3-week intervals.',
      ' Fertilizer: 200g Urea + 200g MOP at planting. Repeat at 3 and 6 months.',
      ' Propping: Support plants with bamboo poles at flowering stage.',
      ' Harvest: Harvest when fingers are full and angular. Takes 11-14 months.',
    ]
  },
  {
    id: 'organic-farming',
    title: 'Organic Farming Basics',
    titleMal: 'ജൈവ കൃഷി അടിസ്ഥാനങ്ങൾ',
    category: 'Organic',
    icon: '🌿',
    size: '110 KB',
    content: [
      ' Compost: Mix green waste + dry waste (1:1). Turn weekly. Ready in 45-60 days.',
      ' Vermicompost: Use earthworms with kitchen waste. Produces in 30-45 days.',
      ' Neem Oil Spray: Mix 5ml neem oil + 1g soap in 1L water. Controls most pests.',
      ' Jeevamrut: Mix 10L cow urine + 10kg dung + 2kg jaggery + 2kg pulse flour in 200L water.',
      ' Green Manure: Grow Sunhemp or Dhaincha and incorporate before flowering.',
      ' Crop Rotation: Rotate legume crops with non-legume to maintain soil health.',
    ]
  },
  {
    id: 'weather-farming',
    title: 'Kerala Season Farming Calendar',
    titleMal: 'കേരള കൃഷി കലണ്ടർ',
    category: 'Planning',
    icon: '📅',
    size: '75 KB',
    content: [
      ' Kharif (Jun-Sep): Paddy, Tapioca, Ginger, Turmeric planting season.',
      ' Rabi (Oct-Jan): Vegetables, Pulses, Groundnut cultivation.',
      ' Summer (Feb-May): Irrigation-dependent crops. Good for watermelon, cucumber.',
      ' Pre-Monsoon (Apr-May): Land preparation, applying lime, basal fertilizer.',
      ' Post-Harvest (Oct-Nov): Store paddy at <14% moisture. Use proper bins.',
      ' Flood Preparedness: Keep drainage channels clear. Harvest before heavy rain.',
    ]
  },
  {
    id: 'soil-health',
    title: 'Soil Health Management',
    titleMal: 'മണ്ണ് ആരോഗ്യ പരിപാലനം',
    category: 'Soil',
    icon: '🌍',
    size: '102 KB',
    content: [
      ' Soil Testing: Test every 3 years. Send samples to Krishi Bhavan lab (free).',
      ' Lime Application: Apply 250-500 kg/acre if pH < 5.5. Mix well before planting.',
      ' Organic Matter: Add 10 tonnes FYM per acre every year before monsoon.',
      ' Drainage: Poor drainage causes root rot. Create raised beds in waterlogged areas.',
      ' Cover Crops: Grow legumes (cowpea, groundnut) during off-season to fix nitrogen.',
      ' Avoid: Over-plowing, burning crop residues, excess chemical fertilizer.',
    ]
  },
]

export default function OfflinePage() {
  const [downloaded, setDownloaded] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('downloaded_guides') || '[]')) } catch { return new Set() }
  })
  const [openGuide, setOpenGuide] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [downloading, setDownloading] = useState<string | null>(null)

  const saveDownloaded = (ids: Set<string>) => {
    setDownloaded(ids)
    localStorage.setItem('downloaded_guides', JSON.stringify([...ids]))
  }

  const handleDownload = (id: string) => {
    setDownloading(id)
    setTimeout(() => {
      const newSet = new Set(downloaded)
      newSet.add(id)
      saveDownloaded(newSet)
      setDownloading(null)
    }, 1200)
  }

  const handleRemove = (id: string) => {
    const newSet = new Set(downloaded)
    newSet.delete(id)
    saveDownloaded(newSet)
  }

  const filtered = GUIDES.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.category.toLowerCase().includes(search.toLowerCase()) ||
    g.titleMal.includes(search)
  )

  const dlCount = downloaded.size
  const totalSize = GUIDES.filter(g => downloaded.has(g.id))
    .reduce((acc, g) => acc + parseInt(g.size), 0)

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 section-title">📥 Offline Guides</h1>
        <p className="text-gray-500" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
          ഓഫ്‌ലൈൻ കൃഷി ഗൈഡുകൾ
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Download farming guides to use without internet connection
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="p-3 text-center card">
          <p className="text-2xl font-bold text-forest-700">{dlCount}</p>
          <p className="text-xs text-gray-500">Downloaded</p>
        </div>
        <div className="p-3 text-center card">
          <p className="text-2xl font-bold text-gray-700">{GUIDES.length}</p>
          <p className="text-xs text-gray-500">Total Guides</p>
        </div>
        <div className="p-3 text-center card">
          <p className="text-2xl font-bold text-earth-600">{totalSize}KB</p>
          <p className="text-xs text-gray-500">Saved</p>
        </div>
      </div>

      {/* Offline notice */}
      {dlCount > 0 && (
        <div className="flex items-center gap-2 p-3 mb-4 border bg-forest-50 border-forest-200 rounded-xl">
          <span className="text-xl">✅</span>
          <p className="text-sm font-medium text-forest-700">
            {dlCount} guide{dlCount > 1 ? 's' : ''} available offline — readable without internet
          </p>
        </div>
      )}

      {/* Search */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search guides…"
        className="mb-4 input-field"
      />

      {/* Guide List */}
      <div className="space-y-3">
        {filtered.map(guide => {
          const isDl    = downloaded.has(guide.id)
          const isOpen  = openGuide === guide.id
          const isDling = downloading === guide.id

          return (
            <div key={guide.id} className={`card overflow-hidden transition-all ${isDl ? 'border-forest-300' : ''}`}>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 text-3xl">{guide.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-gray-800">{guide.title}</p>
                      <p className="text-xs text-gray-400" style={{ fontFamily: 'Noto Sans Malayalam, sans-serif' }}>
                        {guide.titleMal}
                      </p>
                    </div>
                    {isDl && <span className="flex-shrink-0 text-xs badge bg-forest-100 text-forest-700">✅ Saved</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-600 bg-gray-100 badge">{guide.category}</span>
                    <span className="text-xs text-gray-400">{guide.size}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setOpenGuide(isOpen ? null : guide.id)}
                  className="flex-1 py-2 text-sm btn-outline"
                >
                  {isOpen ? '▲ Hide' : '📖 Read'}
                </button>
                {isDl ? (
                  <button onClick={() => handleRemove(guide.id)} className="px-4 py-2 text-sm text-red-500 border-2 border-red-200 rounded-xl hover:bg-red-50">
                    🗑️ Remove
                  </button>
                ) : (
                  <button
                    onClick={() => handleDownload(guide.id)}
                    disabled={isDling}
                    className="flex items-center justify-center flex-1 gap-1 py-2 text-sm btn-primary"
                  >
                    {isDling
                      ? <><span className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" /> Saving…</>
                      : ' Download'}
                  </button>
                )}
              </div>

              {/* Content */}
              {isOpen && (
                <div className="pt-4 mt-4 space-y-2 border-t border-gray-100">
                  {guide.content.map((line, i) => (
                    <p key={i} className="text-sm leading-relaxed text-gray-700">{line}</p>
                  ))}
                  {!isDl && (
                    <div className="p-3 mt-3 border border-yellow-200 rounded-lg bg-yellow-50">
                      <p className="text-xs text-yellow-700"> Download this guide to read it without internet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-gray-400">
          <p className="mb-2 text-4xl"></p>
          <p>No guides found for "{search}"</p>
        </div>
      )}
    </div>
  )
}
