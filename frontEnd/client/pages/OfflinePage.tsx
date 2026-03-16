
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Trash2, 
  BookOpen, 
  Search, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Info,
  Smartphone,
  WifiOff
} from 'lucide-react';

interface Guide {
  id: string;
  title: string;
  titleMal: string;
  category: string;
  icon: string;
  size: string;
  content: string[];
  downloaded?: boolean;
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
      'Stem Borer: Apply Chlorpyrifos 2.5ml per liter of water. Spray at evening.',
      'Leaf Folder: Use Monocrotophos 1.6ml/L. Avoid spraying during flowering.',
      'Blast Disease: Apply Tricyclazole 0.6g/L or Isoprothiolane 1.5ml/L.',
      'Brown Plant Hopper: Drain field for 3-4 days. Apply Buprofezin 1ml/L.',
      'Spray Schedule: First spray at 30 days, second at 60 days after transplanting.',
      'Safety: Wear gloves and mask. Do not spray before rain.',
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
      'Fertilizer: Apply 1.3 kg Urea + 2 kg Super Phosphate + 3.5 kg MOP per tree per year.',
      'Rhinoceros Beetle: Fill crown with sand + Naphthalene balls. Apply Carbaryl dust.',
      'Bud Rot: Apply Bordeaux mixture (1%) to crown during monsoon. Repeat monthly.',
      'Irrigation: 200 liters per tree per week in summer. Reduce in monsoon.',
      'Pruning: Remove dead fronds regularly. Keep 30-35 green fronds on tree.',
      'Intercropping: Banana, pepper, or cocoa can be grown under coconut trees.',
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
      'Planting: Use disease-free suckers. Plant at 1.8m × 1.8m spacing.',
      'Panama Wilt: No chemical cure. Remove infected plants. Use Grandnaine variety.',
      'Sigatoka: Spray Mancozeb 2g/L or Propiconazole 1ml/L at 3-week intervals.',
      'Fertilizer: 200g Urea + 200g MOP at planting. Repeat at 3 and 6 months.',
      'Propping: Support plants with bamboo poles at flowering stage.',
      'Harvest: Harvest when fingers are full and angular. Takes 11-14 months.',
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
      'Compost: Mix green waste + dry waste (1:1). Turn weekly. Ready in 45-60 days.',
      'Vermicompost: Use earthworms with kitchen waste. Produces in 30-45 days.',
      'Neem Oil Spray: Mix 5ml neem oil + 1g soap in 1L water. Controls most pests.',
      'Jeevamrut: Mix 10L cow urine + 10kg dung + 2kg jaggery + 2kg pulse flour in 200L water.',
      'Green Manure: Grow Sunhemp or Dhaincha and incorporate before flowering.',
      'Crop Rotation: Rotate legume crops with non-legume to maintain soil health.',
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
      'Kharif (Jun-Sep): Paddy, Tapioca, Ginger, Turmeric planting season.',
      'Rabi (Oct-Jan): Vegetables, Pulses, Groundnut cultivation.',
      'Summer (Feb-May): Irrigation-dependent crops. Good for watermelon, cucumber.',
      'Pre-Monsoon (Apr-May): Land preparation, applying lime, basal fertilizer.',
      'Post-Harvest (Oct-Nov): Store paddy at <14% moisture. Use proper bins.',
      'Flood Preparedness: Keep drainage channels clear. Harvest before heavy rain.',
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
      'Soil Testing: Test every 3 years. Send samples to Krishi Bhavan lab (free).',
      'Lime Application: Apply 250-500 kg/acre if pH < 5.5. Mix well before planting.',
      'Organic Matter: Add 10 tonnes FYM per acre every year before monsoon.',
      'Drainage: Poor drainage causes root rot. Create raised beds in waterlogged areas.',
      'Cover Crops: Grow legumes (cowpea, groundnut) during off-season to fix nitrogen.',
      'Avoid: Over-plowing, burning crop residues, excess chemical fertilizer.',
    ]
  },
];

export default function OfflinePage() {
  const [downloaded, setDownloaded] = useState<Set<string>>(() => {
    try { 
      const stored = localStorage.getItem('downloaded_guides');
      const parsed = stored ? JSON.parse(stored) : [];
      return new Set(Array.isArray(parsed) ? (parsed as string[]) : []);
    } catch { 
      return new Set<string>();
    }
  });
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  const saveDownloaded = (ids: Set<string>) => {
    setDownloaded(ids);
    localStorage.setItem('downloaded_guides', JSON.stringify([...ids]));
  };

  const handleDownload = (id: string) => {
    setDownloading(id);
    // Simulate network delay
    setTimeout(() => {
      const newSet = new Set<string>(downloaded);
      newSet.add(id);
      saveDownloaded(newSet);
      setDownloading(null);
    }, 1500);
  };

  const handleRemove = (id: string) => {
    const newSet = new Set<string>(downloaded);
    newSet.delete(id);
    saveDownloaded(newSet);
  };

  const filtered = GUIDES.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.category.toLowerCase().includes(search.toLowerCase()) ||
    g.titleMal.includes(search)
  );

  const dlCount = downloaded.size;
  const totalSize = GUIDES.filter(g => downloaded.has(g.id))
    .reduce((acc, g) => acc + parseInt(g.size), 0);

  return (
    <div className="min-h-screen pt-24 pb-20 bg-stone-50">
      <div className="page-container">
        
        {/* Header Section */}
        <div className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-700">
              <WifiOff size={24} />
            </div>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl text-slate-900">
              Offline <span className="text-emerald-600">Guides</span>
            </h1>
          </motion.div>
          <p className="mb-2 text-lg font-medium text-slate-500 font-malayalam">
            ഓഫ്ലൈൻ കൃഷി ഗൈഡുകൾ
          </p>
          <p className="max-w-2xl text-slate-500">
            Download essential farming guides to your device. Once downloaded, you can access them even without an internet connection in remote farm locations.
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 gap-6 mb-10 sm:grid-cols-3">
          {[
            { label: 'Downloaded', value: dlCount, color: 'text-emerald-600', icon: <CheckCircle2 size={20} /> },
            { label: 'Total Guides', value: GUIDES.length, color: 'text-slate-900', icon: <BookOpen size={20} /> },
            { label: 'Storage Used', value: `${totalSize} KB`, color: 'text-amber-600', icon: <Smartphone size={20} /> }
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.color.replace('text-', 'bg-').replace('600', '50').replace('900', '100')}`}>
                {stat.icon}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute -translate-y-1/2 left-5 top-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search guides by crop or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-[2rem] pl-14 pr-6 py-5 text-lg font-medium shadow-sm focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
          />
        </div>

        {/* Guide List */}
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((guide) => {
              const isDownloaded = downloaded.has(guide.id);
              const isOpen = openGuide === guide.id;
              const isDownloading = downloading === guide.id;

              return (
                <motion.div 
                  key={guide.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white rounded-[2.5rem] border transition-all duration-300 ${
                    isDownloaded ? 'border-emerald-100 shadow-md' : 'border-slate-100'
                  }`}
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                      <div className="flex items-start gap-5">
                        <div className="flex items-center justify-center w-16 h-16 text-4xl shadow-inner bg-slate-50 rounded-2xl">
                          {guide.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-black text-slate-900">{guide.title}</h3>
                            {isDownloaded && (
                              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                Offline
                              </span>
                            )}
                          </div>
                          <p className="mb-3 text-sm font-medium text-slate-400 font-malayalam">
                            {guide.titleMal}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">
                              {guide.category}
                            </span>
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                              {guide.size}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setOpenGuide(isOpen ? null : guide.id)}
                          className={`flex-1 md:flex-none px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                            isOpen ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {isOpen ? <><ChevronUp size={16} /> Hide</> : <><BookOpen size={16} /> Read</>}
                        </button>

                        {isDownloaded ? (
                          <button 
                            onClick={() => handleRemove(guide.id)}
                            className="p-3 text-red-400 transition-all rounded-2xl hover:bg-red-50 hover:text-red-500"
                            title="Remove from offline"
                          >
                            <Trash2 size={20} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDownload(guide.id)}
                            disabled={isDownloading}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                              isDownloading 
                                ? 'bg-emerald-50 text-emerald-400 cursor-not-allowed' 
                                : 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700 hover:-translate-y-0.5'
                            }`}
                          >
                            {isDownloading ? (
                              <><div className="w-4 h-4 border-2 rounded-full border-emerald-400 border-t-transparent animate-spin" /> Saving...</>
                            ) : (
                              <><Download size={16} /> Download</>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content Area */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-8 mt-8 space-y-4 border-t border-slate-50">
                            {guide.content.map((line, i) => (
                              <div key={i} className="flex gap-4 group">
                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 group-hover:scale-150 transition-transform" />
                                <p className="font-medium leading-relaxed text-slate-600">{line}</p>
                              </div>
                            ))}
                            
                            {!isDownloaded && (
                              <div className="flex items-start gap-3 p-4 mt-8 border bg-amber-50 rounded-2xl border-amber-100">
                                <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs font-medium leading-relaxed text-amber-700">
                                  You are reading this guide online. Download it to ensure you can access this information even when you're deep in the fields without signal.
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mb-6 text-slate-300">
              <Search size={48} />
            </div>
            <h3 className="mb-2 text-2xl font-black text-slate-900">No guides found</h3>
            <p className="max-w-xs mx-auto text-slate-500">
              Try searching for a different crop or category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}