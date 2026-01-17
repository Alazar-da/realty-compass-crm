import React, { createContext, useContext, useState } from 'react';
import { Activity, ActivityType, leads as initialLeads } from '@/data/dummyData';

interface ActivitiesContextType {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  completeActivity: (activityId: string) => void;
  getActivitiesByLead: (leadId: string) => Activity[];
  getActivitiesByUser: (userId: string) => Activity[];
  getUpcomingActivities: (userId?: string) => Activity[];
  getTodayActivities: (userId?: string) => Activity[];
}

const ActivitiesContext = createContext<ActivitiesContextType | undefined>(undefined);

// Extract all activities from leads
const extractActivities = (): Activity[] => {
  return initialLeads.flatMap(lead => lead.activities || []);
};

export const ActivitiesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>(extractActivities());

  const addActivity = (activityData: Omit<Activity, 'id' | 'createdAt'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: `a${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setActivities([...activities, newActivity]);
  };

  const completeActivity = (activityId: string) => {
    setActivities(activities.map((activity) =>
      activity.id === activityId
        ? { ...activity, completedAt: new Date().toISOString() }
        : activity
    ));
  };

  const getActivitiesByLead = (leadId: string) =>
    activities.filter((activity) => activity.leadId === leadId);

  const getActivitiesByUser = (userId: string) =>
    activities.filter((activity) => activity.userId === userId);

  const getUpcomingActivities = (userId?: string) => {
    const now = new Date();
    return activities
      .filter((activity) => {
        const isUpcoming = !activity.completedAt && new Date(activity.scheduledAt) >= now;
        return userId ? isUpcoming && activity.userId === userId : isUpcoming;
      })
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  };

  const getTodayActivities = (userId?: string) => {
    const today = new Date().toISOString().split('T')[0];
    return activities
      .filter((activity) => {
        const activityDate = activity.scheduledAt.split('T')[0];
        const isToday = activityDate === today;
        return userId ? isToday && activity.userId === userId : isToday;
      })
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  };

  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        addActivity,
        completeActivity,
        getActivitiesByLead,
        getActivitiesByUser,
        getUpcomingActivities,
        getTodayActivities,
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
};

export const useActivities = () => {
  const context = useContext(ActivitiesContext);
  if (!context) {
    throw new Error('useActivities must be used within an ActivitiesProvider');
  }
  return context;
};
