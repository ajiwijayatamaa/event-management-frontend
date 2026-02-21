import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

const useGetAttendees = (slug: string) => {
  return useQuery({
    queryKey: ["attendees", slug],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/events/${slug}/attendees`);
      return data;
    },
    enabled: !!slug,
  });
};

export default useGetAttendees;
