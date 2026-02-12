import { Pencil, Settings } from "lucide-react";
import { Link } from "react-router"; // Pakai Link

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
    <div className="border-8 border-[#1a1a1a] bg-[#fff8e7] p-8 shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] relative overflow-hidden">
      {/* Label Verified */}
      <div className="absolute top-0 right-0 bg-[#ff6b35] text-white px-4 py-1 font-black text-xs uppercase border-b-4 border-l-4 border-[#1a1a1a]">
        Verified Member
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <img
              src={avatar}
              className="w-32 h-32 border-4 border-[#1a1a1a] bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] object-cover grayscale group-hover:grayscale-0 transition-all"
              alt="Profile"
            />
            {/* Link kecil di foto profil */}
            <Link
              to="/edit-profile"
              className="absolute -bottom-2 -right-2 bg-[#ffeb3b] p-2 border-4 border-[#1a1a1a] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:translate-y-[-2px] transition-all"
            >
              <Pencil className="h-4 w-4" />
            </Link>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-5xl font-black uppercase font-impact tracking-tight leading-none mb-2">
              {name}
            </h2>
            <p className="font-mono font-bold bg-[#1a1a1a] text-[#ffeb3b] px-3 py-1 inline-block text-sm">
              {email}
            </p>
          </div>
        </div>

        {/* LINK SEBAGAI TOMBOL EDIT */}
        <Link
          to="/edit-profile"
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-white text-[#1a1a1a] px-8 py-4 font-black uppercase border-4 border-[#1a1a1a] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ffeb3b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
        >
          <Settings className="h-5 w-5" />
          Edit Profile
        </Link>
      </div>
    </div>
  );
};
