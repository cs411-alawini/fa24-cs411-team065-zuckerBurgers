import VVlist from "@/components/VenderVenue/VenderVenuesList";
import FilterForm from "@/components/VenderVenue/FilterForm";

async function AllVenderVenuesPage() {
  return (
    <>
      <FilterForm />
      <VVlist />
    </>
  );
}

export default AllVenderVenuesPage;
