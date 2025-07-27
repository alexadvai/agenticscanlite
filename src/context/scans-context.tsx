// src/context/scans-context.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { WebAppScan, Vulnerability } from '@/lib/types';
import { mockScans } from '@/lib/mock-data';

interface ScansContextType {
  scans: WebAppScan[];
  addScan: (scan: Omit<WebAppScan, 'id' | 'status' | 'createdAt' | 'vulns' | 'score' | 'recommendations'>) => void;
  removeScan: (scanId: string) => void;
  updateScan: (scan: Partial<WebAppScan> & { id: string }) => void;
}

const ScansContext = createContext<ScansContextType | undefined>(undefined);

// Helper to generate some mock vulnerabilities for simulated scans
const generateMockVulnerabilities = (): { vulns: Vulnerability[], score: number, recommendations: string[] } => {
    const allVulns = [
        { id: 'vuln-sim-01', type: 'SQL Injection', severity: 'Critical', url: '/api/login', payload: "' OR 1=1", description: "A simulated SQLi vulnerability." },
        { id: 'vuln-sim-02', type: 'Reflected XSS', severity: 'High', url: '/search?q=<script>', payload: "<script>console.log('xss')</script>", description: "A simulated XSS vulnerability." },
        { id: 'vuln-sim-03', type: 'Missing Security Headers', severity: 'Low', url: '/', payload: 'N/A', description: "Content-Security-Policy header is missing." },
        { id: 'vuln-sim-04', type: 'Directory Traversal', severity: 'Medium', url: '/files?name=../../etc/passwd', payload: '../../etc/passwd', description: 'Allows access to sensitive files.' }
    ];

    const vulns: Vulnerability[] = [];
    const recommendations = new Set<string>();

    if (Math.random() > 0.3) { // 70% chance of finding some vulns
        const numVulns = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numVulns; i++) {
            const randomVuln = allVulns[Math.floor(Math.random() * allVulns.length)];
            if (!vulns.some(v => v.id === randomVuln.id)) {
                vulns.push({ ...randomVuln, id: `${randomVuln.id}-${Date.now()}` });
            }
        }
    }
    
    // Simple scoring logic
    const scoreMap = { 'Critical': 40, 'High': 25, 'Medium': 15, 'Low': 5, 'Informational': 0 };
    let score = 100;
    vulns.forEach(v => {
        score -= scoreMap[v.severity];
        if(v.type === 'SQL Injection') recommendations.add("Use parameterized queries.");
        if(v.type === 'Reflected XSS') recommendations.add("Sanitize user input before rendering.");
    });


    return { vulns, score: Math.max(0, score), recommendations: Array.from(recommendations) };
};


export function ScansProvider({ children }: { children: ReactNode }) {
  const [scans, setScans] = useState<WebAppScan[]>(mockScans);

  const updateScan = (updatedScan: Partial<WebAppScan> & { id: string }) => {
    setScans(prevScans =>
      prevScans.map(scan =>
        scan.id === updatedScan.id ? { ...scan, ...updatedScan } : scan
      )
    );
  };
  
  const addScan = (scanDetails: Omit<WebAppScan, 'id' | 'status' | 'createdAt' | 'vulns' | 'score' | 'recommendations'>) => {
    const newScan: WebAppScan = {
        ...scanDetails,
        id: `scan-${Math.random().toString(36).substring(2, 8)}`,
        status: 'queued',
        createdAt: new Date().toISOString(),
        submittedBy: 'user-1',
        agentId: 'agent-sim-01',
        vulns: [],
        score: 0,
        recommendations: [],
    };

    setScans(prevScans => [newScan, ...prevScans]);

    // Simulate scan lifecycle
    setTimeout(() => {
        updateScan({ id: newScan.id, status: 'running', startedAt: new Date().toISOString() });
    }, 2000); // Move to running after 2s

    setTimeout(() => {
        const { vulns, score, recommendations } = generateMockVulnerabilities();
        updateScan({ 
            id: newScan.id, 
            status: 'completed', 
            completedAt: new Date().toISOString(),
            vulns,
            score,
            recommendations: recommendations.length > 0 ? recommendations : ["No critical issues found. Keep software up to date."],
        });
    }, 7000 + Math.random() * 3000); // Complete after 7-10s
  };


  const removeScan = (scanId: string) => {
    setScans(prevScans => prevScans.filter(scan => scan.id !== scanId));
  }

  return (
    <ScansContext.Provider value={{ scans, addScan, removeScan, updateScan }}>
      {children}
    </ScansContext.Provider>
  );
}

export function useScans() {
  const context = useContext(ScansContext);
  if (context === undefined) {
    throw new Error('useScans must be used within a ScansProvider');
  }
  return context;
}
