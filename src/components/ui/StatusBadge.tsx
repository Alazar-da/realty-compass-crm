import { LeadStatus } from '@/data/dummyData';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: LeadStatus;
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: 'New', className: 'status-new' },
  in_progress: { label: 'In Progress', className: 'status-in-progress' },
  promising: { label: 'Promising', className: 'status-promising' },
  won: { label: 'Won', className: 'status-won' },
  lost: { label: 'Lost', className: 'status-lost' },
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <span className={cn('status-badge', config.className)}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
