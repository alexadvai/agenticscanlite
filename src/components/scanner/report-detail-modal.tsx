"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { WebAppScan } from "@/lib/types";
import { SeverityBadge } from "./severity-badge";
import VulnerabilityQA from "./vulnerability-qa";
import { Download, FileJson, Info, ShieldCheck, Target } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface ReportDetailModalProps {
  scan: WebAppScan;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportDetailModal({ scan, isOpen, onClose }: ReportDetailModalProps) {
  if (!scan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center gap-2">
            <Target /> Scan Report: {scan.targetUrl}
          </DialogTitle>
          <DialogDescription>
            Detailed results for scan ID: {scan.id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b pb-4">
            <div className="flex items-center gap-3 bg-muted p-3 rounded-lg">
                <ShieldCheck className="w-8 h-8 text-primary" />
                <div>
                    <p className="text-sm text-muted-foreground">Security Score</p>
                    <p className="text-2xl font-bold">{scan.score}</p>
                </div>
            </div>
             <div className="col-span-2 bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground flex items-center gap-2"><Info className="w-4 h-4"/>Recommendations</p>
                <ul className="text-sm list-disc pl-5 mt-1">
                {scan.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                ))}
                </ul>
            </div>
        </div>

        <ScrollArea className="flex-grow pr-4 -mr-4">
            <h3 className="text-lg font-semibold my-4">Vulnerabilities Found ({scan.vulns.length})</h3>
            {scan.vulns.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                {scan.vulns.map((vuln) => (
                    <AccordionItem value={vuln.id} key={vuln.id}>
                    <AccordionTrigger>
                        <div className="flex items-center gap-4">
                        <SeverityBadge severity={vuln.severity} />
                        <span className="font-medium text-left">{vuln.type}</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        <p><strong className="text-muted-foreground">Description:</strong> {vuln.description}</p>
                        <p><strong className="text-muted-foreground">Impacted URL:</strong> <span className="font-code text-sm">{vuln.url}</span></p>
                        <div>
                        <strong className="text-muted-foreground">Payload/Details:</strong>
                        <pre className="bg-muted p-3 rounded-md mt-1 font-code text-sm overflow-x-auto">
                            <code>{vuln.payload}</code>
                        </pre>
                        </div>
                        <VulnerabilityQA vulnerability={vuln} />
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            ) : (
                <div className="text-center py-8 text-muted-foreground">
                    <p>No vulnerabilities were found in this scan.</p>
                </div>
            )}
        </ScrollArea>
        <div className="mt-auto pt-4 border-t flex justify-end gap-2">
            <Button variant="outline"><FileJson className="mr-2 h-4 w-4" /> Download JSON</Button>
            <Button><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
