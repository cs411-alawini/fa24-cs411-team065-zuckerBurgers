"use client";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function FilterForm() {
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission with selected filters
  };

  return (
    <form
      className="bg-muted mb-16 p-8 grid gap-4 rounded-lg sm:grid-cols-2 md:grid-cols-3"
      onSubmit={handleSubmit}
    >
      {/* Search Input */}
      <Input type="text" placeholder="Search Vendors" name="search" />

      {/* Service Category Select */}
      <Select name="serviceCategory">
        <SelectTrigger>
          <SelectValue placeholder="Select Service Category" />
        </SelectTrigger>
        <SelectContent>
          {["Venue", "Catering", "Photography", "Decoration"].map(
            (category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            )
          )}
        </SelectContent>
      </Select>

      {/* Location Input */}
      <Input type="text" placeholder="Location" name="location" />

      {/* Date Input */}
      <Input type="date" name="date" placeholder="Select Date" />

      {/* Price Range Input */}
      <div className="col-span-full">
        <label htmlFor="priceRange" className="block text-sm font-medium mb-2">
          Price Range (${priceRange[0]} - ${priceRange[1]})
        </label>
        <div className="flex space-x-2">
          <Input
            type="number"
            name="minPrice"
            placeholder="Min Price"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
          />
          <Input
            type="number"
            name="maxPrice"
            placeholder="Max Price"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
          />
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="col-span-full sm:col-span-2 md:col-span-1"
      >
        Search
      </Button>
    </form>
  );
}

export default FilterForm;
