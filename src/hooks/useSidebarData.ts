import { useState, useEffect } from 'react';
import { Message } from '../../types';

export interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

const DEFAULT_CLINICS: string[] = [
  'Alpharetta',
  'Canton',
  'Cartersville',
  'Cumming',
  'Gainesville',
  'Marietta',
  'Midtown Atlanta',
  'Newnan',
  'Northside',
  'Peachtree City',
];

const CLINICS_KEY = 'gsd_clinics';
const CONVERSATIONS_KEY = 'gsd_conversations';

function loadClinics(): string[] {
  try {
    // TODO: replace localStorage with Supabase wherever data is persisted.
    const raw = localStorage.getItem(CLINICS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_CLINICS;
}

function loadConversations(): Conversation[] {
  try {
    // TODO: replace localStorage with Supabase wherever data is persisted.
    const raw = localStorage.getItem(CONVERSATIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed.map((c: Conversation & { timestamp: string; messages: (Message & { timestamp: string })[] }) => ({
        ...c,
        timestamp: new Date(c.timestamp),
        messages: c.messages.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })),
      }));
    }
  } catch {}
  return [];
}

export function useSidebarData() {
  const [clinics, setClinics] = useState<string[]>(loadClinics);
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);

  useEffect(() => {
    // TODO: replace localStorage with Supabase wherever data is persisted.
    localStorage.setItem(CLINICS_KEY, JSON.stringify(clinics));
  }, [clinics]);

  useEffect(() => {
    // TODO: replace localStorage with Supabase wherever data is persisted.
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  }, [conversations]);

  const addClinic = (name: string) => {
    setClinics((prev) => [...prev, name]);
  };

  const deleteClinic = (name: string) => {
    setClinics((prev) => prev.filter((c) => c !== name));
  };

  const addConversation = (title: string, messages: Message[]) => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title,
      timestamp: new Date(),
      messages,
    };
    // TODO: replace localStorage with Supabase wherever data is persisted.
    setConversations((prev) => [newConv, ...prev]);
  };

  const deleteConversation = (id: string) => {
    // TODO: replace localStorage with Supabase wherever data is persisted.
    setConversations((prev) => prev.filter((c) => c.id !== id));
  };

  const clearAll = () => {
    // TODO: replace localStorage with Supabase wherever data is persisted.
    setConversations([]);
  };

  return {
    clinics,
    addClinic,
    deleteClinic,
    conversations,
    addConversation,
    deleteConversation,
    clearAll,
  };
}
