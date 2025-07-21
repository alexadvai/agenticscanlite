"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Rocket, Target, KeyRound, Radio } from "lucide-react";
import { useScans } from "@/context/scans-context";

const formSchema = z.object({
  targetUrl: z.string().url({ message: "Please enter a valid URL." }),
  scanMode: z.enum(["Active", "Passive", "Authenticated"]),
  authMethod: z.enum(["none", "form", "header"]).optional().default("none"),
  username: z.string().optional(),
  password: z.string().optional(),
  token: z.string().optional(),
}).refine(data => {
    if (data.scanMode === 'Authenticated' && data.authMethod === 'form') {
        return !!data.username && !!data.password;
    }
    return true;
}, {
    message: "Username and password are required for form-based authentication.",
    path: ["username"],
}).refine(data => {
    if (data.scanMode === 'Authenticated' && data.authMethod === 'header') {
        return !!data.token;
    }
    return true;
}, {
    message: "A token is required for header-based authentication.",
    path: ["token"],
});


export default function NewScanForm() {
  const { toast } = useToast();
  const { addScan } = useScans();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetUrl: "",
      scanMode: "Passive",
      authMethod: "none",
      username: "",
      password: "",
      token: "",
    },
  });

  const scanMode = form.watch("scanMode");
  const authMethod = form.watch("authMethod");

  function onSubmit(values: z.infer<typeof formSchema>) {
    addScan({
        id: `scan-${Math.random().toString(36).substring(2, 8)}`,
        targetUrl: values.targetUrl,
        scanMode: values.scanMode,
        authMethod: values.authMethod || 'none',
        status: "queued",
        agentId: "agent-manual-01",
        submittedBy: "user-1",
        createdAt: new Date().toISOString(),
        vulns: [],
        score: 0,
        recommendations: [],
    });

    toast({
      title: "Scan Queued!",
      description: `Scan for ${values.targetUrl} has been successfully submitted.`,
    });
    form.reset();
    window.location.hash = '#scan-queue';
  }

  return (
    <>
      <h2 className="text-3xl font-headline font-bold mb-4">New Scan</h2>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Launch a New Web App Scan</CardTitle>
          <CardDescription>
            Enter the details below to start a new security scan. The scanner will
            analyze the target for common vulnerabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="targetUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Target className="mr-2 h-4 w-4"/>Target URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      The full URL of the web application you want to scan.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="scanMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Radio className="mr-2 h-4 w-4" />Scan Mode</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a scan mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Passive">Passive Scan</SelectItem>
                        <SelectItem value="Active">Active Scan</SelectItem>
                        <SelectItem value="Authenticated">Authenticated Scan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Passive scans are non-intrusive. Active scans send test payloads.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {scanMode === 'Authenticated' && (
                  <Card className="bg-muted/50 p-6 space-y-6">
                      <FormField
                          control={form.control}
                          name="authMethod"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel className="flex items-center"><KeyRound className="mr-2 h-4 w-4"/>Authentication Method</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                      <SelectTrigger>
                                          <SelectValue placeholder="Select an authentication method" />
                                      </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                      <SelectItem value="none">None</SelectItem>
                                      <SelectItem value="form">Form-based (Username/Password)</SelectItem>
                                      <SelectItem value="header">Header-based (Token)</SelectItem>
                                      </SelectContent>
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                          )}
                          />
                      {authMethod === 'form' && (
                          <>
                              <FormField
                              control={form.control}
                              name="username"
                              render={({ field }) => (
                                  <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                      <Input placeholder="user@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                  </FormItem>
                              )}
                              />
                              <FormField
                              control={form.control}
                              name="password"
                              render={({ field }) => (
                                  <FormItem>
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                      <Input type="password" placeholder="••••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                  </FormItem>
                              )}
                              />
                          </>
                      )}
                      {authMethod === 'header' && (
                            <FormField
                              control={form.control}
                              name="token"
                              render={({ field }) => (
                                  <FormItem>
                                  <FormLabel>Authentication Token</FormLabel>
                                  <FormControl>
                                      <Input placeholder="Bearer ..." {...field} />
                                  </FormControl>
                                  <FormDescription>The token will be sent in the Authorization header.</FormDescription>
                                  <FormMessage />
                                  </FormItem>
                              )}
                              />
                      )}
                  </Card>
              )}

              <Button type="submit" className="w-full sm:w-auto">
                <Rocket className="mr-2 h-4 w-4" />
                Launch Scan
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
