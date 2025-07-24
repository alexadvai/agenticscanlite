
"use client";

import { useState, useEffect } from "react";
import type { WebAppScan } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Target } from "lucide-react";
import { StatusBadge } from "./status-badge";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { useScans } from "@/context/scans-context";

export default function ScanQueue() {
  const { scans, removeScan } = useScans();
  const [queuedScans, setQueuedScans] = useState<WebAppScan[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const filteredScans = scans.filter(
      (scan) => scan.status === "queued" || scan.status === "running"
    );
    setQueuedScans(filteredScans.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }, [scans]);

  const handleCancelScan = (scanId: string) => {
    removeScan(scanId);
    toast({
      title: "Scan Canceled",
      description: `The scan (ID: ${scanId}) has been canceled.`,
      variant: 'destructive',
    });
  };

  return (
    <div>
      <h2 className="text-3xl font-headline font-bold mb-4">Scan Queue</h2>
      {queuedScans.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {queuedScans.map((scan) => (
            <Card key={scan.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <StatusBadge status={scan.status} />
                    <CardTitle className="mt-2 flex items-center gap-2 text-lg pt-1">
                       <Target className="w-5 h-5 text-muted-foreground" />
                       <span className="truncate">{scan.targetUrl}</span>
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCancelScan(scan.id)}
                    aria-label="Cancel scan"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Mode:</span> {scan.scanMode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Submitted:</span>{" "}
                    {formatDistanceToNow(new Date(scan.createdAt), { addSuffix: true })}
                  </p>
                </div>
                 <div className="mt-4 text-xs text-muted-foreground">
                    Scan ID: {scan.id}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold text-muted-foreground">The scan queue is empty.</h3>
          <p className="text-muted-foreground mt-2">Launch a new scan to see it here.</p>
        </div>
      )}
    </div>
  );
}
