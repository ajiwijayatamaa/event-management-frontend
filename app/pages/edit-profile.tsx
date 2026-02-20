import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  KeyRound,
  Loader2,
  User,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { redirect, useNavigate } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  useUploadPhoto,
  useUpdateProfile,
  useChangePassword,
} from "~/hooks/api/useEditProfile";
import {
  uploadPhotoSchema,
  editProfileSchema,
  changePasswordSchema,
  type UploadPhotoSchema,
  type EditProfileSchema,
  type ChangePasswordSchema,
} from "~/schema/edit-profile";
import { useAuth } from "~/stores/useAuth";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
};

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const photoForm = useForm<UploadPhotoSchema>({
    resolver: zodResolver(uploadPhotoSchema),
    defaultValues: { photo: new File([], "") },
  });

  const profileForm = useForm<EditProfileSchema>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: { name: user?.name || "", email: user?.email || "" },
  });

  const passwordForm = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const { mutateAsync: uploadPhoto, isPending: isUploadingPhoto } =
    useUploadPhoto();
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();
  const { mutateAsync: changePassword, isPending: isChangingPassword } =
    useChangePassword();

  const onSubmitPhoto = async (data: UploadPhotoSchema) => {
    await uploadPhoto(data);
    photoForm.reset();
  };

  const onSubmitProfile = async (data: EditProfileSchema) => {
    await updateProfile(data);
  };

  const onSubmitPassword = async (data: ChangePasswordSchema) => {
    await changePassword(data);
    passwordForm.reset();
  };

  return (
    <div className="min-h-screen bg-neutral-100 px-4 py-10">
      <div className="max-w-md mx-auto">
        {/* Back Button - Font Gede */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-base font-bold text-neutral-500 hover:text-neutral-800 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border border-neutral-200">
          {/* ── TICKET TOP: Profile Header ── */}
          <div className="bg-neutral-900 px-8 pt-9 pb-12 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-rose-400 to-orange-400" />

            <div className="relative flex items-center gap-6">
              <img
                src={user?.profilePicture || "https://via.placeholder.com/128"}
                alt="Profile"
                className="w-20 h-20 rounded-[1.5rem] object-cover ring-4 ring-orange-400/30 ring-offset-4 ring-offset-neutral-900 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span className="text-orange-400 text-sm font-black tracking-[0.2em] uppercase">
                    Member Pass
                  </span>
                </div>
                <p className="text-white font-black text-2xl leading-tight truncate">
                  {user?.name || "Your Name"}
                </p>
                <p className="text-neutral-400 text-base font-medium truncate mt-1">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* ── PERFORATED LINE ── */}
          <div className="relative bg-white flex items-center h-0">
            <div className="absolute -left-5 w-10 h-10 bg-neutral-100 rounded-full border border-neutral-200 z-10" />
            <div className="absolute -right-5 w-10 h-10 bg-neutral-100 rounded-full border border-neutral-200 z-10" />
            <div className="flex-1 border-t-[3px] border-dashed border-neutral-200 mx-10" />
          </div>

          {/* ── TICKET BOTTOM: Tabs + Form ── */}
          <div className="bg-white px-8 pt-10 pb-10">
            <Tabs defaultValue="photo">
              <TabsList className="w-full bg-neutral-100 rounded-[1.5rem] p-1.5 h-auto mb-10">
                <TabsTrigger
                  value="photo"
                  className="flex-1 flex items-center justify-center gap-2.5 py-3.5 text-sm font-bold text-neutral-500 rounded-2xl transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-md"
                >
                  <Camera className="w-4 h-4" />
                  Photo
                </TabsTrigger>
                <TabsTrigger
                  value="profile"
                  className="flex-1 flex items-center justify-center gap-2.5 py-3.5 text-sm font-bold text-neutral-500 rounded-2xl transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-md"
                >
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="password"
                  className="flex-1 flex items-center justify-center gap-2.5 py-3.5 text-sm font-bold text-neutral-500 rounded-2xl transition-all data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-md"
                >
                  <KeyRound className="w-4 h-4" />
                  Pass
                </TabsTrigger>
              </TabsList>

              {/* Tab: Photo */}
              <TabsContent value="photo" className="mt-0">
                <form
                  onSubmit={photoForm.handleSubmit(onSubmitPhoto)}
                  className="space-y-6"
                >
                  <Controller
                    name="photo"
                    control={photoForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor="photo-upload"
                          className="text-sm font-black text-neutral-400 tracking-widest uppercase mb-3"
                        >
                          Profile Photo
                        </FieldLabel>
                        <Input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          disabled={isUploadingPhoto}
                          aria-invalid={fieldState.invalid}
                          onChange={(e) => {
                            const file =
                              e.target.files?.[0] || new File([], "");
                            field.onChange(file); // LOGIKA BALIK KE ASLI
                          }}
                          className="cursor-pointer bg-neutral-50 border-neutral-200 rounded-2xl h-14 text-base pt-3.5 px-5 focus:border-orange-400"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <button
                    type="submit"
                    disabled={isUploadingPhoto}
                    className="w-full bg-neutral-900 hover:bg-black disabled:opacity-40 text-white text-base font-black py-4.5 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all active:scale-[0.98]"
                  >
                    {isUploadingPhoto && (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                    {isUploadingPhoto ? "Uploading..." : "Upload Photo"}
                  </button>
                </form>
              </TabsContent>

              {/* Tab: Profile */}
              <TabsContent value="profile" className="mt-0">
                <form
                  onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                  className="space-y-6"
                >
                  <Field>
                    <FieldLabel className="text-sm font-black text-neutral-400 tracking-widest uppercase mb-3">
                      Full Name
                    </FieldLabel>
                    <Input
                      {...profileForm.register("name")}
                      disabled={isUpdatingProfile}
                      placeholder="Your full name"
                      className="bg-neutral-50 border-neutral-200 rounded-2xl h-14 text-base px-6 focus:ring-4 focus:ring-orange-400/10 focus:border-orange-400 transition-all"
                    />
                    {profileForm.formState.errors.name && (
                      <FieldError
                        errors={[profileForm.formState.errors.name]}
                      />
                    )}
                  </Field>
                  <Field>
                    <FieldLabel className="text-sm font-black text-neutral-400 tracking-widest uppercase mb-3">
                      Email Address
                    </FieldLabel>
                    <Input
                      {...profileForm.register("email")}
                      disabled={isUpdatingProfile}
                      placeholder="your@email.com"
                      className="bg-neutral-50 border-neutral-200 rounded-2xl h-14 text-base px-6 focus:ring-4 focus:ring-orange-400/10 focus:border-orange-400 transition-all"
                    />
                    {profileForm.formState.errors.email && (
                      <FieldError
                        errors={[profileForm.formState.errors.email]}
                      />
                    )}
                  </Field>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="w-full bg-neutral-900 hover:bg-black disabled:opacity-40 text-white text-base font-black py-4.5 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all"
                  >
                    {isUpdatingProfile && (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                    {isUpdatingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </TabsContent>

              {/* Tab: Password */}
              <TabsContent value="password" className="mt-0">
                <form
                  onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                  className="space-y-6"
                >
                  <Field>
                    <FieldLabel className="text-sm font-black text-neutral-400 tracking-widest uppercase mb-3">
                      Current Password
                    </FieldLabel>
                    <Input
                      type="password"
                      {...passwordForm.register("oldPassword")}
                      disabled={isChangingPassword}
                      className="bg-neutral-50 border-neutral-200 rounded-2xl h-14 text-base px-6"
                    />
                    {passwordForm.formState.errors.oldPassword && (
                      <FieldError
                        errors={[passwordForm.formState.errors.oldPassword]}
                      />
                    )}
                  </Field>
                  <div className="h-px bg-neutral-100 my-2" />
                  <Field>
                    <FieldLabel className="text-sm font-black text-neutral-400 tracking-widest uppercase mb-3">
                      New Password
                    </FieldLabel>
                    <Input
                      type="password"
                      {...passwordForm.register("newPassword")}
                      disabled={isChangingPassword}
                      className="bg-neutral-50 border-neutral-200 rounded-2xl h-14 text-base px-6"
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <FieldError
                        errors={[passwordForm.formState.errors.newPassword]}
                      />
                    )}
                  </Field>
                  <Field>
                    <FieldLabel className="text-sm font-black text-neutral-400 tracking-widest uppercase mb-3">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      type="password"
                      {...passwordForm.register("confirmPassword")}
                      disabled={isChangingPassword}
                      className="bg-neutral-50 border-neutral-200 rounded-2xl h-14 text-base px-6"
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <FieldError
                        errors={[passwordForm.formState.errors.confirmPassword]}
                      />
                    )}
                  </Field>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full bg-neutral-900 hover:bg-black disabled:opacity-40 text-white text-base font-black py-4.5 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all"
                  >
                    {isChangingPassword && (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
