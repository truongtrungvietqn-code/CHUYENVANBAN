import React from 'react';
import { LANGUAGES, VOICES } from '../constants';
import { VoiceOption } from '../types';

interface SettingsPanelProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  selectedLanguage,
  onLanguageChange,
  selectedVoice,
  onVoiceChange,
}) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-6 h-full flex flex-col gap-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Settings</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
        <div className="relative">
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer hover:bg-slate-900/80 transition-colors"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.name}>
                {lang.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Language helps prompt the model for correct accent and pronunciation.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Voice Personality</label>
        <div className="space-y-3">
          {VOICES.map((voice: VoiceOption) => (
            <div
              key={voice.id}
              onClick={() => onVoiceChange(voice.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                selectedVoice === voice.id
                  ? 'bg-blue-600/20 border-blue-500/50 ring-1 ring-blue-500'
                  : 'bg-slate-900/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedVoice === voice.id ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                    {voice.name[0]}
                </div>
                <div>
                  <div className={`font-medium ${selectedVoice === voice.id ? 'text-white' : 'text-slate-300'}`}>
                    {voice.name}
                  </div>
                  <div className="text-xs text-slate-500">{voice.gender} • {voice.description}</div>
                </div>
              </div>
              {selectedVoice === voice.id && (
                <div className="text-blue-400">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
