export interface Event {
  id: number;
  organizerId: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  image: string;
  location: string;
  availableSeats: number;
  totalSeats: number;
  startDate: string;
  endDate: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt: string | null;
  organizer: {
    name: string;
  };
}
