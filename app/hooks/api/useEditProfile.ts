import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";
import type { EditProfileSchema } from "~/schema/edit-profile";
import { useAuth } from "~/stores/useAuth";

const useEditProfile = () => {
  const { user, login } = useAuth();

  return useMutation({
    mutationFn: async (payload: EditProfileSchema) => {
      const formData = new FormData();
      formData.append("photoProfile", payload.photo);

      const { data } = await axiosInstance.post(
        "/users/photo-profile",
        formData,
      );
      return data;
    },
    onSuccess: (data) => {
      const { message, ...updatedUserData } = data;

      // Sinkronisasi data ke Zustand store agar halaman Profile (view) otomatis berubah
      login({ ...user, ...updatedUserData });

      toast.success(message || "Update profile success");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal update profile");
    },
  });
};

export default useEditProfile;
