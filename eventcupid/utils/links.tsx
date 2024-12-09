// utils/links.tsx
import { AreaChart, Layers, AppWindow } from "lucide-react";
import React from "react";

type NavLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export const EventHostLinks: NavLink[] = [
  {
    href: "/postEvent",
    label: "Post Event",
    icon: <Layers />,
  },
  {
    href: "/searchVendorVenues",
    label: "Venues",
    icon: <AppWindow />,
  }
//   {
//     href: "/negotiate",
//     label: "Negotiate",
//     icon: <AreaChart />,
//   },
];

export const VenueLinks: NavLink[] = [
  {
    href: "/postVenue",
    label: "Post Venue",
    icon: <Layers />,
  }
//   {
//     href: "/negotiate",
//     label: "Negotiate",
//     icon: <AreaChart />,
//   },
];

export const VendorLinks: NavLink[] = [
  {
    href: "/postVendor",
    label: "Vendors",
    icon: <Layers />,
  }
//   {
//     href: "/negotiate",
//     label: "Negotiate",
//     icon: <AreaChart />,
//   },
];
