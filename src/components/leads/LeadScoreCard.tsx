import { LeadScore, getScoreColor, getScoreBgColor } from '@/data/dummyData';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, DollarSign, Clock, Star, Heart } from 'lucide-react';

interface LeadScoreCardProps {
  score: LeadScore;
  compact?: boolean;
}

const ScoreItem = ({ 
  label, 
  value, 
  icon: Icon,
  compact 
}: { 
  label: string; 
  value: number; 
  icon: React.ElementType;
  compact?: boolean;
}) => (
  <div className={cn("flex items-center gap-2", compact ? "flex-1" : "")}>
    <Icon className="h-4 w-4 text-muted-foreground" />
    <div className={cn("flex-1", compact && "hidden sm:block")}>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}/25</span>
      </div>
      <Progress value={(value / 25) * 100} className="h-1.5" />
    </div>
    {compact && (
      <span className="text-xs font-medium sm:hidden">{value}</span>
    )}
  </div>
);

const LeadScoreCard = ({ score, compact = false }: LeadScoreCardProps) => {
  if (compact) {
    return (
      <div className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-semibold",
        getScoreBgColor(score.total),
        getScoreColor(score.total)
      )}>
        <TrendingUp className="h-3.5 w-3.5" />
        <span>{score.total}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Lead Score</span>
        <div className={cn(
          "flex items-center gap-1.5 px-3 py-1 rounded-full text-lg font-bold",
          getScoreBgColor(score.total),
          getScoreColor(score.total)
        )}>
          <TrendingUp className="h-4 w-4" />
          <span>{score.total}/100</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <ScoreItem label="Budget Fit" value={score.budget} icon={DollarSign} />
        <ScoreItem label="Timeline" value={score.timeline} icon={Clock} />
        <ScoreItem label="Interest Level" value={score.interest} icon={Star} />
        <ScoreItem label="Engagement" value={score.engagement} icon={Heart} />
      </div>
    </div>
  );
};

export default LeadScoreCard;
