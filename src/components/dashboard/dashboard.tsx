"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { mockScans } from "@/lib/mock-data";
import { useMemo } from "react";
import { SeverityBadge } from "../scanner/severity-badge";
import type { Vulnerability } from "@/lib/types";
import { ShieldCheck, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const COLORS = {
    Critical: '#ef4444',
    High: '#f97316',
    Medium: '#eab308',
    Low: '#3b82f6',
    Informational: '#6b7280',
  };
  

export default function Dashboard() {
    const severityDistribution = useMemo(() => {
        const counts: Record<Vulnerability["severity"], number> = {
            Critical: 0,
            High: 0,
            Medium: 0,
            Low: 0,
            Informational: 0,
        };
        mockScans.forEach(scan => {
            scan.vulns.forEach(vuln => {
                counts[vuln.severity]++;
            });
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value })).filter(item => item.value > 0);
    }, []);

    const scansOverTime = useMemo(() => {
        const counts: Record<string, number> = {};
        mockScans.forEach(scan => {
            if (scan.completedAt) {
                const date = new Date(scan.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (!counts[date]) {
                    counts[date] = 0;
                }
                counts[date]++;
            }
        });
        return Object.entries(counts).map(([name, Scans]) => ({ name, Scans })).reverse();
    }, []);

    const totalScans = mockScans.length;
    const completedScans = mockScans.filter(s => s.status === 'completed').length;
    const runningScans = mockScans.filter(s => s.status === 'running' || s.status === 'queued').length;
    const failedScans = mockScans.filter(s => s.status === 'failed').length;


  return (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalScans}</div>
                    <p className="text-xs text-muted-foreground">in system history</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completedScans}</div>
                    <p className="text-xs text-muted-foreground">Successfully finished</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active/Queued</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{runningScans}</div>
                    <p className="text-xs text-muted-foreground">Currently in progress</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Failed Scans</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{failedScans}</div>
                    <p className="text-xs text-muted-foreground">Did not complete</p>
                </CardContent>
            </Card>
       </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vulnerability Severity Distribution</CardTitle>
            <CardDescription>Breakdown of all vulnerabilities found across all scans.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {severityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))"
                    }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Scans Over Time</CardTitle>
            <CardDescription>Number of completed scans per day.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scansOverTime}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))"/>
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
                    <Tooltip 
                        cursor={{fill: 'hsl(var(--muted))'}}
                        contentStyle={{
                            backgroundColor: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))"
                        }}
                    />
                    <Bar dataKey="Scans" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
