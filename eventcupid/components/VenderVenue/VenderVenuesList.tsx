"use client";
import VVCard from "./VenderVenueCard";
import { Venue } from "@/utils/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const fetchVenues = async (): Promise<Venue[]> => {
  const response = await fetch(`http://127.0.0.1:5000/venues`);
  if (!response.ok) {
    throw new Error("Failed to fetch venues");
  }
  return response.json();
};

const fetchHotVenues = async (): Promise<Venue[]> => {
  const response = await fetch(`http://127.0.0.1:5000/venues/hot`);
  if (!response.ok) {
    throw new Error("Failed to fetch hot venues");
  }
  return response.json();
};

function VVlist() {
  const queryClient = useQueryClient(); // Access query client for manual invalidation
  const [activeTab, setActiveTab] = useState(0); // 0 for hot venues, 1 for all venues

  // Fetch hot venues
  const {
    data: hotVenues,
    isLoading: isLoadingHotVenues,
    isError: isErrorHotVenues,
    error: hotVenuesError,
  } = useQuery<Venue[]>({
    queryKey: ["hotVenues"],
    queryFn: fetchHotVenues,
    enabled: activeTab === 0, // Fetch only if 'Hot' tab is active
  });

  // Fetch all venues
  const {
    data: venues,
    isLoading: isLoadingVenues,
    isError: isErrorVenues,
    error: venuesError,
  } = useQuery<Venue[]>({
    queryKey: ["venues"],
    queryFn: fetchVenues,
    enabled: activeTab === 1, // Fetch only if 'All' tab is active
  });

  const isLoading = activeTab === 0 ? isLoadingHotVenues : isLoadingVenues;
  const isError = activeTab === 0 ? isErrorHotVenues : isErrorVenues;
  const error = activeTab === 0 ? hotVenuesError : venuesError;
  const data = activeTab === 0 ? hotVenues : venues;

  const refreshList = () => {
    console.log("Invalidating and refetching venues...");
    queryClient.invalidateQueries({ queryKey: ["venues"] });
  };

  if (isLoading) {
    return <p>Loading {activeTab === 0 ? "hot venues" : "venues"}...</p>;
  }

  if (isError) {
    return <p>Failed to load {activeTab === 0 ? "hot venues" : "venues"}: {error?.message}. Please try again later.</p>;
  }

  if (!data || data.length === 0) {
    return <p>No {activeTab === 0 ? "hot venues" : "venues"} available.</p>;
  }

  return (
    <div className="container my-5">
      {/* Main Toggle Buttons */}
      <div className="flex justify-center mb-4">
        <div className="relative w-1/2 flex items-center">
          <button
            className={`flex-1 py-2 ${activeTab === 0 ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} rounded-l-md`}
            onClick={() => {
              setActiveTab(0);
            }}
          >
            Hot Venues
          </button>
          <button
            className={`flex-1 py-2 ${activeTab === 1 ? "bg-blue-500 text-white" : "bg-gray-300 text-black"} rounded-md`}
            onClick={() => {
              setActiveTab(1);
            }}
          >
            All Venues
          </button>
        </div>
      </div>

      {/* Display Venues */}
      <div className="grid md:grid-cols-2 gap-8">
        {data.map((venue) => (
          <VVCard key={venue.id} venue={venue} refreshList={refreshList} />
        ))}
      </div>
    </div>
  );
}

export default VVlist;
