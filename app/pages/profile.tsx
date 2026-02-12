import { ArrowLeft } from "lucide-react";
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
      <div className="h-screen flex items-center justify-center font-black italic">
        LOADING...
      </div>
    );

  return (
    // Tambahkan font-sans dan antialiased supaya teks lebih tajam
    <div className="min-h-screen bg-[#f5e6d3] antialiased p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex justify-start">
          <Link to="/">
            <button className="group relative inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 font-black uppercase font-mono text-sm border-4 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
              Kembali
            </button>
          </Link>
        </div>

        {/* HEADER*/}
        <ProfileHeader user={user} />

        {/* STATS: Grid 2 Kolom yang Seimbang */}
        <StatsSection
          points={profileData?.points}
          couponCount={
            profileData?.coupons?.filter((c) => !c.isUsed).length || 0
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* KIRI: Konten Utama (Ledger) */}
          <div className="lg:col-span-8 space-y-8">
            <PointHistory points={profileData?.points} />
          </div>

          {/* KANAN: Sidebar (Referral & Coupons) */}
          <div className="lg:col-span-4 space-y-10 sticky top-8">
            <ReferralBox referralCode={user?.referralCode} />
            <CouponList coupons={profileData?.coupons} />
          </div>
        </div>
      </div>
    </div>
  );
}
