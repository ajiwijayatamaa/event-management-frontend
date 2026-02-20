import { Calendar, Sparkles, Ticket } from "lucide-react";
import type { Coupon } from "~/schema/profile";

export const CouponList = ({ coupons = [] }: { coupons?: Coupon[] }) => {
  const activeCoupons = coupons.filter((c) => !c.isUsed);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Ticket className="w-4 h-4 text-orange-400" />
        <span className="text-orange-400 text-xs font-bold tracking-widest uppercase">
          Voucher Vault
        </span>
      </div>

      {/* List */}
      <div className="max-h-[400px] overflow-y-auto space-y-3 pr-1">
        {activeCoupons.length > 0 ? (
          activeCoupons.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm flex"
            >
              {/* Kiri: diskon */}
              <div className="bg-neutral-900 w-16 flex items-center justify-center shrink-0 relative">
                {/* Notch atas */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-neutral-100 rounded-full border border-neutral-200" />
                {/* Notch bawah */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-neutral-100 rounded-full border border-neutral-200" />
                <span className="text-orange-400 font-bold text-sm -rotate-90 whitespace-nowrap tracking-widest">
                  {Math.floor(Number(c.discountRate))}% OFF
                </span>
              </div>

              {/* Garis perforasi */}
              <div className="w-px border-l-2 border-dashed border-neutral-200 my-3" />

              {/* Kanan: info */}
              <div className="bg-white flex-1 px-4 py-3 min-w-0">
                <p className="text-neutral-900 font-bold text-sm tracking-widest font-mono truncate mb-2">
                  {c.couponCode}
                </p>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-neutral-400" />
                  <span className="text-neutral-400 text-xs">
                    Exp:{" "}
                    {new Date(c.expiredAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-200 p-8 text-center">
            <Ticket className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
            <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest">
              No Vouchers Available
            </p>
          </div>
        )}
      </div>

      {/* Footer count */}
      {activeCoupons.length > 0 && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 rounded-2xl">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-neutral-400 text-xs font-semibold uppercase tracking-widest">
              Active Vouchers
            </span>
          </div>
          <span className="text-orange-400 text-xs font-bold">
            {activeCoupons.length} available
          </span>
        </div>
      )}
    </div>
  );
};
