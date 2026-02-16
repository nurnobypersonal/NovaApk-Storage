
import React, { useState } from 'react';
import { Upload, Package, Smartphone, CheckCircle, ArrowRight, ShieldAlert, RefreshCcw, FileCode, Wand2 } from 'lucide-react';
// Import from local lib/firebase to ensure correct modular exports
import { db, storage, auth, isFirebaseConfigured, collection, addDoc, serverTimestamp, ref, uploadBytesResumable, getDownloadURL } from '../lib/firebase';
import { GoogleGenAI } from "@google/genai";
import { AppData } from '../types';
import { APP_CATEGORIES } from '../constants';

interface SubmitAppProps {
  lang: string;
  isDarkMode: boolean;
  onOfflineSubmit?: (app: Omit<AppData, 'id'>) => void;
}

const SubmitApp: React.FC<SubmitAppProps> = ({ isDarkMode, onOfflineSubmit, lang }) => {
  const [formData, setFormData] = useState({ name: '', developer: '', category: 'Tools', description: '', size: '', version: '1.0.0' });
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isAiImproving, setIsAiImproving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRTL = lang === 'ar' || lang === 'ur';

  /**
   * Rewrites an app description using gemini-3-flash-preview.
   * Instantiates GoogleGenAI inside the method to ensure it uses the latest API key.
   */
  const improveDescription = async () => {
    if (!formData.description) return;
    setIsAiImproving(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Rewrite this mobile app description to be more professional and engaging for an app store: "${formData.description}"`,
        // Disable thinking to minimize latency for a simple text rewrite task
        config: { thinkingConfig: { thinkingBudget: 0 } }
      });
      setFormData(prev => ({ ...prev, description: response.text || prev.description }));
    } catch (e) { 
      console.error(e); 
    } finally { 
      setIsAiImproving(false); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apkFile) return;

    setIsUploading(true);
    setError(null);

    // Support Local/Offline Mode
    if (!isFirebaseConfigured || !storage || !db || !auth) {
      // Simulate upload
      let prog = 0;
      const interval = setInterval(() => {
        prog += 5;
        setUploadProgress(prog);
        if (prog >= 100) {
          clearInterval(interval);
          if (onOfflineSubmit) {
            onOfflineSubmit({
              ...formData,
              icon: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`,
              banner: `https://picsum.photos/seed/${formData.name}/800/400`,
              status: 'published',
              rating: 5.0,
              downloads: '0',
              submittedBy: 'guest_user',
              reviews: []
            });
          }
          setIsUploading(false);
          setSubmitted(true);
        }
      }, 100);
      return;
    }

    if (!auth.currentUser) {
      setError("Please login to submit apps.");
      setIsUploading(false);
      return;
    }

    try {
      const storageRef = ref(storage, `apks/${auth.currentUser.uid}/${Date.now()}_${apkFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, apkFile);
      uploadTask.on('state_changed', 
        (snapshot: any) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100), 
        (error: any) => { console.error(error); setIsUploading(false); setError(error.message); }, 
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, "apps"), {
            ...formData,
            apkUrl: downloadURL,
            icon: `https://api.dicebear.com/7.x/initials/svg?seed=${formData.name}`,
            banner: `https://picsum.photos/seed/${formData.name}/800/400`,
            status: 'pending',
            rating: 5.0,
            downloads: '0',
            submittedBy: auth.currentUser?.uid,
            createdAt: serverTimestamp()
          });
          setIsUploading(false);
          setSubmitted(true);
        }
      );
    } catch (err: any) { 
      console.error(err); 
      setIsUploading(false); 
      setError(err.message);
    }
  };

  if (submitted) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[60vh] text-center p-8 ${isRTL ? 'rtl' : ''}`}>
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="text-emerald-500 w-12 h-12" />
        </div>
        <h2 className={`text-3xl font-black mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {lang === 'bn' ? 'সফলভাবে জমা দেওয়া হয়েছে!' : 'Submission Successful!'}
        </h2>
        <p className="text-gray-500 max-w-md">
          {lang === 'bn' ? 'আপনার অ্যাপটি নোভা ইউনিভার্সে যুক্ত করা হয়েছে।' : 'Your app has been added to the Nova Universe.'}
        </p>
        <button onClick={() => setSubmitted(false)} className="mt-8 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
          {lang === 'bn' ? 'আরও জমা দিন' : 'Submit Another'}
        </button>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-8 max-w-4xl mx-auto space-y-10 ${isDarkMode ? 'text-white' : 'text-gray-900'} ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <header>
        <h2 className="text-4xl font-black mb-2">Publish on Nova</h2>
        <p className="text-gray-500">Distribute your Android packages to the community.</p>
        {(!isFirebaseConfigured || !auth) && (
          <div className="mt-4 p-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase border border-indigo-100 inline-block">
            Offline Mode: Apps will be stored locally
          </div>
        )}
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} p-8 rounded-[3rem] border shadow-xl md:col-span-2 space-y-6`}>
           <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isRTL ? 'rtl' : ''}`}>
             <div className="space-y-1">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">App Name</label>
               <input required type="text" className={`w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} border-none rounded-2xl px-5 py-4 text-sm font-bold ${isRTL ? 'text-right' : ''}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
             </div>
             <div className="space-y-1">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Developer</label>
               <input required type="text" className={`w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} border-none rounded-2xl px-5 py-4 text-sm font-bold ${isRTL ? 'text-right' : ''}`} value={formData.developer} onChange={e => setFormData({...formData, developer: e.target.value})} />
             </div>
           </div>
           <div className="space-y-1">
             <div className={`flex justify-between items-center mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</label>
               <button type="button" onClick={improveDescription} className="text-[10px] font-black text-indigo-500 uppercase flex items-center gap-1 hover:text-indigo-400 transition-colors">
                 <Wand2 size={12} /> {isAiImproving ? 'Improving...' : 'AI Improve'}
               </button>
             </div>
             <textarea required className={`w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} border-none rounded-2xl px-5 py-4 text-sm font-bold h-32 resize-none ${isRTL ? 'text-right' : ''}`} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
           </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} p-8 rounded-[3rem] border shadow-xl flex flex-col justify-center`}>
           <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={`w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} border-none rounded-2xl px-5 py-4 text-sm font-bold appearance-none ${isRTL ? 'text-right' : ''}`}>
             {APP_CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
           </select>
           <div className={`grid grid-cols-2 gap-4 mt-4 ${isRTL ? 'rtl' : ''}`}>
             <input type="text" placeholder="1.0.0" className={`w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} border-none rounded-2xl px-4 py-3 text-sm font-bold ${isRTL ? 'text-right' : ''}`} value={formData.version} onChange={e => setFormData({...formData, version: e.target.value})} />
             <input type="text" placeholder="Size (MB)" className={`w-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} border-none rounded-2xl px-4 py-3 text-sm font-bold ${isRTL ? 'text-right' : ''}`} value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
           </div>
        </div>

        <div className="relative h-full">
          <input type="file" accept=".apk" id="apk-upload" className="hidden" onChange={e => setApkFile(e.target.files?.[0] || null)} />
          <label htmlFor="apk-upload" className={`${isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-900 border-gray-800'} p-8 rounded-[3rem] border shadow-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 transition-all border-dashed h-full min-h-[200px]`}>
            <Upload className="text-indigo-400 w-10 h-10 mb-4" />
            <h4 className="text-white font-black text-sm uppercase">{apkFile ? apkFile.name : 'Upload APK'}</h4>
            <p className="text-gray-500 text-[10px] uppercase font-bold mt-1">Binary binary.apk</p>
          </label>
        </div>

        {error && <div className="md:col-span-2 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100">{error}</div>}

        <div className={`md:col-span-2 p-8 bg-indigo-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative ${isRTL ? 'md:flex-row-reverse' : ''}`}>
          {isUploading ? (
            <div className="w-full space-y-3">
               <div className={`flex justify-between text-xs font-black uppercase ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span>{lang === 'bn' ? 'আপলোড হচ্ছে...' : 'Uploading...'}</span>
                  <span>{Math.round(uploadProgress)}%</span>
               </div>
               <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
               </div>
            </div>
          ) : (
            <>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h4 className="text-xl font-black">Ready to launch?</h4>
                <p className="text-indigo-200 text-xs">Nova Sentinel will verify your package after upload.</p>
              </div>
              <button type="submit" disabled={!apkFile} className="px-12 py-5 bg-white text-indigo-900 rounded-2xl font-black uppercase shadow-2xl disabled:opacity-30 active:scale-95 transition-all">
                {lang === 'bn' ? 'জমা দিন' : 'Submit for Review'}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default SubmitApp;
