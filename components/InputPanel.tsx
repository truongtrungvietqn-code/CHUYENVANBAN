import React from 'react';

interface InputPanelProps {
  text: string;
  setText: (text: string) => void;
}

const InputPanel: React.FC<InputPanelProps> = ({ text, setText }) => {
  const charCount = text.length;
  // Mock cost estimation
  const estCost = (charCount * 0.000002).toFixed(6);

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6 h-full flex flex-col">
       <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">Content</h2>
        </div>
        
        <div className="flex gap-4 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-700">
            <span>Chars: <span className="text-slate-200">{charCount}</span></span>
            <span className="w-px h-4 bg-slate-700 block"></span>
            <span>Est. Cost: <span className="text-green-400">${estCost}</span></span>
        </div>
      </div>

      <div className="relative flex-grow">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert to speech..."
          className="w-full h-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none leading-relaxed font-normal transition-all"
        />
        <div className="absolute bottom-4 right-4 text-xs text-slate-500 pointer-events-none">
            Markdown / Text supported
        </div>
      </div>
    </div>
  );
};

export default InputPanel;
