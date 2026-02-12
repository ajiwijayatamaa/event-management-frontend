import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Pointer } from "lucide-react"; // Import ikon di sini
import { Controller, useForm } from "react-hook-form";
import { redirect } from "react-router";
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
import useEditProfile from "~/hooks/api/useEditProfile";
import {
  editProfileSchema,
  type EditProfileSchema,
} from "~/schema/edit-profile";
import { useAuth } from "~/stores/useAuth";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
};

export default function EditProfile() {
  const { user } = useAuth();

  const form = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      photo: new File([], ""),
    },
  });

  const { mutateAsync: editProfile, isPending } = useEditProfile();
  async function onSubmit(data: EditProfileSchema) {
    await editProfile(data);
    form.reset();
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
                    disabled={isPending}
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
              disabled={isPending} // Disable tombol agar tidak double click
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                <>
                  <Pointer className="mr-2 h-4 w-4" />
                </>
              )}
              {isPending ? "Uploading..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
