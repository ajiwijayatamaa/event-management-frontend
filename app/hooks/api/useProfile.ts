import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { ProfileSchema } from "~/schema/profile";

const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      // Endpoint ini diasumsikan mengembalikan data points & coupons milik user
      const { data } = await axiosInstance.get<ProfileSchema>("/users/profile");
      return data;
    },
  });
};

export default useProfile;
