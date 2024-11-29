import { useState } from "react";
import { Venue } from "@/utils/types";
import { MapPin } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

function VVCard({ Venue }: { Venue: Venue }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [venueData, setVenueData] = useState({
    name: Venue.name,
    address: Venue.address,
    max_capacity: Venue.max_capacity,
    manager_id: Venue.manager_id,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVenueData({ ...venueData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Ensure max_capacity is an integer
    const updatedVenueData = {
      ...venueData,
      max_capacity: parseInt(venueData.max_capacity as unknown as string, 10),
    };
  
    try {
      const response = await fetch(`http://localhost:5000/venues/${Venue.id}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVenueData),
      });
  
      if (response.ok) {
        alert("Venue updated successfully!");
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        alert(`Failed to update venue: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating venue:", error);
      alert("An unexpected error occurred.");
    }
  };
  
  return (
    <>
      <Card className="bg-muted">
        <CardHeader>
          <img
            src={`https://www.course-api.com/images/tours/tour-1.jpeg`} // Replace with actual image path
            alt={Venue.name}
            className="w-full h-48 object-cover rounded-t"
          />
        </CardHeader>
        <CardContent className="mt-4">
          <div className="mb-2">
            <CardTitle className="text-xl font-semibold">{Venue.name}</CardTitle>
          </div>
          <CardDescription className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="w-4 h-4 mr-1" /> {Venue.address}
          </CardDescription>
          <div className="text-lg font-semibold">
            Max Capacity: {Venue.max_capacity}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between gap-4">
          <Button asChild size="sm">
            <a href={`/venues/${Venue.id}`}>View Details</a>
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsModalOpen(true)}>
            Edit Venue
          </Button>
        </CardFooter>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <div className="bg-black text-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Venue</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label htmlFor="name" className="text-white">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={venueData.name}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="address" className="text-white">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={venueData.address}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="max_capacity" className="text-white">Max Capacity</Label>
                <Input
                  id="max_capacity"
                  name="max_capacity"
                  type="number"
                  value={venueData.max_capacity}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-black"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="manager_id" className="text-white">Manager ID</Label>
                <Input
                  id="manager_id"
                  name="manager_id"
                  value={venueData.manager_id}
                  onChange={handleInputChange}
                  required
                  className="bg-white text-black"
                />
              </div>
              <div className="flex items-center justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white text-black"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-500 hover:bg-blue-700">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default VVCard;
