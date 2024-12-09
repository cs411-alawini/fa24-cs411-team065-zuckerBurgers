"use client";

import PostVenueForm from "@/components/Venues/PostVenueForm";
import UserRegistrationHandler from "@/components/UserRegistrationHandler";
import MyVenues from "@/components/Venues/MyVenues";
import { useState } from "react";

export default function PostVenuePage() {
  const [refreshVenues, setRefreshVenues] = useState(false);

  const refreshVenuesList = () => {
    setRefreshVenues((prev) => !prev);
  };

  return (
    <>
      <UserRegistrationHandler />
      <PostVenueForm onVenueAdded={refreshVenuesList} />
      <MyVenues refreshTrigger={refreshVenues} />
    </>
  );
}
