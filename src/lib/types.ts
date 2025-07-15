export interface Vulnerability {
  id: string;
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low" | "Informational";
  url: string;
  payload: string;
  description: string;
}

export interface WebAppScan {
  id: string;
  targetUrl: string;
  scanMode: "Active" | "Passive" | "Authenticated";
  authMethod: "none" | "form" | "header";
  status: "queued" | "running" | "completed" | "failed";
  agentId: string;
  submittedBy: string;
  createdAt: string; // ISO string
  startedAt?: string; // ISO string
  completedAt?: string; // ISO string
  vulns: Vulnerability[];
  score: number; // 0-100
  recommendations: string[];
  reportUrl?: string;
}
