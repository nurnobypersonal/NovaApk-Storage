
import React from 'react';
import { Home, LayoutGrid, Moon, Sun, Package, ShieldCheck, BadgeCheck, Sparkles, Zap, Command, ShieldAlert, Globe, Heart, Languages, Wifi, WifiOff, Share2, Settings, UploadCloud, Info, Activity } from 'lucide-react';
import { ViewState, UserRole, User as UserType, Language } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  userRole: UserRole;
  currentUser: UserType | null;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  lang: Language;
  setLang: (l: Language) => void;
  isFirebaseConfigured: boolean;
  isOnline: boolean;
  onShare: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, onNavigate, userRole, currentUser, isDarkMode, toggleDarkMode, lang, setLang, isOnline, onShare
}) => {
  return (
    <div className={`w-80 border-r ${isDarkMode ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-100'} h-screen sticky top-0 hidden lg:flex flex-col p-8 shadow-2xl z-50 transition-colors duration-500`}>
      <div className="flex items-center gap-4 mb-12 px-2 cursor-pointer group" onClick={() => onNavigate('home')}>
        <div className="bg-brand-600 p-3.5 rounded-[1.2rem] shadow-xl shadow-brand-500/30 group-hover:scale-110 group-hover:rotate-12 transition-all">
          <Package className="text-white w-7 h-7" />
        </div>
        <div className="flex flex-col">
          <h1 className={`text-2xl font-black leading-tight tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Nova<br/><span className="text-brand-600 uppercase text-[10px] tracking-[0.4em] font-black">APK Store</span>
          </h1>
        </div>
      </div>

      <div className="mb-6 flex-1 overflow-y-auto scrollbar-hide pr-2">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 px-4 flex items-center gap-2">
          <Command size={10} /> {lang === 'bn' ? 'মার্কেটপ্লেস' : 'Marketplace'}
        </p>
        <nav className="space-y-2">
          {[
            { id: 'home', label: lang === 'bn' ? 'স্টোর হোম' : 'Store Home', icon: Home },
            { id: 'ai-studio', label: lang === 'bn' ? 'এআই স্টুডিও' : 'AI Studio', icon: Sparkles },
            { id: 'installed', label: lang === 'bn' ? 'আমার লাইব্রেরি' : 'My Library', icon: LayoutGrid },
            { id: 'security', label: lang === 'bn' ? 'নিরাপত্তা কেন্দ্র' : 'Security Center', icon: ShieldCheck },
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => onNavigate(item.id as ViewState)} 
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all ${currentView === item.id ? 'bg-brand-600 text-white font-black shadow-xl shadow-brand-500/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
            >
              <item.icon size={18} /> <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        {userRole === 'admin' && (
          <div className="mt-8 pt-8 border-t dark:border-slate-800">
            <p className="text-[10px] font-black text-brand-500 uppercase tracking-[0.3em] mb-6 px-4 flex items-center gap-2">
              <Settings size={10} /> {lang === 'bn' ? 'অ্যাডমিন কন্ট্রোল' : 'Admin Control'}
            </p>
            <nav className="space-y-2">
              <button 
                onClick={() => onNavigate('admin-portal')} 
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all ${currentView === 'admin-portal' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
              >
                <LayoutGrid size={18} /> <span className="text-sm font-bold tracking-tight">{lang === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
              </button>
              <button 
                onClick={() => onNavigate('submit-app')} 
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all ${currentView === 'submit-app' ? 'bg-indigo-600 text-white font-black' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'}`}
              >
                <UploadCloud size={18} /> <span className="text-sm font-bold tracking-tight">{lang === 'bn' ? 'অ্যাপ আপলোড' : 'Upload App'}</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      <div className="mb-6 px-4 space-y-4">
         {/* Live Production Status */}
         <div className="flex items-center justify-between px-5 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <div className="flex items-center gap-2">
               <Activity size={12} className="text-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Production</span>
            </div>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
         </div>
         
         <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
            <button onClick={() => setLang('bn')} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-2 ${lang === 'bn' ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-500 hover:text-brand-600'}`}>
              BN
            </button>
            <button onClick={() => setLang('en')} className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-2 ${lang === 'en' ? 'bg-brand-500 text-white shadow-lg' : 'text-slate-500 hover:text-brand-600'}`}>
              EN
            </button>
         </div>
         
         <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-800">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Store Version</span>
            <span className="text-[10px] font-black text-brand-600">v4.5.0</span>
         </div>
      </div>

      <button onClick={onShare} className="w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] bg-brand-500/10 text-brand-600 hover:bg-brand-500/20 transition-all mb-4 border border-brand-500/20">
        <Share2 size={18} />
        <span className="text-sm font-black tracking-tight">{lang === 'bn' ? 'স্টোর শেয়ার করুন' : 'Share Store'}</span>
      </button>

      <div className="mt-auto space-y-4">
        <div className={`flex items-center justify-between p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
           <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                {isOnline ? (lang === 'bn' ? 'অনলাইন' : 'Online') : (lang === 'bn' ? 'অফলাইন' : 'Offline')}
              </span>
           </div>
           {isOnline ? <Wifi size={14} className="text-emerald-500" /> : <WifiOff size={14} className="text-red-500" />}
        </div>

        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-[1.5rem]">
           <button onClick={() => !isDarkMode && toggleDarkMode()} className={`flex-1 flex justify-center py-3 rounded-2xl transition-all ${!isDarkMode ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500'}`}>
             <Sun size={14} />
           </button>
           <button onClick={() => isDarkMode && toggleDarkMode()} className={`flex-1 flex justify-center py-3 rounded-2xl transition-all ${isDarkMode ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20' : 'text-slate-500'}`}>
             <Moon size={14} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
