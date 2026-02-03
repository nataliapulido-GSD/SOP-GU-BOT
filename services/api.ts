import { WebhookPayload } from '../types';

export const sendMessageToWebhook = async (url: string, payload: WebhookPayload): Promise<string> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Try to parse JSON first
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      const data = await response.json();
      // Adjust this based on your specific n8n output structure. 
      // Common patterns: { output: "text" }, { text: "text" }, or just the object itself if it's flat.
      return data.output || data.text || data.message || JSON.stringify(data);
    } else {
      // Fallback to text if response is not JSON
      return await response.text();
    }
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};