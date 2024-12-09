import React from "react";
import CreateEventForm from "@/components/CreateEventForm";
import UserRegistrationHandler from "@/components/UserRegistrationHandler";
import AddEvent from "@/components/VenderVenue/AddEvent";

export default function PostEvent() {
  return (
    <>
      <AddEvent/>
      <UserRegistrationHandler/>
    </>
  );
}

