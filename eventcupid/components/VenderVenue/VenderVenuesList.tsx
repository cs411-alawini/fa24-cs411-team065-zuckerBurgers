"use client";

import VVCard from "./VenderVenueCard";
import { useQuery } from "@tanstack/react-query";

// Define Venue type
interface Venue {
  id: number;
  manager_id: number;
  name: string;
  address: string;
  max_capacity: number;
}

// Fetch function to get venues from the Flask backend
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
    queryKey: ['venues'], // Query key for venues
    queryFn: fetchVenues, // Fetch function
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
        <VVCard key={venue.id} Venue={venue} />
      ))}
    </div>
  );
}

export default VVlist;
