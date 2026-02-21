import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";
import type { CreateTransactionPayload } from "~/types/transaction";

const useCreateTransaction = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: CreateTransactionPayload) => {
      const { data } = await axiosInstance.post("/transactions", payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Booking successful! Enjoy your event.");
      navigate("/dashboard/orders");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Transaction failed. Please try again.",
      );
    },
  });
};

export default useCreateTransaction;
