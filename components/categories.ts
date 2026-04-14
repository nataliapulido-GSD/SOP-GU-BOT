export interface Category {
  name: string;
  items: string[];
}

export const CATEGORIES: Category[] = [
  {
    name: 'Insurance',
    items: ['Insurance Grid', 'Prior Authorization'],
  },
  {
    name: 'Clinical',
    items: ['DASH Chief Complaints', 'Diagnosis/Symptom Search'],
  },
  {
    name: 'Call Routing',
    items: ['Transfer Guidelines'],
  },
  {
    name: 'Scheduling',
    items: ['Scheduling Guidelines', 'Referral Procedures'],
  },
];
