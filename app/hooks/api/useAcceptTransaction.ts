import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";

const useAcceptTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: number) => {
      await axiosInstance.patch(`/transactions/${transactionId}/accept`);
    },
    onSuccess: () => {
      toast.success("Transaksi berhasil diterima!");
      // Refresh list transaksi otomatis setelah accept
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message || "Gagal menerima transaksi. Coba lagi.",
      );
    },
  });
};

export default useAcceptTransaction;
