import { useAuth } from '@/context/AuthContext';
import { useLeads } from '@/context/LeadsContext';
import { useActivities } from '@/context/ActivitiesContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import ConversionFunnel from '@/components/dashboard/ConversionFunnel';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import UpcomingActivities from '@/components/dashboard/UpcomingActivities';
import StatusBadge from '@/components/ui/StatusBadge';
import { Users, TrendingUp, DollarSign, Clock, UserCheck, AlertCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, users } = useAuth();
  const { leads, getLeadsByAssignee } = useLeads();
  const { getUpcomingActivities } = useActivities();

  const isSales = currentUser?.role === 'sales';
  const relevantLeads = isSales && currentUser
    ? getLeadsByAssignee(currentUser.id)
    : leads;

  const upcomingActivities = getUpcomingActivities(isSales ? currentUser?.id : undefined);

  const stats = {
    totalLeads: relevantLeads.length,
    newLeads: relevantLeads.filter((l) => l.status === 'new').length,
    wonDeals: relevantLeads.filter((l) => l.status === 'won').length,
    inProgress: relevantLeads.filter((l) => ['in_progress', 'promising'].includes(l.status)).length,
    unassigned: leads.filter((l) => !l.assignedTo).length,
    salesTeam: users.filter((u) => u.role === 'sales').length,
    avgScore: relevantLeads.length > 0 
      ? Math.round(relevantLeads.reduce((sum, l) => sum + l.score.total, 0) / relevantLeads.length)
      : 0,
  };

  const recentLeads = [...relevantLeads]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Welcome back, {currentUser?.name.split(' ')[0]}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here's what's happening with your {isSales ? 'assigned leads' : 'real estate business'} today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={isSales ? 'My Leads' : 'Total Leads'}
            value={stats.totalLeads}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="New Leads"
            value={stats.newLeads}
            icon={AlertCircle}
          />
          <StatCard
            title="Won Deals"
            value={stats.wonDeals}
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Avg. Score"
            value={stats.avgScore}
            icon={TrendingUp}
          />
        </div>

        {/* Analytics Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Conversion Funnel */}
          <div className="card-elevated p-6 animate-fade-in">
            <ConversionFunnel leads={relevantLeads} />
          </div>

          {/* Performance Chart - Only for admins/supervisors */}
          {!isSales && (
            <div className="card-elevated p-6 animate-fade-in lg:col-span-2">
              <PerformanceChart leads={leads} users={users} />
            </div>
          )}

          {/* Upcoming Activities */}
          {isSales && (
            <div className="card-elevated p-6 animate-fade-in lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-lg font-semibold">Upcoming Activities</h3>
                <Link to="/schedule" className="text-sm text-primary hover:underline">View all</Link>
              </div>
              <UpcomingActivities activities={upcomingActivities} maxItems={5} showViewAll={false} />
            </div>
          )}
        </div>

        {/* Recent Leads + Upcoming Activities for Admin */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Leads */}
          <div className="card-elevated p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-semibold">Recent Activity</h2>
              <Link
                to={isSales ? '/my-leads' : '/leads'}
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{lead.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{lead.propertyInterest}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Activities for Admin/Supervisor */}
          {!isSales && (
            <div className="card-elevated p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-semibold">Upcoming Activities</h3>
                <Link to="/schedule" className="text-sm text-primary hover:underline">View all</Link>
              </div>
              <UpcomingActivities activities={upcomingActivities} maxItems={5} showViewAll={false} />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
