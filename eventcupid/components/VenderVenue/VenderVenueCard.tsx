import { VendorVenueType } from "@/utils/types";
import {
  MapPin,
  Briefcase,
  CalendarDays,
  RadioTower,
  Star,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import VVInfo from "./VenderVenueInfo";
import SaveBtn from "./SaveBtn";
import { Badge } from "lucide-react";
function VVCard({ VendorVenue }: { VendorVenue: VendorVenueType }) {
  return (
    <Card className="bg-muted">
      <CardHeader>
        <img
          src={`https://www.course-api.com/images/tours/tour-1.jpeg`} // Replace with actual image path
          alt={VendorVenue.name}
          className="w-full h-48 object-cover rounded-t"
        />
      </CardHeader>
      <CardContent className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xl font-semibold">
            {VendorVenue.name}
          </CardTitle>
        </div>
        <CardDescription className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="w-4 h-4 mr-1" /> {VendorVenue.location}
        </CardDescription>
        <div className="flex items-center mb-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.round(VendorVenue.ratings)
                  ? "text-yellow-500"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-2">
            {VendorVenue.ratings} ({VendorVenue.reviews.length} reviews)
          </span>
        </div>
        <div className="text-lg font-semibold">
          ${VendorVenue.pricing.toLocaleString()}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-4">
        <Button asChild size="sm">
          <Link href={`/searchVendorVenues/${VendorVenue.id}`}>More</Link>
        </Button>
        <SaveBtn />
        {/* <SaveBtn /> */}
      </CardFooter>
    </Card>
  );
}
export default VVCard;
