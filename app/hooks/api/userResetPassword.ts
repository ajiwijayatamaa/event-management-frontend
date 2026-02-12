import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";
import type { ResetPasswordSchema } from "~/schema/reset-password";

const useResetPassword = (token: string) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: ResetPasswordSchema) => {
      const { data } = await axiosInstance.post(
        "/auth/reset-password",
        {
          password: payload.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Reset Password Success");
      navigate("/login");
    },
    onError: () => {
      toast.error("Error Reset Password");
    },
  });
};

export default useResetPassword;
