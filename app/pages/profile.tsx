import {
  ArrowRight,
  Calendar,
  Coins,
  Copy,
  Gift,
  Loader2,
  Settings,
  Ticket,
  Sparkles,
  TrendingUp,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { axiosInstance } from "~/lib/axios";
import { useAuth } from "~/stores/useAuth";

export default function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axiosInstance.get("/users/profile");
        setProfileData(res.data);
      } catch (err) {
        console.error("Gagal mengambil data profil lengkap:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Hitung total poin
  const totalPoints =
    profileData?.points?.reduce(
      (acc: number, curr: any) => acc + curr.remainingAmount,
      0,
    ) || 0;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(user?.referralCode || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-violet-400/30 animate-pulse rounded-full"></div>
            <Loader2 className="relative animate-spin h-12 w-12 text-violet-600 mx-auto" />
          </div>
          <p className="text-sm text-violet-600/80 font-medium animate-pulse">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 py-8 px-4 sm:py-12">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto space-y-6">
        {/* HEADER SECTION - Premium Event Theme */}
        <Card className="overflow-hidden border-0 shadow-2xl bg-white/90 backdrop-blur-md hover:shadow-violet-200/50 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 via-purple-600/5 to-fuchsia-600/5"></div>
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"></div>

          <CardContent className="relative p-6 sm:p-10">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Profile Picture with Ring Animation */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-full blur-md group-hover:blur-lg transition-all duration-300 opacity-75"></div>
                <div className="relative bg-white p-1.5 rounded-full">
                  <img
                    src={
                      user?.profilePicture ||
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=Aji"
                    }
                    alt="Profile"
                    className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover ring-4 ring-white shadow-xl"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white p-2 rounded-full shadow-lg">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left space-y-3">
                <div className="space-y-1">
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                    {user?.name}
                  </h2>
                  <p className="text-gray-600 font-medium flex items-center justify-center lg:justify-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    {user?.email}
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-3">
                  <Button
                    asChild
                    size="sm"
                    className="rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <Link to="/edit-profile">
                      <Settings className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Quick Stats Badge */}
              <div className="lg:ml-auto bg-gradient-to-br from-violet-50 to-purple-50 p-6 rounded-2xl border-2 border-violet-200/50 shadow-inner">
                <div className="text-center space-y-1">
                  <TrendingUp className="h-6 w-6 text-violet-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider">
                    Member Status
                  </p>
                  <p className="text-2xl font-black text-purple-700">Active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* REWARDS OVERVIEW - Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Points Card */}
          <Card className="border-0 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="relative bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>

              <CardContent className="relative pt-8 pb-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <p className="text-sm font-bold opacity-90 uppercase tracking-wider">
                        Total Points
                      </p>
                    </div>
                    <h3 className="text-5xl font-black">
                      {totalPoints.toLocaleString()}
                    </h3>
                    <p className="text-xs opacity-80 font-medium">
                      Available for redemption
                    </p>
                  </div>
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Coins className="h-10 w-10 text-white drop-shadow-lg" />
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Coupons Card */}
          <Card className="border-0 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
            <div className="relative bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>

              <CardContent className="relative pt-8 pb-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <p className="text-sm font-bold opacity-90 uppercase tracking-wider">
                        Active Coupons
                      </p>
                    </div>
                    <h3 className="text-5xl font-black">
                      {profileData?.coupons?.length || 0}
                    </h3>
                    <p className="text-xs opacity-80 font-medium">
                      Ready to use
                    </p>
                  </div>
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Ticket className="h-10 w-10 text-white drop-shadow-lg" />
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* REFERRAL BOX - Premium Design */}
        <Card className="border-2 border-dashed border-violet-300 bg-gradient-to-r from-violet-50/80 to-purple-50/80 backdrop-blur-sm shadow-xl overflow-hidden group hover:shadow-2xl hover:border-violet-400 transition-all duration-500">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500"></div>

          <CardContent className="py-8 px-6 sm:px-10">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Left side - Info */}
              <div className="flex-1 space-y-3 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm">
                  <Gift className="h-5 w-5 text-violet-600" />
                  <span className="font-bold text-violet-600 text-sm uppercase tracking-wide">
                    Referral Program
                  </span>
                </div>
                <h4 className="text-2xl font-black text-gray-800">
                  Invite Friends & Earn Rewards
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
                  Bagikan kode referral kamu dan dapatkan{" "}
                  <span className="font-bold text-violet-600">10.000 poin</span>{" "}
                  untuk setiap teman yang mendaftar menggunakan kode kamu!
                </p>
              </div>

              {/* Right side - Referral Code */}
              <div className="w-full lg:w-auto">
                <div className="bg-white p-4 rounded-2xl border-2 border-violet-200 shadow-lg">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 text-center">
                    Your Referral Code
                  </p>
                  <div className="flex items-center gap-2 bg-gradient-to-r from-violet-50 to-purple-50 p-3 rounded-xl">
                    <code className="flex-1 text-center px-4 font-mono font-black text-2xl sm:text-3xl bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                      {user?.referralCode}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCopyReferral}
                      className={`${
                        copied
                          ? "bg-green-100 text-green-600 hover:bg-green-100"
                          : "hover:bg-violet-100 text-violet-600"
                      } rounded-xl transition-all duration-300`}
                    >
                      {copied ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  {copied && (
                    <p className="text-xs text-green-600 font-semibold mt-2 text-center animate-pulse">
                      ✓ Copied to clipboard!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* COUPONS LIST - Modern Card Design */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
              <Ticket className="h-7 w-7 text-violet-600" />
              My Coupons
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </h3>
            <div className="px-4 py-1.5 bg-violet-100 text-violet-700 rounded-full text-sm font-bold">
              {profileData?.coupons?.length || 0} Active
            </div>
          </div>

          {profileData?.coupons?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {profileData.coupons.map((coupon: any, index: number) => (
                <Card
                  key={coupon.id}
                  className="group overflow-hidden border-2 border-gray-100 hover:border-violet-300 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex h-full">
                    {/* Left side - Icon */}
                    <div className="relative w-28 bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <Ticket className="relative h-12 w-12 text-white drop-shadow-lg group-hover:rotate-12 transition-transform duration-300" />

                      {/* Decorative circles */}
                      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-full"></div>
                      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-full"></div>
                    </div>

                    {/* Right side - Details */}
                    <div className="flex-1 p-5 bg-white group-hover:bg-gradient-to-br group-hover:from-violet-50/30 group-hover:to-purple-50/30 transition-all duration-300">
                      <div className="space-y-3">
                        <div>
                          <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-2">
                            ACTIVE
                          </div>
                          <h5 className="font-black text-xl text-gray-800 group-hover:text-violet-700 transition-colors">
                            Discount 10% Off
                          </h5>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-violet-500" />
                          <span className="font-medium">Expires:</span>
                          <span className="font-bold text-gray-800">
                            {new Date(coupon.expiredAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>

                        <Button
                          size="sm"
                          className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-md group-hover:shadow-lg transition-all duration-300"
                        >
                          Use Coupon
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed border-gray-200 bg-white/50">
              <CardContent className="text-center py-16">
                <div className="inline-flex p-6 bg-gray-100 rounded-full mb-4">
                  <Ticket className="h-12 w-12 text-gray-400" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">
                  Belum Ada Kupon
                </h4>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Tukarkan poin kamu untuk mendapatkan kupon diskon menarik di
                  event-event mendatang!
                </p>
                <Button className="rounded-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Browse Events
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
