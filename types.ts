export type Sender = 'user' | 'bot';

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  isError?: boolean;
}

export interface WebhookPayload {
  action: string;
  sessionId: string;
  chatInput: string;
}

export interface ChatConfig {
  webhookUrl: string;
  logoUrl: string;
  botName: string;
  welcomeMessage: string;
}