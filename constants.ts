import { ChatConfig } from './types';

// Configuration defaults
// In a real production app, these might come from env variables or a settings API
export const DEFAULT_CONFIG: ChatConfig = {
  // Replace this with your actual n8n webhook URL
  webhookUrl: 'https://nataliagarciapulido.app.n8n.cloud/webhook/b2cf5241-bd5d-43fd-955c-7637b363e43e/chat', 
  
  // Georgia Urology Logo (Imgur Direct Link)
  logoUrl: 'https://i.imgur.com/Ds0rUEU.png',
  
  botName: 'GU SOP Assistant',
  
  welcomeMessage: 'Hello! I am the Georgia Urology SOP Assistant. I am here to help Virtual Assistants consult the Standard Operating Procedures. How can I assist you today?',
};
