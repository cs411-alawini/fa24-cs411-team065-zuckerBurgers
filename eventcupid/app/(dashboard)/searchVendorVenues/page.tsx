import VVlist from "@/components/VenderVenue/VenderVenuesList";
import FilterForm from "@/components/VenderVenue/FilterForm";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

async function AllVenderVenuesPage() {
  return (
    <>
      <FilterForm />
      <VVlist />
    </>
  );
}

export default AllVenderVenuesPage;
