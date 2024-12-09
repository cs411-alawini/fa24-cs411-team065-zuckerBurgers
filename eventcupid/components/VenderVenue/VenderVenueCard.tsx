import { useState } from "react";
import { Venue } from "@/utils/types";
import VVDialog from "./VVDialog";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRole } from "@/app/RoleProvider";

function VVCard({ venue, refreshList }: { venue: Venue; refreshList: () => void }) {
  const { role } = useRole();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false); // For Details View
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For Edit View
  const [venueData, setVenueData] = useState({ ...venue });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setVenueData({
      ...venueData,
      [name]: name === "max_capacity" ? parseInt(value, 10) || 0 : value, // Convert max_capacity to a number
    });
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:5000/venues/${venue.id}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(venueData),
      });

      if (response.ok) {
        alert("Venue updated successfully!");
        setIsEditModalOpen(false);
        refreshList(); // Ensure this triggers the refresh
      } else {
        const errorData = await response.json();
        alert(`Failed to update venue: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating venue:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this venue?")) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/venues/${venue.id}/delete`, {
          method: "DELETE",
        });

        if (response.ok) {
          alert("Venue deleted successfully.");
          refreshList(); // Trigger refresh after deletion
        } else {
          alert("Failed to delete venue.");
        }
      } catch (error) {
        console.error("Error deleting venue:", error);
        alert("An unexpected error occurred.");
      }
    }
  };


  return (
    <div>
      {/* Details View Trigger */}
      <VVDialog
        venue={venue}
        role={role}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      >
        <Card
          className="bg-muted hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => setIsDetailsOpen(true)}
        >
          <CardHeader>
            <img
              src={`https://www.course-api.com/images/tours/tour-1.jpeg`}
              alt={venue.name}
              className="w-full h-48 object-cover rounded-t"
            />
          </CardHeader>
          <CardContent>
            <CardTitle>{venue.name}</CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              {venue.address}
            </div>
            <div className="text-lg font-semibold">Max Capacity: {venue.max_capacity}</div>
          </CardContent>
          <CardFooter>
            {role === "venue" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditModalOpen(true);
                  }}
                >
                  Edit Venue
                </Button>
                <Button size="sm" variant="destructive" onClick={handleDelete}>
                  Delete Venue
                </Button>
              </>
            )}
            {role === "event-host" && (
              <Button size="sm" variant="default">
                Details
              </Button>
            )}
          </CardFooter>
        </Card>
      </VVDialog>
      {isEditModalOpen && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Edit Venue</h2>
      <form onSubmit={handleSaveChanges}>
        <div className="mb-4">
          <Label htmlFor="name" className="text-gray-300">Name</Label>
          <Input
            id="name"
            name="name"
            value={venueData.name}
            onChange={handleInputChange}
            className="bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="address" className="text-gray-300">Address</Label>
          <Input
            id="address"
            name="address"
            value={venueData.address}
            onChange={handleInputChange}
            className="bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="max_capacity" className="text-gray-300">Max Capacity</Label>
          <Input
            id="max_capacity"
            name="max_capacity"
            type="number"
            value={venueData.max_capacity}
            onChange={handleInputChange}
            className="bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500 w-full"
            required
          />
        </div>
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsEditModalOpen(false)}
            className="bg-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}

export default VVCard;
