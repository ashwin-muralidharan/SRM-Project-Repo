
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, UserCog } from "lucide-react";
import { papers as allPapers, colleges } from "@/lib/data";
import { AppShell } from "@/components/app-shell";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DepartmentChart } from "@/components/dashboard/department-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { PapersByYearChart } from "@/components/dashboard/papers-by-year-chart";

export default function AdminDashboardPage() {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (role !== 'admin') {
      router.push('/'); // Redirect to user dashboard if not admin
    }
  }, [isAuthenticated, role, router]);

  const collegeChartData = React.useMemo(() => {
    return colleges.map(college => ({
      name: college.name,
      total: allPapers.filter(p => p.college === college.name).length
    }));
  }, []);

  const papersByYearData = React.useMemo(() => {
    const yearCounts = allPapers.reduce((acc, paper) => {
        const year = new Date(paper.publicationDate).getFullYear().toString();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(yearCounts).map(([name, total]) => ({ name, total })).sort((a,b) => a.name.localeCompare(b.name));
  }, []);

  const totalPapers = allPapers.length;
  const totalColleges = colleges.length;
  const totalAuthors = new Set(allPapers.flatMap(p => p.authors.map(a => a.name))).size;
  
  if (!isAuthenticated || role !== 'admin') {
    return null;
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold font-headline">SRM Group Admin Dashboard</h1>
            <p className="text-muted-foreground">Global overview of all colleges and research papers.</p>
          </div>
          <Link href="/admin/users">
            <Button variant="outline">
              <UserCog className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Papers"
            value={totalPapers.toString()}
            description="Across all colleges"
          />
          <StatsCard
            title="Total Authors"
            value={totalAuthors.toString()}
            description="Unique contributing authors"
          />
          <StatsCard
            title="Total Colleges"
            value={totalColleges.toString()}
            description="Total number of colleges in the group"
          />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-3">
                <DepartmentChart data={collegeChartData} />
            </div>
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Papers by Year</CardTitle>
                        <CardDescription>Total papers published across all colleges annually.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <PapersByYearChart data={papersByYearData} height={350} />
                    </CardContent>
                </Card>
            </div>
        </div>


        <Card>
            <CardHeader>
                <CardTitle>Colleges Overview</CardTitle>
                <CardDescription>Select a college to view its detailed dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
                {colleges.map(college => (
                    <Card key={college.id}>
                        <CardHeader>
                            <CardTitle>{college.name}</CardTitle>
                            <CardDescription>
                              {allPapers.filter(p => p.college === college.name).length} papers
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={`/admin/${college.id}`}>
                                <Button className="w-full">
                                    View Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
