import { useState, useEffect } from 'react';
import { getStoredCMSData, saveStoredCMSData } from './data';
import { CMSData } from './types';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { CMSPanel } from './components/CMSPanel';
import { Sparkles, Info, CheckSquare, Cloud, CloudLightning, Database, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured, fetchCMSDataFromSupabase, saveCMSDataToSupabase } from './lib/supabase';

export default function App() {
  const [cmsData, setCmsData] = useState<CMSData>(getStoredCMSData());
  const [activeTab, setActiveTab] = useState<string>('beranda');
  
  // Track if we are on a path-based admin route (e.g. /admin, #/admin, #admin, or url param admin)
  const [isRouteAdmin, setIsRouteAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      return path === '/admin' || hash === '#/admin' || hash === '#admin' || search.includes('admin');
    }
    return false;
  });

  // Split-Preview mode inside Admin Portal (let admins view public changes side-by-side)
  const [splitPreviewMode, setSplitPreviewMode] = useState<boolean>(false);

  useEffect(() => {
    const handleLocationCheck = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const hash = window.location.hash;
        const search = window.location.search;
        const isAdmin = path === '/admin' || hash === '#/admin' || hash === '#admin' || search.includes('admin');
        setIsRouteAdmin(isAdmin);
      }
    };
    window.addEventListener('popstate', handleLocationCheck);
    window.addEventListener('hashchange', handleLocationCheck);
    return () => {
      window.removeEventListener('popstate', handleLocationCheck);
      window.removeEventListener('hashchange', handleLocationCheck);
    };
  }, []);

  const exitAdminPortal = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/');
      setIsRouteAdmin(false);
    }
  };

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('jbm_theme') as 'dark' | 'light') || 'dark';
  });

  const [darkVariant, setDarkVariant] = useState<'slate' | 'abyss' | 'obsidian'>(() => {
    return (localStorage.getItem('jbm_dark_variant') as 'slate' | 'abyss' | 'obsidian') || 'obsidian';
  });

  const [supabaseSyncStatus, setSupabaseSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error' | 'not-configured'>(
    isSupabaseConfigured ? 'idle' : 'not-configured'
  );

  useEffect(() => {
    localStorage.setItem('jbm_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      // Reset color variables for light mode standard colors
      document.documentElement.style.removeProperty('--navy-deep');
      document.documentElement.style.removeProperty('--navy-card');
      document.documentElement.style.removeProperty('--navy-light');
    } else {
      document.body.classList.remove('light-theme');
      // Set the dynamic color values depending on chosen dark theme variant
      if (darkVariant === 'slate') {
        document.documentElement.style.setProperty('--navy-deep', '#0f172a');
        document.documentElement.style.setProperty('--navy-card', '#1e293b');
        document.documentElement.style.setProperty('--navy-light', '#334155');
      } else if (darkVariant === 'abyss') {
        document.documentElement.style.setProperty('--navy-deep', '#080d19');
        document.documentElement.style.setProperty('--navy-card', '#111a2e');
        document.documentElement.style.setProperty('--navy-light', '#1f2a45');
      } else if (darkVariant === 'obsidian') {
        document.documentElement.style.setProperty('--navy-deep', '#030712');
        document.documentElement.style.setProperty('--navy-card', '#0e1424');
        document.documentElement.style.setProperty('--navy-light', '#1e293b');
      }
    }
    localStorage.setItem('jbm_dark_variant', darkVariant);
  }, [theme, darkVariant]);

  // Read initial configuration from Supabase if configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      setSupabaseSyncStatus('syncing');
      fetchCMSDataFromSupabase()
        .then((supabaseData) => {
          if (supabaseData) {
            setCmsData(supabaseData);
            saveStoredCMSData(supabaseData); // sync local storage as fallback
            setSupabaseSyncStatus('synced');
          } else {
            // Seed Supabase with our default/local state if no data row exists on the table yet
            saveCMSDataToSupabase(cmsData)
              .then(() => setSupabaseSyncStatus('synced'))
              .catch((err) => {
                console.error('Failed to seed initial Supabase CMS config row:', err);
                setSupabaseSyncStatus('error');
              });
          }
        })
        .catch((error) => {
          console.error('Could not fetch from Supabase:', error);
          setSupabaseSyncStatus('error');
        });
    }
  }, []);

  // Update document title and description based on current activeTab SEO config
  useEffect(() => {
    const seoConfig = cmsData.seo;
    if (seoConfig) {
      const activeSeo = seoConfig[activeTab as keyof typeof seoConfig];
      if (activeSeo) {
        document.title = activeSeo.title;
        
        // Find or create meta description tag
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', activeSeo.description);
      }
    }
  }, [activeTab, cmsData]);

  // Save to Web storage state and fire client-to-Supabase request asynchronously
  const handleCMSDataChange = (newData: CMSData) => {
    setCmsData(newData);
    saveStoredCMSData(newData);

    if (isSupabaseConfigured) {
      setSupabaseSyncStatus('syncing');
      saveCMSDataToSupabase(newData)
        .then(() => {
          setSupabaseSyncStatus('synced');
        })
        .catch((error) => {
          console.error('Error auto-syncing to Supabase:', error);
          setSupabaseSyncStatus('error');
        });
    }
  };

  if (isRouteAdmin) {
    return (
      <div className="min-h-screen bg-[#030712] font-sans antialiased text-slate-100 flex flex-col lg:flex-row">
        
        {/* Split Screen Live view on large screens (if enabled by administrator) */}
        {splitPreviewMode && (
          <div className="flex-grow hidden lg:flex flex-col border-r border-white/5 overflow-y-auto max-h-screen relative bg-navy-deep">
            {/* Interactive watermark bar */}
            <div className="bg-[#121c33] border-b border-white/5 py-2 px-5 text-[9px] font-mono text-[#D4A017] uppercase font-extrabold flex items-center justify-between tracking-widest shrink-0 sticky top-0 z-50">
              <span className="flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Split Preview: JBM Live Presentation
              </span>
              <span className="text-gray-400 font-normal">Tampilan Langsung Real-time</span>
            </div>
            
            {/* Loaded Frontend content */}
            <div className="flex-1 opacity-90 scale-95 origin-top duration-300">
              <Navbar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                cmsOpen={true} 
                setCmsOpen={() => {}}
                brandTitle={cmsData.hero.titlePrimary ? 'Jaya Berkat' : 'JBM'}
                theme={theme}
                setTheme={setTheme}
                isAdminModeEnabled={false}
              />
              <main className="pb-16">
                <Dashboard 
                  cmsData={cmsData} 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  cmsOpen={true}
                  setCmsOpen={() => {}}
                  theme={theme}
                  darkVariant={darkVariant}
                  setDarkVariant={setDarkVariant}
                />
              </main>
            </div>
          </div>
        )}

        {/* Dedicated Admin CMS Workspace Panel */}
        <div className={`w-full shrink-0 flex flex-col ${splitPreviewMode ? 'lg:w-[45%] xl:w-[40%] bg-[#0a0f1d]' : 'w-full min-h-screen'}`}>
          <CMSPanel 
            cmsData={cmsData} 
            onChange={handleCMSDataChange} 
            onClose={exitAdminPortal}
            splitPreviewMode={splitPreviewMode}
            onToggleSplitPreview={() => setSplitPreviewMode(prev => !prev)}
            supabaseSyncStatus={supabaseSyncStatus}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-deep font-sans antialiased text-slate-100 flex flex-col selection:bg-accent-red/30 selection:text-white">
      
      {/* Visual background ambient gradient to resemble premium studio style */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-br from-navy-card/20 via-transparent to-transparent z-0" />

      {/* Main Orchestrated View Wrapper */}
      <div className="relative flex-grow flex flex-col z-10">
        
        {/* PUBLIC SITE WRAPPER */}
        <div className="flex-1 flex flex-col w-full">
          
          {/* Clean Customer Header Navigation - 100% pristine public state */}
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            cmsOpen={false} 
            setCmsOpen={() => {}}
            brandTitle={cmsData.hero.titlePrimary ? 'Jaya Berkat' : 'JBM'}
            theme={theme}
            setTheme={setTheme}
            isAdminModeEnabled={false}
          />

          {/* Content Pages Router */}
          <main className="flex-grow">
            <Dashboard 
              cmsData={cmsData} 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              cmsOpen={false}
              setCmsOpen={() => {}}
              theme={theme}
              darkVariant={darkVariant}
              setDarkVariant={setDarkVariant}
            />
          </main>
        </div>

      </div>
    </div>
  );
}
