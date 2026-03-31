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
    items: ['DASH Chief Complaints', 'Diagnosis/Symptom Search', 'Lab Protocol'],
  },
  {
    name: 'Call Routing',
    items: ['Transfer Guidelines', 'After-Hours Guide'],
  },
  {
    name: 'Scheduling',
    items: ['Scheduling Guidelines', 'Referral Procedures'],
  },
];
