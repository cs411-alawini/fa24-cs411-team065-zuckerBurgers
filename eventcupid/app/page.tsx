// app/page.tsx
"use client";

import Image from "next/image";
import Logo from "../assets/logo.svg";
import LandingImg from "../assets/main.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRole } from "@/app/RoleProvider";
import { useRouter } from "next/navigation";

export default function Home() {
  const { setRole } = useRole();
  const router = useRouter();

  const handleStart = (role: "event-host" | "venue" | "vendor") => {
    setRole(role);
    router.push("/dashboard");
  };
  const { role } = useRole();
  console.log("Current role:", role); // Debug log

  return (
    <main className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen text-white">
      <header className="max-w-6xl mx-auto px-4 sm:px-8 py-6 flex justify-between items-center">
        <Image src={Logo} alt="logo" className="w-32 h-auto" />
      </header>
      <section className="max-w-6xl mx-auto px-4 sm:px-8 h-screen -mt-20 grid lg:grid-cols-[1fr,400px] items-center">
        <div>
          <a>
            <h1 className="capitalize text-4xl md:text-7xl font-bold leading-tight">
              Event <span className="text-yellow-300">Cupid</span>
            </h1>
            <p className="leading-loose max-w-md mt-4 text-lg">
              An application designed to simplify the event planning process by
              efficiently connecting event organizers with ideal venues and
              vendors.
            </p>
            <Button
              asChild
              className="mt-6 px-6 py-3 text-lg font-semibold bg-yellow-300 text-black hover:bg-yellow-400"
              onClick={() => handleStart("event-host")}
            >
              <Link href="/postEvent">Start As Event Host</Link>
            </Button>
            <br />
            <Button
              asChild
              className="mt-6 px-6 py-3 text-lg font-semibold bg-yellow-300 text-black hover:bg-yellow-400"
              onClick={() => handleStart("venue")}
            >
              <Link href="/postVenue">Start As Venue</Link>
            </Button>
            <br />
            <Button
              asChild
              className="mt-6 px-6 py-3 text-lg font-semibold bg-yellow-300 text-black hover:bg-yellow-400"
              onClick={() => handleStart("vendor")}
            >
              <Link href="/postVendor">Start As Vendor</Link>
            </Button>
          </a>
        </div>
        <Image
          src={LandingImg}
          alt="landing"
          className="hidden lg:block w-full h-auto"
        />
      </section>
    </main>
  );
}
