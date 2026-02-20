import { Pencil, Settings, Sparkles } from "lucide-react";
import { Link } from "react-router";

interface ProfileHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    profilePicture?: string | null;
  } | null;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const name = user?.name || "User";
  const email = user?.email || "No Email";
  const avatar =
    user?.profilePicture ||
    `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}`;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar - Ukuran naik ke w-20 */}
        <div className="relative">
          <img
            src={avatar}
            alt="Profile"
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-orange-400 ring-offset-4 ring-offset-neutral-900"
          />
          <Link
            to="/edit-profile"
            className="absolute -bottom-1 -right-1 bg-orange-400 p-2 rounded-xl hover:bg-orange-300 transition-colors"
          >
            <Pencil className="w-4 h-4 text-neutral-900" />
          </Link>
        </div>

        {/* Info - Font Gede */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 text-sm font-bold tracking-widest uppercase">
              Member Pass
            </span>
          </div>
          <h2 className="text-white font-bold text-3xl leading-tight">
            {name}
          </h2>
          <p className="text-neutral-400 text-base mt-1">{email}</p>
        </div>
      </div>

      {/* Edit Button - Padding & Font naik */}
      <Link
        to="/edit-profile"
        className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold px-6 py-3.5 rounded-2xl transition-colors border border-white/10"
      >
        <Settings className="w-5 h-5" />
        Edit Profile
      </Link>
    </div>
  );
};
