import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

const useGetEventBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["event", slug],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/events/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
};

export default useGetEventBySlug;
