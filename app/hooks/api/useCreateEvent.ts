import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";
import type { CreateEventSchema } from "~/schema/create-event";

const useCreateEvent = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: CreateEventSchema) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("location", data.location);
      formData.append("price", data.price.toString());
      formData.append("totalSeats", data.totalSeats.toString());
      formData.append("availableSeats", data.totalSeats.toString());
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);
      formData.append("image", data.image);

      await axiosInstance.post("/events", formData);
    },
    onSuccess: () => {
      toast.success("Event created successfully!");
      navigate("/organizer/events");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message ||
          "Failed to create event. Please try again.",
      );
    },
  });
};

export default useCreateEvent;
