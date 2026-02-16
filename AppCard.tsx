
import React from 'react';
import { Star, Download, Bookmark, Zap } from 'lucide-react';
import { AppData } from '../types';

interface AppCardProps {
  app: AppData;
  onClick: () => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onClick }) => {
  const isNew = parseInt(app.id) > 5; // Simulating new apps

  return (
    <div 
      onClick={onClick}
      className="group bg-white dark:bg-slate-900/40 rounded-[2.5rem] p-4 border border-slate-100 dark:border-slate-800 hover:shadow-premium hover:-translate-y-2 hover:border-brand-500/40 transition-all cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-inner img-placeholder mb-4">
        <img 
          src={app.icon} 
          alt={app.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${app.name}&backgroundColor=4f46e5`;
          }}
        />
        
        {isNew && (
          <div className="absolute top-3 left-3">
            <div className="bg-brand-600 px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">
              <Zap size={10} className="text-white fill-white" />
              <span className="text-[8px] font-black text-white uppercase tracking-widest">New</span>
            </div>
          </div>
        )}

        <div className="absolute top-3 right-3">
           <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl p-2 rounded-2xl shadow-sm border border-white/20 text-slate-400 hover:text-brand-500 transition-colors">
              <Bookmark size={14} />
           </div>
        </div>

        <div className="absolute bottom-3 left-3">
          <div className="bg-slate-950/80 backdrop-blur-xl px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl border border-white/10">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black text-white">{app.rating}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 px-1">
        <h3 className="font-black text-slate-900 dark:text-white text-base leading-tight mb-1 truncate group-hover:text-brand-500 transition-colors tracking-tight">
          {app.name}
        </h3>
        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest truncate mb-3">
          {app.developer}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Size</span>
            <span className="text-[10px] font-black text-slate-600 dark:text-slate-300">{app.size}</span>
          </div>
          <div className="w-9 h-9 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-xl shadow-lg group-hover:bg-brand-600 group-hover:text-white transition-all flex items-center justify-center">
             <Download size={14} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppCard;
