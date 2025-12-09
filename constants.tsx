import React from 'react';
import { VoiceOption, Template } from './types';

// Gemini TTS Prebuilt Voices
export const VOICES: VoiceOption[] = [
  { id: 'Puck', name: 'Puck', gender: 'Male', description: 'Deep, resonant, authoritative.' },
  { id: 'Charon', name: 'Charon', gender: 'Male', description: 'Calm, steady, trustworthy.' },
  { id: 'Kore', name: 'Kore', gender: 'Female', description: 'Warm, engaging, clear.' },
  { id: 'Fenrir', name: 'Fenrir', gender: 'Male', description: 'Energetic, fast-paced.' },
  { id: 'Zephyr', name: 'Zephyr', gender: 'Female', description: 'Soft, gentle, soothing.' },
];

export const LANGUAGES = [
  { code: 'vi', name: 'Vietnamese' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'zh', name: 'Chinese' },
];

export const TEMPLATES: Template[] = [
  {
    id: 'news',
    label: 'Tech News',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    content: `Bản tin AI hôm nay: Google vừa ra mắt mô hình Gemini 2.5 Flash mới với khả năng xử lý âm thanh vượt trội. Đây là bước tiến quan trọng trong công nghệ tương tác giọng nói thời gian thực. Sau đây là chi tiết.`
  },
  {
    id: 'story',
    label: 'Storytelling',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    content: `Ngày xửa ngày xưa, tại một vương quốc xa xôi, có một chú rồng nhỏ tên là Lửa. Không giống như những con rồng khác thích phun lửa, Lửa lại thích thổi ra những bong bóng xà phòng lấp lánh.`
  },
  {
    id: 'ad',
    label: 'Commercial',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    content: `Bạn đang tìm kiếm sự bình yên? Hãy đến với Zen Spa. Chỉ với 30 phút, bạn sẽ lấy lại năng lượng cho cả tuần làm việc. Đặt lịch ngay hôm nay để nhận ưu đãi 50%.`
  }
];

export const TIPS = [
  { title: "Pause", description: "Use punctuation like commas, periods, or ellipses (...) to create natural pauses." },
  { title: "Emotion", description: "Start with a direction like 'Say excitedly:' or 'Whisper:' to guide the tone." },
  { title: "Speed", description: "Gemini interprets context. Short, punchy sentences tend to be faster." },
];
