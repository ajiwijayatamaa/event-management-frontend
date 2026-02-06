import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
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

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.email({ error: "invalid email address." }),
  password: z.string().min(8, "Password must be at least 8 characters."),
  role: z.enum(["CUSTOMER", "ORGANIZER"]),
  referrerCode: z.string().optional(),
});
const Register = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
      referrerCode: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await axiosInstance.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        referrerCode: data.referrerCode,
      });

      navigate("/login");
    } catch (error) {
      alert("Error login");
    }
  }
  return (
    <div className="min-h-screen flex bg-background">
      {/* 1. Left Side - Image (Sesuai style Login) */}
      <div className="hidden lg:block lg:flex-1">
        <div className="relative h-full w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=1600&fit=crop"
            alt="Conference event"
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
                Start Your Journey
              </h2>
              <p className="mt-4 max-w-md text-lg text-white/80">
                Create an account to discover events, earn rewards, and connect
                with like-minded people.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 2. Right Side - Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo Section */}
          <Link to="/" className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Ticket className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Eventify</span>
          </Link>

          <Card className="border-border/50 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                Create an account
              </CardTitle>
              <CardDescription>
                Join Eventify today and start exploring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                id="form-register"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Name */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-register-name">Name</FieldLabel>
                      <Input
                        {...field}
                        id="form-register-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="Your Name"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                {/* EMAIL */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-register-email">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-register-email"
                        aria-invalid={fieldState.invalid}
                        placeholder="you@example.com"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* ROLE */}
                <Controller
                  name="role"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-register-role">Role</FieldLabel>
                      <select
                        {...field}
                        id="form-register-role"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="ORGANIZER">Organizer</option>
                      </select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* REFEREER */}
                <Controller
                  name="referrerCode"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="form-register-referral">
                        Referral Code (optional)
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-register-referral"
                        placeholder="ABCD1234"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* PASSWORD */}
                <div className="space-y-2">
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-register-password">
                          Password
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-register-password"
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
                </div>

                <Button type="submit" form="form-register">
                  Register
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
