import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLeads } from '@/context/LeadsContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import LeadScoreCard from '@/components/leads/LeadScoreCard';
import ActivityTimeline from '@/components/leads/ActivityTimeline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Lead, LeadStatus, LeadScore, ActivityType, statusOptions, activityTypeOptions } from '@/data/dummyData';
import { Search, MessageSquare, Phone, Mail, Calendar, FileText, Plus, TrendingUp } from 'lucide-react';

const MyLeads = () => {
  const { currentUser } = useAuth();
  const { getLeadsByAssignee, updateLeadStatus, updateLeadScore, addComment, addLeadActivity } = useLeads();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isActivityDialogOpen, setIsActivityDialogOpen] = useState(false);
  const [activityLeadId, setActivityLeadId] = useState<string | null>(null);

  const [newActivity, setNewActivity] = useState({
    type: 'call' as ActivityType,
    title: '',
    description: '',
    scheduledAt: '',
  });

  const [editScore, setEditScore] = useState<LeadScore>({
    budget: 15,
    timeline: 15,
    interest: 15,
    engagement: 15,
    total: 60,
  });

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

  const handleUpdateScore = (leadId: string) => {
    updateLeadScore(leadId, editScore);
  };

  const handleAddActivity = () => {
    if (activityLeadId && currentUser && newActivity.title && newActivity.scheduledAt) {
      const lead = myLeads.find(l => l.id === activityLeadId);
      if (lead) {
        addLeadActivity(activityLeadId, {
          leadId: activityLeadId,
          leadName: lead.name,
          type: newActivity.type,
          title: newActivity.title,
          description: newActivity.description,
          scheduledAt: newActivity.scheduledAt,
          userId: currentUser.id,
          userName: currentUser.name,
        });
        setNewActivity({ type: 'call', title: '', description: '', scheduledAt: '' });
        setIsActivityDialogOpen(false);
        setActivityLeadId(null);
      }
    }
  };

  const openActivityDialog = (leadId: string) => {
    setActivityLeadId(leadId);
    setIsActivityDialogOpen(true);
  };

  const activityIcons: Record<ActivityType, React.ElementType> = {
    call: Phone,
    meeting: Calendar,
    email: Mail,
    note: FileText,
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
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{lead.name}</h3>
                  <p className="text-sm text-muted-foreground">{lead.propertyInterest}</p>
                </div>
                <LeadScoreCard score={lead.score} compact />
              </div>

              <div className="flex items-center gap-2 mb-3">
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
                  {lead.activities.length} activities
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openActivityDialog(lead.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedLead(lead);
                          setEditScore(lead.score);
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{lead.name}</DialogTitle>
                      </DialogHeader>
                      <Tabs defaultValue="overview" className="mt-4">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="score">Score</TabsTrigger>
                          <TabsTrigger value="activities">Activities</TabsTrigger>
                          <TabsTrigger value="comments">Comments</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="overview" className="space-y-4 pt-4">
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

                          <div className="space-y-2 pt-4 border-t">
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
                        </TabsContent>

                        <TabsContent value="score" className="space-y-6 pt-4">
                          <LeadScoreCard score={lead.score} />
                          
                          <div className="border-t pt-4 space-y-4">
                            <h4 className="font-medium">Update Score</h4>
                            
                            <div className="space-y-4">
                              {[
                                { key: 'budget', label: 'Budget Fit' },
                                { key: 'timeline', label: 'Timeline' },
                                { key: 'interest', label: 'Interest Level' },
                                { key: 'engagement', label: 'Engagement' },
                              ].map((item) => (
                                <div key={item.key} className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>{item.label}</span>
                                    <span className="font-medium">
                                      {editScore[item.key as keyof Omit<LeadScore, 'total'>]}/25
                                    </span>
                                  </div>
                                  <Slider
                                    value={[editScore[item.key as keyof Omit<LeadScore, 'total'>]]}
                                    onValueChange={(value) => {
                                      const newScore = {
                                        ...editScore,
                                        [item.key]: value[0],
                                      };
                                      newScore.total = newScore.budget + newScore.timeline + newScore.interest + newScore.engagement;
                                      setEditScore(newScore);
                                    }}
                                    max={25}
                                    step={1}
                                    className="w-full"
                                  />
                                </div>
                              ))}
                            </div>
                            
                            <Button onClick={() => handleUpdateScore(lead.id)} className="w-full">
                              <TrendingUp className="mr-2 h-4 w-4" />
                              Update Score
                            </Button>
                          </div>
                        </TabsContent>

                        <TabsContent value="activities" className="space-y-4 pt-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Activity History</h4>
                            <Button size="sm" onClick={() => openActivityDialog(lead.id)}>
                              <Plus className="mr-1 h-4 w-4" />
                              Log Activity
                            </Button>
                          </div>
                          <ActivityTimeline activities={lead.activities} />
                        </TabsContent>

                        <TabsContent value="comments" className="space-y-4 pt-4">
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
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
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

      {/* Add Activity Dialog */}
      <Dialog open={isActivityDialogOpen} onOpenChange={setIsActivityDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Activity Type</Label>
              <div className="grid grid-cols-4 gap-2">
                {activityTypeOptions.map((option) => {
                  const Icon = activityIcons[option.value];
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={newActivity.type === option.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setNewActivity({ ...newActivity, type: option.value })}
                      className="flex flex-col h-16 gap-1"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{option.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                placeholder="e.g., Follow-up call"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                placeholder="Details about the activity..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Scheduled Date & Time</Label>
              <Input
                type="datetime-local"
                value={newActivity.scheduledAt}
                onChange={(e) => setNewActivity({ ...newActivity, scheduledAt: e.target.value })}
              />
            </div>
            <Button onClick={handleAddActivity} className="w-full" disabled={!newActivity.title || !newActivity.scheduledAt}>
              Log Activity
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MyLeads;
