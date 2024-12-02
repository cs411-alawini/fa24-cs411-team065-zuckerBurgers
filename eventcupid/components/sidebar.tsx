// components/Sidebar.tsx
"use client";
import Logo from "@/assets/logo.svg";
import { useRole } from "@/app/RoleProvider";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { EventHostLinks, VenueLinks, VendorLinks } from "@/utils/links";

function Sidebar() {
  const pathname = usePathname();
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
    <aside className="py-4 px-8 bg-muted h-full">
      <Link href="/" className="flex items-center gap-x-2">
        <Image src={Logo} alt="logo" className="mx-auto" />
      </Link>
      <div className="flex flex-col mt-20 gap-y-4">
        {links.map((link) => (
          <Button
            asChild
            key={link.href}
            variant={pathname === link.href ? "default" : "link"}
          >
            <Link href={link.href} className="flex items-center gap-x-2">
              {link.icon}
              <span className="capitalize">{link.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
