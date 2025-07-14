
"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { papers as allPapers, colleges, departments as allDepartments } from "@/lib/data";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { PapersTable } from "@/components/dashboard/papers-table";
import { PapersByYearChart } from "@/components/dashboard/papers-by-year-chart";
import { PaperTypeChart } from "@/components/dashboard/paper-type-chart";
import { FilterToolbar } from "@/components/dashboard/filter-toolbar";

export default function CategoryDetailPage() {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();
  const params = useParams();
  
  const collegeId = params.collegeId as string;
  const category = decodeURIComponent(params.category as string);

  const [filters, setFilters] = React.useState({
    searchTerm: "",
    department: "",
    year: "",
  });

  const college = React.useMemo(() => colleges.find(c => c.id === collegeId), [collegeId]);
  
  const papers = React.useMemo(() => {
    if (!college) return [];
    return allPapers.filter(p => p.college === college.name && p.category === category);
  }, [college, category]);
  
  const departmentsForFilter = React.useMemo(() => {
    if (!college) return [];
    // Filter departments by college AND category
    return allDepartments.filter(d => d.collegeId === college.id && d.category === category);
  }, [college, category]);

  const yearsForFilter = React.useMemo(() => {
    const years = new Set(papers.map(p => new Date(p.publicationDate).getFullYear().toString()));
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [papers]);
  
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


  const papersByYearData = React.useMemo(() => {
    const yearCounts = papers.reduce((acc, paper) => {
        const year = new Date(paper.publicationDate).getFullYear().toString();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(yearCounts).map(([name, total]) => ({ name, total })).sort((a,b) => a.name.localeCompare(b.name));
  }, [papers]);

  const papersByDepartmentData = React.useMemo(() => {
    const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
    const departmentCounts = papers.reduce((acc, paper) => {
        acc[paper.department] = (acc[paper.department] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(departmentCounts).map(([name, value], index) => ({
        name,
        value,
        fill: colors[index % colors.length]
    }));
  }, [papers]);


  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, role, router]);
  
  if (!isAuthenticated || role !== 'admin') {
    return null; 
  }

  if (!college || !college.categories.includes(category)) {
    return (
        <AppShell>
            <div className="text-center">
                <h1 className="text-2xl font-bold">Category Not Found</h1>
                <p>The category you are looking for does not exist in this college.</p>
                <Link href={`/admin/${collegeId}`}>
                    <Button variant="link">Back to College Dashboard</Button>
                </Link>
            </div>
        </AppShell>
    )
  }
  
  const totalPapers = papers.length;
  const totalAuthors = new Set(papers.flatMap(p => p.authors.map(a => a.name))).size;
  
  return (
    <AppShell>
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <Link href={`/admin/${collegeId}`}>
                    <Button variant="outline" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold font-headline">{category}</h1>
                    <p className="text-muted-foreground">Category dashboard for {college.name}.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatsCard
                    title="Total Papers"
                    value={filteredPapers.length.toString()}
                    description={`In ${category}`}
                />
                <StatsCard
                    title="Total Authors"
                    value={totalAuthors.toString()}
                    description="Unique contributing authors"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <PaperTypeChart 
                    data={papersByDepartmentData} 
                    title="Papers by Department" 
                    description={`Distribution across departments in ${category}.`}
                />
              </div>
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Papers by Year</CardTitle>
                    <CardDescription>Research output over the past few years for {category}.</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <PapersByYearChart data={papersByYearData} />
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Research Papers in {category}</CardTitle>
                    <CardDescription>A list of all publications from this category.</CardDescription>
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
  )
}
