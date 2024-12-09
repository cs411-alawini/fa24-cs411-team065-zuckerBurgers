"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Venue } from "@/utils/types";
import { Button } from "../ui/button";

interface VVDialogProps {
  venue: Venue;
  role: string | null;
  children: React.ReactNode;
  isOpen: boolean; // Add isOpen prop
  onClose: () => void; // Add onClose callback
}

function VVDialog({ venue, role, children, isOpen, onClose }: VVDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <div>{children}</div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{venue.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <img
            src={`https://www.course-api.com/images/tours/tour-1.jpeg`}
            alt={venue.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          <div>
            <h3>Details</h3>
            <p>Address: {venue.address}</p>
            <p>Max Capacity: {venue.max_capacity}</p>
          </div>
          {role === "event-host" && (
            <div className="flex justify-end">
              <Button variant="default">Contact</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default VVDialog;
