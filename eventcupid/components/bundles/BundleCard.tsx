// components/Bundles/BundleCard.tsx
"use client";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ServiceType } from "@/utils/types";

interface BundleCardProps {
  service: ServiceType;
}

function BundleCard({ service }: BundleCardProps) {
  const isBundled = service.bundleId !== null;

  return (
    <article className="bg-muted rounded-lg p-6 hover:shadow-xl transition duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
          <p className="text-muted-foreground mb-4">{service.description}</p>
          <div className="flex gap-4 mb-4">
            <Badge variant="secondary">{service.serviceCategory}</Badge>
            <p className="text-muted-foreground">
              Base Price: ${service.price}
            </p>
          </div>
        </div>
        {isBundled ? (
          <Badge variant="default">In Bundle</Badge>
        ) : (
          <Button variant="outline">Add to Bundle</Button>
        )}
      </div>
    </article>
  );
}

export default BundleCard;
