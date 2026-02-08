import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { redirect } from "react-router";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { axiosInstance } from "~/lib/axios";
import { useAuth } from "~/stores/useAuth";
import { Loader2, Pointer } from "lucide-react"; // Import ikon di sini

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
};

const formSchema = z.object({
  photo: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Photo is required.")
    .refine((file) => file.type.startsWith("image/"), "File must be an image.")
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "Photo must be less than 5MB.",
    ),
});

type FormProfile = z.infer<typeof formSchema>;

export default function Profile() {
  const { user, login } = useAuth();

  const form = useForm<FormProfile>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      photo: new File([], ""),
    },
  });

  // Ambil status isSubmitting dari formState
  const { isSubmitting } = form.formState;

  async function onSubmit(data: FormProfile) {
    try {
      const formData = new FormData();
      formData.append("photoProfile", data.photo);

      const currentToken = user?.accessToken;

      const result = await axiosInstance.post(
        "/users/photo-profile",
        formData,
        {
          headers: { Authorization: `Bearer ${currentToken}` },
        },
      );

      login({
        ...result.data,
        accessToken: currentToken,
      });

      alert("Upload photo success");
      form.reset(); // Reset input file setelah sukses
    } catch (error) {
      console.error(error);
      alert("Gagal upload");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Profile</CardTitle>
          <CardDescription>Update your profile photo</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="form-profile"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Current Photo */}
            <div className="flex justify-center">
              <img
                src={user?.profilePicture || "https://via.placeholder.com/128"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-border"
              />
            </div>

            {/* Photo Upload */}
            <Controller
              name="photo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-profile-photo">
                    Profile Photo
                  </FieldLabel>
                  <Input
                    id="form-profile-photo"
                    type="file"
                    accept="image/*"
                    disabled={isSubmitting} // Matikan input saat loading
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || new File([], "");
                      field.onChange(file);
                    }}
                    className="cursor-pointer"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Submit Button dengan Loading & Ikon Tangan */}
            <Button
              type="submit"
              form="form-profile"
              className="w-full"
              disabled={isSubmitting} // Disable tombol agar tidak double click
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Pointer className="mr-2 h-4 w-4" />
                  Upload Photo
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
