
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Package, LayoutGrid, Home, Sparkles, ShieldCheck, Settings, Users, Activity, Command } from 'lucide-react';
import { MOCK_APPS, APP_CATEGORIES } from './constants';
import { AppData, ViewState, User as UserType, Language } from './types';
import Sidebar from './components/Sidebar';
import AppCard from './components/AppCard';
import AppDetails from './components/AppDetails';
import Auth from './components/Auth';
import AdminPortal from './components/AdminPortal';
import AIStudio from './components/AIStudio';
import SecurityCenter from './components/SecurityCenter';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [lang, setLang] = useState<Language>('bn');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  
  const [currentUser, setCurrentUser] = useState<UserType | null>(() => {
    const saved = localStorage.getItem('nova_user');
    return saved ? JSON.parse(saved) : null;
  });

  const filteredApps = useMemo(() => {
    return MOCK_APPS.filter(app => 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleLogin = (user: UserType) => {
    setCurrentUser(user);
    localStorage.setItem('nova_user', JSON.stringify(user));
    setCurrentView('home');
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark bg-[#020617]' : 'bg-slate-50'} transition-colors duration-500 font-sans`}>
      <Sidebar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        userRole={currentUser?.role || 'guest'} 
        currentUser={currentUser} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
        lang={lang} 
        setLang={setLang} 
        isFirebaseConfigured={false} 
        isOnline={navigator.onLine}
        onShare={() => {
          if (navigator.share) {
            navigator.share({
              title: 'Nova APK Store',
              text: 'নূর নবী ইসলামের তৈরি সেরা প্রিমিয়াম এপিকে স্টোর!',
              url: window.location.href
            });
          }
        }}
      />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="sticky top-0 z-40 px-6 py-4 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={lang === 'bn' ? "অ্যাপ বা ক্যাটাগরি খুঁজুন..." : "Search apps or categories..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-white transition-all shadow-inner"
            />
          </div>
          <button onClick={() => setCurrentView('auth')} className="w-10 h-10 rounded-xl overflow-hidden border-2 border-brand-500 ml-4 hover:scale-110 transition-transform shadow-lg">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.name || 'Guest'}`} alt="User" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 md:p-8 pb-32">
          {currentView === 'home' && (
            <div className="animate-slide-up">
              <div className="mb-10">
                <h2 className="text-3xl font-black mb-2 dark:text-white tracking-tight">সদ্য যুক্ত করা অ্যাপ</h2>
                <p className="text-slate-500 text-sm">নূর নবী ইসলাম দ্বারা ভেরিফাইড সব লেটেস্ট এপিকে।</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {filteredApps.map(app => (
                  <AppCard key={app.id} app={app} onClick={() => setSelectedAppId(app.id)} />
                ))}
              </div>
            </div>
          )}

          {currentView === 'ai-studio' && (
            <AIStudio lang={lang} isDarkMode={isDarkMode} isOnline={navigator.onLine} />
          )}

          {currentView === 'security' && (
            <SecurityCenter isDarkMode={isDarkMode} />
          )}

          {currentView === 'admin-portal' && (
            <AdminPortal apps={MOCK_APPS} userRole={currentUser?.role || 'guest'} lang={lang} onDeleteApp={() => {}} />
          )}

          {currentView === 'auth' && (
            <Auth onLogin={handleLogin} onClose={() => setCurrentView('home')} />
          )}
        </div>

        {selectedAppId && (
          <AppDetails 
            lang={lang} 
            app={MOCK_APPS.find(a => a.id === selectedAppId)!} 
            onClose={() => setSelectedAppId(null)} 
            onAddReview={() => {}} 
            onInstall={() => {}} 
            onFinishInstall={() => {}}
            isInstalled={false} 
            isInstalling={false} 
            isDarkMode={isDarkMode} 
            isOnline={navigator.onLine}
          />
        )}
      </main>
    </div>
  );
};

export default App;
