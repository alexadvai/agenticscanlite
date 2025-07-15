import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Vulnerability } from "@/lib/types";

interface SeverityBadgeProps {
  severity: Vulnerability["severity"];
}

export const SeverityBadge = ({ severity }: SeverityBadgeProps) => {
  const severityConfig = {
    Critical: {
      className: "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20",
    },
    High: {
      className: "bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20 dark:text-orange-500",
    },
    Medium: {
      className: "bg-accent/10 text-accent border-accent/20 hover:bg-accent/20",
    },
    Low: {
      className: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
    },
    Informational: {
      className: "bg-muted text-muted-foreground border-border hover:bg-muted/80",
    },
  };

  return (
    <Badge variant="outline" className={cn("font-semibold", severityConfig[severity].className)}>
      {severity}
    </Badge>
  );
};
