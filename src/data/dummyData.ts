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

// Simple pipeline statuses as requested
export type LeadStatus = 'new' | 'in_progress' | 'promising' | 'won' | 'lost';

export type ActivityType = 'call' | 'meeting' | 'email' | 'note';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  leadId: string;
  leadName: string;
  type: ActivityType;
  title: string;
  description: string;
  scheduledAt: string;
  completedAt?: string;
  userId: string;
  userName: string;
  createdAt: string;
}

export interface LeadScore {
  budget: number; // 0-25
  timeline: number; // 0-25
  interest: number; // 0-25
  engagement: number; // 0-25
  total: number; // 0-100
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
  score: LeadScore;
  assignedTo: string | null;
  assignedToName: string | null;
  comments: Comment[];
  activities: Activity[];
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

const calculateScore = (budget: number, timeline: number, interest: number, engagement: number): LeadScore => ({
  budget,
  timeline,
  interest,
  engagement,
  total: budget + timeline + interest + engagement,
});

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
    score: calculateScore(20, 15, 18, 10),
    assignedTo: null,
    assignedToName: null,
    comments: [],
    activities: [],
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
    status: 'in_progress',
    score: calculateScore(25, 20, 22, 18),
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
    activities: [
      {
        id: 'a1',
        leadId: '2',
        leadName: 'Jennifer Martinez',
        type: 'call',
        title: 'Initial Discovery Call',
        description: 'Discussed property requirements and budget range.',
        scheduledAt: '2024-03-11T10:00:00',
        completedAt: '2024-03-11T10:30:00',
        userId: '3',
        userName: 'Michael Chen',
        createdAt: '2024-03-10',
      },
      {
        id: 'a2',
        leadId: '2',
        leadName: 'Jennifer Martinez',
        type: 'meeting',
        title: 'Property Viewing - Luxury Tower',
        description: 'Show 3 penthouse units in Luxury Tower Downtown.',
        scheduledAt: '2024-03-18T14:00:00',
        userId: '3',
        userName: 'Michael Chen',
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
    status: 'promising',
    score: calculateScore(22, 25, 23, 22),
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
    activities: [
      {
        id: 'a3',
        leadId: '3',
        leadName: 'David Kim',
        type: 'meeting',
        title: 'Site Visit - Oak Street',
        description: 'Second viewing with architect.',
        scheduledAt: '2024-03-15T11:00:00',
        completedAt: '2024-03-15T12:30:00',
        userId: '4',
        userName: 'Emily Rodriguez',
        createdAt: '2024-03-12',
      },
      {
        id: 'a4',
        leadId: '3',
        leadName: 'David Kim',
        type: 'email',
        title: 'Sent Property Documents',
        description: 'Sent floor plans and financial projections.',
        scheduledAt: '2024-03-13T09:00:00',
        completedAt: '2024-03-13T09:15:00',
        userId: '4',
        userName: 'Emily Rodriguez',
        createdAt: '2024-03-13',
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
    status: 'promising',
    score: calculateScore(20, 23, 25, 20),
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
    activities: [
      {
        id: 'a5',
        leadId: '4',
        leadName: 'Amanda Foster',
        type: 'call',
        title: 'Offer Discussion',
        description: 'Discussed offer strategy and negotiation approach.',
        scheduledAt: '2024-03-13T15:00:00',
        completedAt: '2024-03-13T15:45:00',
        userId: '3',
        userName: 'Michael Chen',
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
    score: calculateScore(18, 25, 22, 25),
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
    activities: [
      {
        id: 'a6',
        leadId: '5',
        leadName: 'Thomas Brown',
        type: 'meeting',
        title: 'Contract Signing',
        description: 'Final contract signing at our office.',
        scheduledAt: '2024-03-14T10:00:00',
        completedAt: '2024-03-14T11:00:00',
        userId: '5',
        userName: 'David Thompson',
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
    score: calculateScore(20, 10, 15, 8),
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
    activities: [
      {
        id: 'a7',
        leadId: '6',
        leadName: 'Lisa Chang',
        type: 'call',
        title: 'Follow-up Call',
        description: 'Client informed about job relocation to another city.',
        scheduledAt: '2024-03-10T14:00:00',
        completedAt: '2024-03-10T14:20:00',
        userId: '4',
        userName: 'Emily Rodriguez',
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
    score: calculateScore(15, 20, 15, 5),
    assignedTo: null,
    assignedToName: null,
    comments: [],
    activities: [],
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
    status: 'in_progress',
    score: calculateScore(25, 18, 22, 15),
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
    activities: [
      {
        id: 'a8',
        leadId: '8',
        leadName: 'Sophie Adams',
        type: 'meeting',
        title: 'Private Villa Tour',
        description: 'Exclusive showing of 3 beachfront villas.',
        scheduledAt: '2024-03-16T10:00:00',
        userId: '5',
        userName: 'David Thompson',
        createdAt: '2024-03-14',
      },
    ],
    createdAt: '2024-03-12',
    updatedAt: '2024-03-14',
  },
];

export const statusOptions: { value: LeadStatus; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: 'info' },
  { value: 'in_progress', label: 'In Progress', color: 'warning' },
  { value: 'promising', label: 'Promising', color: 'primary' },
  { value: 'won', label: 'Won', color: 'success' },
  { value: 'lost', label: 'Lost', color: 'destructive' },
];

export const activityTypeOptions: { value: ActivityType; label: string; icon: string }[] = [
  { value: 'call', label: 'Call', icon: 'Phone' },
  { value: 'meeting', label: 'Meeting', icon: 'Calendar' },
  { value: 'email', label: 'Email', icon: 'Mail' },
  { value: 'note', label: 'Note', icon: 'FileText' },
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

// Helper function to get score color based on total
export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-primary';
  if (score >= 40) return 'text-warning';
  return 'text-destructive';
};

export const getScoreBgColor = (score: number): string => {
  if (score >= 80) return 'bg-success/10';
  if (score >= 60) return 'bg-primary/10';
  if (score >= 40) return 'bg-warning/10';
  return 'bg-destructive/10';
};
