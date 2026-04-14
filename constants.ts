import { ChatConfig } from './types';

// Configuration defaults
// In a real production app, these might come from env variables or a settings API
export const DEFAULT_CONFIG: ChatConfig = {
  webhookUrl: import.meta.env.VITE_N8N_WEBHOOK as string,
  logoUrl: import.meta.env.VITE_LOGO_URL as string,
  botName: 'GSD Max',
  welcomeMessage: 'Hello! I\'m Max, your GSD SOP Assistant. I\'m here to help you quickly look up Standard Operating Procedures for Georgia Urology. What can I help you with today?',
  darkMode: false,
};
