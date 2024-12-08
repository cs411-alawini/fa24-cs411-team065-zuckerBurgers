import { useState } from "react";
import { Venue } from "@/utils/types";
import VVDialog from "./VVDialog";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRole } from "@/app/RoleProvider"; // Import role context or hook

function VVCard({ venue }: { venue: Venue }) {
  const { role } = useRole(); // Get the user's role
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [venueData, setVenueData] = useState({ ...venue });

  console.log("Role in VendorVenueCard:", role); // Debug role
  console.log("Venue in VendorVenueCard:", venue); // Debug venue

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVenueData({ ...venueData, [e.target.name]: e.target.value });
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
    <VVDialog venue={venue} role={role}>
      <div>
        <Card className="bg-muted hover:shadow-lg transition-shadow cursor-pointer">
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
                <Button size="sm" variant="outline" onClick={() => setIsEditModalOpen(true)}>
                  Edit Venue
                </Button>
                <Button size="sm" variant="destructive" onClick={handleDelete}>
                  Delete Venue
                </Button>
              </>
            )}
            {role === "event-host" && (
              <Button size="sm" variant="default">
                Negotiate
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Venue</h2>
            <form onSubmit={handleSaveChanges}>
              <div className="mb-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={venueData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={venueData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="max_capacity">Max Capacity</Label>
                <Input
                  id="max_capacity"
                  name="max_capacity"
                  type="number"
                  value={venueData.max_capacity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </VVDialog>
  );
}

export default VVCard;
