// types.ts
import { z } from 'zod';

export type EventType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  clerkId: string;
  eventType: string;
  budgetRange: string;
  requiredServices: string[];
  location: string;
  date: Date;
};

export type VendorVenueType = {
  id: string;
  name: string;
  location: string;
  serviceCategory: string;
  pricing: number;
  ratings: number;
  reviews: string[];
};


export enum EventTypes {
  Wedding = 'wedding',
  Conference = 'conference',
  Birthday = 'birthday',
  // Add more event types as needed
}

export const createEventSchema = z.object({
  eventType: z.nativeEnum(EventTypes, {
    errorMap: () => ({ message: 'Select a valid event type.' }),
  }),
  budgetRange: z.string().nonempty('Budget range is required.'),
  requiredServices: z.array(z.string()).nonempty('Select at least one service.'),
  location: z.string().min(2, 'Location must be at least 2 characters.'),
  date: z.string().nonempty('Date is required.'),
});

export type CreateEventType = z.infer<typeof createEventSchema>;

// utils/types.ts
export interface ServiceType {
  id: string;
  name: string;
  price: number;
  vendorId: string;
  bundleId: string | null;
  serviceCategory: string;
  description: string;
}


export interface Venue {
  id: number;
  manager_id: number;
  name: string;
  address: string;
  max_capacity: number;
}

// utils/types.ts

export interface User {
  UserID: number;
  Username: string;
  Email: string;
  PhoneNumber: string;
  UserType: 'Organizer' | 'Manager';
}

// utils/types.ts

export interface User {
  UserID: number;
  Username: string;
  Email: string;
  PhoneNumber: string;
  UserType: 'Organizer' | 'Manager';
}
