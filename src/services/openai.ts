import OpenAI from 'openai';
import { isTestMode } from './storage';

let openaiClient: OpenAI | null = null;

// モックレスポンスのリスト
const mockResponses = [
  'こんにちは！私はmetabot2です。今日はどのようなお手伝いができますか？',
  'タスクの管理や、日々のスケジュール調整など、様々なサポートができます。',
  '音声入力も対応していますので、お気軽にお話しください。',
  'それは素晴らしいアイデアですね！実現に向けてサポートさせていただきます。',
  'ご質問ありがとうございます。詳しく説明させていただきますね。',
];

let mockResponseIndex = 0;

export const initializeOpenAI = (apiKey: string) => {
  if (!isTestMode() && apiKey) {
    openaiClient = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // ブラウザでの使用を許可
    });
  }
};

export const getChatCompletion = async (messages: Array<{ role: 'user' | 'assistant'; content: string }>) => {
  // テストモードの場合はモックレスポンスを返す
  if (isTestMode()) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 遅延をシミュレート
    const response = mockResponses[mockResponseIndex];
    mockResponseIndex = (mockResponseIndex + 1) % mockResponses.length;
    return response;
  }

  if (!openaiClient) {
    throw new Error('OpenAI APIが初期化されていません');
  }

  try {
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Chat completion error:', error);
    throw error;
  }
};

export const textToSpeech = async (text: string): Promise<ArrayBuffer> => {
  // テストモードの場合は空のArrayBufferを返す
  if (isTestMode()) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return new ArrayBuffer(0);
  }

  if (!openaiClient) {
    throw new Error('OpenAI APIが初期化されていません');
  }

  try {
    const mp3 = await openaiClient.audio.speech.create({
      model: 'tts-1',
      voice: 'nova',
      input: text,
    });

    return await mp3.arrayBuffer();
  } catch (error) {
    console.error('Text to speech error:', error);
    throw error;
  }
};

export const speechToText = async (audioBlob: Blob): Promise<string> => {
  // テストモードの場合はモックテキストを返す
  if (isTestMode()) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockTexts = [
      '今日のタスクを教えてください',
      '新しいタスクを追加したいです',
      '会話履歴を見せてください',
      'APIキーの設定方法を教えてください',
    ];
    return mockTexts[Math.floor(Math.random() * mockTexts.length)];
  }

  if (!openaiClient) {
    throw new Error('OpenAI APIが初期化されていません');
  }

  try {
    const file = new File([audioBlob], 'audio.webm', { type: audioBlob.type });
    
    const response = await openaiClient.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
      language: 'ja',
    });

    return response.text;
  } catch (error) {
    console.error('Speech to text error:', error);
    throw error;
  }
};