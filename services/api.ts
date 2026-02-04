import { WebhookPayload } from '../types';

export const sendMessageToWebhook = async (url: string, payload: WebhookPayload): Promise<string> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatInput: payload.chatInput,
        sessionId: payload.sessionId
      }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const responseText = await response.text();
    console.log('Chat Response:', responseText);
    
    if (!responseText || responseText.trim() === '') {
      throw new Error('Empty response');
    }

    try {
      const data = JSON.parse(responseText);
      return data.output || data.text || data.message || JSON.stringify(data);
    } catch {
      return responseText;
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
