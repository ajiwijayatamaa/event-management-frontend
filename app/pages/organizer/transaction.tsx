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
  if (user.role !== "ORGANIZER") return redirect("/");
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "PAID":
      return (
        <Badge className="flex w-fit items-center gap-1 bg-green-100 text-green-700 hover:bg-green-100 font-black uppercase text-[10px] tracking-wider rounded-full">
          <CheckCircle className="h-3 w-3" /> Diterima
        </Badge>
      );
    case "PENDING":
      return (
        <Badge className="flex w-fit items-center gap-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-100 font-black uppercase text-[10px] tracking-wider rounded-full">
          <Clock className="h-3 w-3" /> Menunggu
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge className="flex w-fit items-center gap-1 bg-red-100 text-red-700 hover:bg-red-100 font-black uppercase text-[10px] tracking-wider rounded-full">
          <XCircle className="h-3 w-3" /> Ditolak
        </Badge>
      );
    case "EXPIRED":
      return (
        <Badge className="flex w-fit items-center gap-1 bg-zinc-100 text-zinc-500 hover:bg-zinc-100 font-black uppercase text-[10px] tracking-wider rounded-full">
          <Clock className="h-3 w-3" /> Kadaluarsa
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

const statCards = (
  totalRevenue: number,
  pendingRevenue: number,
  paidCount: number,
  pendingCount: number,
) => [
  {
    label: "Total Revenue",
    value: formatPrice(totalRevenue),
    icon: <DollarSign className="h-5 w-5 text-green-600" />,
    bg: "bg-green-100",
  },
  {
    label: "Pending Revenue",
    value: formatPrice(pendingRevenue),
    icon: <Clock className="h-5 w-5 text-yellow-600" />,
    bg: "bg-yellow-100",
  },
  {
    label: "Diterima",
    value: paidCount,
    icon: <CheckCircle className="h-5 w-5 text-orange-500" />,
    bg: "bg-orange-100",
  },
  {
    label: "Menunggu",
    value: pendingCount,
    icon: <TrendingUp className="h-5 w-5 text-zinc-600" />,
    bg: "bg-zinc-100",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

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

  const handleAccept = (id: number) => acceptTransaction(id);
  const handleReject = (id: number) => rejectTransaction(id);

  return (
    <div className="flex min-h-screen bg-zinc-50/50">
      <OrganizerSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="w-4 h-4 text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  Manajemen Keuangan
                </span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic">
                Semua <span className="text-orange-500">Transaksi</span>
              </h1>
              <p className="text-zinc-500 text-sm font-medium mt-1">
                Lihat dan kelola semua transaksi event kamu.
              </p>
            </div>

            {/* ── Stat Cards ───────────────────────────────────────────── */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statCards(
                totalRevenue,
                pendingRevenue,
                paidCount,
                pendingCount,
              ).map((stat) => (
                <Card
                  key={stat.label}
                  className="border-none shadow-sm rounded-[1.5rem] bg-white overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl ${stat.bg}`}
                      >
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          {stat.label}
                        </p>
                        <p className="text-xl font-black italic tracking-tight text-zinc-900">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ── Transaction Table ─────────────────────────────────────── */}
            <Card className="border-none shadow-sm rounded-[2rem] bg-white overflow-hidden">
              <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
                <CardTitle className="flex items-center gap-3 text-zinc-900 font-black uppercase italic text-lg tracking-tight">
                  <Receipt className="h-5 w-5 text-orange-500" />
                  Daftar Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Loading */}
                {isPending && (
                  <div className="py-24 text-center text-sm font-medium text-zinc-400 animate-pulse">
                    Memuat data transaksi...
                  </div>
                )}

                {/* Error */}
                {isError && (
                  <div className="py-24 text-center text-sm font-bold text-red-500">
                    Gagal mengambil data transaksi.
                  </div>
                )}

                {/* Empty */}
                {!isPending && transactions.length === 0 && (
                  <div className="py-24 text-center text-sm font-medium text-zinc-400">
                    Belum ada transaksi.
                  </div>
                )}

                {/* Table */}
                {!isPending && transactions.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-zinc-100 text-left">
                          <th className="px-8 pb-4 pt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            ID
                          </th>
                          <th className="px-4 pb-4 pt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Customer
                          </th>
                          <th className="px-4 pb-4 pt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Event
                          </th>
                          <th className="px-4 pb-4 pt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Tiket
                          </th>
                          <th className="px-4 pb-4 pt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Total
                          </th>
                          <th className="px-4 pb-4 pt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Status
                          </th>
                          <th className="px-4 pb-4 pt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Bukti
                          </th>
                          <th className="px-4 pb-4 pt-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Tanggal
                          </th>
                          <th className="px-4 pb-4 pt-6 pr-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-50">
                        {transactions.map((transaction: any) => (
                          <tr
                            key={transaction.id}
                            className="text-sm hover:bg-zinc-50/50 transition-colors"
                          >
                            <td className="px-8 py-5">
                              <span className="font-mono text-xs font-bold text-zinc-400">
                                #{transaction.id}
                              </span>
                            </td>

                            <td className="px-4 py-5">
                              <p className="font-bold text-zinc-900 text-sm">
                                {transaction.user?.name || "-"}
                              </p>
                              <p className="text-[11px] text-zinc-400 font-medium">
                                {transaction.user?.email}
                              </p>
                            </td>

                            <td className="px-4 py-5">
                              <p className="font-bold text-zinc-900 text-sm max-w-[160px] truncate">
                                {transaction.event?.name || "-"}
                              </p>
                            </td>

                            <td className="px-4 py-5">
                              <span className="font-black italic text-zinc-700">
                                {transaction.ticketQuantity}
                              </span>
                            </td>

                            <td className="px-4 py-5">
                              <span className="font-black italic text-zinc-900 text-sm">
                                {formatPrice(Number(transaction.totalPrice))}
                              </span>
                            </td>

                            <td className="px-4 py-5">
                              {getStatusBadge(transaction.status)}
                            </td>

                            <td className="px-4 py-5">
                              {transaction.paymentProof ? (
                                <a
                                  href={transaction.paymentProof}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <img
                                    src={transaction.paymentProof}
                                    alt="Bukti Bayar"
                                    className="h-12 w-16 cursor-pointer rounded-xl border border-zinc-100 object-cover transition-opacity hover:opacity-75"
                                  />
                                </a>
                              ) : (
                                <span className="text-[10px] italic font-medium text-zinc-300">
                                  Belum diupload
                                </span>
                              )}
                            </td>

                            <td className="px-4 py-5">
                              <span className="text-[11px] font-medium text-zinc-400">
                                {formatDate(transaction.createdAt)}
                              </span>
                            </td>

                            <td className="px-4 py-5 pr-8">
                              {transaction.status === "PENDING" && (
                                <div className="flex items-center gap-2">
                                  {/* Dialog Accept */}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        className="h-8 rounded-xl bg-zinc-900 text-white hover:bg-black font-black uppercase text-[10px] tracking-wider px-3"
                                        disabled={isAccepting || isRejecting}
                                      >
                                        <CheckCircle className="mr-1 h-3 w-3 text-orange-500" />
                                        Terima
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-2xl">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle className="font-black uppercase italic tracking-tight">
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
                                        <AlertDialogCancel className="rounded-xl">
                                          Batal
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          className="rounded-xl bg-zinc-900 hover:bg-black font-black"
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
                                        className="h-8 rounded-xl border-zinc-200 text-zinc-500 hover:border-red-200 hover:text-red-600 hover:bg-red-50 font-black uppercase text-[10px] tracking-wider px-3 transition-colors"
                                        disabled={isAccepting || isRejecting}
                                      >
                                        <XCircle className="mr-1 h-3 w-3" />
                                        Tolak
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-2xl">
                                      <AlertDialogHeader>
                                        <AlertDialogTitle className="font-black uppercase italic tracking-tight">
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
                                        <AlertDialogCancel className="rounded-xl">
                                          Batal
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          className="rounded-xl bg-destructive hover:bg-destructive/90 font-black"
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
