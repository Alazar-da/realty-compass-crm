import { Activity } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import { Phone, Calendar, Mail, FileText, Check, Clock } from 'lucide-react';

interface ActivityTimelineProps {
  activities: Activity[];
  maxItems?: number;
}

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

const ActivityTimeline = ({ activities, maxItems }: ActivityTimelineProps) => {
  const displayActivities = maxItems ? activities.slice(0, maxItems) : activities;

  if (displayActivities.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic py-4 text-center">
        No activities recorded yet
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {displayActivities.map((activity, index) => {
        const Icon = activityIcons[activity.type] || FileText;
        const isCompleted = !!activity.completedAt;

        return (
          <div key={activity.id} className="flex gap-3">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2",
                activityColors[activity.type]
              )}>
                <Icon className="h-4 w-4" />
              </div>
              {index < displayActivities.length - 1 && (
                <div className="w-0.5 flex-1 bg-border mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.userName} • {new Date(activity.scheduledAt).toLocaleDateString()}
                  </p>
                </div>
                {isCompleted ? (
                  <span className="flex items-center gap-1 text-xs text-success">
                    <Check className="h-3 w-3" />
                    Done
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-warning">
                    <Clock className="h-3 w-3" />
                    Scheduled
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {activity.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;
