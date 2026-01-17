import React, { createContext, useContext, useState } from 'react';
import { Lead, LeadStatus, LeadScore, Comment, Activity, leads as initialLeads } from '@/data/dummyData';

interface LeadsContextType {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'activities'>) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  updateLeadScore: (leadId: string, score: LeadScore) => void;
  assignLead: (leadId: string, userId: string, userName: string) => void;
  addComment: (leadId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  addLeadActivity: (leadId: string, activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  getLeadById: (leadId: string) => Lead | undefined;
  getLeadsByAssignee: (userId: string) => Lead[];
}

const LeadsContext = createContext<LeadsContextType | undefined>(undefined);

export const LeadsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'activities'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newLead: Lead = {
      ...leadData,
      id: String(leads.length + 1),
      comments: [],
      activities: [],
      createdAt: today,
      updatedAt: today,
    };
    setLeads([newLead, ...leads]);
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads(leads.map((lead) =>
      lead.id === leadId
        ? { ...lead, status, updatedAt: new Date().toISOString().split('T')[0] }
        : lead
    ));
  };

  const updateLeadScore = (leadId: string, score: LeadScore) => {
    setLeads(leads.map((lead) =>
      lead.id === leadId
        ? { ...lead, score, updatedAt: new Date().toISOString().split('T')[0] }
        : lead
    ));
  };

  const assignLead = (leadId: string, userId: string, userName: string) => {
    setLeads(leads.map((lead) =>
      lead.id === leadId
        ? {
            ...lead,
            assignedTo: userId,
            assignedToName: userName,
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : lead
    ));
  };

  const addComment = (leadId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    setLeads(leads.map((lead) =>
      lead.id === leadId
        ? {
            ...lead,
            comments: [
              ...lead.comments,
              {
                ...commentData,
                id: String(lead.comments.length + 1),
                createdAt: new Date().toISOString().split('T')[0],
              },
            ],
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : lead
    ));
  };

  const addLeadActivity = (leadId: string, activityData: Omit<Activity, 'id' | 'createdAt'>) => {
    setLeads(leads.map((lead) =>
      lead.id === leadId
        ? {
            ...lead,
            activities: [
              ...lead.activities,
              {
                ...activityData,
                id: `a${Date.now()}`,
                createdAt: new Date().toISOString().split('T')[0],
              },
            ],
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : lead
    ));
  };

  const getLeadById = (leadId: string) => leads.find((lead) => lead.id === leadId);

  const getLeadsByAssignee = (userId: string) => leads.filter((lead) => lead.assignedTo === userId);

  return (
    <LeadsContext.Provider
      value={{ 
        leads, 
        addLead, 
        updateLeadStatus, 
        updateLeadScore,
        assignLead, 
        addComment, 
        addLeadActivity,
        getLeadById, 
        getLeadsByAssignee 
      }}
    >
      {children}
    </LeadsContext.Provider>
  );
};

export const useLeads = () => {
  const context = useContext(LeadsContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadsProvider');
  }
  return context;
};
