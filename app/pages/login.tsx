import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
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
      const response = await axiosInstance.post("/api/users/login", {
        login: data.email,
        password: data.password,
      });

      login({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        usertoken: response.data["user-token"],
      });
      navigate("/");
      console.log(response);
    } catch (error) {
      alert("Error login");
    }
  }
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Eventify</span>
          </Link>

          <Card className="border-border/50 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                id="form-login"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-login-email">Email</FieldLabel>
                      <Input
                        {...field}
                        id="form-login-email"
                        aria-invalid={fieldState.invalid}
                        placeholder="you@example.com"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <div className="space-y-2">
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-login-password">
                          Password
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-login-password"
                          type="password"
                          aria-invalid={fieldState.invalid}
                          placeholder="*******"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button type="submit" form="form-login">
                  Sign In
                </Button>
              </form>
              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  Don't have an account?{" "}
                </span>
                <Link
                  to="/register"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:flex-1">
        <div className="relative h-full w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=1600&fit=crop"
            alt="Event atmosphere"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-4xl font-bold text-white">
                Discover Amazing Events
              </h2>
              <p className="mt-4 max-w-md text-lg text-white/80">
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
