import { useAuth } from '@/context/AuthContext';
import { useLeads } from '@/context/LeadsContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import { Users, TrendingUp, DollarSign, Clock, UserCheck, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, users } = useAuth();
  const { leads, getLeadsByAssignee } = useLeads();

  const isSales = currentUser?.role === 'sales';
  const relevantLeads = isSales && currentUser
    ? getLeadsByAssignee(currentUser.id)
    : leads;

  const stats = {
    totalLeads: relevantLeads.length,
    newLeads: relevantLeads.filter((l) => l.status === 'new').length,
    wonDeals: relevantLeads.filter((l) => l.status === 'won').length,
    inProgress: relevantLeads.filter((l) =>
      ['contacted', 'qualified', 'negotiation'].includes(l.status)
    ).length,
    unassigned: leads.filter((l) => !l.assignedTo).length,
    salesTeam: users.filter((u) => u.role === 'sales').length,
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
            title="In Progress"
            value={stats.inProgress}
            icon={Clock}
          />
          {!isSales && (
            <>
              <StatCard
                title="Unassigned"
                value={stats.unassigned}
                icon={UserCheck}
              />
              <StatCard
                title="Sales Team"
                value={stats.salesTeam}
                icon={TrendingUp}
              />
            </>
          )}
        </div>

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

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="table-header py-3 text-left">Lead Name</th>
                  <th className="table-header py-3 text-left">Property Interest</th>
                  <th className="table-header py-3 text-left">Status</th>
                  <th className="table-header py-3 text-left">Assigned To</th>
                  <th className="table-header py-3 text-left">Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="py-4">
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                      </div>
                    </td>
                    <td className="py-4 text-sm">{lead.propertyInterest}</td>
                    <td className="py-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="py-4 text-sm">
                      {lead.assignedToName || (
                        <span className="text-muted-foreground italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">{lead.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
