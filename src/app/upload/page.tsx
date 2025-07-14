"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { UploadForm } from "./upload-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";

export default function UploadPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <AppShell>
      <div className="mx-auto grid w-full max-w-4xl gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline">Submit a New Paper</h1>
            <p className="text-muted-foreground">Fill in the details of the research publication.</p>
          </div>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Publication Details</CardTitle>
                <CardDescription>Please provide accurate information for all required fields.</CardDescription>
            </CardHeader>
            <CardContent>
                <UploadForm />
            </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
