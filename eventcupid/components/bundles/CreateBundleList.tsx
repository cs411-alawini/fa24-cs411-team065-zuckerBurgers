// components/Bundles/CreateBundleList.tsx
"use client";

import BundleCard from "./BundleCard";
import { ServiceType } from "@/utils/types";

// Mock data
const availableServices: ServiceType[] = [
  {
    id: "1",
    name: "Premium Photography",
    price: 1000,
    vendorId: "v1",
    bundleId: null,
    serviceCategory: "Photography",
    description: "Professional event photography service",
  },
  {
    id: "2",
    name: "Basic Catering",
    price: 2000,
    vendorId: "v2",
    bundleId: "b1", // Already in a bundle
    serviceCategory: "Catering",
    description: "Standard catering service",
  },
  // Add more mock services
];

function CreateBundleList() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {availableServices.map((service) => (
        <BundleCard key={service.id} service={service} />
      ))}
    </div>
  );
}

export default CreateBundleList;
