// src/components/dashboard/dashboard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useMemo, useState, useEffect } from "react";
import { SeverityBadge } from "../scanner/severity-badge";
import type { Vulnerability, WebAppScan } from "@/lib/types";
import { ShieldCheck, Clock, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { format } from 'date-fns';
import ReportDetailModal from "../scanner/report-detail-modal";
import { getHighestSeverity } from "../scanner/scan-reports";
import { useScans } from "@/context/scans-context";
import { ScrollArea } from "../ui/scroll-area";


const COLORS = {
    Critical: 'hsl(var(--destructive))',
    High: 'hsl(var(--chart-4))',
    Medium: 'hsl(var(--chart-3))',
    Low: 'hsl(var(--chart-1))',
    Informational: 'hsl(var(--muted-foreground))',
  };
  
const RecentScanRow = ({ scan, onRowClick }: { scan: WebAppScan, onRowClick: (scan: WebAppScan) => void }) => {
    const [formattedDate, setFormattedDate] = useState<string | null>(null);

    useEffect(() => {
        // This effect runs only on the client, after hydration
        if (scan.completedAt) {
            setFormattedDate(format(new Date(scan.completedAt), "PPp"));
        } else {
            setFormattedDate('N/A');
        }
    }, [scan.completedAt]);

    const highestSeverity = getHighestSeverity(scan.vulns);

    return (
        <TableRow onClick={() => onRowClick(scan)} className="cursor-pointer">
            <TableCell className="font-medium">{scan.targetUrl}</TableCell>
            <TableCell>{formattedDate || '...'}</TableCell>
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
    );
};

export default function Dashboard() {
    const { scans } = useScans();
    const [selectedScan, setSelectedScan] = useState<WebAppScan | null>(null);

    const {
        severityDistribution,
        scansOverTime,
        totalScans,
        completedScans,
        runningScans,
        failedScans,
        recentScans,
    } = useMemo(() => {
        const counts: Record<Vulnerability["severity"], number> = { Critical: 0, High: 0, Medium: 0, Low: 0, Informational: 0 };
        scans.forEach(scan => {
          if(scan.vulns) {
            scan.vulns.forEach(vuln => counts[vuln.severity]++)
          }
        });
        
        const timeCounts: Record<string, number> = {};
        scans.forEach(scan => {
            if (scan.completedAt) {
                const date = new Date(scan.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (!timeCounts[date]) timeCounts[date] = 0;
                timeCounts[date]++;
            }
        });
        
        const recent = scans
            .filter(s => s.status === 'completed' || s.status === 'failed')
            .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
            .slice(0, 5);

        return {
            severityDistribution: Object.entries(counts).map(([name, value]) => ({ name, value })).filter(item => item.value > 0),
            scansOverTime: Object.entries(timeCounts).map(([name, Scans]) => ({ name, Scans })).reverse(),
            totalScans: scans.length,
            completedScans: scans.filter(s => s.status === 'completed').length,
            runningScans: scans.filter(s => s.status === 'running' || s.status === 'queued').length,
            failedScans: scans.filter(s => s.status === 'failed').length,
            recentScans: recent,
        };
    }, [scans]);


  return (
    <div className="flex flex-col flex-grow space-y-6">
        <h2 className="text-3xl font-headline font-bold">Dashboard</h2>
       <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalScans}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedScans}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active/Queued</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{runningScans}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Failed</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{failedScans}</div>
                    </CardContent>
                </Card>
            </div>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Vulnerability Severity</CardTitle>
                    <CardDescription>Overall distribution of discovered vulnerabilities.</CardDescription>
                </CardHeader>
                <CardContent className="pb-4 h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={severityDistribution} labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                        {severityDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                        ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                            itemStyle={{ textTransform: 'capitalize' }}
                        />
                    </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Scans Over Time</CardTitle>
                    <CardDescription>Completed scans per day.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2 pr-6 pb-6 h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scansOverTime}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))"/>
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
                            <Tooltip 
                                cursor={{fill: 'hsl(var(--muted))'}}
                                contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                            />
                            <Bar dataKey="Scans" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
       </div>
       <Card className="flex-grow flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><FileText className="h-5 w-5"/>Recent Scans</CardTitle>
                <CardDescription>A log of the last 5 completed scans.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                 <ScrollArea className="h-full">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Target URL</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-center">Score</TableHead>
                                <TableHead>Highest Severity</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentScans.map((scan) => (
                            <RecentScanRow key={scan.id} scan={scan} onRowClick={setSelectedScan} />
                            ))}
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
