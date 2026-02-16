
import React, { useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Download, ExternalLink, Trash2, ShieldCheck, RefreshCw, BarChart3, Users, Eye, Upload, Send, X, Star } from 'lucide-react';
import { AppData, User, UpdateRequest, Language } from '../types';

interface UserLibraryProps {
  installedApps: AppData[];
  userSubmissions: AppData[];
  onUninstall: (appId: string) => void;
  onUpdateApp: (appId: string) => void;
  onSubmitUpdate: (appId: string, update: UpdateRequest) => void;
  currentUser: User | null;
  isDarkMode: boolean;
  lang: Language;
}

const UserLibrary: React.FC<UserLibraryProps> = ({ installedApps, userSubmissions, onUninstall, onUpdateApp, onSubmitUpdate, currentUser, isDarkMode, lang }) => {
  const [activeTab, setActiveTab] = React.useState<'installed' | 'submissions'>('installed');
  const [showUpdateForm, setShowUpdateForm] = useState<string | null>(null);
  const [updateVersion, setUpdateVersion] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');

  const isRTL = lang === 'ar' || lang === 'ur';

  if (!currentUser) return null;

  const handleUpdateSubmit = (e: React.FormEvent, appId: string) => {
    e.preventDefault();
    if (!updateVersion || !updateNotes) return;
    onSubmitUpdate(appId, {
      version: updateVersion,
      releaseNotes: updateNotes,
      date: new Date().toISOString()
    });
    setShowUpdateForm(null);
    setUpdateVersion('');
    setUpdateNotes('');
  };

  const userStats = [
    { label: 'Installed', value: installedApps.length, icon: Package },
    { label: 'Submissions', value: userSubmissions.length, icon: Upload },
    { label: 'Avg Rating', value: '4.8', icon: Star },
  ];

  return (
    <div className={`p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500 ${isDarkMode ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <header className={`flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h2 className="text-3xl font-black mb-2">Account Dashboard</h2>
          <p className="text-gray-500 font-medium">Manage your installed packages and contributions.</p>
        </div>
        <div className="flex gap-4">
          {userStats.map((stat, i) => (
             <div key={i} className={`px-6 py-4 rounded-3xl border ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} shadow-sm text-center min-w-[120px]`}>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-black">{stat.value}</p>
             </div>
          ))}
        </div>
      </header>

      <div className={`flex p-1 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'} rounded-2xl w-fit mb-8 border ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={() => setActiveTab('installed')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'installed' ? (isDarkMode ? 'bg-gray-800 text-indigo-400' : 'bg-white text-indigo-600 shadow-sm') : 'text-gray-500'}`}
        >
          My Library ({installedApps.length})
        </button>
        <button 
          onClick={() => setActiveTab('submissions')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'submissions' ? (isDarkMode ? 'bg-gray-800 text-indigo-400' : 'bg-white text-indigo-600 shadow-sm') : 'text-gray-500'}`}
        >
          Developer Hub ({userSubmissions.length})
        </button>
      </div>

      {activeTab === 'installed' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {installedApps.length === 0 ? (
            <div className={`col-span-full py-20 text-center ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'} rounded-[3rem] border-2 border-dashed`}>
              <Package className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No Apps Installed Yet</p>
            </div>
          ) : (
            installedApps.map(app => (
              <div key={app.id} className={`${isDarkMode ? 'bg-gray-900 border-gray-800 hover:border-indigo-900' : 'bg-white border-gray-100 hover:border-indigo-200'} p-6 rounded-[2.5rem] border shadow-xl transition-all group relative ${isRTL ? 'text-right' : 'text-left'}`}>
                {app.hasUpdate && (
                  <div className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} bg-red-500 text-white text-[8px] font-black px-3 py-1 rounded-full animate-bounce shadow-lg uppercase`}>
                    Update Available v{app.newVersion}
                  </div>
                )}
                <div className={`flex items-center gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <img src={app.icon} className="w-16 h-16 rounded-2xl object-cover shadow-md" alt="" />
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h4 className="font-black leading-tight">{app.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Version {app.version}</p>
                    <div className={`flex items-center gap-1 text-emerald-500 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <ShieldCheck size={10} />
                      <span className="text-[8px] font-black uppercase tracking-tighter">Verified Secure</span>
                    </div>
                  </div>
                </div>
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {app.hasUpdate ? (
                    <button 
                      onClick={() => onUpdateApp(app.id)}
                      className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                    >
                      <RefreshCw size={14} className="animate-spin-slow" /> Update to {app.newVersion}
                    </button>
                  ) : (
                    <button className={`flex-1 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-900'} text-white rounded-xl text-xs font-black hover:bg-indigo-600 transition-all flex items-center justify-center gap-2`}>
                      <ExternalLink size={14} /> Launch App
                    </button>
                  )}
                  <button 
                    onClick={() => onUninstall(app.id)}
                    className={`p-3 ${isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-red-900/30' : 'bg-gray-50 text-gray-400 hover:bg-red-50'} hover:text-red-500 rounded-xl transition-all`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {userSubmissions.length === 0 ? (
             <div className={`py-20 text-center ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'} rounded-[3rem] border-2 border-dashed`}>
                <Clock className="mx-auto text-gray-200 mb-4" size={48} />
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No Submissions Found</p>
             </div>
          ) : (
            userSubmissions.map(app => (
              <div key={app.id} className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} p-8 rounded-[3rem] border shadow-sm flex flex-col gap-6 relative overflow-hidden`}>
                <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <img src={app.icon} className="w-14 h-14 rounded-2xl object-cover" alt="" />
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <h4 className="font-black text-lg">{app.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{app.category} • Current Version {app.version}</p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {app.pendingUpdate && (
                      <div className={`flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full border border-blue-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Upload size={14} className="animate-bounce" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Update v{app.pendingUpdate.version} in review</span>
                      </div>
                    )}
                    {app.status === 'pending' && !app.pendingUpdate && (
                      <div className={`flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-600 rounded-full border border-yellow-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Clock size={14} className="animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest">In Review</span>
                      </div>
                    )}
                    {app.status === 'published' && (
                      <div className={`flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <CheckCircle size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Live</span>
                      </div>
                    )}
                    {app.status === 'published' && !app.pendingUpdate && (
                      <button 
                        onClick={() => setShowUpdateForm(app.id)}
                        className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                      >
                        Push Update
                      </button>
                    )}
                  </div>
                </div>

                {showUpdateForm === app.id && (
                  <div className={`mt-4 p-8 ${isDarkMode ? 'bg-gray-950/50' : 'bg-indigo-50/50'} rounded-[2rem] border border-indigo-100 animate-in slide-in-from-top-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className={`flex justify-between items-center mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <h5 className="font-black text-[10px] uppercase tracking-widest text-indigo-500">Submit New Version</h5>
                      <button onClick={() => setShowUpdateForm(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                    </div>
                    <form onSubmit={(e) => handleUpdateSubmit(e, app.id)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-1">
                          <label className={`block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1 ${isRTL ? 'text-right' : ''}`}>New Version</label>
                          <input 
                            required
                            type="text" 
                            placeholder="e.g. 1.2.0" 
                            value={updateVersion}
                            onChange={e => setUpdateVersion(e.target.value)}
                            className={`w-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'} border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 ${isRTL ? 'text-right' : ''}`}
                          />
                        </div>
                        <div className="md:col-span-3">
                          <label className={`block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1 ${isRTL ? 'text-right' : ''}`}>Release Notes</label>
                          <textarea 
                            required
                            placeholder="Describe what's new in this version..." 
                            value={updateNotes}
                            onChange={e => setUpdateNotes(e.target.value)}
                            className={`w-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'} border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 min-h-[80px] resize-none ${isRTL ? 'text-right' : ''}`}
                          />
                        </div>
                      </div>
                      <button type="submit" className={`w-full md:w-fit px-10 py-3.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 ${isRTL ? 'mr-auto' : ''}`}>
                        <Send size={14} /> Submit Update Request
                      </button>
                    </form>
                  </div>
                )}

                {app.status === 'published' && app.analytics && (
                  <div className={`grid grid-cols-3 gap-4 p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="text-center">
                      <div className={`flex items-center justify-center gap-2 text-blue-500 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Users size={14} />
                        <span className="text-lg font-black">{app.analytics.totalInstalls}</span>
                      </div>
                      <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Installs</p>
                    </div>
                    <div className={`text-center border-x ${isDarkMode ? 'border-gray-700/50' : 'border-gray-200'} `}>
                      <div className={`flex items-center justify-center gap-2 text-emerald-500 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Eye size={14} />
                        <span className="text-lg font-black">{app.analytics.views}</span>
                      </div>
                      <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Impressions</p>
                    </div>
                    <div className="text-center">
                      <div className={`flex items-center justify-center gap-2 text-purple-500 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <BarChart3 size={14} />
                        <span className="text-lg font-black">+{app.analytics.lastMonthInstalls}</span>
                      </div>
                      <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Growth</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserLibrary;
