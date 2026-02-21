import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Receipt,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { redirect } from "react-router";
import OrganizerSidebar from "~/components/layout/organizer-sidebar";
import useGetTransactions from "~/hooks/api/useGetTransactions";
import useAcceptTransaction from "~/hooks/api/useAcceptTransaction";
import useRejectTransaction from "~/hooks/api/useRejectTransaction";
import { useAuth } from "~/stores/useAuth";
import { formatDate, formatPrice } from "~/utils/formatter";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
};

const Transactions = () => {
  const { data, isPending, isError } = useGetTransactions();
  const transactions = data?.data || [];

  const { mutate: acceptTransaction, isPending: isAccepting } =
    useAcceptTransaction();
  const { mutate: rejectTransaction, isPending: isRejecting } =
    useRejectTransaction();

  const totalRevenue = transactions
    .filter((t: any) => t.status === "PAID")
    .reduce((sum: number, t: any) => sum + Number(t.totalPrice), 0);

  const pendingRevenue = transactions
    .filter((t: any) => t.status === "PENDING")
    .reduce((sum: number, t: any) => sum + Number(t.totalPrice), 0);

  const paidCount = transactions.filter((t: any) => t.status === "PAID").length;
  const pendingCount = transactions.filter(
    (t: any) => t.status === "PENDING",
  ).length;

  const handleAccept = (id: number) => {
    acceptTransaction(id);
  };

  const handleReject = (id: number) => {
    rejectTransaction(id);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="flex w-fit items-center gap-1 bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3" /> Diterima
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="flex w-fit items-center gap-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="h-3 w-3" /> Menunggu
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="flex w-fit items-center gap-1 bg-red-100 text-red-700 hover:bg-red-100">
            <XCircle className="h-3 w-3" /> Ditolak
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge className="flex w-fit items-center gap-1 bg-gray-100 text-gray-700 hover:bg-gray-100">
            <Clock className="h-3 w-3" /> Kadaluarsa
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen">
      <OrganizerSidebar />

      <main className="flex-1 bg-background">
        <div className="p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold">Transaksi</h1>
              <p className="text-muted-foreground">
                Lihat dan kelola semua transaksi event kamu
              </p>
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-bold">
                        {formatPrice(totalRevenue)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Pending Revenue
                      </p>
                      <p className="text-2xl font-bold">
                        {formatPrice(pendingRevenue)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Diterima</p>
                      <p className="text-2xl font-bold">{paidCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Menunggu</p>
                      <p className="text-2xl font-bold">{pendingCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabel Transaksi */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  Semua Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isPending && (
                  <div className="py-20 text-center text-muted-foreground animate-pulse">
                    Memuat data transaksi...
                  </div>
                )}

                {isError && (
                  <div className="py-20 text-center text-destructive">
                    Gagal mengambil data transaksi.
                  </div>
                )}

                {!isPending && transactions.length === 0 && (
                  <div className="py-20 text-center text-muted-foreground">
                    Belum ada transaksi.
                  </div>
                )}

                {!isPending && transactions.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border text-left text-sm text-muted-foreground">
                          <th className="pb-3 font-medium">ID</th>
                          <th className="pb-3 font-medium">Customer</th>
                          <th className="pb-3 font-medium">Event</th>
                          <th className="pb-3 font-medium">Tiket</th>
                          <th className="pb-3 font-medium">Total</th>
                          <th className="pb-3 font-medium">Status</th>
                          <th className="pb-3 font-medium">Bukti Bayar</th>
                          <th className="pb-3 font-medium">Tanggal</th>
                          <th className="pb-3 font-medium">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {transactions.map((transaction: any) => (
                          <tr key={transaction.id} className="text-sm">
                            <td className="py-4 font-mono">
                              #{transaction.id}
                            </td>

                            <td className="py-4">
                              <div>
                                <p className="font-medium">
                                  {transaction.user?.name || "-"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {transaction.user?.email}
                                </p>
                              </div>
                            </td>

                            <td className="py-4 font-medium">
                              {transaction.event?.name || "-"}
                            </td>

                            <td className="py-4">
                              {transaction.ticketQuantity}
                            </td>

                            <td className="py-4 font-semibold">
                              {formatPrice(Number(transaction.totalPrice))}
                            </td>

                            <td className="py-4">
                              {getStatusBadge(transaction.status)}
                            </td>

                            <td className="py-4">
                              {transaction.paymentProof ? (
                                <a
                                  href={transaction.paymentProof}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src={transaction.paymentProof}
                                    alt="Bukti Bayar"
                                    className="h-12 w-16 cursor-pointer rounded-md border border-border object-cover transition-opacity hover:opacity-80"
                                  />
                                </a>
                              ) : (
                                <span className="text-xs italic text-muted-foreground">
                                  Belum diupload
                                </span>
                              )}
                            </td>

                            <td className="py-4 text-xs text-muted-foreground">
                              {formatDate(transaction.createdAt)}
                            </td>

                            {/* Aksi */}
                            <td className="py-4">
                              {transaction.status === "PENDING" && (
                                <div className="flex items-center gap-2">
                                  {/* Dialog Accept */}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        className="h-8 bg-green-600 text-white hover:bg-green-700"
                                        disabled={isAccepting || isRejecting}
                                      >
                                        <CheckCircle className="mr-1 h-3 w-3" />
                                        Accept
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Terima Transaksi
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Apakah kamu yakin ingin menerima
                                          transaksi{" "}
                                          <span className="font-semibold text-foreground">
                                            #{transaction.id}
                                          </span>{" "}
                                          dari{" "}
                                          <span className="font-semibold text-foreground">
                                            {transaction.user?.name}
                                          </span>
                                          ? Status akan berubah menjadi{" "}
                                          <span className="font-semibold text-green-600">
                                            Diterima
                                          </span>
                                          .
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Batal
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-green-600 hover:bg-green-700"
                                          onClick={() =>
                                            handleAccept(transaction.id)
                                          }
                                        >
                                          Ya, Terima
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>

                                  {/* Dialog Reject */}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-8 border-red-200 text-red-600 hover:bg-red-50"
                                        disabled={isAccepting || isRejecting}
                                      >
                                        <XCircle className="mr-1 h-3 w-3" />
                                        Reject
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Tolak Transaksi
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Apakah kamu yakin ingin menolak
                                          transaksi{" "}
                                          <span className="font-semibold text-foreground">
                                            #{transaction.id}
                                          </span>{" "}
                                          dari{" "}
                                          <span className="font-semibold text-foreground">
                                            {transaction.user?.name}
                                          </span>
                                          ? Semua poin, voucher, dan kursi akan
                                          dikembalikan.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>
                                          Batal
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-destructive hover:bg-destructive/90"
                                          onClick={() =>
                                            handleReject(transaction.id)
                                          }
                                        >
                                          Ya, Tolak
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Transactions;
