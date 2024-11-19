import { Venue } from "@/utils/types"; // Assuming this is your Venue type
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

function VVCard({ Venue }: { Venue: Venue }) {
  return (
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
          <CardTitle className="text-xl font-semibold">
            {Venue.name}
          </CardTitle>
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
          <Link href={`/venues/${Venue.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default VVCard;
