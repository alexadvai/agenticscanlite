import { Header } from "@/components/header";
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { ShieldCheck, LayoutDashboard, PlusCircle, History, FileText, Settings as SettingsIcon } from "lucide-react";
import AppContent from "@/components/app-content";


export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-3 px-2">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-headline font-bold text-foreground">
              AgenticScanLite
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="#dashboard" tooltip="Dashboard">
                <LayoutDashboard />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#new-scan" tooltip="New Scan">
                <PlusCircle />
                New Scan
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#scan-queue" tooltip="Scan Queue">
                <History />
                Scan Queue
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#scan-reports" tooltip="Scan Reports">
                <FileText />
                Scan Reports
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="#settings" tooltip="Settings">
                <SettingsIcon />
                Settings
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="container mx-auto p-4 sm:p-6 lg:p-8">
          <AppContent />
        </main>
      </SidebarInset>
    </div>
  );
}
