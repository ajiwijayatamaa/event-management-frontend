import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Ticket } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import useForgotPassword from "~/hooks/api/useForgotPassword";
import {
  forgotPasswordSchema,
  type ForgotPasswordSchema,
} from "~/schema/forgot-password";

const ForgotPassword = () => {
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  async function onSubmit(data: ForgotPasswordSchema) {
    await forgotPassword(data);
  }

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
                Forgot Password
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                id="form-forgot-password"
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
                        htmlFor="form-email"
                      >
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="form-email"
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

                <div className="pt-2 space-y-3">
                  <Button
                    type="submit"
                    form="form-forgot-password"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 transition-all font-semibold"
                    disabled={isPending}
                  >
                    {isPending ? "Loading" : "Submit"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
