
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Upload, User as UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup
} from "@/components/ui/dropdown-menu"
import Image from "next/image";


export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout, role } = useAuth();
  const router = useRouter();

  const handleUploadClick = () => {
    router.push("/upload");
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
           <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image 
                data-ai-hint="institute logo"
                src="https://media.licdn.com/dms/image/v2/C510BAQEI9giuDuO9Qw/company-logo_200_200/company-logo_200_200/0/1630583307654?e=1757548800&v=beta&t=dlksJZY8vCNYYo_ubqpf20rTUg3Ar00msOpVS2UNZ0M"
                alt="Institute Logo" 
                width={40} 
                height={40} 
                className="rounded-md object-contain"
              />
              <span className="font-headline text-lg">ScholarSync</span>
           </Link>
          
          <div className="ml-auto flex items-center gap-4">
            {role === 'user' && (
              <Button size="lg" onClick={handleUploadClick}>
                  <Upload className="mr-2 h-5 w-5" />
                  Upload Paper
              </Button>
            )}

             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="overflow-hidden rounded-full">
                        <Avatar>
                            <AvatarImage data-ai-hint="profile avatar" src={`https://placehold.co/32x32.png`} alt="Avatar" />
                            <AvatarFallback>{user?.email.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                        <p className="font-medium">{user?.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user?.role} Account</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {role === 'user' && (
                      <DropdownMenuGroup>
                          <Link href="/">
                            <DropdownMenuItem>
                                <UserIcon className="mr-2 h-4 w-4" />
                                <span>My Dashboard</span>
                            </DropdownMenuItem>
                          </Link>
                          <Link href="/upload">
                            <DropdownMenuItem>
                                <Upload className="mr-2 h-4 w-4" />
                                <span>Upload Paper</span>
                            </DropdownMenuItem>
                          </Link>
                      </DropdownMenuGroup>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-8 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
