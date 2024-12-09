"use client";
import VVCard from "./VenderVenueCard";
import { Venue } from "@/utils/types";
// import { useQuery } from "@tanstack/react-query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
const fetchVenues = async (): Promise<Venue[]> => {
  const response = await fetch(`http://127.0.0.1:5000/venues`);
  if (!response.ok) {
    throw new Error("Failed to fetch venues");
  }
  return response.json();
};

function VVlist() {
  const queryClient = useQueryClient(); // Access query client for manual invalidation

  // Use React Query to fetch venues
  const {
    data: venues,
    isLoading,
    isError,
    error,
    refetch, // This allows us to manually refresh the list
  } = useQuery<Venue[]>({
    queryKey: ["venues"],
    queryFn: fetchVenues,
  });

  // Define the refreshList function using the React Query `refetch` method
  // const refreshList = () => {
  //   refetch();
  // };
  // const refreshList = () => {
  //   console.log("Refetching venues...");
  //   refetch(); // Manually refetch venues
  // };
  
  const refreshList = () => {
    console.log("Invalidating and refetching venues...");
    queryClient.invalidateQueries({ queryKey: ["venues"] }); // Correct usage with queryKey
  };
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
        <VVCard key={venue.id} venue={venue} refreshList={refreshList} />
      ))}
    </div>
  );
}

export default VVlist;
