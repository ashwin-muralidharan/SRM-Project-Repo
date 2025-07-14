
"use client";

import * as React from "react";
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { User } from "@/lib/types";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserForm } from "./user-form";
import { useToast } from "@/hooks/use-toast";
import { deleteUser } from "@/app/admin/users/actions";

type UserTableProps = {
  users: User[];
  onDataChange: () => void;
};

export function UserTable({ users, onDataChange }: UserTableProps) {
  const { toast } = useToast();

  const handleDeleteUser = async (userId: string) => {
    const result = await deleteUser(userId);
    if (result.success) {
        toast({
          title: "User Deleted",
          description: result.message,
        });
        onDataChange();
    } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
    }
  }

  return (
    <div className="space-y-4">
        <div className="flex justify-end">
            <UserForm onFormSubmit={onDataChange}>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </UserForm>
        </div>
        <div className="border rounded-md">
            <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.length > 0 ? (
                users.map((user) => (
                    <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.college || 'N/A'}</TableCell>
                    <TableCell>{user.category || 'N/A'}</TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <UserForm user={user} onFormSubmit={onDataChange}>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Pencil className="mr-2 h-4 w-4" /> Edit
                                    </DropdownMenuItem>
                                </UserForm>
                                
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                            className="text-red-600"
                                            onSelect={(e) => e.preventDefault()}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the user account.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                                            Continue
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                    No users found.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
    </div>
  );
}
