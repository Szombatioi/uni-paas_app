"use client";

import api, { getAuthToken, validate } from "@/axios/auth-axios";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  roles: Role[];
}

export interface UserHeader {
  id: string;
  email: string;
}

export interface Role {
  id: string;
  role: string;
  priority: number;
}

interface AuthContextType {
  user: UserHeader | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserHeader | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error();
        }
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await api.get("/auth/me", { headers: { Authorization: `Bearer ${token}` }, });

        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        setUser(null);

        // if (!pathname.includes('/auth')) {
        //   router.push(`/auth/login`);
        // }
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);