import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle } from "lucide-react";
import { Textarea } from "../ui/textarea";

export default function Settings() {
  return (
    <>
      <h2 className="text-3xl font-headline font-bold mb-4">Settings</h2>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Global Scanner Configuration</CardTitle>
          <CardDescription>
            Configure the global settings for the web application scanner.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-2 p-4 border border-yellow-500/50 bg-yellow-500/10 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                  <h4 className="font-semibold text-yellow-700 dark:text-yellow-300">Admin-only Panel</h4>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">Changes made here will impact the entire scanning infrastructure. Proceed with caution.</p>
              </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scan-concurrency">Scan Concurrency Limit</Label>
              <Input id="scan-concurrency" type="number" defaultValue="5" className="max-w-sm"/>
              <p className="text-sm text-muted-foreground">
                The maximum number of scans that can run simultaneously.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate-limit">Rate Limiting (requests/second)</Label>
              <Input id="rate-limit" type="number" defaultValue="10" className="max-w-sm"/>
              <p className="text-sm text-muted-foreground">
                The maximum number of HTTP requests the scanner will send per second.
              </p>
            </div>
          </div>

          <div className="space-y-4">
              <div className="flex items-center space-x-2">
                  <Switch id="csp-injection" />
                  <Label htmlFor="csp-injection">Enable Custom CSP Injection</Label>
              </div>
              <div className="space-y-2">
                  <Label htmlFor="csp-config">Custom CSP Configuration</Label>
                  <Textarea
                  id="csp-config"
                  placeholder="default-src 'self'; script-src 'self' https://trusted.cdn.com"
                  className="w-full min-h-[100px] font-code text-sm"
                  />
                  <p className="text-sm text-muted-foreground">
                  Inject a custom Content Security Policy header into scanned responses to test for violations.
                  </p>
            </div>
          </div>

          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </>
  );
}
