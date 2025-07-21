import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage, Task, ApiSettings } from '../types';

interface AppState {
  // チャット関連
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  
  // タスク関連
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // 設定関連
  apiSettings: ApiSettings;
  updateApiSettings: (settings: Partial<ApiSettings>) => void;
  
  // メニュー関連
  isMenuOpen: boolean;
  toggleMenu: () => void;
  currentView: 'chat' | 'log' | 'tasks' | 'settings';
  setCurrentView: (view: 'chat' | 'log' | 'tasks' | 'settings') => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // チャット関連
      messages: [],
      addMessage: (message) => set((state) => ({ 
        messages: [...state.messages, message] 
      })),
      clearMessages: () => set({ messages: [] }),
      
      // タスク関連
      tasks: [],
      addTask: (task) => set((state) => ({ 
        tasks: [...state.tasks, task] 
      })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
        )
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
      })),
      
      // 設定関連
      apiSettings: {},
      updateApiSettings: (settings) => set((state) => ({
        apiSettings: { ...state.apiSettings, ...settings }
      })),
      
      // メニュー関連
      isMenuOpen: false,
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
      currentView: 'chat',
      setCurrentView: (view) => set({ currentView: view, isMenuOpen: false }),
    }),
    {
      name: 'metabot2-storage',
    }
  )
);