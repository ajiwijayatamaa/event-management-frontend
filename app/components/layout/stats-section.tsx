import { Coins, Ticket } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";

interface StatsProps {
  // Pastikan strukturnya sesuai dengan ProfileData (Optional array)
  points?: { remainingAmount: number }[] | null;
  couponCount: number;
}

export const StatsSection = ({ points = [], couponCount }: StatsProps) => {
  // Tambahkan safety check ?. jika points ternyata null
  const totalBalance = (points || []).reduce(
    (acc, curr) => acc + curr.remainingAmount,
    0,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      {/* Total Balance Card */}
      <Card className="h-full border-8 border-[#1a1a1a] bg-[#ffeb3b] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="font-mono font-black text-xs uppercase opacity-70">
              Total Balance
            </p>
            <h3 className="text-5xl font-black font-impact">
              {totalBalance.toLocaleString()}
            </h3>
          </div>
          <div className="bg-[#1a1a1a] p-2 rounded-full">
            <Coins className="h-8 w-8 text-[#ffeb3b]" />
          </div>
        </CardContent>
      </Card>

      {/* Active Coupons Card */}
      <Card className="border-8 border-[#1a1a1a] bg-[#ff6b35] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] text-white">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="font-mono font-black text-xs uppercase opacity-70 text-white">
              Active Coupons
            </p>
            <h3 className="text-5xl font-black font-impact text-white">
              {couponCount}
            </h3>
          </div>
          <div className="bg-white p-2 rounded-full">
            <Ticket className="h-8 w-8 text-[#ff6b35]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
