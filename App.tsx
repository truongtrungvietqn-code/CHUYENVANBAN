import React, { useState, useRef } from 'react';
import SettingsPanel from './components/SettingsPanel';
import InputPanel from './components/InputPanel';
import ResultPanel from './components/ResultPanel';
import { TEMPLATES, VOICES } from './constants';
import { TTSStatus, Template } from './types';
import { generateSpeech } from './services/geminiService';
import { audioBufferToWav } from './services/audioUtils';

function App() {
  const [text, setText] = useState<string>(TEMPLATES[0].content);
  const [selectedVoice, setSelectedVoice] = useState<string>(VOICES[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Vietnamese');
  const [status, setStatus] = useState<TTSStatus>(TTSStatus.IDLE);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Audio Context is usually required to be created after user interaction, 
  // but we can lazily initialize it in the service or here.
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const handleGenerate = async () => {
    if (!text.trim()) {
        setError("Please enter some text.");
        return;
    }
    
    setError(null);
    setStatus(TTSStatus.GENERATING);
    setAudioBuffer(null);

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const result = await generateSpeech({
        text,
        voiceName: selectedVoice,
        languageName: selectedLanguage
      }, ctx);

      setAudioBuffer(result.audioBuffer);
      setStatus(TTSStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate speech");
      setStatus(TTSStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (!audioBuffer) return;
    const blob = audioBufferToWav(audioBuffer);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gemini-speech-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleTemplateClick = (template: Template) => {
    setText(template.content);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                G
             </div>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
               CHUYỂN VĂN BẢN THÀNH GIỌNG NÓI
             </h1>
          </div>
          <div className="text-xs font-mono text-slate-500 border border-slate-800 rounded-full px-3 py-1">
             Powered by Trương Trung Việt - Giáo viên Trường THCS Nghĩa Hoà
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
          
          {/* Left: Settings */}
          <div className="md:col-span-3 h-full">
            <SettingsPanel 
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
                selectedVoice={selectedVoice}
                onVoiceChange={setSelectedVoice}
            />
          </div>

          {/* Middle: Input */}
          <div className="md:col-span-5 h-full">
            <InputPanel 
                text={text}
                setText={setText}
            />
          </div>

          {/* Right: Results */}
          <div className="md:col-span-4 h-full">
            <ResultPanel 
                status={status}
                audioBuffer={audioBuffer}
                onGenerate={handleGenerate}
                onDownload={handleDownload}
                error={error}
            />
          </div>

        </div>

        {/* Templates Section (Bottom) */}
        <div className="mt-8 pt-8 border-t border-slate-800">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wider">Quick Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TEMPLATES.map((tpl) => (
                    <button
                        key={tpl.id}
                        onClick={() => handleTemplateClick(tpl)}
                        className="flex items-start gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-lg hover:bg-slate-800 hover:border-slate-600 transition-all text-left group"
                    >
                        <div className="p-2 bg-slate-800 rounded-md text-slate-400 group-hover:text-blue-400 group-hover:bg-slate-700 transition-colors">
                            {tpl.icon}
                        </div>
                        <div>
                            <div className="font-medium text-slate-200 group-hover:text-white">{tpl.label}</div>
                            <div className="text-xs text-slate-500 mt-1 line-clamp-2">{tpl.content}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="mt-12 text-center">
            <p className="text-xs text-slate-600">
                developed by Gemini Senior Engineer. Disclaimer: AI generated content may contain errors. Please verify important information.
            </p>
        </div>

      </main>
    </div>
  );
}

export default App;