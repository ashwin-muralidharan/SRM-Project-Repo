
"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { papers as allPapers, colleges, departments as allDepartments } from "@/lib/data";
import { AppShell } from "@/components/app-shell";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PaperTypeChart } from "@/components/dashboard/paper-type-chart";
import { PapersTable } from "@/components/dashboard/papers-table";
import { FilterToolbar } from "@/components/dashboard/filter-toolbar";

export default function CollegeAdminDashboardPage() {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();
  const params = useParams();
  const collegeId = params.collegeId as string;

  const [filters, setFilters] = React.useState({
    searchTerm: "",
    department: "",
    year: "",
  });

  const college = React.useMemo(() => colleges.find(c => c.id === collegeId), [collegeId]);
  
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, role, router]);
  
  // Moved this check after all hooks have been called to prevent render errors.
  if (!college) {
    return (
        <AppShell>
            <div className="text-center">
                <h1 className="text-2xl font-bold">College Not Found</h1>
                <p>The college you are looking for does not exist.</p>
                <Link href="/admin">
                    <Button variant="link">Back to Admin Dashboard</Button>
                </Link>
            </div>
        </AppShell>
    )
  }

  const papers = React.useMemo(() => {
    if (!college) return [];
    return allPapers.filter(p => p.college === college.name);
  }, [college]);

  const yearsForFilter = React.useMemo(() => {
    const years = new Set(papers.map(p => new Date(p.publicationDate).getFullYear().toString()));
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [papers]);
  
  const departmentsForFilter = React.useMemo(() => {
    if (!college) return [];
    return allDepartments.filter(d => d.collegeId === college.id);
  }, [college]);

  const filteredPapers = React.useMemo(() => {
    return papers.filter((paper) => {
      const searchTermMatch =
        filters.searchTerm.length < 2 ||
        paper.authors.some((author) =>
          author.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
        ) ||
        (paper.scopusId && paper.scopusId.toLowerCase().includes(filters.searchTerm.toLowerCase()));

      const departmentMatch =
        !filters.department || paper.department === filters.department;
        
      const yearMatch = !filters.year || new Date(paper.publicationDate).getFullYear().toString() === filters.year;

      return searchTermMatch && departmentMatch && yearMatch;
    });
  }, [filters, papers]);

  const isDentalCollege = college?.id === 'srm-dental';

  const chartData = React.useMemo(() => {
    if (!college) return [];
    const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
    
    if (isDentalCollege) {
      const departmentCounts = papers.reduce((acc, paper) => {
          acc[paper.department] = (acc[paper.department] || 0) + 1;
          return acc;
      }, {} as Record<string, number>);

      return Object.entries(departmentCounts).map(([name, value], index) => ({
          name,
          value,
          fill: colors[index % colors.length]
      }));
    } else {
        return college.categories.map((category, index) => ({
          name: category,
          value: papers.filter(p => p.category === category).length,
          fill: colors[index % colors.length]
      }));
    }
  }, [isDentalCollege, college, papers]);

  const totalPapers = papers.length;
  const totalCategories = college?.categories.length ?? 0;
  const totalAuthors = new Set(papers.flatMap(p => p.authors.map(a => a.name))).size;
  
  if (!isAuthenticated || role !== 'admin') {
    return null; 
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
            <Link href="/admin">
                <Button variant="outline" size="icon">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </Link>
            <div>
                <h1 className="text-2xl font-bold font-headline">{college.name} - Admin Dashboard</h1>
                <p className="text-muted-foreground">Detailed view of research papers and categories.</p>
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Papers"
            value={totalPapers.toString()}
            description={`In ${college.name}`}
          />
          <StatsCard
            title="Total Authors"
            value={totalAuthors.toString()}
            description="Unique contributing authors"
          />
          <StatsCard
            title={isDentalCollege ? "Departments" : "Categories"}
            value={isDentalCollege ? departmentsForFilter.length.toString() : totalCategories.toString()}
            description={`Total in ${college.name}`}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
           {chartData.length > 0 && (
              <div className="lg:col-span-2">
                <PaperTypeChart 
                    data={chartData} 
                    title={isDentalCollege ? "Papers by Department" : "Papers by Category"} 
                    description={isDentalCollege ? "Distribution across departments." : "Distribution across main categories."}
                />
              </div>
            )}

            {!isDentalCollege && (
              <Card className="lg:col-span-3">
                  <CardHeader>
                      <CardTitle>View by Category</CardTitle>
                      <CardDescription>Select a category to view its papers.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {college.categories.map(category => (
                          <Link key={category} href={`/admin/${college.id}/${encodeURIComponent(category)}`}>
                            <Card className="hover:bg-muted transition-colors h-full flex flex-col">
                                <CardHeader>
                                    <CardTitle className="text-lg">{category}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow flex items-end justify-between">
                                    <p className="text-sm text-muted-foreground">
                                        {papers.filter(p => p.category === category).length} papers
                                    </p>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                </CardContent>
                            </Card>
                          </Link>
                      ))}
                  </CardContent>
              </Card>
          )}
        </div>

        <Card>
            <CardHeader>
                <CardTitle>{`All Research Papers for ${college.name}`}</CardTitle>
                <CardDescription>A comprehensive list of all publications from this college.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FilterToolbar
                departments={departmentsForFilter}
                years={yearsForFilter}
                onFilterChange={setFilters}
                filters={filters}
              />
              <PapersTable papers={filteredPapers} />
            </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
