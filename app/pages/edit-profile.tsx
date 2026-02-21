import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  KeyRound,
  Loader2,
  User,
  ArrowLeft,
  Sparkles,
  Ticket,
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

// 1. Loader Logic - Tidak Berubah
export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (!user) return redirect("/login");
};

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 2. Form Definitions - Logic & Schema Tetap Sama
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

  // 3. Mutation Hooks - Logic API Tetap Sama
  const { mutateAsync: uploadPhoto, isPending: isUploadingPhoto } =
    useUploadPhoto();
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();
  const { mutateAsync: changePassword, isPending: isChangingPassword } =
    useChangePassword();

  // 4. Submit Handlers - Logic Tetap Sama
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
    <div className="min-h-screen bg-zinc-100 px-4 py-10 selection:bg-orange-100 selection:text-orange-900">
      <div className="max-w-md mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-base font-bold text-zinc-500 hover:text-zinc-800 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="rounded-[2.5rem] overflow-hidden shadow-xl shadow-zinc-200/50 border border-zinc-200">
          {/* ── TICKET TOP: Profile Header (Logic: Display User) ── */}
          <div className="bg-zinc-900 px-8 pt-9 pb-12 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-rose-400 to-orange-400" />

            <div className="relative flex items-center gap-6">
              <div className="relative shrink-0">
                <img
                  src={
                    user?.profilePicture || "https://via.placeholder.com/128"
                  }
                  alt="Profile"
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-orange-400/20 ring-offset-4 ring-offset-zinc-900 shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-orange-500 p-1.5 rounded-lg shadow-lg border-2 border-zinc-900">
                  <Ticket className="w-3 h-3 text-zinc-900 fill-current" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                  <span className="text-orange-400 text-[10px] font-black tracking-[0.2em] uppercase">
                    Verified Attendee
                  </span>
                </div>
                <p className="text-white font-black text-2xl leading-tight truncate tracking-tight">
                  {user?.name || "Guest User"}
                </p>
                <p className="text-zinc-400 text-sm font-medium truncate mt-0.5 opacity-80">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* ── PERFORATED LINE (Separation) ── */}
          <div className="relative bg-white flex items-center h-0">
            <div className="absolute -left-5 w-10 h-10 bg-zinc-100 rounded-full border border-zinc-200 z-10" />
            <div className="absolute -right-5 w-10 h-10 bg-zinc-100 rounded-full border border-zinc-200 z-10" />
            <div className="flex-1 border-t-[3px] border-dashed border-zinc-100 mx-10" />
          </div>

          {/* ── TICKET BOTTOM: Content ── */}
          <div className="bg-white px-8 pt-10 pb-10">
            <Tabs defaultValue="photo" className="w-full">
              <TabsList className="w-full bg-zinc-100 rounded-2xl p-1 h-auto mb-8 border border-zinc-200/50">
                <TabTrigger
                  value="photo"
                  icon={<Camera className="w-4 h-4" />}
                  label="Photo"
                />
                <TabTrigger
                  value="profile"
                  icon={<User className="w-4 h-4" />}
                  label="Profile"
                />
                <TabTrigger
                  value="password"
                  icon={<KeyRound className="w-4 h-4" />}
                  label="Pass"
                />
              </TabsList>

              <div className="space-y-6">
                {/* Form Photo */}
                <TabsContent value="photo" className="mt-0 outline-none">
                  <form
                    onSubmit={photoForm.handleSubmit(onSubmitPhoto)}
                    className="space-y-6"
                  >
                    <Controller
                      name="photo"
                      control={photoForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel className="text-[11px] font-bold text-zinc-400 tracking-widest uppercase mb-3 block">
                            Identity Photo
                          </FieldLabel>
                          <Input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingPhoto}
                            onChange={(e) =>
                              field.onChange(
                                e.target.files?.[0] || new File([], ""),
                              )
                            }
                            className="cursor-pointer bg-zinc-50 border-zinc-200 rounded-xl h-14 text-sm pt-4 px-5 focus:border-orange-500 transition-colors"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <FormButton
                      loading={isUploadingPhoto}
                      label="Update Photo"
                    />
                  </form>
                </TabsContent>

                {/* Form Profile */}
                <TabsContent value="profile" className="mt-0 outline-none">
                  <form
                    onSubmit={profileForm.handleSubmit(onSubmitProfile)}
                    className="space-y-5"
                  >
                    <FormInput
                      label="Full Name"
                      register={profileForm.register("name")}
                      disabled={isUpdatingProfile}
                      error={profileForm.formState.errors.name}
                    />
                    <FormInput
                      label="Email Address"
                      register={profileForm.register("email")}
                      disabled={isUpdatingProfile}
                      error={profileForm.formState.errors.email}
                    />
                    <FormButton
                      loading={isUpdatingProfile}
                      label="Save Changes"
                    />
                  </form>
                </TabsContent>

                {/* Form Password */}
                <TabsContent value="password" className="mt-0 outline-none">
                  <form
                    onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                    className="space-y-5"
                  >
                    <FormInput
                      label="Current Password"
                      type="password"
                      register={passwordForm.register("oldPassword")}
                      disabled={isChangingPassword}
                      error={passwordForm.formState.errors.oldPassword}
                    />
                    <div className="h-px bg-zinc-100 my-1" />
                    <FormInput
                      label="New Password"
                      type="password"
                      register={passwordForm.register("newPassword")}
                      disabled={isChangingPassword}
                      error={passwordForm.formState.errors.newPassword}
                    />
                    <FormInput
                      label="Confirm New Password"
                      type="password"
                      register={passwordForm.register("confirmPassword")}
                      disabled={isChangingPassword}
                      error={passwordForm.formState.errors.confirmPassword}
                    />
                    <FormButton
                      loading={isChangingPassword}
                      label="Update Security"
                    />
                  </form>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── HELPER COMPONENTS (Satu file agar tidak ribet) ──

function TabTrigger({
  value,
  icon,
  label,
}: {
  value: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <TabsTrigger
      value={value}
      className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black text-zinc-500 rounded-xl transition-all data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm"
    >
      {icon} {label}
    </TabsTrigger>
  );
}

function FormInput({ label, type = "text", register, disabled, error }: any) {
  return (
    <Field>
      <FieldLabel className="text-[11px] font-bold text-zinc-400 tracking-widest uppercase mb-2 block">
        {label}
      </FieldLabel>
      <Input
        type={type}
        {...register}
        disabled={disabled}
        className="bg-zinc-50 border-zinc-200 rounded-xl h-12 text-sm px-5 focus:ring-4 focus:ring-orange-400/5 focus:border-orange-500 transition-all"
      />
      {error && <FieldError errors={[error]} />}
    </Field>
  );
}

function FormButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-zinc-900 hover:bg-black disabled:opacity-40 text-white text-xs font-black py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest"
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
      ) : null}
      {loading ? "Processing..." : label}
    </button>
  );
}
