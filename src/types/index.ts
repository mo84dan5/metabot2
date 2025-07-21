// チャットメッセージの型定義
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// タスクの型定義
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'doing' | 'done';
  createdAt: Date;
  updatedAt: Date;
}

// APIキー設定の型定義
export interface ApiSettings {
  openaiApiKey?: string;
}