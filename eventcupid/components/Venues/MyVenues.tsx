"use client";



import { useState, useEffect } from "react";

import { Venue } from "@/utils/types";

import VVCard from "../VenderVenue/VenderVenueCard";



// Define props for MyVenues

type MyVenuesProps = {

  refreshTrigger: boolean; // Prop to trigger re-fetching of venues

};



function MyVenues({ refreshTrigger }: MyVenuesProps) {

  const [venues, setVenues] = useState<Venue[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);



  const fetchVenues = async () => {

    setLoading(true);

    setError(null); // Clear any previous errors



    // Retrieve the user_id from localStorage

    const userId = localStorage.getItem("user_id");



    if (!userId) {

      setError("User ID not found. Please log in again.");

      setLoading(false);

      return;

    }



    try {

      // Fetch venues for the current user

      const response = await fetch(`http://127.0.0.1:5000/venues/${userId}/all`);

      if (response.ok) {

        const data = await response.json();

        setVenues(data.venues || []); // Set the venues

      } else {

        const errorData = await response.json();

        setError(errorData.message || "Failed to fetch venues.");

      }

    } catch (error) {

      console.error("Error fetching venues:", error);

      setError("An unexpected error occurred. Please try again.");

    } finally {

      setLoading(false);

    }

  };



  // Fetch venues when the component mounts or when refreshTrigger changes
  useEffect(() => {
    fetchVenues();
  }, [refreshTrigger]); // Dependency on refreshTrigger

  // Refresh the list manually after editing
  const refreshList = () => {
    fetchVenues();
  };

  return (

    <div className="mt-8 max-w-6xl mx-auto">

      <h2 className="text-2xl font-semibold mb-6">My Venues</h2>



      {/* Show loading state */}

      {loading && <p>Loading venues...</p>}



      {/* Show error message */}

      {error && <p className="text-red-500">{error}</p>}



      {/* Show venues */}

      {!loading && !error && venues.length === 0 && (

        <p className="text-gray-500">No venues found. Add a new venue above!</p>

      )}

      {!loading && venues.length > 0 && (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {venues.map((venue) => (

          <VVCard key={venue.id} venue={venue} refreshList={refreshList} />

          ))}

        </div>

      )}

    </div>

  );

}



export default MyVenues;