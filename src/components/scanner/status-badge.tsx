
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { WebAppScan } from "@/lib/types";
import { CheckCircle, Clock, Loader2, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: WebAppScan["status"];
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    queued: {
      icon: <Clock className="mr-1.5 h-3 w-3" />,
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
    },
    running: {
      icon: <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />,
      className: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300",
    },
    completed: {
      icon: <CheckCircle className="mr-1.5 h-3 w-3" />,
      className: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
    },
    failed: {
      icon: <XCircle className="mr-1.5 h-3 w-3" />,
      className: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={cn("capitalize font-semibold", config.className)}>
      {config.icon}
      {status}
    </Badge>
  );
};
