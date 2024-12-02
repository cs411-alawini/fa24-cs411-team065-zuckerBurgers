// components/Vendors/PostVendorForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField, CustomFormSelect } from "../FormComponent";
import exp from "constants";

const postVendorSchema = z.object({
  vendorName: z.string().min(1, "Vendor name is required"),
  serviceCategory: z.string().min(1, "Service category is required"),
  location: z.string().min(1, "Location is required"),
  pricing: z.string().min(1, "Pricing is required"),
  description: z.string().min(1, "Description is required"),
});

type PostVendorType = z.infer<typeof postVendorSchema>;

function PostVendorForm() {
  const form = useForm<PostVendorType>({
    resolver: zodResolver(postVendorSchema),
  });

  const serviceCategories = [
    "Catering",
    "Photography",
    "Decoration",
    "Entertainment",
    "Lighting",
    "Sound",
  ];

  return (
    <Form {...form}>
      <form className="bg-muted p-8 rounded">
        <h2 className="font-semibold text-4xl mb-6">Post a Service</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <CustomFormField
            name="vendorName"
            control={form.control}
            labelText="Vendor Name"
          />
          <CustomFormSelect
            name="serviceCategory"
            control={form.control}
            labelText="Service Category"
            items={serviceCategories}
          />
          <CustomFormField
            name="location"
            control={form.control}
            labelText="Location"
          />
          <CustomFormField
            name="pricing"
            control={form.control}
            labelText="Base Pricing"
            type="number"
          />
          <CustomFormField
            name="description"
            control={form.control}
            labelText="Description"
          />
        </div>
        <Button type="submit" className="mt-4">
          Post Service
        </Button>
      </form>
    </Form>
  );
}

export default PostVendorForm;
