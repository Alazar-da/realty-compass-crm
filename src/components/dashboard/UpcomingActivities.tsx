import { Activity } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import { Phone, Calendar, Mail, FileText, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';

interface UpcomingActivitiesProps {
  activities: Activity[];
  maxItems?: number;
  showViewAll?: boolean;
}

const activityIcons: Record<string, React.ElementType> = {
  call: Phone,
  meeting: Calendar,
  email: Mail,
  note: FileText,
};

const activityColors: Record<string, string> = {
  call: 'bg-info/10 text-info',
  meeting: 'bg-primary/10 text-primary',
  email: 'bg-warning/10 text-warning',
  note: 'bg-muted text-muted-foreground',
};

const formatScheduledTime = (dateString: string) => {
  const date = parseISO(dateString);
  
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  }
  
  if (isTomorrow(date)) {
    return `Tomorrow at ${format(date, 'h:mm a')}`;
  }
  
  return format(date, 'MMM d, h:mm a');
};

const UpcomingActivities = ({ activities, maxItems = 5, showViewAll = true }: UpcomingActivitiesProps) => {
  const displayActivities = activities.slice(0, maxItems);

  if (displayActivities.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">No upcoming activities</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayActivities.map((activity) => {
        const Icon = activityIcons[activity.type] || FileText;

        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              activityColors[activity.type]
            )}>
              <Icon className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{activity.title}</p>
              <p className="text-xs text-muted-foreground truncate">
                {activity.leadName}
              </p>
              <p className="text-xs text-primary mt-1">
                {formatScheduledTime(activity.scheduledAt)}
              </p>
            </div>
          </div>
        );
      })}

      {showViewAll && activities.length > maxItems && (
        <Link to="/schedule">
          <Button variant="ghost" className="w-full" size="sm">
            View all activities
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export default UpcomingActivities;
