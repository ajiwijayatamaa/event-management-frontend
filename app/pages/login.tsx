import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Chrome, Ticket } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link, redirect, useNavigate } from "react-router";
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
import { useGoogleLogin } from "@react-oauth/google";

const formSchema = z.object({
  email: z.email({ error: "invalid email address." }),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const clientLoader = () => {
  const user = useAuth.getState().user;
  if (user) return redirect("/");
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      login(response.data);
      navigate("/");
    } catch (error) {
      alert("Error login");
    }
  }

  const handleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      try {
        const response = await axiosInstance.post("/auth/google", {
          accessToken: access_token,
        });

        login(response.data);
        navigate("/");
      } catch (error) {
        alert("Error login");
      }
    },
  });

  return (
    <div className="min-h-screen flex bg-[#fdfdfd] text-slate-900">
      {/* Left Side - Form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[400px]"
        >
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                <Ticket className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-extrabold tracking-tight">
                Event<span className="text-blue-600">ify</span>
              </span>
            </Link>
          </div>

          <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold tracking-tight text-center">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center">
                Please enter your details to sign in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                id="form-login"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-2"
                    >
                      <FieldLabel
                        className="text-sm font-semibold text-slate-700"
                        htmlFor="form-login-email"
                      >
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-login-email"
                        className="h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                        aria-invalid={fieldState.invalid}
                        placeholder="name@example.com"
                      />
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="text-xs font-medium"
                        />
                      )}
                    </Field>
                  )}
                />

                <div className="space-y-2">
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
                            className="text-sm font-semibold text-slate-700"
                            htmlFor="form-login-password"
                          >
                            Password
                          </FieldLabel>
                          <Link
                            to="/forgot-password"
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <Input
                          {...field}
                          id="form-login-password"
                          type="password"
                          className="h-11 bg-slate-50/50 border-slate-200 focus:bg-white transition-all"
                          aria-invalid={fieldState.invalid}
                          placeholder="••••••••"
                        />
                        {fieldState.invalid && (
                          <FieldError
                            errors={[fieldState.error]}
                            className="text-xs font-medium"
                          />
                        )}
                      </Field>
                    )}
                  />
                </div>

                <div className="pt-2 space-y-3">
                  <Button
                    type="submit"
                    form="form-login"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 transition-all font-semibold"
                  >
                    Sign In
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-slate-100" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-3 text-slate-400 font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    type="button"
                    className="w-full h-11 border-slate-200 hover:bg-slate-50 transition-all gap-2 font-medium"
                    onClick={() => handleLogin()}
                  >
                    <Chrome className="h-4 w-4" />
                    Google Login
                  </Button>
                </div>
              </form>

              <div className="mt-8 text-center text-sm">
                <p className="text-slate-500">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right Side - Image with Overlay */}
      <div className="hidden lg:block lg:flex-1 p-4">
        <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=1600&fit=crop"
            alt="Event atmosphere"
            className="h-full w-full object-cover"
          />
          {/* Decorative Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/90 via-blue-800/20 to-transparent" />

          <div className="absolute bottom-0 left-0 p-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-md"
            >
              <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-md border border-white/20">
                ✨ New events added daily
              </div>
              <h2 className="text-5xl font-bold leading-tight text-white mb-6">
                Discover Amazing <br /> Experiences.
              </h2>
              <p className="text-xl text-blue-50/80 leading-relaxed font-light">
                Join thousands of people who use Eventify to find and book their
                next unforgettable experience.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
