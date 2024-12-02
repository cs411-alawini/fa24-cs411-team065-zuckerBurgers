// components/Negotiate/NegotiatePage.tsx
"use client";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface NegotiationItem {
  id: string;
  type: "venue" | "vendor";
  name: string;
  price: number;
  status: "pending" | "accepted" | "rejected";
  message: string;
}

const mockNegotiations: NegotiationItem[] = [
  {
    id: "1",
    type: "venue",
    name: "Grand Ballroom",
    price: 5000,
    status: "pending",
    message: "Can we negotiate the price for a winter wedding?",
  },
  {
    id: "2",
    type: "vendor",
    name: "Elite Catering",
    price: 2000,
    status: "accepted",
    message: "Package deal for 200 guests",
  },
];

function NegotiatePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Negotiations</h1>
      <div className="grid gap-4">
        {mockNegotiations.map((item) => (
          <div
            key={item.id}
            className="bg-muted p-6 rounded-lg flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <Badge>{item.type}</Badge>
                <Badge
                  variant={
                    item.status === "pending"
                      ? "outline"
                      : item.status === "accepted"
                      ? "default"
                      : "destructive"
                  }
                >
                  {item.status}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-2">{item.message}</p>
              <p className="font-medium">Proposed Price: ${item.price}</p>
            </div>
            {item.status === "pending" && (
              <div className="flex gap-2">
                <Button variant="default">Accept</Button>
                <Button variant="outline">Counter</Button>
                <Button variant="destructive">Reject</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NegotiatePage;
