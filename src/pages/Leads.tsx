import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLeads } from '@/context/LeadsContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Lead, LeadStatus, statusOptions, sourceOptions } from '@/data/dummyData';
import { Plus, Search, Filter, MessageSquare, UserPlus } from 'lucide-react';

const Leads = () => {
  const { currentUser, users } = useAuth();
  const { leads, addLead, updateLeadStatus, assignLead, addComment } = useLeads();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newComment, setNewComment] = useState('');

  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    propertyInterest: '',
    budget: '',
    source: 'Website',
  });

  const salesUsers = users.filter((u) => u.role === 'sales');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.propertyInterest.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddLead = () => {
    addLead({
      ...newLead,
      status: 'new',
      assignedTo: null,
      assignedToName: null,
    });
    setNewLead({
      name: '',
      email: '',
      phone: '',
      propertyInterest: '',
      budget: '',
      source: 'Website',
    });
    setIsAddDialogOpen(false);
  };

  const handleAddComment = () => {
    if (selectedLead && newComment.trim() && currentUser) {
      addComment(selectedLead.id, {
        userId: currentUser.id,
        userName: currentUser.name,
        content: newComment.trim(),
      });
      setNewComment('');
    }
  };

  const canAssign = currentUser?.role === 'super_admin' || currentUser?.role === 'supervisor';
  const canAddLead = currentUser?.role === 'super_admin' || currentUser?.role === 'supervisor';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="font-heading text-3xl font-bold">All Leads</h1>
            <p className="mt-1 text-muted-foreground">
              Manage and track all customer leads
            </p>
          </div>

          {canAddLead && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md overflow-y-auto py-5">
        
                <DialogHeader>
                  <DialogTitle>Add New Lead</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-5 h-96">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={newLead.name}
                      onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={newLead.email}
                      onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={newLead.phone}
                      onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Property Interest</Label>
                    <Input
                      value={newLead.propertyInterest}
                      onChange={(e) => setNewLead({ ...newLead, propertyInterest: e.target.value })}
                      placeholder="e.g., 3BR Apartment, Downtown"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Budget</Label>
                    <Input
                      value={newLead.budget}
                      onChange={(e) => setNewLead({ ...newLead, budget: e.target.value })}
                      placeholder="e.g., $400,000 - $500,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Source</Label>
                    <Select
                      value={newLead.source}
                      onValueChange={(value) => setNewLead({ ...newLead, source: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceOptions.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddLead} className="w-full">
                    Create Lead
                  </Button>
                </div>
              
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads..."
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as LeadStatus | 'all')}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="card-elevated overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="table-header py-4 px-6 text-left">Lead</th>
                  <th className="table-header py-4 px-6 text-left">Contact</th>
                  <th className="table-header py-4 px-6 text-left">Property</th>
                  <th className="table-header py-4 px-6 text-left">Budget</th>
                  <th className="table-header py-4 px-6 text-left">Status</th>
                  <th className="table-header py-4 px-6 text-left">Assigned</th>
                  <th className="table-header py-4 px-6 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.source}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        <p>{lead.email}</p>
                        <p className="text-muted-foreground">{lead.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">{lead.propertyInterest}</td>
                    <td className="py-4 px-6 text-sm">{lead.budget}</td>
                    <td className="py-4 px-6">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="py-4 px-6">
                      {canAssign ? (
                        <Select
                          value={lead.assignedTo || 'unassigned'}
                          onValueChange={(value) => {
                            if (value === 'unassigned') return;
                            const user = salesUsers.find((u) => u.id === value);
                            if (user) {
                              assignLead(lead.id, user.id, user.name);
                            }
                          }}
                        >
                          <SelectTrigger className="w-36 h-8 text-xs">
                            <SelectValue placeholder="Assign..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned" disabled>
                              Unassigned
                            </SelectItem>
                            {salesUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm">
                          {lead.assignedToName || (
                            <span className="text-muted-foreground italic">Unassigned</span>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLead(lead)}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Lead Details: {lead.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6 py-4">
                            {/* Status Update */}
                            <div className="space-y-2">
                              <Label>Update Status</Label>
                              <Select
                                value={lead.status}
                                onValueChange={(value) =>
                                  updateLeadStatus(lead.id, value as LeadStatus)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Comments */}
                            <div className="space-y-3">
                              <Label>Comments</Label>
                              <div className="max-h-48 overflow-y-auto space-y-3">
                                {lead.comments.length === 0 ? (
                                  <p className="text-sm text-muted-foreground italic">
                                    No comments yet
                                  </p>
                                ) : (
                                  lead.comments.map((comment) => (
                                    <div
                                      key={comment.id}
                                      className="rounded-lg bg-muted p-3 text-sm"
                                    >
                                      <div className="flex justify-between mb-1">
                                        <span className="font-medium">{comment.userName}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {comment.createdAt}
                                        </span>
                                      </div>
                                      <p>{comment.content}</p>
                                    </div>
                                  ))
                                )}
                              </div>
                              <Textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                rows={2}
                              />
                              <Button
                                onClick={handleAddComment}
                                disabled={!newComment.trim()}
                                size="sm"
                              >
                                Add Comment
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No leads found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leads;
