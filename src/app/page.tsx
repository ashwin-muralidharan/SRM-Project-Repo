
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { papers as allPapers, departments as allDepartments, colleges } from "@/lib/data";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FilterToolbar } from "@/components/dashboard/filter-toolbar";
import { PapersTable } from "@/components/dashboard/papers-table";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DepartmentChart } from "@/components/dashboard/department-chart";
import { useAuth } from "@/context/auth-context";

export default function UserDashboardPage() {
  const { user, isAuthenticated, role } = useAuth();
  const router = useRouter();

  const [filters, setFilters] = React.useState({
    searchTerm: "",
    department: "",
    year: "",
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (role === 'admin') {
      router.push('/admin');
    }
  }, [isAuthenticated, role, router]);

  const userCollege = React.useMemo(() => {
      if(!user || !user.college) return null;
      return colleges.find(c => c.name === user.college);
  }, [user]);

  const userPapers = React.useMemo(() => {
    if (!user || !user.college || !user.category) return [];
    return allPapers.filter(p => p.college === user.college && p.category === user.category);
  }, [user]);


  const departmentsForFilter = React.useMemo(() => {
    if(!user || !user.college || !user.category) return [];
    return allDepartments.filter(d => d.collegeId === userCollege?.id && d.category === user.category);
  }, [user, userCollege]);
  
  const yearsForFilter = React.useMemo(() => {
    const years = new Set(userPapers.map(p => new Date(p.publicationDate).getFullYear().toString()));
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, [userPapers]);


  const chartData = React.useMemo(() => {
    const departmentCounts = userPapers.reduce((acc, paper) => {
        acc[paper.department] = (acc[paper.department] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(departmentCounts).map(([name, total]) => ({ name, total }));
  }, [userPapers]);


  const totalPapers = userPapers.length;
  const totalAuthors = new Set(userPapers.flatMap(p => p.authors.map(a => a.name))).size;
  const totalDepartments = new Set(userPapers.map(p => p.department)).size;

  const filteredPapers = React.useMemo(() => {
    return userPapers.filter((paper) => {
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
  }, [filters, userPapers]);
  
  if (!isAuthenticated || role === 'admin' || !user) {
    return null; 
  }

  const dashboardTitle = user.category
    ? `${user.college} - ${user.category}`
    : `${user.college}`;

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div>
            <h1 className="text-2xl font-bold font-headline">{dashboardTitle} Dashboard</h1>
            <p className="text-muted-foreground">An overview of research papers for your area.</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Papers"
            value={totalPapers.toString()}
            description={`In your category`}
          />
          <StatsCard
            title="Total Authors"
            value={totalAuthors.toString()}
            description="Unique contributing authors"
          />
          <StatsCard
            title="Active Departments"
            value={totalDepartments.toString()}
            description="Within your category"
          />
        </div>
        
        {chartData.length > 0 &&
          <Card>
            <CardHeader>
              <CardTitle>Papers by Department</CardTitle>
              <CardDescription>Breakdown of papers in your category.</CardDescription>
            </CardHeader>
            <CardContent>
              <DepartmentChart data={chartData} />
            </CardContent>
          </Card>
        }

        <Card>
          <CardHeader>
            <CardTitle>Your Research Papers</CardTitle>
            <CardDescription>
              A list of publications relevant to you.
            </CardDescription>
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
