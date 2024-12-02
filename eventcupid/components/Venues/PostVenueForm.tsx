// components/Venues/PostVenueForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "../FormComponent";

const postVenueSchema = z.object({
  venueName: z.string().min(1, "Venue name is required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.string().min(1, "Capacity is required"),
  pricing: z.string().min(1, "Pricing is required"),
  description: z.string().min(1, "Description is required"),
  amenities: z.string().min(1, "Amenities are required"),
});

type PostVenueType = z.infer<typeof postVenueSchema>;

function PostVenueForm() {
  const form = useForm<PostVenueType>({
    resolver: zodResolver(postVenueSchema),
  });

  return (
    <Form {...form}>
      <form className="bg-muted p-8 rounded">
        <h2 className="font-semibold text-4xl mb-6">Post a Venue</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <CustomFormField
            name="venueName"
            control={form.control}
            labelText="Venue Name"
          />
          <CustomFormField
            name="location"
            control={form.control}
            labelText="Location"
          />
          <CustomFormField
            name="capacity"
            control={form.control}
            labelText="Capacity"
            type="number"
          />
          <CustomFormField
            name="pricing"
            control={form.control}
            labelText="Pricing"
            type="number"
          />
          <CustomFormField
            name="description"
            control={form.control}
            labelText="Description"
          />
          <CustomFormField
            name="amenities"
            control={form.control}
            labelText="Amenities"
          />
        </div>
        <Button type="submit" className="mt-4">
          Post Venue
        </Button>
      </form>
    </Form>
  );
}
export default PostVenueForm;
