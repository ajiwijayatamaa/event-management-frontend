import { Calendar, Sparkles, Ticket, Tag } from "lucide-react";
import type { Coupon } from "~/schema/profile";

export const CouponList = ({ coupons = [] }: { coupons?: Coupon[] }) => {
  const activeCoupons = coupons.filter((c) => !c.isUsed);

  return (
    <div className="space-y-4 w-full">
      <div className="space-y-3 w-full">
        {activeCoupons.length > 0 ? (
          activeCoupons.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm w-full"
            >
              {/* Top: diskon badge */}
              <div className="bg-neutral-900 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-orange-400 font-bold text-xs tracking-widest uppercase">
                    Discount Coupon
                  </span>
                </div>
                <span className="bg-orange-400 text-neutral-900 font-black text-sm px-3 py-0.5 rounded-full">
                  {Math.floor(Number(c.discountRate))}% OFF
                </span>
              </div>

              {/* Garis perforasi */}
              <div className="relative flex items-center bg-white h-0">
                <div className="absolute -left-3 w-5 h-5 bg-neutral-100 rounded-full border border-neutral-200 z-10" />
                <div className="absolute -right-3 w-5 h-5 bg-neutral-100 rounded-full border border-neutral-200 z-10" />
                <div className="flex-1 border-t-2 border-dashed border-neutral-200 mx-4" />
              </div>

              {/* Bottom: coupon code + expiry */}
              <div className="bg-white px-5 py-4 space-y-3">
                {/* Coupon Code */}
                <div className="bg-neutral-100 rounded-xl px-4 py-3">
                  <p className="text-neutral-400 text-xs uppercase tracking-widest mb-1">
                    Coupon Code
                  </p>
                  <p className="text-neutral-900 font-black text-base tracking-widest font-mono break-all">
                    {c.couponCode}
                  </p>
                </div>

                {/* Expiry */}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-neutral-400 shrink-0" />
                  <span className="text-neutral-400 text-xs">
                    Valid until{" "}
                    <span className="text-neutral-600 font-semibold">
                      {new Date(c.expiredAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-200 p-10 text-center w-full">
            <Ticket className="w-8 h-8 text-neutral-200 mx-auto mb-2" />
            <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest">
              No Vouchers Available
            </p>
          </div>
        )}
      </div>

      {/* Footer count */}
      {activeCoupons.length > 0 && (
        <div className="flex items-center justify-between px-5 py-3 bg-neutral-900 rounded-2xl w-full">
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
