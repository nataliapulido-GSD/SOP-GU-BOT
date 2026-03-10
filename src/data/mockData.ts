import { Message } from '../../types';

// TODO: replace with Supabase query
export const CLINICS: string[] = [
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
  'Sandy Springs',
  'Stockbridge',
  'Woodstock',
];

export interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

// TODO: replace with Supabase query
export const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Referral callback steps',
    timestamp: new Date('2026-03-10T09:15:00'),
    messages: [
      {
        id: 'conv-1-1',
        text: 'What are the referral callback steps for new patients?',
        sender: 'user',
        timestamp: new Date('2026-03-10T09:15:00'),
      },
      {
        id: 'conv-1-2',
        text: 'For referral callbacks: 1) Verify patient info in EMR, 2) Confirm insurance eligibility, 3) Schedule within 72 hours of referral receipt, 4) Document the call in the patient chart.',
        sender: 'bot',
        timestamp: new Date('2026-03-10T09:15:12'),
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Prior auth process',
    timestamp: new Date('2026-03-09T14:42:00'),
    messages: [
      {
        id: 'conv-2-1',
        text: 'Walk me through the prior authorization process.',
        sender: 'user',
        timestamp: new Date('2026-03-09T14:42:00'),
      },
      {
        id: 'conv-2-2',
        text: 'Prior auth process: 1) Obtain CPT/ICD-10 codes from the ordering provider, 2) Submit auth request through the payer portal, 3) Document the reference number in the EMR, 4) Notify the patient once approved.',
        sender: 'bot',
        timestamp: new Date('2026-03-09T14:42:18'),
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'New patient scheduling',
    timestamp: new Date('2026-03-09T11:05:00'),
    messages: [
      {
        id: 'conv-3-1',
        text: 'What is the SOP for scheduling a new patient?',
        sender: 'user',
        timestamp: new Date('2026-03-09T11:05:00'),
      },
      {
        id: 'conv-3-2',
        text: 'New patient scheduling SOP: 1) Collect demographics and insurance info, 2) Verify insurance eligibility, 3) Offer the first available slot or per patient preference, 4) Send confirmation and new-patient paperwork link.',
        sender: 'bot',
        timestamp: new Date('2026-03-09T11:05:20'),
      },
    ],
  },
  {
    id: 'conv-4',
    title: 'Lab results protocol',
    timestamp: new Date('2026-03-08T16:30:00'),
    messages: [
      {
        id: 'conv-4-1',
        text: 'How do we handle incoming lab results?',
        sender: 'user',
        timestamp: new Date('2026-03-08T16:30:00'),
      },
      {
        id: 'conv-4-2',
        text: 'Lab results protocol: 1) Results auto-route to the ordering provider in EMR, 2) Provider reviews and signs off within 24 hours, 3) Abnormal results trigger a patient notification call, 4) Document patient acknowledgment in the chart.',
        sender: 'bot',
        timestamp: new Date('2026-03-08T16:30:25'),
      },
    ],
  },
  {
    id: 'conv-5',
    title: 'After-hours call handling',
    timestamp: new Date('2026-03-07T10:20:00'),
    messages: [
      {
        id: 'conv-5-1',
        text: 'What is the after-hours call handling procedure?',
        sender: 'user',
        timestamp: new Date('2026-03-07T10:20:00'),
      },
      {
        id: 'conv-5-2',
        text: 'After-hours calls are routed to the answering service. Urgent calls (pain, fever, post-op concerns) are escalated to the on-call provider immediately. Non-urgent requests are documented and returned the next business day.',
        sender: 'bot',
        timestamp: new Date('2026-03-07T10:20:30'),
      },
    ],
  },
];

// TODO: replace with Supabase query
export function getWelcomeMessage(): string {
  return "Hello! I'm Max, your GSD SOP Assistant. I'm here to help you quickly look up Standard Operating Procedures for Georgia Urology. What can I help you with today?";
}
