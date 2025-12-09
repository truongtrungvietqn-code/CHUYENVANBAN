import { GoogleGenAI, Modality } from "@google/genai";
import { decodeAudioData } from "./audioUtils";

interface GenerateSpeechParams {
  text: string;
  voiceName: string;
  languageName: string;
}

export const generateSpeech = async (params: GenerateSpeechParams, audioContext: AudioContext): Promise<{ audioBuffer: AudioBuffer; base64Data: string }> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Prompt Engineering for Language/Style direction
  // Gemini TTS is context-aware. 
  let promptText = params.text;
  if (params.languageName && params.languageName !== 'English') {
    promptText = `Read the following text in ${params.languageName}: "${params.text}"`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: params.voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("No audio data returned from Gemini.");
    }

    // Decode PCM data to AudioBuffer
    const audioBuffer = await decodeAudioData(base64Audio, audioContext, 24000, 1);

    return {
        audioBuffer,
        base64Data: base64Audio
    };

  } catch (error) {
    console.error("Gemini TTS Error:", error);
    throw error;
  }
};
