export interface CreateTransactionPayload {
  eventId: number;
  ticketCount: number;
  voucherId: number | null;
  usePoints: boolean;
  totalPrice: number;
}
