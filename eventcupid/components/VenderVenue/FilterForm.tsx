"use client";
import { useState, useMemo } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
function FilterForm() {
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission with selected filters
  };
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [open, setOpen] = useState(false);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: { componentRestrictions: { country: "us" } },
    debounce: 300,
  });

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    setOpen(false);

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setCoordinates({ lat, lng });
    } catch (error) {
      console.error("😱 Error: ", error);
    }
  };

  const mapCenter = useMemo(() => coordinates, [coordinates]);
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

      {/* Location Input */}
      <div className="relative">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Input
              type="text"
              placeholder="Location"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full"
            />
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {status === "OK" &&
                    data.map(({ place_id, description }) => (
                      <CommandItem
                        key={place_id}
                        onSelect={() => handleSelect(description)}
                      >
                        {description}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {coordinates.lat !== 0 && coordinates.lng !== 0 && (
          <div className="mt-2 h-[200px] rounded-md overflow-hidden">
            <LoadScript
              googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            >
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={mapCenter}
                zoom={13}
              >
                <Marker position={coordinates} />
              </GoogleMap>
            </LoadScript>
          </div>
        )}
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
