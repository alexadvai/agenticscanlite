// src/components/app-content.tsx
"use client";

import { useState, useEffect } from 'react';
import Dashboard from "@/components/dashboard/dashboard";
import NewScanForm from "@/components/scanner/new-scan-form";
import ScanQueue from "@/components/scanner/scan-queue";
import ScanReports from "@/components/scanner/scan-reports";
import Settings from "@/components/scanner/settings";
import { Card } from './ui/card';

const componentMap: { [key: string]: React.ComponentType } = {
  dashboard: Dashboard,
  'new-scan': NewScanForm,
  'scan-queue': ScanQueue,
  'scan-reports': ScanReports,
  settings: Settings,
};

export default function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validTabs = Object.keys(componentMap);
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      } else {
        setActiveTab('dashboard');
      }
    };

    handleHashChange(); // Set initial tab based on URL hash
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const ActiveComponent = componentMap[activeTab] || Dashboard;

  return (
    <div>
        <ActiveComponent />
    </div>
  );
}
