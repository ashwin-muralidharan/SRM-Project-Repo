
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { User } from "@/lib/types";
import { colleges } from "@/lib/data";
import { addUser, updateUser } from "@/app/admin/users/actions";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().optional(),
  role: z.enum(["admin", "user"], { required_error: "Role is required." }),
  college: z.string().optional(),
  category: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.role === 'user' && !data.college) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "College is required for user role.",
        path: ['college']
      });
    }
    if (data.role === 'user' && !data.category) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Category is required for user role.",
          path: ['category']
        });
    }
});


type UserFormProps = {
    user?: User;
    onFormSubmit: () => void;
    children: React.ReactNode;
}

export function UserForm({ user, onFormSubmit, children }: UserFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);

  const isEditMode = !!user;

  // Refine schema for client-side validation based on edit mode
  const refinedFormSchema = formSchema.refine(data => {
    // Password is required for new users
    if (!isEditMode && !data.password) return false;
    return true;
  }, {
    message: "Password is required for new users.",
    path: ["password"],
  });


  const form = useForm<z.infer<typeof refinedFormSchema>>({
    resolver: zodResolver(refinedFormSchema),
    defaultValues: {
      email: user?.email || "",
      password: "", // Always start with an empty password field for security
      role: user?.role || "user",
      college: user?.college || "",
      category: user?.category || "",
    },
  });

  const watchRole = form.watch("role");
  const watchCollege = form.watch("college");
  
  const selectedCollege = React.useMemo(() => {
    return colleges.find(c => c.name === watchCollege)
  }, [watchCollege]);

  async function onSubmit(values: z.infer<typeof refinedFormSchema>) {
    startTransition(async () => {
        const result = isEditMode
            ? await updateUser(user.id, values)
            : await addUser(values);
        
        if (result.success) {
            toast({
              title: isEditMode ? "User Updated" : "User Added",
              description: result.message,
            });
            onFormSubmit();
            setOpen(false);
            form.reset();
        } else {
            toast({
              title: "Error",
              description: result.message,
              variant: "destructive",
            });
        }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the user's details below." : "Fill in the details for the new user."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                    <Input placeholder="name@example.com" {...field} />
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
                    <Input type="password" placeholder={isEditMode ? "Leave blank to keep current password" : "Enter password"} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />

            {watchRole === 'user' && (
                <>
                 <FormField
                    control={form.control}
                    name="college"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>College</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a college" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {colleges.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!watchCollege}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {selectedCollege?.categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </>
            )}

            <DialogFooter>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditMode ? 'Save Changes' : 'Create User'}
                </Button>
            </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
