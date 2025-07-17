// src/context/scans-context.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { WebAppScan } from '@/lib/types';
import { mockScans } from '@/lib/mock-data';

interface ScansContextType {
  scans: WebAppScan[];
  addScan: (scan: WebAppScan) => void;
  removeScan: (scanId: string) => void;
  updateScan: (scan: Partial<WebAppScan> & { id: string }) => void;
}

const ScansContext = createContext<ScansContextType | undefined>(undefined);

export function ScansProvider({ children }: { children: ReactNode }) {
  const [scans, setScans] = useState<WebAppScan[]>(mockScans);

  const addScan = (scan: WebAppScan) => {
    setScans(prevScans => [scan, ...prevScans]);
  };

  const removeScan = (scanId: string) => {
    setScans(prevScans => prevScans.filter(scan => scan.id !== scanId));
  }

  const updateScan = (updatedScan: Partial<WebAppScan> & { id: string }) => {
    setScans(prevScans =>
      prevScans.map(scan =>
        scan.id === updatedScan.id ? { ...scan, ...updatedScan } : scan
      )
    );
  };

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
