"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Role = "event-host" | "venue" | "vendor" | null;

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("role") as Role;
      console.log("Retrieved role from localStorage:", storedRole); // Debug log
      return storedRole || null;
    }
    return null;
  });

  useEffect(() => {
    if (role && role !== localStorage.getItem("role")) {
      console.log("Saving role to localStorage:", role);
      localStorage.setItem("role", role);
    }
  }, [role]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}
