// components/VenderVenue/VVDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VendorVenueType } from "@/utils/types";
import { MapPin, Star, CalendarDays } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

interface VVDialogProps {
  VendorVenue: VendorVenueType;
  children: React.ReactNode;
}

function VVDialog({ VendorVenue, children }: VVDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {VendorVenue.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Hero Image */}
          <img
            src={`https://www.course-api.com/images/tours/tour-1.jpeg`}
            alt={VendorVenue.name}
            className="w-full h-64 object-cover rounded-lg"
          />

          {/* Main Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{VendorVenue.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>{VendorVenue.serviceCategory}</span>
                </div>
                <div className="text-xl font-semibold">
                  ${VendorVenue.pricing.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Ratings & Reviews */}
            <div>
              <h3 className="font-semibold mb-2">Ratings & Reviews</h3>
              <div className="flex items-center mb-2">
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
                <span className="ml-2">{VendorVenue.ratings}</span>
              </div>
              <div className="space-y-2">
                {VendorVenue.reviews.map((review, index) => (
                  <div key={index} className="text-sm">
                    "{review}"
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline">Contact</Button>
            <Button>Book Now</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VVDialog;
