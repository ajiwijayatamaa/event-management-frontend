import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";
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
import useResetPassword from "~/hooks/api/userResetPassword";
import {
  resetPasswordSchema,
  type ResetPasswordSchema,
} from "~/schema/reset-password";
import type { Route } from "./+types/reset-password";

const ResetPassword = ({ params }: Route.ComponentProps) => {
  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync: resetPassword, isPending } = useResetPassword(
    params.token,
  );

  async function onSubmit(data: ResetPasswordSchema) {
    await resetPassword(data);
  }

  return (
    <div className="min-h-screen flex bg-background">
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
            <span className="text-2xl font-bold">EVENTIFIRE</span>
          </Link>

          <Card className="border-border/50 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                Reset Password
              </CardTitle>
              <CardDescription>Enter your new password</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                id="form-reset-password"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* PASSWORD */}
                <div className="space-y-2">
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-password">
                          Password
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-password"
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

                {/* CONFIRM PASSWORD */}
                <div className="space-y-2">
                  <Controller
                    name="confirmPassword"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="form-confirm-password">
                          Confirm Password
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-confirm-password"
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

                <Button
                  type="submit"
                  form="form-reset-password"
                  disabled={isPending}
                >
                  {isPending ? "Loading" : "Submit"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
