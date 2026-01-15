export type UserRole = 'super_admin' | 'supervisor' | 'sales';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'negotiation' | 'won' | 'lost';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyInterest: string;
  budget: string;
  source: string;
  status: LeadStatus;
  assignedTo: string | null;
  assignedToName: string | null;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export const users: User[] = [
  {
    id: '1',
    email: 'admin@realestate.com',
    password: 'admin123',
    name: 'John Anderson',
    role: 'super_admin',
    avatar: 'JA',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    email: 'supervisor@realestate.com',
    password: 'super123',
    name: 'Sarah Mitchell',
    role: 'supervisor',
    avatar: 'SM',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    email: 'sales1@realestate.com',
    password: 'sales123',
    name: 'Michael Chen',
    role: 'sales',
    avatar: 'MC',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    email: 'sales2@realestate.com',
    password: 'sales123',
    name: 'Emily Rodriguez',
    role: 'sales',
    avatar: 'ER',
    createdAt: '2024-02-15',
  },
  {
    id: '5',
    email: 'sales3@realestate.com',
    password: 'sales123',
    name: 'David Thompson',
    role: 'sales',
    avatar: 'DT',
    createdAt: '2024-03-01',
  },
];

export const leads: Lead[] = [
  {
    id: '1',
    name: 'Robert Williams',
    email: 'robert.w@email.com',
    phone: '+1 (555) 123-4567',
    propertyInterest: '3BR Apartment, Downtown',
    budget: '$450,000 - $550,000',
    source: 'Website',
    status: 'new',
    assignedTo: null,
    assignedToName: null,
    comments: [],
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10',
  },
  {
    id: '2',
    name: 'Jennifer Martinez',
    email: 'j.martinez@email.com',
    phone: '+1 (555) 234-5678',
    propertyInterest: 'Luxury Penthouse',
    budget: '$1,200,000 - $1,500,000',
    source: 'Referral',
    status: 'contacted',
    assignedTo: '3',
    assignedToName: 'Michael Chen',
    comments: [
      {
        id: '1',
        userId: '3',
        userName: 'Michael Chen',
        content: 'Initial call made. Client interested in scheduling a viewing next week.',
        createdAt: '2024-03-11',
      },
    ],
    createdAt: '2024-03-08',
    updatedAt: '2024-03-11',
  },
  {
    id: '3',
    name: 'David Kim',
    email: 'david.kim@email.com',
    phone: '+1 (555) 345-6789',
    propertyInterest: 'Commercial Office Space',
    budget: '$800,000 - $1,000,000',
    source: 'LinkedIn',
    status: 'qualified',
    assignedTo: '4',
    assignedToName: 'Emily Rodriguez',
    comments: [
      {
        id: '2',
        userId: '4',
        userName: 'Emily Rodriguez',
        content: 'Met with client. They have pre-approval for financing.',
        createdAt: '2024-03-09',
      },
      {
        id: '3',
        userId: '4',
        userName: 'Emily Rodriguez',
        content: 'Showed 3 properties. Client likes the one on Oak Street.',
        createdAt: '2024-03-12',
      },
    ],
    createdAt: '2024-03-05',
    updatedAt: '2024-03-12',
  },
  {
    id: '4',
    name: 'Amanda Foster',
    email: 'a.foster@email.com',
    phone: '+1 (555) 456-7890',
    propertyInterest: '4BR Family Home',
    budget: '$650,000 - $750,000',
    source: 'Open House',
    status: 'negotiation',
    assignedTo: '3',
    assignedToName: 'Michael Chen',
    comments: [
      {
        id: '4',
        userId: '3',
        userName: 'Michael Chen',
        content: 'Client made an offer of $680,000. Waiting for seller response.',
        createdAt: '2024-03-13',
      },
    ],
    createdAt: '2024-03-01',
    updatedAt: '2024-03-13',
  },
  {
    id: '5',
    name: 'Thomas Brown',
    email: 't.brown@email.com',
    phone: '+1 (555) 567-8901',
    propertyInterest: 'Investment Property',
    budget: '$300,000 - $400,000',
    source: 'Website',
    status: 'won',
    assignedTo: '5',
    assignedToName: 'David Thompson',
    comments: [
      {
        id: '5',
        userId: '5',
        userName: 'David Thompson',
        content: 'Deal closed! Property on Maple Ave sold for $375,000.',
        createdAt: '2024-03-14',
      },
    ],
    createdAt: '2024-02-20',
    updatedAt: '2024-03-14',
  },
  {
    id: '6',
    name: 'Lisa Chang',
    email: 'lisa.c@email.com',
    phone: '+1 (555) 678-9012',
    propertyInterest: 'Waterfront Condo',
    budget: '$500,000 - $600,000',
    source: 'Social Media',
    status: 'lost',
    assignedTo: '4',
    assignedToName: 'Emily Rodriguez',
    comments: [
      {
        id: '6',
        userId: '4',
        userName: 'Emily Rodriguez',
        content: 'Client decided to postpone purchase due to job relocation.',
        createdAt: '2024-03-10',
      },
    ],
    createdAt: '2024-02-15',
    updatedAt: '2024-03-10',
  },
  {
    id: '7',
    name: 'Mark Johnson',
    email: 'm.johnson@email.com',
    phone: '+1 (555) 789-0123',
    propertyInterest: 'Starter Home',
    budget: '$250,000 - $320,000',
    source: 'Referral',
    status: 'new',
    assignedTo: null,
    assignedToName: null,
    comments: [],
    createdAt: '2024-03-14',
    updatedAt: '2024-03-14',
  },
  {
    id: '8',
    name: 'Sophie Adams',
    email: 's.adams@email.com',
    phone: '+1 (555) 890-1234',
    propertyInterest: 'Beachfront Villa',
    budget: '$2,000,000+',
    source: 'Partner Agency',
    status: 'contacted',
    assignedTo: '5',
    assignedToName: 'David Thompson',
    comments: [
      {
        id: '7',
        userId: '5',
        userName: 'David Thompson',
        content: 'VIP client. Scheduled private tour for this weekend.',
        createdAt: '2024-03-14',
      },
    ],
    createdAt: '2024-03-12',
    updatedAt: '2024-03-14',
  },
];

export const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

export const sourceOptions = [
  'Website',
  'Referral',
  'LinkedIn',
  'Open House',
  'Social Media',
  'Partner Agency',
  'Cold Call',
  'Other',
];
