import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, CheckCircle2, XCircle } from "lucide-react";
import OrganizerSidebar from "@/components/layout/OrganizerSidebar";

// Mock Data berdasarkan Skema Transaction Prisma kamu
const mockTransactions = [
  {
    id: 1,
    user: { name: "Budi Santoso" },
    event: { name: "Jazz Night 2024" },
    ticketQuantity: 2,
    totalPrice: 500000,
    status: "PENDING",
    paymentProof: "https://placehold.co/400x600?text=Bukti+Transfer",
    createdAt: "2024-03-20T10:00:00Z",
  },
  {
    id: 2,
    user: { name: "Siti Aminah" },
    event: { name: "Tech Workshop" },
    ticketQuantity: 1,
    totalPrice: 0,
    status: "PAID",
    paymentProof: null,
    createdAt: "2024-03-19T14:30:00Z",
  },
];

const TransactionManagement = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <OrganizerSidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              Manage and verify participant payments.
            </p>
          </div>
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.user.name}</TableCell>
                  <TableCell>{tx.event.name}</TableCell>
                  <TableCell>{tx.ticketQuantity}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(tx.totalPrice)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tx.status === "PAID"
                          ? "success"
                          : tx.status === "PENDING"
                            ? "warning"
                            : "destructive"
                      }
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" /> View Proof
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-green-600 cursor-pointer">
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive cursor-pointer">
                          <XCircle className="mr-2 h-4 w-4" /> Reject
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default TransactionManagement;
