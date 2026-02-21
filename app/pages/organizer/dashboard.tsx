import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import {
  BarChart3,
  Calendar,
  Plus,
  Users,
  TrendingUp,
  LayoutDashboard,
  ArrowUpRight,
} from "lucide-react";
import { Link, redirect } from "react-router";
import OrganizerSidebar from "~/components/layout/organizer-sidebar";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "~/stores/useAuth";
import { useState } from "react";
import useGetStatistics from "~/hooks/api/useGetStatistics";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
  if (user.role !== "ORGANIZER") return redirect("/");
};

// Config warna chart disesuaikan ke Orange-500
const chartConfig = {
  revenue: {
    label: "Pendapatan",
    color: "#f97316", // Orange-500
  },
};

const Dashboard = () => {
  const [period, setPeriod] = useState<"year" | "month" | "day">("month");
  const { data, isPending, isError } = useGetStatistics(period);

  return (
    <div className="flex min-h-screen bg-zinc-50/50">
      <OrganizerSidebar />

      <main className="flex-1 p-6 lg:p-10">
        {/* HEADER DASHBOARD */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <LayoutDashboard className="w-4 h-4 text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                Statistik Panel
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic">
              Dashboard <span className="text-orange-500">Organizer</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium mt-1">
              Kelola event Anda dan pantau performa penjualan secara real-time.
            </p>
          </div>

          <Button
            asChild
            className="bg-zinc-900 hover:bg-black text-white rounded-xl h-12 px-6 shadow-xl shadow-zinc-200 transition-all active:scale-95 font-bold uppercase text-xs tracking-widest"
          >
            <Link to="/organizer/events/create">
              <Plus className="mr-2 h-4 w-4 text-orange-400" /> Buat Event Baru
            </Link>
          </Button>
        </div>

        {/* STATS CARDS - Menggunakan style semi-ticket */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          {[
            {
              title: "Event Aktif",
              value: data?.summary.activeEvents,
              icon: Calendar,
              suffix: "Event",
            },
            {
              title: "Tiket Terjual",
              value: data?.summary.totalTicketsSold,
              icon: Users,
              suffix: "Tiket",
            },
            {
              title: "Total Pendapatan",
              value: data?.summary.totalRevenue,
              icon: TrendingUp,
              isCurrency: true,
            },
          ].map((stat, i) => (
            <Card
              key={i}
              className="border-none shadow-sm bg-white rounded-[2rem] overflow-hidden relative group"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-zinc-300 group-hover:text-orange-500 transition-colors" />
              </CardHeader>
              <CardContent className="pb-6">
                <div className="text-3xl font-black tracking-tighter text-zinc-900 italic">
                  {isPending
                    ? "..."
                    : stat.isCurrency
                      ? `Rp ${stat.value?.toLocaleString("id-ID")}`
                      : `${stat.value ?? 0} ${stat.suffix ?? ""}`}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ANALYTICS CHART */}
        <Card className="mb-10 border-none shadow-sm bg-white rounded-[2rem] overflow-hidden">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-50 pb-6 pt-8 px-8">
            <CardTitle className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3 text-zinc-900">
              <div className="p-2 bg-orange-50 rounded-lg">
                <BarChart3 className="h-4 w-4 text-orange-600" />
              </div>
              Laporan Penjualan
            </CardTitle>

            <Tabs
              value={period}
              onValueChange={(val) =>
                setPeriod(val as "year" | "month" | "day")
              }
              className="bg-zinc-100 p-1 rounded-xl"
            >
              <TabsList className="bg-transparent h-8 gap-1">
                {["year", "month", "day"].map((p) => (
                  <TabsTrigger
                    key={p}
                    value={p}
                    className="rounded-lg text-[10px] font-bold uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-sm"
                  >
                    {p === "year" ? "Tahun" : p === "month" ? "Bulan" : "Hari"}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-8 pt-10">
            {isPending ? (
              <div className="h-[300px] flex items-center justify-center text-zinc-400 font-bold uppercase text-[10px] tracking-widest animate-pulse">
                Menyusun Data...
              </div>
            ) : isError ? (
              <div className="h-[300px] flex items-center justify-center text-red-400 font-bold uppercase text-[10px] tracking-widest">
                Gagal memuat statistik.
              </div>
            ) : data?.chartData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-zinc-400 font-bold uppercase text-[10px] tracking-widest">
                Belum ada data tersedia.
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart
                  data={data?.chartData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f4f4f5"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#a1a1aa" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fontWeight: 700, fill: "#a1a1aa" }}
                  />
                  <ChartTooltip
                    cursor={{ fill: "#fafafa" }}
                    content={
                      <ChartTooltipContent
                        className="bg-zinc-900 border-none text-white rounded-xl shadow-2xl"
                        formatter={(value) => (
                          <span className="font-black text-orange-400">
                            Rp {Number(value).toLocaleString("id-ID")}
                          </span>
                        )}
                      />
                    }
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#f97316"
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* QUICK ACTIONS / SHORTCUTS */}
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              title: "Manajemen Transaksi",
              desc: "Pantau semua tiket masuk dan status pembayaran.",
              link: "/organizer/transactions",
              label: "Lihat Transaksi",
            },
            {
              title: "Event Saya",
              desc: "Atur jadwal, kuota tiket, dan daftar peserta.",
              link: "/organizer/events",
              label: "Kelola Event",
            },
          ].map((item, idx) => (
            <Card
              key={idx}
              className="border-none shadow-sm bg-white rounded-[2rem] p-4 group"
            >
              <CardHeader>
                <CardTitle className="text-lg font-black italic uppercase tracking-tight text-zinc-900">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-500 font-medium mb-6 leading-relaxed">
                  {item.desc}
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="border-zinc-200 text-zinc-900 font-black uppercase text-[10px] tracking-widest h-11 px-6 rounded-xl hover:bg-zinc-900 hover:text-white transition-all group"
                >
                  <Link to={item.link} className="flex items-center">
                    {item.label}
                    <ArrowUpRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
