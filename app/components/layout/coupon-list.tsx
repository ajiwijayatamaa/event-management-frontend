import { Calendar, Ticket } from "lucide-react";
import type { Coupon } from "~/schema/profile";

export const CouponList = ({ coupons = [] }: { coupons?: Coupon[] }) => {
  const activeCoupons = coupons.filter((c) => !c.isUsed);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Ticket className="h-6 w-6 stroke-[3px]" />
        <h3 className="text-3xl font-black uppercase font-impact italic tracking-tight">
          Voucher Vault
        </h3>
      </div>

      {/* Container dengan Scroll jika kupon terlalu banyak */}
      <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-[#1a1a1a]">
        {activeCoupons.length > 0 ? (
          activeCoupons.map((c) => (
            <div
              key={c.id}
              className="flex border-4 border-[#1a1a1a] bg-white shadow-[4px_4px_0px_0px_rgba(26,26,26,1)] group hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(26,26,26,1)] transition-all"
            >
              {/* Bagian Diskon (Kiri) */}
              <div className="bg-[#ffeb3b] w-16 p-2 border-r-4 border-dashed border-[#1a1a1a] flex items-center justify-center">
                <span className="font-impact text-2xl -rotate-90 whitespace-nowrap">
                  {Math.floor(Number(c.discountRate))}%
                </span>
              </div>

              {/* Bagian Info (Kanan) */}
              <div className="p-3 flex-1 min-w-0">
                <p className="font-black font-mono uppercase text-sm truncate bg-[#1a1a1a] text-white px-2 py-1 mb-2">
                  {c.couponCode}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] font-black font-mono opacity-70">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    EXP:{" "}
                    {new Date(c.expiredAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="border-4 border-dashed border-[#1a1a1a]/20 p-8 text-center">
            <p className="font-mono font-bold uppercase opacity-30">
              No Vouchers
            </p>
          </div>
        )}
      </div>

      {activeCoupons.length > 0 && (
        <div className="bg-[#1a1a1a] text-[#ffeb3b] text-[10px] font-bold p-1 text-center uppercase italic">
          {activeCoupons.length} Active Rewards
        </div>
      )}
    </div>
  );
};
