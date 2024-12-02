"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlignLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useRole } from "@/app/RoleProvider";
import { EventHostLinks, VenueLinks, VendorLinks } from "@/utils/links";

import Link from "next/link";
function DropdownLinks() {
  const { role } = useRole();

  let links: { href: string; label: string; icon: React.ReactNode }[] = [];
  if (role === "event-host") {
    links = EventHostLinks;
  } else if (role === "venue") {
    links = VenueLinks;
  } else if (role === "vendor") {
    links = VendorLinks;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="lg:hidden">
        <Button variant="outline" size="icon">
          <AlignLeft />
          <span className="sr-only">Toggle links</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-52 lg:hidden "
        align="start"
        sideOffset={25}
      >
        {links.map((link) => {
          return (
            <DropdownMenuItem key={link.href}>
              <Link href={link.href} className="flex items-center gap-x-2 ">
                {link.icon} <span className="capitalize">{link.label}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export default DropdownLinks;
