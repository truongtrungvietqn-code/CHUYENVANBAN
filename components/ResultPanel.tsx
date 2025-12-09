import React, { useRef, useEffect, useState } from 'react';
import { TTSStatus } from '../types';
import { TIPS } from '../constants';

interface ResultPanelProps {
  status: TTSStatus;
  audioBuffer: AudioBuffer | null;
  onGenerate: () => void;
  onDownload: () => void;
  error: string | null;
}

const ResultPanel: React.FC<ResultPanelProps> = ({
  status,
  audioBuffer,
  onGenerate,
  onDownload,
  error
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize AudioContext if needed
  const getAudioContext = () => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playAudio = async () => {
    if (!audioBuffer) return;
    const ctx = getAudioContext();
    
    // Resume context if suspended (browser policy)
    if (ctx.state === 'suspended') {
        await ctx.resume();
    }

    // Stop previous instance if running
    if (sourceRef.current) {
        try { sourceRef.current.stop(); } catch (e) {} 
    }

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.onended = () => setIsPlaying(false);
    
    sourceRef.current = source;
    source.start(0);
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (sourceRef.current) {
        try { sourceRef.current.stop(); } catch(e) {}
        setIsPlaying(false);
    }
  };

  // Simple visualizer effect when playing
  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#4f46e5'; // Indigo-600
        const bars = 30;
        const barWidth = canvas.width / bars;
        
        for (let i = 0; i < bars; i++) {
            const height = Math.random() * canvas.height * 0.8;
            ctx.fillRect(i * barWidth, (canvas.height - height) / 2, barWidth - 2, height);
        }
        animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6 h-full flex flex-col">
       <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Result & Controls</h2>
      </div>

      <div className="flex-grow flex flex-col gap-4">
        {/* Audio Player Viz */}
        <div className="h-32 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center overflow-hidden relative">
            {audioBuffer ? (
                 <canvas ref={canvasRef} width={300} height={100} className="w-full h-full opacity-80" />
            ) : (
                <div className="text-slate-600 text-sm">Waveform will appear here</div>
            )}
            
            {audioBuffer && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                        onClick={isPlaying ? stopAudio : playAudio}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform text-slate-900"
                    >
                        {isPlaying ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        ) : (
                            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                        )}
                    </button>
                </div>
            )}
        </div>
        
        {/* Time and Status */}
        <div className="flex justify-between text-xs text-slate-400 font-mono px-1">
            <span>{status === TTSStatus.GENERATING ? 'Generating...' : status === TTSStatus.SUCCESS ? 'Ready' : 'Idle'}</span>
            <span>{audioBuffer ? `${audioBuffer.duration.toFixed(2)}s` : '0:00'}</span>
        </div>

        {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                Error: {error}
            </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-2">
            <button
                onClick={onGenerate}
                disabled={status === TTSStatus.GENERATING}
                className={`py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
                    status === TTSStatus.GENERATING 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-blue-500/25'
                }`}
            >
                {status === TTSStatus.GENERATING ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Wait...
                    </>
                ) : (
                    <>
                    <span>Generate</span>
                    </>
                )}
            </button>
            <button
                onClick={onDownload}
                disabled={!audioBuffer}
                className={`py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 border transition-all ${
                    !audioBuffer 
                    ? 'border-slate-800 text-slate-600 bg-slate-900 cursor-not-allowed' 
                    : 'border-slate-600 text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white'
                }`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
            </button>
        </div>
      </div>
        
      {/* Tips */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Prompt Tips
        </h3>
        <div className="space-y-3">
            {TIPS.map((tip, idx) => (
                <div key={idx} className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                    <span className="text-xs font-bold text-blue-400 block mb-0.5">{tip.title}</span>
                    <span className="text-xs text-slate-400 leading-tight">{tip.description}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ResultPanel;
