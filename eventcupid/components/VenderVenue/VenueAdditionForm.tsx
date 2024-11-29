"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

function VenueAdditionForm() {
  const [formData, setFormData] = useState({
    managerId: "",
    name: "",
    address: "",
    maxCapacity: "",
  });

  const [statusMessage, setStatusMessage] = useState<string | null>(null); // State to hold success or error message

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(`Field ${name} updated to: ${value}`); // Log when input fields are updated
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");

    // Log form data before sending request
    console.log("Form Data:", formData);

    // Validate data before sending it
    if (!formData.managerId || !formData.name || !formData.address || !formData.maxCapacity) {
      console.error("Error: Missing required fields");
      setStatusMessage("Please fill in all required fields.");
      return;
    }

    try {
      console.log("Sending request to the server...");
      const response = await fetch("http://127.0.0.1:5000/venues/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manager_id: parseInt(formData.managerId, 10),
          name: formData.name,
          address: formData.address,
          max_capacity: parseInt(formData.maxCapacity, 10),
        }),
      });

      console.log("Request sent. Response Status:", response.status); // Log status code

      if (response.ok) {
        console.log("Venue added successfully!");
        setFormData({
          managerId: "",
          name: "",
          address: "",
          maxCapacity: "",
        });
        setStatusMessage("Venue added successfully!"); // Success message
      } else {
        const errorData = await response.json();
        console.error("Error: ", errorData.message || "Failed to add venue.");
        setStatusMessage(errorData.message || "Failed to add venue."); // Error message
      }
    } catch (error) {
      console.error("An error occurred during the request: ", error);
      setStatusMessage("An unexpected error occurred. Please try again."); // Error message
    }
  };

  return (
    <div className="bg-gray-900 text-white py-6 px-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Add New Venue</h2>
        <form
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Manager ID Input */}
          <Input
            type="number"
            placeholder="Manager ID"
            name="managerId"
            value={formData.managerId}
            onChange={handleChange}
            required
            className="bg-gray-700 text-white border border-gray-600 w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Venue Name Input */}
          <Input
            type="text"
            placeholder="Venue Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-gray-700 text-white border border-gray-600 w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Address Input */}
          <Input
            type="text"
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="bg-gray-700 text-white border border-gray-600 w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Max Capacity Input */}
          <Input
            type="number"
            placeholder="Max Capacity"
            name="maxCapacity"
            value={formData.maxCapacity}
            onChange={handleChange}
            required
            className="bg-gray-700 text-white border border-gray-600 w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add Venue
          </Button>
        </form>

        {/* Display status message */}
        {statusMessage && (
          <div
            className={`mt-6 p-4 rounded-md ${
              statusMessage.includes("success") ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            <p className="text-center">{statusMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VenueAdditionForm;
