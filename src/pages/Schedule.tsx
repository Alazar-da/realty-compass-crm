import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useActivities } from '@/context/ActivitiesContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Phone, Calendar, Mail, FileText, Check, Clock } from 'lucide-react';
import { format, parseISO, startOfWeek, addDays, isSameDay } from 'date-fns';

const activityIcons: Record<string, React.ElementType> = {
  call: Phone,
  meeting: Calendar,
  email: Mail,
  note: FileText,
};

const activityColors: Record<string, string> = {
  call: 'bg-info/10 text-info border-info/30',
  meeting: 'bg-primary/10 text-primary border-primary/30',
  email: 'bg-warning/10 text-warning border-warning/30',
  note: 'bg-muted text-muted-foreground border-muted-foreground/30',
};

const Schedule = () => {
  const { currentUser } = useAuth();
  const { activities, completeActivity } = useActivities();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const isSales = currentUser?.role === 'sales';
  const userActivities = isSales && currentUser
    ? activities.filter(a => a.userId === currentUser.id)
    : activities;

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getActivitiesForDate = (date: Date) => {
    return userActivities.filter(activity => {
      const activityDate = parseISO(activity.scheduledAt);
      return isSameDay(activityDate, date);
    }).sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
  };

  const selectedDayActivities = getActivitiesForDate(selectedDate);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in">
          <h1 className="font-heading text-3xl font-bold">Schedule</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your meetings, calls, and activities
          </p>
        </div>

        {/* Week View */}
        <div className="card-elevated p-4 animate-fade-in">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => {
              const dayActivities = getActivitiesForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "p-3 rounded-lg text-center transition-all",
                    isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    isToday && !isSelected && "ring-2 ring-primary"
                  )}
                >
                  <p className="text-xs font-medium opacity-70">{format(day, 'EEE')}</p>
                  <p className="text-lg font-bold">{format(day, 'd')}</p>
                  {dayActivities.length > 0 && (
                    <div className="flex justify-center gap-0.5 mt-1">
                      {dayActivities.slice(0, 3).map((_, i) => (
                        <div key={i} className={cn("h-1.5 w-1.5 rounded-full", isSelected ? "bg-primary-foreground" : "bg-primary")} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Activities */}
        <div className="card-elevated p-6 animate-fade-in">
          <h2 className="font-heading text-xl font-semibold mb-4">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h2>

          {selectedDayActivities.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground">No activities scheduled</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedDayActivities.map((activity) => {
                const Icon = activityIcons[activity.type] || FileText;
                const isCompleted = !!activity.completedAt;

                return (
                  <div
                    key={activity.id}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border",
                      isCompleted ? "bg-muted/50 opacity-60" : "bg-card"
                    )}
                  >
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2",
                      activityColors[activity.type]
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={cn("font-medium", isCompleted && "line-through")}>{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.leadName}</p>
                        </div>
                        <span className="text-sm text-muted-foreground shrink-0">
                          {format(parseISO(activity.scheduledAt), 'h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">{activity.userName}</span>
                        {!isCompleted ? (
                          <Button size="sm" variant="outline" onClick={() => completeActivity(activity.id)}>
                            <Check className="mr-1 h-3 w-3" />
                            Complete
                          </Button>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-success">
                            <Check className="h-3 w-3" />
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Schedule;
