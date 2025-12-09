import React from 'react';

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  description: string;
}

export interface Template {
  id: string;
  label: string;
  content: string;
  icon: React.ReactNode;
}

export enum TTSStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  PLAYING = 'PLAYING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export interface GenerationConfig {
  voiceName: string;
  language: string; // Used as a system instruction/prompt prefix
}