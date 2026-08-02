import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Trash2, 
  Search, 
  CheckCircle2, 
  ChevronDown,
  ChevronUp,
  Info,
  WifiOff,
  Wheat,
  TreePalm,
  Banana,
  Leaf,
  CalendarDays,
  Globe,
  Camera,
  Mic,
  FileText
} from 'lucide-react';

const GUIDES = [
  {
    id: 'paddy-management',
    title: 'Paddy Crop Care & Pest Control',
    category: 'Rice',
    iconName: 'Wheat',
    size: '1.2 MB',
    content: [
      'Nursery preparation: Use 20-25 kg seed for 1 acre nursery. Treat seeds with Pseudomonas fluorescens 10g/kg.',
      'Water management: Maintain 2-5 cm water level during tillering phase. Drain water 10 days before harvest.',
      'Stem Borer control: Apply Chlorpyrifos 20% EC @ 2ml/L if dead hearts exceed 5% in vegetative stage.',
      'Rice Blast prevention: Spray Tricyclazole 75% WP @ 0.6g/L at panicle emergence.'
    ]
  },
  {
    id: 'coconut-care',
    title: 'Coconut Plantation Management',
    category: 'Coconut',
    iconName: 'TreePalm',
    size: '850 KB',
    content: [
      'Fertilizer schedule: Apply 500g N, 320g P2O5, 1200g K2O per palm annually in two split doses (May-June & Sept-Oct).',
      'Rhinoceros Beetle: Place green muscardine fungus (Metarhizium) or use Ferrolure pheromone traps @ 1 trap/2 hectares.',
      'Red Palm Weevil: Hook out larvae and fill crown area with neem cake + sand mixture (1:2 ratio).',
      'Root Wilt Management: Apply 50kg organic manure + 1kg Trichoderma enriched neem cake per palm annually.'
    ]
  },
  {
    id: 'banana-cultivation',
    title: 'Banana Farming & Disease Guide',
    category: 'Banana',
    iconName: 'Banana',
    size: '1.5 MB',
    content: [
      'Sucker selection: Choose sword suckers weighing 1.5-2.0 kg from healthy high-yielding mother plants.',
      'Sigatoka Leaf Spot: Spray Propiconazole 1ml/L or Mineral oil + Carbendazim during monsoon months.',
      'Bunch emergence care: Apply 100g Potassium sulphate per plant 30 days after bunch emergence for crop weight.',
      'Propping: Support plants with bamboo poles during fruit development to prevent lodging from wind.'
    ]
  },
  {
    id: 'organic-fertilizer',
    title: 'Organic Fertilizer Preparation',
    category: 'General',
    iconName: 'Leaf',
    size: '950 KB',
    content: [
      'Jeevamrutha recipe: Mix 10kg cow dung, 10L cow urine, 2kg jaggery, 2kg pulse flour, and 100g fertile soil in 200L water.',
      'Fermentation: Stir clockwise twice daily. Ready for soil application after 48-72 hours.',
      'Panchagavya preparation: Mix cow dung, ghee, milk, curd, urine, tender coconut water, banana, and sugarcane juice.',
      'Composting: Layer green farm waste (N-rich) with dry leaves (C-rich) in 1:3 ratio with Trichoderma inoculum.'
    ]
  },
  {
    id: 'monsoon-prep',
    title: 'Monsoon Preparation & Drainage',
    category: 'Advisory',
    iconName: 'CalendarDays',
    size: '720 KB',
    content: [
      'Drainage channel clearing: Clear main and sub-drains across fields to prevent stagnant waterlogging.',
      'Root rot prevention: Apply copper oxychloride 3g/L or Trichoderma viride drenching around susceptible roots.',
      'Soil conservation: Plant vetiver grass along contour bunds to prevent topsoil erosion during heavy downpours.'
    ]
  }
];

const getIcon = (iconName) => {
  const icons = {
    'Wheat': Wheat,
    'TreePalm': TreePalm,
    'Banana': Banana,
    'Leaf': Leaf,
    'CalendarDays': CalendarDays,
    'Globe': Globe,
    'Camera': Camera,
    'Mic': Mic
  };
  return icons[iconName] || FileText;
};

export default function OfflinePage() {
  const [downloaded, setDownloaded] = useState(() => {
    try { 
      const stored = localStorage.getItem('downloaded_guides');
      const parsed = stored ? JSON.parse(stored) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch { 
      return new Set();
    }
  });
  
  const [customGuides, setCustomGuides] = useState([]);
  const [openGuide, setOpenGuide] = useState(null);
  const [search, setSearch] = useState('');
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    try {
      const custom = JSON.parse(localStorage.getItem('custom_offline_guides') || '[]');
      if (Array.isArray(custom)) setCustomGuides(custom);
    } catch { /* ignore */ }
  }, []);

  const saveDownloaded = (newSet) => {
    setDownloaded(newSet);
    try {
      localStorage.setItem('downloaded_guides', JSON.stringify([...newSet]));
    } catch { /* ignore */ }
  };

  const handleDownload = (id) => {
    setDownloading(id);
    setTimeout(() => {
      const newSet = new Set(downloaded);
      newSet.add(id);
      saveDownloaded(newSet);
      setDownloading(null);
    }, 600);
  };

  const handleRemove = (id) => {
    const newSet = new Set(downloaded);
    newSet.delete(id);
    saveDownloaded(newSet);

    if (id.startsWith('custom-')) {
      const updated = customGuides.filter(g => g.id !== id);
      setCustomGuides(updated);
      localStorage.setItem('custom_offline_guides', JSON.stringify(updated));
    }
  };

  const allGuidesList = [...GUIDES, ...customGuides];
  const filtered = allGuidesList.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 py-8 mx-auto font-sans bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-200">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 pt-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/60 rounded-lg text-emerald-700 dark:text-emerald-300">
              <WifiOff size={24} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Offline Guides
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Download essential farming guides to your device. Once downloaded, you can access them even without an internet connection in remote farm locations.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search guides by crop or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md pl-11 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
        </div>

        {/* Guide List */}
        <div className="space-y-4">
          {filtered.map((guide) => {
            const isDownloaded = downloaded.has(guide.id);
            const isOpen = openGuide === guide.id;
            const isDownloading = downloading === guide.id;

            return (
              <div 
                key={guide.id}
                className={`bg-white dark:bg-slate-900 rounded-lg border transition-all duration-200 overflow-hidden ${
                  isDownloaded 
                    ? 'border-emerald-300 dark:border-emerald-800 shadow-sm' 
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div 
                  className="p-5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  onClick={() => setOpenGuide(isOpen ? null : guide.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-lg text-emerald-600 dark:text-emerald-400 border border-slate-100 dark:border-slate-700 shrink-0">
                      {React.createElement(getIcon(guide.iconName), { size: 24 })}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{guide.title}</h3>
                        {isDownloaded && (
                          <CheckCircle2 size={16} className="text-emerald-500 dark:text-emerald-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-md">
                          {guide.category}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {guide.size}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleDownload(guide.id)}
                      disabled={isDownloading || isDownloaded}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        isDownloaded 
                          ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 opacity-80 cursor-default'
                          : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 disabled:opacity-50'
                      }`}
                    >
                      {isDownloading ? (
                        <><div className="w-4 h-4 border-2 rounded-full border-emerald-600 border-t-transparent animate-spin" /> Saving...</>
                      ) : isDownloaded ? (
                        <><CheckCircle2 size={16} /> Downloaded</>
                      ) : (
                        <><Download size={16} /> Download</>
                      )}
                    </button>

                    <button 
                      onClick={() => handleRemove(guide.id)}
                      disabled={!isDownloaded}
                      className={`p-2 transition-colors rounded-md ${
                        isDownloaded 
                          ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50' 
                          : 'text-slate-300 dark:text-slate-600 bg-slate-50 dark:bg-slate-800 opacity-50 cursor-not-allowed'
                      }`}
                      title="Remove from offline"
                    >
                      <Trash2 size={18} />
                    </button>

                    <button
                      onClick={() => setOpenGuide(isOpen ? null : guide.id)}
                      className="p-2 text-slate-400 dark:text-slate-500 transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Expandable Content Area */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <ul className="space-y-3 mt-3">
                      {guide.content.map((line, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0" />
                          <p>{line}</p>
                        </li>
                      ))}
                    </ul>
                    
                    {!isDownloaded && (
                      <div className="flex items-start gap-3 p-4 mt-6 bg-blue-50 dark:bg-blue-950/30 rounded-md">
                        <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
                        <p className="text-sm text-blue-800 dark:text-blue-300">
                          You are reading this guide online. Download it to ensure you can access this information even when you're offline.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-slate-500 shadow-sm">
              <Search size={24} />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-100">No guides found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Try searching for a different crop or category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}