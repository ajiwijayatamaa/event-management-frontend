import { Timer, ScrollText } from "lucide-react";
import type { Point } from "~/schema/profile";

export const PointHistory = ({ points = [] }: { points?: Point[] }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ScrollText className="h-6 w-6 stroke-[3px]" />
        <h3 className="text-3xl font-black uppercase font-impact italic tracking-tight">
          Point Ledger
        </h3>
      </div>

      {/* Container dengan Max Height dan Custom Scrollbar */}
      <div className="border-8 border-[#1a1a1a] bg-white shadow-[8px_8px_0px_0px_rgba(26,26,26,1)] overflow-hidden">
        <div className="max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#1a1a1a] scrollbar-track-transparent">
          {points.length > 0 ? (
            // Urutkan poin terbaru di atas (optional tapi disarankan)
            [...points].reverse().map((pt) => (
              <div
                key={pt.id}
                className="border-b-4 border-[#1a1a1a] p-5 flex justify-between items-center last:border-0 hover:bg-[#ffeb3b]/10 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black font-impact text-[#1a1a1a]">
                      +{pt.remainingAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-mono font-bold opacity-40">
                      PTS
                    </span>
                  </div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-widest bg-[#1a1a1a] text-white px-2 py-0.5 w-fit">
                    TXID: {pt.id.toString().padStart(5, "0")}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#f5e6d3] border-2 border-[#1a1a1a] shadow-[2px_2px_0px_0px_rgba(26,26,26,1)]">
                    <Timer className="h-3.5 w-3.5 text-[#ff6b35]" />
                    <span className="text-[10px] font-black font-mono">
                      EXP:{" "}
                      {new Date(pt.expiredAt).toLocaleDateString("id-ID", {
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
            <div className="p-12 text-center">
              <p className="font-mono font-black uppercase opacity-30 italic text-lg">
                -- No Data Available --
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="text-[10px] font-bold font-mono uppercase opacity-60">
        *Showing your last {points.length} point transactions
      </p>
    </div>
  );
};
