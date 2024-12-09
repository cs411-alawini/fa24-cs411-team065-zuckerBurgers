// components/UserRegistrationHandlerHelper.tsx
import { UserResource } from "@clerk/types";

type UserRegistrationData = {
  clerk_id: string;
  username: string;
  email: string;
  phone_number: string;
  user_type: "Organizer" | "Manager";
};

type RegistrationResponse = {
  success: boolean;
  message: string;
  user_id?: number;
};

export const registerUserInDatabase = async (
  user: UserResource,
  role: "event-host" | "venue" | "vendor" | null
): Promise<RegistrationResponse> => {
  if (!user || !role) {
    throw new Error("User and role are required");
  }

  try {
    const userData: UserRegistrationData = {
      clerk_id: user.id,
      username: user.username || user.firstName || "Anonymous",
      email: user.emailAddresses[0].emailAddress,
      phone_number: user.phoneNumbers[0]?.phoneNumber || "N/A",
      user_type: role === "event-host" ? "Organizer" : "Manager",
    };
    console.log("Registering user:", userData);

    const response = await fetch("http://127.0.0.1:5000/users/addid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    console.log( data)
    if (!response.ok && response.status !== 409) {
      throw new Error("Failed to register user");
    }
        // Save the user_id in localStorage upon success
    if (data.user_id) {
      localStorage.setItem("user_id", String(Number(data.user_id))); // Ensure it's a number and stored as a string
    }
    console.log("User ID:", data.user_id);

    return {
      success: true,
      message: data.message || "User registered successfully",
      user_id: data.user_id,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
