"use client";

import { useState, useMemo } from "react";
import { mockScans } from "@/lib/mock-data";
import type { WebAppScan, Vulnerability } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import ReportDetailModal from "./report-detail-modal";
import { SeverityBadge } from "./severity-badge";

type SortKey = "targetUrl" | "completedAt" | "score" | "severity";

const getHighestSeverity = (vulns: Vulnerability[]): Vulnerability["severity"] | null => {
  if (vulns.length === 0) return null;
  const severityOrder: Vulnerability["severity"][] = ["Critical", "High", "Medium", "Low", "Informational"];
  let highest: Vulnerability["severity"] | null = null;
  let highestIndex = Infinity;

  for (const vuln of vulns) {
    const index = severityOrder.indexOf(vuln.severity);
    if (index < highestIndex) {
      highest = vuln.severity;
      highestIndex = index;
    }
  }
  return highest;
}

export default function ScanReports() {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" } | null>({ key: 'completedAt', direction: 'desc' });
  const [selectedScan, setSelectedScan] = useState<WebAppScan | null>(null);

  const completedScans = useMemo(() => mockScans.filter((scan) => scan.status === "completed" || scan.status === "failed"), []);

  const sortedScans = useMemo(() => {
    let sortableItems = [...completedScans];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;

        if(sortConfig.key === 'severity'){
          const severityOrder: (Vulnerability["severity"] | null)[] = ["Critical", "High", "Medium", "Low", "Informational", null];
          aValue = severityOrder.indexOf(getHighestSeverity(a.vulns));
          bValue = severityOrder.indexOf(getHighestSeverity(b.vulns));
        } else {
           aValue = a[sortConfig.key];
           bValue = b[sortConfig.key];
        }

        if (aValue === undefined || aValue === null) aValue = sortConfig.direction === 'asc' ? Infinity : -Infinity;
        if (bValue === undefined || bValue === null) bValue = sortConfig.direction === 'asc' ? Infinity : -Infinity;

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [completedScans, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  }

  return (
    <div>
       <h2 className="text-2xl font-headline font-bold mb-4">Scan Reports</h2>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('targetUrl')}>
                  Target URL <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('completedAt')}>
                  Date <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-center">
                <Button variant="ghost" onClick={() => requestSort('score')}>
                  Score <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('severity')}>
                  Highest Severity <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedScans.map((scan) => {
              const highestSeverity = getHighestSeverity(scan.vulns);
              return (
              <TableRow key={scan.id} onClick={() => setSelectedScan(scan)} className="cursor-pointer">
                <TableCell className="font-medium">{scan.targetUrl}</TableCell>
                <TableCell>
                  {scan.completedAt ? format(new Date(scan.completedAt), "PPp") : 'N/A'}
                </TableCell>
                <TableCell className="text-center font-mono">{scan.status === 'failed' ? 'N/A' : scan.score}</TableCell>
                <TableCell>
                  {highestSeverity ? (
                    <SeverityBadge severity={highestSeverity} />
                  ) : (
                    scan.status !== 'failed' && <span className="text-muted-foreground">None</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                    <span className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${scan.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {scan.status}
                    </span>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </div>

      {selectedScan && (
        <ReportDetailModal
          scan={selectedScan}
          isOpen={!!selectedScan}
          onClose={() => setSelectedScan(null)}
        />
      )}
    </div>
  );
}
