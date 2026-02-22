import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Ticket, KeyRound, Loader2, ArrowLeft, Mail } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";
// --- IMPORT BUTTON SHADCN ---
import { Button } from "~/components/ui/button";
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
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-6 selection:bg-orange-100 selection:text-orange-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[400px]"
      >
        {/* Logo Branding */}
        <div className="flex justify-center mb-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-xl shadow-orange-500/10 group-hover:scale-105 transition-transform">
              <Ticket className="h-6 w-6 text-orange-400 rotate-12" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-zinc-900 italic">
              EVENTIFIRE<span className="text-orange-500">.</span>
            </span>
          </Link>
        </div>

        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-zinc-300/50 border border-zinc-200">
          {/* ── TICKET TOP: Header ── */}
          <div className="bg-zinc-900 px-8 pt-10 pb-12 relative overflow-hidden text-center">
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-rose-400 to-orange-400" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 mb-3">
                <KeyRound className="w-4 h-4 text-orange-400 animate-bounce" />
                <span className="text-orange-400 text-[10px] font-black tracking-[0.3em] uppercase">
                  Pemulihan Akun
                </span>
              </div>
              <h2 className="text-white font-black text-2xl tracking-tight uppercase italic">
                Lupa Kata Sandi
              </h2>
              <p className="text-zinc-400 text-xs font-medium mt-2 opacity-70 uppercase tracking-widest leading-relaxed">
                Kami akan mengirimkan instruksi <br /> pemulihan ke email Anda
              </p>
            </div>
          </div>

          {/* ── PERFORATED LINE ── */}
          <div className="relative bg-white flex items-center h-0">
            <div className="absolute -left-5 w-10 h-10 bg-zinc-100 rounded-full border border-zinc-200 z-10" />
            <div className="absolute -right-5 w-10 h-10 bg-zinc-100 rounded-full border border-zinc-200 z-10" />
            <div className="flex-1 border-t-[3px] border-dashed border-zinc-100 mx-10" />
          </div>

          {/* ── TICKET BOTTOM: Form ── */}
          <div className="bg-white px-8 pt-12 pb-10">
            <form
              id="form-forgot-password"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel className="text-[11px] font-bold text-zinc-400 tracking-widest uppercase mb-2 block">
                      Masukkan Alamat Email
                    </FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      placeholder="NAMA@EMAIL.COM"
                      className="bg-zinc-50 border-zinc-200 rounded-xl h-12 text-sm px-5 focus:ring-4 focus:ring-orange-400/5 focus:border-orange-500 transition-all placeholder:text-zinc-300"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="pt-2 space-y-4">
                {/* --- BUTTON UTAMA (SHADCN) --- */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-zinc-900 hover:bg-black text-white text-xs font-black h-14 rounded-xl flex items-center justify-center gap-3 shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin text-orange-400" />
                  ) : (
                    <Mail className="w-4 h-4 text-orange-400" />
                  )}
                  {isPending ? "Mengirim..." : "Kirim Instruksi"}
                </Button>

                {/* --- BUTTON KEMBALI (SHADCN VARIANT OUTLINE) --- */}
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-zinc-200 hover:bg-zinc-50 text-zinc-900 text-xs font-black h-14 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] uppercase tracking-widest"
                >
                  <Link to="/login">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Masuk
                  </Link>
                </Button>
              </div>
            </form>

            <div className="mt-10 text-center border-t border-zinc-100 pt-8">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
                Butuh bantuan lebih lanjut? <br />
                <span className="text-zinc-900 border-b border-zinc-900 cursor-pointer hover:text-orange-500 hover:border-orange-500 transition-colors">
                  Hubungi Bantuan
                </span>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
