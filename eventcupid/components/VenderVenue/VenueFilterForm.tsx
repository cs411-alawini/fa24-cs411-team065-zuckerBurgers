"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// Define Venue type for better type checking
interface Venue {
  venue_id: number;
  manager_id: number;
  venue_name: string;
  address: string;
  max_capacity: number;
}

// Define the structure of the API response
interface VenueResponse {
  message: string;
  venue: Venue;
}

// Fetch function to get venue details based on venueId
const fetchVenueById = async (venueId: number): Promise<VenueResponse> => {
  const response = await fetch(`http://127.0.0.1:5000/venues/${venueId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch venue details");
  }
  return response.json();
};

function VenueSearch() {
  const [venueId, setVenueId] = useState<number | null>(null);
  const [venueDetails, setVenueDetails] = useState<Venue | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (venueId === null) {
      setError("Please enter a valid venue ID.");
      return;
    }

    try {
      // Reset the error before searching
      setError(null);

      // Fetch the venue details based on the provided venueId
      const data = await fetchVenueById(venueId);
      setVenueDetails(data.venue); // Now 'data.venue' is correctly typed
    } catch (err: any) {
      setError(err.message || "Something went wrong while fetching venue details.");
    }
  };

  return (
    <div className="bg-gray-900 text-white py-6 px-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Search for a Venue</h2>
        <form
          className="space-y-6"
          onSubmit={handleSearch}
        >
          {/* Venue ID Input */}
          <div>
            <Input
              type="number"
              placeholder="Enter Venue ID"
              value={venueId ?? ""}
              onChange={(e) => setVenueId(Number(e.target.value))}
              className="bg-gray-700 text-white border border-gray-600 w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Search Venue
            </Button>
          </div>
        </form>

        {/* Display error if any */}
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}

        {/* Display venue details if available */}
        {venueDetails && (
          <div className="mt-8 p-6 bg-gray-700 rounded-md shadow-md">
            <h3 className="text-xl font-bold text-white mb-4">Venue Details</h3>
            <p><strong className="text-indigo-400">Venue Name:</strong> {venueDetails.venue_name}</p>
            <p><strong className="text-indigo-400">Manager ID:</strong> {venueDetails.manager_id}</p>
            <p><strong className="text-indigo-400">Address:</strong> {venueDetails.address}</p>
            <p><strong className="text-indigo-400">Max Capacity:</strong> {venueDetails.max_capacity}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VenueSearch;
