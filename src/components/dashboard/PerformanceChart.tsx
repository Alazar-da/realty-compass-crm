import { Lead, User } from '@/data/dummyData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PerformanceChartProps {
  leads: Lead[];
  users: User[];
}

const PerformanceChart = ({ leads, users }: PerformanceChartProps) => {
  const salesUsers = users.filter(u => u.role === 'sales');

  const performanceData = salesUsers.map(user => {
    const userLeads = leads.filter(l => l.assignedTo === user.id);
    const wonLeads = userLeads.filter(l => l.status === 'won').length;
    const lostLeads = userLeads.filter(l => l.status === 'lost').length;
    const activeLeads = userLeads.filter(l => !['won', 'lost'].includes(l.status)).length;

    return {
      name: user.name.split(' ')[0],
      fullName: user.name,
      won: wonLeads,
      lost: lostLeads,
      active: activeLeads,
      total: userLeads.length,
      conversion: userLeads.length > 0 ? Math.round((wonLeads / userLeads.length) * 100) : 0,
    };
  });

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-lg font-semibold">Team Performance</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={performanceData} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              width={60}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-popover border rounded-lg shadow-lg p-3">
                      <p className="font-medium">{data.fullName}</p>
                      <div className="text-sm space-y-1 mt-2">
                        <p className="text-success">Won: {data.won}</p>
                        <p className="text-warning">Active: {data.active}</p>
                        <p className="text-destructive">Lost: {data.lost}</p>
                        <p className="text-muted-foreground mt-1">
                          Conversion: {data.conversion}%
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="won" stackId="a" fill="hsl(var(--success))" radius={[0, 0, 0, 0]} />
            <Bar dataKey="active" stackId="a" fill="hsl(var(--warning))" radius={[0, 0, 0, 0]} />
            <Bar dataKey="lost" stackId="a" fill="hsl(var(--destructive))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-success" />
          <span className="text-muted-foreground">Won</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-warning" />
          <span className="text-muted-foreground">Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded bg-destructive" />
          <span className="text-muted-foreground">Lost</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
