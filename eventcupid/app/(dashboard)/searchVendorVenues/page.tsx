import VVlist from "@/components/VenderVenue/VenderVenuesList";
import VenueAdditionForm from "@/components/VenderVenue/VenueAdditionForm";
import VenueFilterForm from "@/components/VenderVenue/VenueFilterForm";

async function AllVenderVenuesPage() {
  return (
    <>
      <VenueFilterForm />
      <VenueAdditionForm />
      <VVlist />
    </>
  );
}

export default AllVenderVenuesPage;
