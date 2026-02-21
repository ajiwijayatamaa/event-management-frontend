import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";
import type { StatisticsResponse } from "~/types/statistic";

const useGetStatistics = (period: "year" | "month" | "day") => {
  return useQuery({
    queryKey: ["statistics", period],
    queryFn: async () => {
      const { data } = await axiosInstance<StatisticsResponse>(
        "/events/statistics",
        { params: { period } },
      );
      return data;
    },
  });
};

export default useGetStatistics;
