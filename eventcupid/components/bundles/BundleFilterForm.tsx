// components/Bundles/BundleFilterForm.tsx
"use client";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function BundleFilterForm() {
  return (
    <form className="bg-muted mb-16 p-8 grid gap-4 rounded-lg sm:grid-cols-2 md:grid-cols-3">
      <Input type="text" placeholder="Search Services" name="search" />

      <Select name="serviceCategory">
        <SelectTrigger>
          <SelectValue placeholder="Service Category" />
        </SelectTrigger>
        <SelectContent>
          {["Photography", "Catering", "Decoration", "Entertainment"].map(
            (category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>

      <Input type="number" placeholder="Bundle Price" name="bundlePrice" />

      <Button type="submit" className="col-span-full">
        Create Bundle
      </Button>
    </form>
  );
}

export default BundleFilterForm;
