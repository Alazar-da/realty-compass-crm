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
import { Lead, LeadStatus, statusOptions } from '@/data/dummyData';
import { Search, MessageSquare, Phone, Mail } from 'lucide-react';

const MyLeads = () => {
  const { currentUser } = useAuth();
  const { getLeadsByAssignee, updateLeadStatus, addComment } = useLeads();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newComment, setNewComment] = useState('');

  const myLeads = currentUser ? getLeadsByAssignee(currentUser.id) : [];

  const filteredLeads = myLeads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="font-heading text-3xl font-bold">My Leads</h1>
          <p className="mt-1 text-muted-foreground">
            Manage leads assigned to you ({myLeads.length} total)
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your leads..."
              className="pl-10"
            />
          </div>
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

        {/* Leads Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="card-elevated p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{lead.name}</h3>
                  <p className="text-sm text-muted-foreground">{lead.propertyInterest}</p>
                </div>
                <StatusBadge status={lead.status} />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{lead.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{lead.phone}</span>
                </div>
              </div>

              <div className="text-sm mb-4">
                <span className="text-muted-foreground">Budget: </span>
                <span className="font-medium">{lead.budget}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-xs text-muted-foreground">
                  Updated {lead.updatedAt}
                </span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Manage
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>{lead.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {/* Lead Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <p className="font-medium">{lead.email}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Phone:</span>
                          <p className="font-medium">{lead.phone}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Property:</span>
                          <p className="font-medium">{lead.propertyInterest}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Budget:</span>
                          <p className="font-medium">{lead.budget}</p>
                        </div>
                      </div>

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
                        <Label>Comments ({lead.comments.length})</Label>
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
              </div>
            </div>
          ))}
        </div>

        {filteredLeads.length === 0 && (
          <div className="card-elevated py-12 text-center">
            <p className="text-muted-foreground">
              {myLeads.length === 0
                ? 'No leads assigned to you yet'
                : 'No leads match your search'}
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyLeads;
