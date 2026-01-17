import { Lead, LeadStatus, statusOptions } from '@/data/dummyData';
import { cn } from '@/lib/utils';

interface ConversionFunnelProps {
  leads: Lead[];
}

const statusOrder: LeadStatus[] = ['new', 'in_progress', 'promising', 'won'];

const ConversionFunnel = ({ leads }: ConversionFunnelProps) => {
  const statusCounts = statusOrder.map(status => ({
    status,
    count: leads.filter(l => l.status === status).length,
    label: statusOptions.find(s => s.value === status)?.label || status,
  }));

  const maxCount = Math.max(...statusCounts.map(s => s.count), 1);
  const lostCount = leads.filter(l => l.status === 'lost').length;

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-semibold">Conversion Funnel</h3>
      
      <div className="space-y-3">
        {statusCounts.map((item, index) => {
          const widthPercent = (item.count / maxCount) * 100;
          const colorClasses = [
            'bg-info/80',
            'bg-warning/80',
            'bg-primary/80',
            'bg-success/80',
          ];

          return (
            <div key={item.status} className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-sm text-muted-foreground">{item.count} leads</span>
              </div>
              <div className="h-8 bg-muted rounded-md overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-md transition-all duration-500 flex items-center justify-end pr-2",
                    colorClasses[index]
                  )}
                  style={{ width: `${Math.max(widthPercent, 5)}%` }}
                >
                  {widthPercent > 20 && (
                    <span className="text-xs font-medium text-white">
                      {Math.round(widthPercent)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lost indicator */}
      <div className="pt-3 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Lost Leads</span>
          <span className="font-medium text-destructive">{lostCount}</span>
        </div>
      </div>

      {/* Conversion rate */}
      <div className="pt-3 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Win Rate</span>
          <span className="text-lg font-bold text-success">
            {leads.length > 0
              ? Math.round((leads.filter(l => l.status === 'won').length / leads.length) * 100)
              : 0}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConversionFunnel;
