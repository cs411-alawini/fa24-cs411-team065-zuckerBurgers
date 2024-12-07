"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";

const venueSchema = z.object({
  managerId: z
    .number()
    .min(1, "Manager ID is required")
    .positive("Manager ID must be a positive number"),
  venueName: z.string().min(1, "Venue name is required"),
  address: z.string().min(1, "Address is required"),
  maxCapacity: z
    .number()
    .min(1, "Max capacity is required")
    .positive("Max capacity must be a positive number"),
});

type VenueFormType = z.infer<typeof venueSchema>;

function PostVenueForm() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VenueFormType>({
    resolver: zodResolver(venueSchema),
  });

  const onSubmit = async (data: VenueFormType) => {
    console.log("Form Data Submitted:", data);

    try {
      const response = await fetch("http://127.0.0.1:5000/venues/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manager_id: data.managerId,
          name: data.venueName,
          address: data.address,
          max_capacity: data.maxCapacity,
        }),
      });

      if (response.ok) {
        setStatusMessage("Venue added successfully!");
        reset(); // Reset form fields on success
      } else {
        const errorData = await response.json();
        setStatusMessage(
          errorData.message || "Failed to add venue. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatusMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Form>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-muted p-8 rounded max-w-4xl mx-auto"
      >
        <h2 className="font-semibold text-4xl mb-6 text-center">Add Venue</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manager ID */}
          <div>
            <label htmlFor="managerId" className="block font-medium mb-2">
              Manager ID
            </label>
            <Input
              id="managerId"
              type="number"
              placeholder="Enter Manager ID"
              {...register("managerId", { valueAsNumber: true })}
              className="w-full"
            />
            {errors.managerId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.managerId.message}
              </p>
            )}
          </div>

          {/* Venue Name */}
          <div>
            <label htmlFor="venueName" className="block font-medium mb-2">
              Venue Name
            </label>
            <Input
              id="venueName"
              type="text"
              placeholder="Enter Venue Name"
              {...register("venueName")}
              className="w-full"
            />
            {errors.venueName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.venueName.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block font-medium mb-2">
              Address
            </label>
            <Input
              id="address"
              type="text"
              placeholder="Enter Venue Address"
              {...register("address")}
              className="w-full"
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Max Capacity */}
          <div>
            <label htmlFor="maxCapacity" className="block font-medium mb-2">
              Max Capacity
            </label>
            <Input
              id="maxCapacity"
              type="number"
              placeholder="Enter Maximum Capacity"
              {...register("maxCapacity", { valueAsNumber: true })}
              className="w-full"
            />
            {errors.maxCapacity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.maxCapacity.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="mt-6 w-full">
          Add Venue
        </Button>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mt-4 p-4 rounded ${
              statusMessage.includes("success") ? "bg-green-500" : "bg-red-500"
            } text-white text-center`}
          >
            {statusMessage}
          </div>
        )}
      </form>
    </Form>
  );
}

export default PostVenueForm;
