import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Ticket,
  Mail,
  Lock,
  User,
  Gift,
  ArrowRight,
  UserCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const Register = () => {
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
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {/* Role Selection (Fitur 2: Customer & Organizer) */}
                <div className="space-y-2">
                  <Label>Join as a</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center justify-between border rounded-md px-3 py-2 cursor-pointer hover:bg-secondary/50 transition-colors has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50/50">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <User className="h-4 w-4" /> Customer
                      </div>
                      <input
                        type="radio"
                        name="role"
                        value="customer"
                        defaultChecked
                        className="accent-blue-600"
                      />
                    </label>
                    <label className="flex items-center justify-between border rounded-md px-3 py-2 cursor-pointer hover:bg-secondary/50 transition-colors has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50/50">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <UserCircle className="h-4 w-4" /> Organizer
                      </div>
                      <input
                        type="radio"
                        name="role"
                        value="organizer"
                        className="accent-blue-600"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="name" placeholder="John Doe" className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Referral Code Section (Fitur 2: Referral Registration) */}
                <div className="space-y-2 pt-2 border-t">
                  <Label htmlFor="referral" className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-blue-600" />
                    Referral Code (Optional)
                  </Label>
                  <Input
                    id="referral"
                    placeholder="Enter code to get rewards"
                    className="bg-secondary/30"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:opacity-90"
                  size="lg"
                >
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4" />
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
