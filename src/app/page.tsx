import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Header } from "@/components/header";
import NewScanForm from "@/components/scanner/new-scan-form";
import ScanQueue from "@/components/scanner/scan-queue";
import ScanReports from "@/components/scanner/scan-reports";
import Settings from "@/components/scanner/settings";
import { PlusCircle, History, FileText, Settings as SettingsIcon } from "lucide-react";
import Dashboard from "@/components/dashboard/dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
            <TabsTrigger value="dashboard" className="py-2"><PlusCircle className="mr-2 h-4 w-4" />Dashboard</TabsTrigger>
            <TabsTrigger value="new-scan" className="py-2"><PlusCircle className="mr-2 h-4 w-4" />New Scan</TabsTrigger>
            <TabsTrigger value="scan-queue" className="py-2"><History className="mr-2 h-4 w-4" />Scan Queue</TabsTrigger>
            <TabsTrigger value="scan-reports" className="py-2"><FileText className="mr-2 h-4 w-4" />Scan Reports</TabsTrigger>
            <TabsTrigger value="settings" className="py-2"><SettingsIcon className="mr-2 h-4 w-4" />Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-6">
            <Dashboard />
          </TabsContent>
          <TabsContent value="new-scan" className="mt-6">
            <NewScanForm />
          </TabsContent>
          <TabsContent value="scan-queue" className="mt-6">
            <ScanQueue />
          </TabsContent>
          <TabsContent value="scan-reports" className="mt-6">
            <ScanReports />
          </TabsContent>
          <TabsContent value="settings" className="mt-6">
            <Settings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
