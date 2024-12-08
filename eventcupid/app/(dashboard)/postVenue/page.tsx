// app/postVenue/page.tsx

import PostVenueForm from "@/components/Venues/PostVenueForm";
import UserRegistrationHandler from "@/components/UserRegistrationHandler";

export default function PostVenuePage() {
  return (
    <>
      <UserRegistrationHandler />
      <PostVenueForm />
    </>
  );
}
