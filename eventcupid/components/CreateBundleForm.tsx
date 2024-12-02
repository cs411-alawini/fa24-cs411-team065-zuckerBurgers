// CreateBundleForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomFormField, CustomFormMultiSelect } from "./FormComponent";

// Schema based on MD file requirements
const createBundleSchema = z.object({
  bundlePrice: z.string().min(1, { message: "Bundle price is required" }),
  services: z
    .array(z.string())
    .min(1, { message: "At least one service is required" }),
});

type CreateBundleType = z.infer<typeof createBundleSchema>;

function CreateBundleForm() {
  const form = useForm<CreateBundleType>({
    resolver: zodResolver(createBundleSchema),
    defaultValues: {
      bundlePrice: "",
      services: [],
    },
  });

  function onSubmit(values: CreateBundleType) {
    console.log(values);
  }

  // Example services - in real app, these would come from the Services table
  const availableServices = [
    "Wedding Photography",
    "Event Catering",
    "Sound System",
    "Decoration Setup",
    "Lighting Installation",
    "Wedding Cake",
    "DJ Services",
    "Video Recording",
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-muted p-8 rounded"
      >
        <h2 className="font-semibold text-4xl mb-6">Create Service Bundle</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <CustomFormField
            name="bundlePrice"
            control={form.control}
            labelText="Bundle Price"
            type="number"
          />
          <CustomFormMultiSelect
            name="services"
            control={form.control}
            labelText="Select Services"
            items={availableServices}
          />
        </div>
        <Button type="submit" className="mt-4">
          Create Bundle
        </Button>
      </form>
    </Form>
  );
}

export default CreateBundleForm;
