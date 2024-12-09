// components/UserRegistrationHandler.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRole } from "@/app/RoleProvider";
import { registerUserInDatabase } from "./UserRegistrationHandlerHelper";

export default function UserRegistrationHandler() {
  const { user } = useUser();
  const { role } = useRole();

  useEffect(() => {
    const registerUserOnce = async () => {
      // const isRegistered = localStorage.getItem(`registered_${user?.id}`);
      if (!user || !role ) return;

      const result = await registerUserInDatabase(user, role);

      if (result.success) {
        localStorage.setItem(`registered_${user.id}`, "true");
      }
    };

    registerUserOnce();
  }, [user, role]);

  return null;
}
