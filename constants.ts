import { ChatConfig } from './types';

// Configuration defaults
// In a real production app, these might come from env variables or a settings API
export const DEFAULT_CONFIG: ChatConfig = {
  // Replace this with your actual n8n webhook URL
  webhookUrl: 'https://nataliagarciapulido.app.n8n.cloud/webhook/b2cf5241-bd5d-43fd-955c-7637b363e43e/chat', 
  
  // Georgia Urology Logo (Imgur Direct Link)
  logoUrl: 'https://i.imgur.com/nb3ZTao.png',
  
  botName: 'GSD Max',

  welcomeMessage: 'Hello! I\'m Max, your GSD SOP Assistant. I\'m here to help you quickly look up Standard Operating Procedures for Georgia Urology. What can I help you with today?',
};
