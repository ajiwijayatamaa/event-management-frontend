import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "~/lib/axios";

const useGetTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/transactions");
      return data;
    },
  });
};

export default useGetTransactions;
