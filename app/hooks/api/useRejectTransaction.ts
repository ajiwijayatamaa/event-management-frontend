import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";

const useRejectTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: number) => {
      await axiosInstance.patch(`/transactions/${transactionId}/reject`);
    },
    onSuccess: () => {
      toast.success("Transaksi berhasil ditolak!");
      // Refresh list transaksi otomatis setelah reject
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message || "Gagal menolak transaksi. Coba lagi.",
      );
    },
  });
};

export default useRejectTransaction;
