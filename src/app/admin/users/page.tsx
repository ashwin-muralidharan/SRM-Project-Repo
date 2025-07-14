
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserCog } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserTable } from "@/components/admin/user-table";
import { users } from "@/lib/data";


export default function UserManagementPage() {
    const { isAuthenticated, role } = useAuth();
    const router = useRouter();

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

    // In a real app, you'd fetch this from a server action
    const [userList, setUserList] = React.useState(users);

    // This function would be passed to the UserForm to refresh data
    const refreshUsers = () => {
        // In a real app, you'd re-fetch users. Here we just re-read our mock data.
        // This is a placeholder for reactivity.
        setUserList([...users]); 
    };

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
                        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
                            <UserCog className="h-6 w-6" />
                            User Management
                        </h1>
                        <p className="text-muted-foreground">Add, edit, or remove users from the system.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>System Users</CardTitle>
                        <CardDescription>A list of all users with access to ScholarSync.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UserTable users={userList} onDataChange={refreshUsers} />
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
