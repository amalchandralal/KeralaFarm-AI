import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Trash2, 
  BookOpen, 
  Search, 
  CheckCircle2, 
  ChevronDown,
  ChevronUp,
  Info,
  Smartphone,
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
      const stored = localStorage.getItem('custom_offline_guides');
      if (stored) setCustomGuides(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const GUIDES = [...customGuides];

  const saveDownloaded = (ids) => {
    setDownloaded(ids);
    localStorage.setItem('downloaded_guides', JSON.stringify([...ids]));
  };

  const handleDownload = (id) => {
    setDownloading(id);
    // Simulate network delay for caching
    setTimeout(() => {
      const newSet = new Set(downloaded);
      newSet.add(id);
      saveDownloaded(newSet);
      setDownloading(null);
    }, 800);
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

  const filtered = GUIDES.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 font-sans">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
            <div className="p-2.5 bg-emerald-100 rounded-lg text-emerald-700">
              <WifiOff size={24} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Offline Guides
            </h1>
          </div>
          <p className="text-sm text-gray-500 max-w-2xl">
            Download essential farming guides to your device. Once downloaded, you can access them even without an internet connection in remote farm locations.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search guides by crop or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
        </div>

        {/* Guide List */}
        <div className="space-y-4">
          {filtered.map((guide) => {
            const isDownloaded = downloaded.has(guide.id);
            const isOpen = openGuide === guide.id;
            const isDownloading = downloading === guide.id;
            const Icon = guide.icon;

            return (
              <div 
                key={guide.id}
                className={`bg-white rounded-lg border transition-all duration-200 overflow-hidden ${
                  isDownloaded ? 'border-emerald-200 shadow-sm' : 'border-gray-200'
                }`}
              >
                <div 
                  className="p-5 cursor-pointer hover:bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  onClick={() => setOpenGuide(isOpen ? null : guide.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-50 rounded-lg text-emerald-600 border border-gray-100 shrink-0">
                      {React.createElement(getIcon(guide.iconName), { size: 24 })}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900">{guide.title}</h3>
                        {isDownloaded && (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md">
                          {guide.category}
                        </span>
                        <span className="text-xs text-gray-400">
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
                          ? 'text-emerald-700 bg-emerald-100 opacity-80 cursor-default'
                          : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50'
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
                          ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                          : 'text-gray-300 bg-gray-50 opacity-50 cursor-not-allowed'
                      }`}
                      title="Remove from offline"
                    >
                      <Trash2 size={18} />
                    </button>

                    <button
                      onClick={() => setOpenGuide(isOpen ? null : guide.id)}
                      className="p-2 text-gray-400 transition-colors rounded-md hover:bg-gray-100"
                    >
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {/* Expandable Content Area */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                    <ul className="space-y-3 mt-3">
                      {guide.content.map((line, i) => (
                        <li key={i} className="flex gap-3 text-sm text-gray-600">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <p>{line}</p>
                        </li>
                      ))}
                    </ul>
                    
                    {!isDownloaded && (
                      <div className="flex items-start gap-3 p-4 mt-6 bg-blue-50 rounded-md">
                        <Info size={18} className="text-blue-600 shrink-0" />
                        <p className="text-sm text-blue-800">
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
            <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400 shadow-sm">
              <Search size={24} />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900">No guides found</h3>
            <p className="text-sm text-gray-500">
              Try searching for a different crop or category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}