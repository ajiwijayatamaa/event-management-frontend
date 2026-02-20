import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";
import type {
  EditProfileSchema,
  UploadPhotoSchema,
  ChangePasswordSchema,
} from "~/schema/edit-profile";
import { useAuth } from "~/stores/useAuth";

// Hook: Upload Photo
export const useUploadPhoto = () => {
  const { user, login } = useAuth();

  return useMutation({
    mutationFn: async (payload: UploadPhotoSchema) => {
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
      login({ ...user, ...updatedUserData }); // sinkron ke zustand
      toast.success(message || "Photo updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal upload photo");
    },
  });
};

// Hook: Update Name & Email
export const useUpdateProfile = () => {
  const { user, login } = useAuth();

  return useMutation({
    mutationFn: async (payload: EditProfileSchema) => {
      const { data } = await axiosInstance.patch("/users/profile", payload);
      return data;
    },
    onSuccess: (data) => {
      login({ ...user, ...data.data });
      toast.success(data.message || "Profile updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal update profile");
    },
  });
};

// Hook: Change Password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (payload: ChangePasswordSchema) => {
      const { data } = await axiosInstance.patch(
        "/users/change-password",
        payload,
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal ganti password");
    },
  });
};
