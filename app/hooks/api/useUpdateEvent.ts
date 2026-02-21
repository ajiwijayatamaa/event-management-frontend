import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { axiosInstance } from "~/lib/axios";
import type { UpdateEventSchema } from "~/schema/update-event";

const useUpdateEvent = (eventId: number) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: UpdateEventSchema) => {
      const formData = new FormData();

      if (data.name) formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      if (data.location) formData.append("location", data.location);
      if (data.startDate) formData.append("startDate", data.startDate);
      if (data.endDate) formData.append("endDate", data.endDate);

      if (data.price !== undefined)
        formData.append("price", data.price.toString());
      if (data.totalSeats !== undefined)
        formData.append("totalSeats", data.totalSeats.toString());

      // Image hanya di-append kalau user memilih file baru
      // Kalau tidak, backend otomatis pakai image lama
      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      await axiosInstance.patch(`/events/${eventId}`, formData);
    },
    onSuccess: () => {
      toast.success("Event updated successfully!");
      navigate("/organizer/events");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error.response?.data.message ||
          "Failed to update event. Please try again.",
      );
    },
  });
};

export default useUpdateEvent;
