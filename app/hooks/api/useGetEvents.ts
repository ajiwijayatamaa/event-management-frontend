import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { Event } from "~/types/event";
import type { PageableResponse, PaginationQueries } from "~/types/pagination";

interface GetEventsQuery extends PaginationQueries {
  search?: string;
}

const useGetEvents = (queryParams: GetEventsQuery) => {
  return useQuery({
    queryKey: ["events", queryParams],
    queryFn: async () => {
      const { data } = await axiosInstance<PageableResponse<Event>>("/events", {
        params: queryParams,
      });
      return data;
    },
  });
};

export default useGetEvents;
