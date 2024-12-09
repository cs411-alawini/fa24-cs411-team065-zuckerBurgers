import React from "react";
import CreateEventForm from "@/components/CreateEventForm";
import UserRegistrationHandler from "@/components/UserRegistrationHandler";
function PostEvent() {
  return (
    <>
      <UserRegistrationHandler/>
      <CreateEventForm />
    </>
  );
}

export default PostEvent;
