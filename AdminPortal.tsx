
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Server, Lock, Activity, Cpu, Package, HelpCircle, 
  Github, CloudUpload, Zap, Smartphone, Globe2, Command, Check, FileCode, AlertTriangle, RefreshCcw, ExternalLink
} from 'lucide-react';
import { AppData, UserRole, Language } from '../types';

interface AdminPortalProps {
  apps: AppData[];
  userRole: UserRole;
  lang: Language;
  onDeleteApp: (id: string) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ apps, userRole, lang, onDeleteApp }) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'dashboard' | 'fix-guide' | 'apps'>('fix-guide');
  
  if (userRole !== 'admin') return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-8">
       <div className="text-center">
          <Lock size={48} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Owner Access Only</h2>
          <p className="text-slate-500 mt-2">Md Nur Noby Islam ছাড়া অন্য কেউ এখানে প্রবেশ করতে পারবে না।</p>
       </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12 animate-slide-up pb-24">
      {/* Noble Header */}
      <header className="bg-gradient-to-br from-slate-900 to-brand-950 p-12 rounded-[4rem] text-white shadow-2xl border border-white/5 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="px-3 py-1 bg-brand-500 text-[10px] font-black uppercase rounded-full">Owner Hub</div>
             <div className="text-emerald-400 text-[10px] font-black uppercase">● System Active</div>
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter">Md Nur Noby Islam</h2>
          <p className="text-slate-400 mt-4 max-w-xl">আপনার এপিকে স্টোরের সব ৪0৪ এরর সমাধান এবং গিটহাব সেটিংস এখান থেকে ম্যানেজ করুন।</p>
        </div>
        <div className="absolute right-0 bottom-0 p-10 opacity-10"><Server size={200} /></div>
      </header>

      {/* Admin Tabs */}
      <div className="flex gap-4 p-2 bg-slate-100 dark:bg-slate-900 rounded-[3rem] w-fit shadow-inner border dark:border-slate-800">
        {[
          { id: 'fix-guide', label: '৪0৪ এরর সমাধান গাইড', icon: AlertTriangle },
          { id: 'dashboard', label: 'সার্ভার স্ট্যাটাস', icon: Activity },
          { id: 'apps', label: 'অ্যাপ ম্যানেজমেন্ট', icon: Package },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-[2.5rem] text-[11px] font-black uppercase tracking-widest transition-all ${
              activeAdminTab === tab.id ? 'bg-brand-600 text-white shadow-brand' : 'text-slate-500 hover:text-brand-500'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {/* 404 Fix Guide */}
      {activeAdminTab === 'fix-guide' && (
        <div className="space-y-8 animate-slide-up">
           <div className="bg-red-500/5 border border-red-500/20 p-12 rounded-[4rem] text-slate-900 dark:text-white">
              <div className="flex items-center gap-6 mb-12">
                 <div className="p-4 bg-red-600 rounded-3xl text-white shadow-lg">
                    <RefreshCcw size={32} className="animate-spin-slow" />
                 </div>
                 <div>
                    <h4 className="text-4xl font-black uppercase tracking-tight">আপনার ৪0৪ এরর কেন হচ্ছে?</h4>
                    <p className="text-red-600 font-bold uppercase text-[10px] tracking-widest">নূর নবী ভাই, নিচের সেটিংসগুলো চেক করুন</p>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-sm border dark:border-slate-800 space-y-6">
                    <div className="flex items-center gap-3">
                       <Globe2 className="text-brand-500" />
                       <h5 className="font-black text-xl uppercase tracking-tighter">Vercel সেটিংস ফিক্স</h5>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                       Vercel Dashboard-এ গিয়ে আপনার প্রজেক্টটি সিলেক্ট করুন:
                    </p>
                    <ul className="space-y-4">
                       <li className="flex items-start gap-3">
                          <Check size={16} className="mt-1 text-emerald-500" />
                          <span className="text-xs font-bold">Settings > General > Framework Preset: **Vite** সিলেক্ট করুন।</span>
                       </li>
                       <li className="flex items-start gap-3">
                          <Check size={16} className="mt-1 text-emerald-500" />
                          <span className="text-xs font-bold">Build & Development Settings-এ **Output Directory** যেন **dist** থাকে।</span>
                       </li>
                    </ul>
                 </div>

                 <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] shadow-sm border dark:border-slate-800 space-y-6">
                    <div className="flex items-center gap-3">
                       <FileCode className="text-emerald-500" />
                       <h5 className="font-black text-xl uppercase tracking-tighter">প্রয়োজনীয় ফাইল চেক</h5>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                       আপনার GitHub-এর মূল পাতায় (Root) অবশ্যই এই ফাইলগুলো থাকতে হবে:
                    </p>
                    <div className="flex flex-wrap gap-2">
                       {['index.html', 'package.json', 'vercel.json', 'vite.config.ts', 'index.tsx'].map(f => (
                         <span key={f} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black text-brand-600 border border-slate-200 dark:border-slate-700">
                            {f}
                         </span>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="mt-8 p-10 bg-slate-900 text-white rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-5">
                    <div className="p-4 bg-white/10 rounded-2xl">
                       <Github className="text-brand-400" />
                    </div>
                    <div>
                       <h6 className="font-black text-lg">এখনই সব ফাইল আপলোড করুন</h6>
                       <p className="text-slate-400 text-sm">উপরে দেওয়া ৫টি ফাইল গিটহাবে থাকলেই সাইট লাইভ হবে।</p>
                    </div>
                 </div>
                 <a href="https://vercel.com/dashboard" target="_blank" className="px-10 py-4 bg-brand-600 hover:bg-brand-700 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2">
                    Vercel Dashboard <ExternalLink size={14} />
                 </a>
              </div>
           </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="text-center pt-8">
         <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-950 rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/5">
            <Command size={14} className="text-brand-500" /> Managed by Md Nur Noby Islam
         </div>
      </footer>
    </div>
  );
};

export default AdminPortal;
