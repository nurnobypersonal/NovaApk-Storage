
import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCcw, Download, Image as ImageIcon, AlertCircle, Terminal, Zap, Palette, FileText, ExternalLink, Globe, Key, BookOpen, Search, Volume2, PlayCircle, Loader2, Quote, CloudOff, Video, Film, Clapperboard } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Language } from '../types';

interface AIStudioProps {
  isDarkMode?: boolean;
  lang: Language;
  isOnline: boolean;
}

const AIStudio: React.FC<AIStudioProps> = ({ isDarkMode = false, lang, isOnline }) => {
  const [activeTab, setActiveTab] = useState<'icon' | 'desc' | 'research' | 'voice' | 'copy' | 'video'>('icon');
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoStatus, setVideoStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [appName, setAppName] = useState('');
  const [generatedResult, setGeneratedResult] = useState<{ content: string, type: 'image' | 'text' | 'audio' | 'video' } | null>(null);

  const handleGenerateVideo = async () => {
    if (!isOnline || !prompt) return;

    // Use current process API key
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setError("API Key not found. Please configure it in your environment.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setVideoStatus('Connecting to Veo-3 Engine...');

    try {
      const ai = new GoogleGenAI({ apiKey });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `App trailer for ${appName}: ${prompt}`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        setVideoStatus('Nova Brain is rendering your video...');
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const videoResponse = await fetch(`${downloadLink}&key=${apiKey}`);
        const blob = await videoResponse.blob();
        setGeneratedResult({ content: URL.createObjectURL(blob), type: 'video' });
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsProcessing(false);
      setVideoStatus('');
    }
  };

  const handleGenerateVoice = async () => {
    if (!isOnline || !prompt) return;
    const apiKey = process.env.API_KEY;
    if (!apiKey) return;

    setIsProcessing(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say with excitement: Welcome to ${appName}. ${prompt}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        },
      });
      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) setGeneratedResult({ content: audioData, type: 'audio' });
    } catch (e: any) { setError(e.message); } finally { setIsProcessing(false); }
  };

  const handleGenerateIcon = async () => {
    if (!isOnline || !prompt) return;
    const apiKey = process.env.API_KEY;
    if (!apiKey) return;

    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: `Professional 3D app icon for "${appName}". Description: ${prompt}. Minimalist design.` }] },
        config: { imageConfig: { aspectRatio: '1:1', imageSize: '1K' } }
      });
      
      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (part?.inlineData) {
        setGeneratedResult({ content: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`, type: 'image' });
      }
    } catch (e: any) { setError(e.message); } finally { setIsProcessing(false); }
  };

  const handleGenerateDescription = async () => {
    if (!isOnline || !prompt || !appName) return;
    const apiKey = process.env.API_KEY;
    if (!apiKey) return;

    setIsProcessing(true);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Write a high-converting Play Store description for the app "${appName}" based on these features: ${prompt}.`,
        config: { tools: [{ googleSearch: {} }] }
      });
      // response.text property directly returns the string output as per guidelines
      setGeneratedResult({ content: response.text || "", type: 'text' });
    } catch (e: any) { setError(e.message); } finally { setIsProcessing(false); }
  };

  const playAudio = async () => {
    if (generatedResult?.type !== 'audio') return;
    const decode = (base64: string) => {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
      return bytes;
    };
    const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
      const dataInt16 = new Int16Array(data.buffer);
      const frameCount = dataInt16.length / numChannels;
      const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
      for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
      return buffer;
    };
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decode(generatedResult.content), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 animate-slide-up px-6 pb-24">
      <header className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-50 dark:bg-brand-900/30 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-brand-100 dark:border-brand-800">
          <Sparkles size={14} className="animate-pulse" /> Neural Forge 5.0
        </div>
        <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight dark:text-white">AI Developer Studio</h2>
        <p className="text-slate-500 font-medium max-w-2xl mx-auto">{lang === 'bn' ? 'নোভা এআই ব্যবহার করে অ্যাপ আইকন, ভিডিও প্রমো এবং ডেসক্রিপশন তৈরি করুন।' : 'Generate high-quality app assets using Nova AI technology.'}</p>
        
        {!isOnline && (
          <div className="mt-6 flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold w-fit mx-auto border border-red-100 dark:border-red-900/30 animate-pulse">
            <CloudOff size={16} /> Offline Mode: AI Forge Disabled
          </div>
        )}
      </header>

      <div className="flex justify-center p-2 bg-slate-100 dark:bg-slate-900 rounded-[3rem] w-fit mx-auto mb-16 border dark:border-slate-800 shadow-inner overflow-x-auto scrollbar-hide">
        {[
          { id: 'icon', label: 'Icon', icon: Palette },
          { id: 'video', label: 'Video', icon: Film },
          { id: 'desc', label: 'Description', icon: FileText },
          { id: 'voice', label: 'Voice', icon: Volume2 },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setGeneratedResult(null); setError(null); }}
            className={`flex items-center gap-3 px-10 py-4 rounded-[2.5rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id ? 'bg-brand-600 text-white shadow-xl scale-105' : 'text-slate-500 hover:text-brand-600'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border dark:border-slate-800 shadow-premium space-y-8">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">App Name</label>
            <input value={appName} onChange={e => setAppName(e.target.value)} placeholder="e.g. Nova Studio" className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-5 font-bold outline-none focus:ring-2 focus:ring-brand-500 dark:text-white transition-all shadow-inner" />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">Context/Prompt</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Describe what the AI should create..." className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] px-6 py-6 font-bold h-48 outline-none focus:ring-2 focus:ring-brand-500 resize-none dark:text-white transition-all shadow-inner" />
          </div>
          <button 
            disabled={isProcessing || !isOnline} 
            onClick={() => {
              if (activeTab === 'icon') handleGenerateIcon();
              else if (activeTab === 'video') handleGenerateVideo();
              else if (activeTab === 'voice') handleGenerateVoice();
              else if (activeTab === 'desc') handleGenerateDescription();
            }}
            className="w-full py-6 bg-brand-600 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Zap size={20} />}
            {isProcessing ? (videoStatus || "Fusing nodes...") : "Forge Asset"}
          </button>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-2xl text-[10px] font-black uppercase border border-red-100 dark:border-red-900/50 flex items-center gap-3">
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </div>

        <div className="bg-slate-100 dark:bg-slate-900/50 rounded-[4rem] border-4 border-dashed dark:border-slate-800 min-h-[500px] flex flex-col items-center justify-center p-8 relative">
           {generatedResult ? (
             <div className="w-full h-full flex flex-col items-center gap-8 animate-slide-up overflow-y-auto scrollbar-hide p-4">
                {generatedResult.type === 'video' && <video src={generatedResult.content} controls className="w-full rounded-[3rem] shadow-2xl border-4 border-white" />}
                {generatedResult.type === 'image' && <img src={generatedResult.content} className="w-80 h-80 rounded-[4rem] shadow-2xl border-8 border-white object-cover" alt="AI Icon" />}
                {generatedResult.type === 'audio' && (
                  <button onClick={playAudio} className="px-12 py-5 bg-white text-brand-600 rounded-full font-black text-xs uppercase flex items-center gap-3 shadow-xl">
                    <PlayCircle size={24} /> Play Preview
                  </button>
                )}
                {generatedResult.type === 'text' && <div className="p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-premium text-sm leading-relaxed whitespace-pre-wrap dark:text-slate-300 font-medium">{generatedResult.content}</div>}
             </div>
           ) : (
             <div className="text-center flex flex-col items-center gap-4">
                <div className="p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-inner">
                   <Clapperboard className="text-slate-300 w-12 h-12" />
                </div>
                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
                   {isProcessing ? "Synthesizing..." : "Neural Forge Idle"}
                </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AIStudio;
