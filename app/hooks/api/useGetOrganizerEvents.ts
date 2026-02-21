import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { PageableResponse, PaginationQueries } from "~/types/pagination";
import type { Event } from "~/types/event";

interface GetOrganizerEventsQuery extends PaginationQueries {
  search?: string;
}

const useGetOrganizerEvents = (queryParams: GetOrganizerEventsQuery) => {
  return useQuery({
    queryKey: ["organizer-events", queryParams],
    queryFn: async () => {
      const { data } = await axiosInstance<PageableResponse<Event>>(
        "/events/my-events",
        { params: queryParams },
      );
      return data;
    },
  });
};

export default useGetOrganizerEvents;
