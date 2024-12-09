import VVlist from "@/components/VenderVenue/VenderVenuesList";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

async function AllVenderVenuesPage() {
  return (
    <>
      <VVlist />
    </>
  );
}

export default AllVenderVenuesPage;
