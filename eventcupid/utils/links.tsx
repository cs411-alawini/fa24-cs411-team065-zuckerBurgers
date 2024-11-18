import { AreaChart, Layers, AppWindow } from "lucide-react";

type NavLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

const links: NavLink[] = [
  {
    href: "/postEvent",
    label: "post event",
    icon: <Layers />,
  },
  {
    href: "/searchVendorVenues",
    label: "Search Vendors",
    icon: <AppWindow />,
  },
  {
    href: "/Negotiate",
    label: "Negotiate",
    icon: <AreaChart />,
  },
];

export default links;
