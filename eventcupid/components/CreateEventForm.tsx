// CreateVendorForm.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createEventSchema, CreateEventType, EventTypes } from "@/utils/types";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import {
  CustomFormField,
  CustomFormSelect,
  CustomFormMultiSelect,
} from "./FormComponent";

function CreateEventForm() {
  const form = useForm<CreateEventType>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      eventType: undefined, // Change this line
      budgetRange: "",
      requiredServices: [],
      location: "",
      date: "",
    },
  });

  function onSubmit(values: CreateEventType) {
    console.log(values);
  }

  const eventTypes = Object.values(EventTypes);
  const services = [
    "Catering",
    "Sound",
    "Lighting",
    "Photography",
    "Decoration",
  ];

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-muted p-8 rounded"
      >
        <h2 className="font-semibold text-4xl mb-6">Post an Event</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <CustomFormSelect
            name="eventType"
            control={form.control}
            labelText="Event Type"
            items={eventTypes}
          />
          <CustomFormField
            name="budgetRange"
            control={form.control}
            labelText="Budget Range"
          />

          <CustomFormField
            name="location"
            control={form.control}
            labelText="Location"
          />
          <CustomFormField
            name="date"
            control={form.control}
            labelText="Date"
          />
          <CustomFormMultiSelect
            name="requiredServices"
            control={form.control}
            labelText="Required Services"
            items={services}
          />
        </div>
        <Button type="submit" className="mt-4">
          Create Event
        </Button>
      </form>
    </Form>
  );
}

export default CreateEventForm;
