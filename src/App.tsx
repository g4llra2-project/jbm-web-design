import { useState, useEffect } from 'react';
import { getStoredCMSData, saveStoredCMSData } from './data';
import { CMSData } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CMSPanel } from './components/CMSPanel';
import { Sparkles, Info, CheckSquare } from 'lucide-react';

export default function App() {
  const [cmsData, setCmsData] = useState<CMSData>(getStoredCMSData());
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [cmsOpen, setCmsOpen] = useState<boolean>(true); // Start with CMS open for high discoverability
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('jbm_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('jbm_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  // Save to localStorage when database changes
  const handleCMSDataChange = (newData: CMSData) => {
    setCmsData(newData);
    saveStoredCMSData(newData);
  };

  return (
    <div className="min-h-screen bg-navy-deep font-sans antialiased text-slate-100 flex flex-col selection:bg-accent-red/30 selection:text-white">
      
      {/* Visual background ambient gradient to resemble premium studio style */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-br from-navy-card/20 via-transparent to-transparent z-0" />

      {/* Main Orchestrated View Wrapper */}
      <div className="relative flex-grow flex flex-col lg:flex-row z-10">
        
        {/* LEFT / MAIN WORKSPACE: THE LIVE JBM WEBSITE PREVIEW */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${cmsOpen ? 'lg:w-[65%] xl:w-[70%]' : 'w-full'}`}>
          
          {/* Header Navigation with logo and operational status */}
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            cmsOpen={cmsOpen} 
            setCmsOpen={setCmsOpen}
            brandTitle={cmsData.hero.titlePrimary ? 'Jaya Berkat' : 'JBM'}
            theme={theme}
            setTheme={setTheme}
          />

          {/* Quick interactive banner inside live site indicating edit state */}
          {cmsOpen && (
            <div className="bg-accent-red/5 border-b border-navy-light/40 px-4 py-2 text-xs text-accent-red flex items-center justify-between font-sans">
              <span className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-accent-red animate-pulse" />
                Mode Administrator Aktif — Panel kontrol CMS interaktif terbuka di sebelah kanan.
              </span>
              <button 
                onClick={() => setCmsOpen(false)}
                className="hover:underline font-bold text-[11px] uppercase tracking-wider text-slate-400 hover:text-white shrink-0 ml-4 font-sans"
              >
                Tutup Mode Admin
              </button>
            </div>
          )}

          {/* Content Pages Router */}
          <main className="flex-grow">
            <Dashboard 
              cmsData={cmsData} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              cmsOpen={cmsOpen}
              setCmsOpen={setCmsOpen}
            />
          </main>
        </div>

        {/* RIGHT WORKSPACE: DYNAMIC CMS OFFICE CONTROL PANEL */}
        {cmsOpen && (
          <aside className="w-full lg:w-[35%] xl:w-[30%] lg:sticky lg:top-0 lg:h-screen shrink-0 border-t lg:border-t-0 lg:border-l border-navy-light z-30">
            <CMSPanel 
              cmsData={cmsData} 
              onChange={handleCMSDataChange} 
              onClose={() => setCmsOpen(false)} 
            />
          </aside>
        )}

      </div>
    </div>
  );
}
