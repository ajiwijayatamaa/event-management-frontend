import { ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router";
import { CouponList } from "~/components/layout/coupon-list";
import { PointHistory } from "~/components/layout/point-history";
import { ProfileHeader } from "~/components/layout/profile-header";
import { ReferralBox } from "~/components/layout/refferalbox";
import { StatsSection } from "~/components/layout/stats-section";
import useProfile from "~/hooks/api/useProfile";
import { useAuth } from "~/stores/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const { data: profileData, isLoading } = useProfile();

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-orange-400 rounded-full animate-spin" />
          <p className="text-neutral-400 text-xs font-semibold uppercase tracking-widest">
            Loading...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-100 antialiased">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-rose-400 to-orange-400" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 space-y-6">
        {/* Back */}
        <Link to="/">
          <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-700 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
        </Link>

        {/* Ticket-style Profile Card */}
        <div className="rounded-3xl overflow-hidden shadow-md border border-neutral-200">
          {/* Ticket Top */}
          <div className="bg-neutral-900 px-6 pt-7 pb-10 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 via-rose-400 to-orange-400" />

            <div className="relative">
              <ProfileHeader user={user} />
            </div>
          </div>

          {/* Perforated line */}
          <div className="relative bg-neutral-100 flex items-center h-0">
            <div className="absolute -left-3 w-6 h-6 bg-neutral-100 rounded-full border border-neutral-200 z-10" />
            <div className="absolute -right-3 w-6 h-6 bg-neutral-100 rounded-full border border-neutral-200 z-10" />
            <div className="flex-1 border-t-2 border-dashed border-neutral-300 mx-5" />
          </div>

          {/* Ticket Bottom: Stats */}
          <div className="bg-white px-6 pt-6 pb-6">
            <div className="flex items-center gap-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-orange-400 text-xs font-bold tracking-widest uppercase">
                Your Stats
              </span>
            </div>
            <StatsSection
              points={profileData?.points}
              couponCount={
                profileData?.coupons?.filter((c) => !c.isUsed).length || 0
              }
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Point History */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="bg-neutral-900 px-6 py-4 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-orange-400 text-xs font-bold tracking-widest uppercase">
                  Point History
                </span>
              </div>
              <div className="p-6">
                <PointHistory points={profileData?.points} />
              </div>
            </div>
          </div>

          {/* Right: Referral + Coupons */}
          <div className="lg:col-span-4 space-y-6 sticky top-6">
            {/* Referral */}
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="bg-neutral-900 px-6 py-4 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-orange-400 text-xs font-bold tracking-widest uppercase">
                  Referral Code
                </span>
              </div>
              <div className="p-6">
                <ReferralBox referralCode={user?.referralCode} />
              </div>
            </div>

            {/* Coupons */}
            <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="bg-neutral-900 px-6 py-4 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-orange-400 text-xs font-bold tracking-widest uppercase">
                  Voucher Vault
                </span>
              </div>
              <div className="p-6">
                <CouponList coupons={profileData?.coupons} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
