"use client";
import VVCard from "./VenderVenueCard";
import { Venue } from "@/utils/types";
import { useQuery } from "@tanstack/react-query";

const fetchVenues = async (): Promise<Venue[]> => {
  const response = await fetch(`http://127.0.0.1:5000/venues`);
  if (!response.ok) {
    throw new Error("Failed to fetch venues");
  }
  return response.json();
};

function VVlist() {
  // Use React Query to fetch venues
  const { data: venues, isLoading, isError, error } = useQuery<Venue[]>({
    queryKey: ["venues"],
    queryFn: fetchVenues,
  });

  if (isLoading) {
    return <p>Loading venues...</p>;
  }

  if (isError) {
    return <p>Failed to load venues: {error?.message}. Please try again later.</p>;
  }

  if (!venues || venues.length === 0) {
    return <p>No venues available.</p>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {venues.map((venue) => (
        <VVCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
}

export default VVlist;
