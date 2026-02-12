import { useState } from "react"; // Tambahkan ini
import { Copy, Check } from "lucide-react"; // Tambahkan Check
import { Button } from "~/components/ui/button";

// Tambahkan | null di sini
export const ReferralBox = ({
  referralCode,
}: {
  referralCode?: string | null;
}) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset icon setelah 2 detik
    }
  };

  return (
    <div className="bg-[#1a1a1a] p-6 border-8 border-[#1a1a1a] shadow-[8px_8px_0px_0px_rgba(255,107,53,1)]">
      <p className="text-[#ffeb3b] font-mono font-black text-xs uppercase mb-2">
        Share the love:
      </p>
      <div className="flex gap-2">
        <div className="flex-1 bg-white p-3 font-mono font-black text-xl border-2 border-white truncate">
          {referralCode || "NOCODE"}
        </div>
        <Button
          onClick={copyCode}
          className={`transition-colors ${
            copied
              ? "bg-green-500 hover:bg-green-600"
              : "bg-[#ffeb3b] hover:bg-white"
          } text-[#1a1a1a] font-black`}
        >
          {copied ? (
            <Check className="h-5 w-5" />
          ) : (
            <Copy className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};
