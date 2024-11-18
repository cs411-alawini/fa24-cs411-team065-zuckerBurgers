"use client";
import VVCard from "./VenderVenueCard";
import VVInfo from "./VenderVenueInfo";
import { VendorVenueType } from "@/utils/types";
const VVInfos: VendorVenueType[] = [
  {
    id: "1",
    name: "Grand Ballroom",
    location: "Downtown City Center",
    serviceCategory: "Venue",
    pricing: 5000,
    ratings: 4.5,
    reviews: ["Great venue!", "Excellent service."],
  },
  {
    id: "2",
    name: "Sunset Gardens",
    location: "Hillside Avenue",
    serviceCategory: "Venue",
    pricing: 3000,
    ratings: 4.0,
    reviews: ["Beautiful scenery!", "Loved the ambiance."],
  },
  {
    id: "3",
    name: "Elite Catering",
    location: "West Street",
    serviceCategory: "Catering",
    pricing: 2000,
    ratings: 4.8,
    reviews: ["Delicious food!", "Professional staff."],
  },
  // Add more mock data as needed
];
function VVlist() {
  return (
    <>
      <div className="grid md:grid-cols-2  gap-8">
        {VVInfos.map((VV) => {
          return <VVCard key={VV.id} VendorVenue={VV} />;
        })}
      </div>
    </>
  );
}
export default VVlist;
