
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";
import { users } from "@/lib/data";

type AuthContextType = {
  user: User | null;
  role: 'admin' | 'user';
  isAuthenticated: boolean;
  login: (email: string, password?: string) => User;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const router = useRouter();

  const login = (email: string, password?: string): User => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!foundUser) {
      throw new Error("Invalid email or password.");
    }
    
    if (foundUser.password !== password) {
      throw new Error("Invalid email or password.");
    }
    
    setUser(foundUser);
    return foundUser;
  };

  const logout = React.useCallback(() => {
    setUser(null);
    router.push('/login');
  }, [router]);

  const value = { 
    user, 
    role: user?.role || 'user',
    isAuthenticated: !!user,
    login,
    logout 
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
