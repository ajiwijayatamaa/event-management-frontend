import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";
import type { ForgotPasswordSchema } from "~/schema/forgot-password";

const useForgotPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (payload: ForgotPasswordSchema) => {
      const { data } = await axiosInstance.post("/auth/forgot-password", {
        email: payload.email,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Send Email Success");
      navigate("/");
    },
    onError: () => {
      toast.error("Error Forgot Password");
    },
  });
};

export default useForgotPassword;
