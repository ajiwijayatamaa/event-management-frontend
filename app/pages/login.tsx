import { zodResolver } from "@hookform/resolvers/zod";
import { useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";
import { ArrowRight, Chrome, Loader2, Ticket } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link, redirect, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import useLogin from "~/hooks/api/useLogin";
import { axiosInstance } from "~/lib/axios";
import { loginSchema, type LoginSchema } from "~/schema/login";
import { useAuth } from "~/stores/useAuth";

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (user) return redirect("/");
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { mutateAsync: loginMutation, isPending } = useLogin();

  async function onSubmit(data: LoginSchema) {
    await loginMutation(data);
  }

  const handleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        const response = await axiosInstance.post("/auth/google", {
          accessToken: access_token,
        });

        login(response.data);
        toast.success("Google Login Success!");
        navigate("/");
      } catch (error) {
        toast.error("Google Login Failed");
      }
    },
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-white">
      {/* Minimal Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop&q=90"
          alt="Event background"
          className="w-full h-full object-cover"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60"></div>
      </div>

      {/* Minimalist Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-0 right-0 z-20 p-6 sm:p-8"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 group-hover:bg-slate-800 transition-colors">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Eventify
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-sm text-white/80">
            <span>50K+ Users</span>
            <span className="w-1 h-1 rounded-full bg-white/40"></span>
            <span>1K+ Events</span>
            <span className="w-1 h-1 rounded-full bg-white/40"></span>
            <span>4.9★ Rating</span>
          </div>
        </div>
      </motion.div>

      {/* Centered Login Card - Overlay Style */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl bg-white overflow-hidden">
            <CardContent className="p-0">
              {/* Form Section */}
              <div className="p-8 sm:p-10">
                {/* Header - Minimal & Clean */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Sign In
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Welcome back to Eventify
                  </p>
                </div>

                {/* Form */}
                <form
                  id="form-login"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* Email Field */}
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="space-y-2"
                      >
                        <FieldLabel
                          className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                          htmlFor="form-login-email"
                        >
                          Email
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-login-email"
                          className="h-12 bg-slate-50 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm"
                          aria-invalid={fieldState.invalid}
                          placeholder="name@example.com"
                        />
                        {fieldState.invalid && (
                          <FieldError
                            errors={[fieldState.error]}
                            className="text-xs text-red-600"
                          />
                        )}
                      </Field>
                    )}
                  />

                  {/* Password Field */}
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <FieldLabel
                            className="text-xs font-semibold text-slate-700 uppercase tracking-wider"
                            htmlFor="form-login-password"
                          >
                            Password
                          </FieldLabel>
                        </div>
                        <Input
                          {...field}
                          id="form-login-password"
                          type="password"
                          className="h-12 bg-slate-50 border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all text-sm"
                          aria-invalid={fieldState.invalid}
                          placeholder="••••••••"
                        />
                        {fieldState.invalid && (
                          <FieldError
                            errors={[fieldState.error]}
                            className="text-xs text-red-600"
                          />
                        )}
                      </Field>
                    )}
                  />
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-slate-900 hover:text-slate-700 transition-colors"
                  >
                    Forgot Password?
                  </Link>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    form="form-login"
                    disabled={isPending}
                    className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white transition-all font-medium text-sm mt-6"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-slate-500 font-medium">
                        OR
                      </span>
                    </div>
                  </div>

                  {/* Google Button */}
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full h-12 border-slate-200 hover:bg-slate-50 transition-all gap-2 font-medium text-sm"
                    onClick={() => handleLogin()}
                  >
                    <Chrome className="h-4 w-4" />
                    Continue with Google
                  </Button>
                </form>

                {/* Sign Up Link */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-slate-600">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="font-semibold text-slate-900 hover:text-slate-700 transition-colors"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>

              {/* Bottom Banner - Accent */}
              <div className="bg-slate-900 px-8 py-4 sm:px-10 sm:py-5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    <span className="text-xs font-medium">Secure Login</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    <span className="text-xs font-medium">
                      256-bit Encryption
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center text-xs text-white/60"
          >
            By signing in, you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
