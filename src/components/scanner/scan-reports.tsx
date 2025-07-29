
"use client";

import { useState, useMemo } from "react";
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
import { ArrowUpDown, Calendar as CalendarIcon, X } from "lucide-react";
import { format, isWithinInterval } from "date-fns";
import ReportDetailModal from "./report-detail-modal";
import { SeverityBadge } from "./severity-badge";
import { useScans } from "@/context/scans-context";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";


type SortKey = "targetUrl" | "completedAt" | "score" | "severity";

export const getHighestSeverity = (vulns: Vulnerability[]): Vulnerability["severity"] | null => {
  if (!vulns || vulns.length === 0) return null;
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
  const { scans } = useScans();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: "asc" | "desc" } | null>({ key: 'completedAt', direction: 'desc' });
  const [selectedScan, setSelectedScan] = useState<WebAppScan | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const completedScans = useMemo(() => scans.filter((scan) => scan.status === "completed" || scan.status === "failed"), [scans]);
  
  const filteredScans = useMemo(() => {
    if (!dateRange || (!dateRange.from && !dateRange.to)) {
      return completedScans;
    }
    return completedScans.filter((scan) => {
      if (!scan.completedAt) return false;
      const completedDate = new Date(scan.completedAt);
      const interval: Interval = {
          start: dateRange.from || new Date(0),
          end: dateRange.to || new Date(),
      };
      // Set end of day for the 'to' date to include the whole day
      if (interval.end) {
        interval.end.setHours(23, 59, 59, 999);
      }
      return isWithinInterval(completedDate, interval);
    });
  }, [completedScans, dateRange]);


  const sortedScans = useMemo(() => {
    let sortableItems = [...filteredScans];
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
  }, [filteredScans, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  
  const clearDateFilter = () => {
    setDateRange(undefined);
  };


  return (
    <div className="flex flex-col flex-grow h-full">
       <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-headline font-bold">Scan Reports</h2>
        <div className="flex items-center gap-2">
            <Popover>
            <PopoverTrigger asChild>
                <Button
                variant={"outline"}
                className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                )}
                >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                    dateRange.to ? (
                    <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                    </>
                    ) : (
                    format(dateRange.from, "LLL dd, y")
                    )
                ) : (
                    <span>Pick a date range</span>
                )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                />
            </PopoverContent>
            </Popover>
            {dateRange && (
                <Button variant="ghost" size="icon" onClick={clearDateFilter}>
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
      </div>
      <Card className="flex-grow">
       <CardContent className="h-full">
        <ScrollArea className="h-full">
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
                        <span className={`capitalize px-2 py-1 text-xs font-semibold rounded-full ${scan.status === 'completed' ? 'bg-green-100/10 text-green-500' : 'bg-red-100/10 text-red-500'}`}>
                            {scan.status}
                        </span>
                    </TableCell>
                </TableRow>
                )})}
            </TableBody>
            </Table>
        </ScrollArea>
        </CardContent>
      </Card>

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

