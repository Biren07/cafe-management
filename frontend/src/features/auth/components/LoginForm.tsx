"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Coffee,
  ShieldCheck,
  CheckSquare,
  Square,
  ArrowRight,
} from "lucide-react";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import { setCredentials } from "@/store/slices/authSlice";
import { useLoginMutation } from "../services/authApi";
import { loginSchema, LoginFormData } from "../schemas/auth.schema";
import { authStorage } from "@/utils/auth-storage";
import { ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const REMEMBER_ME_EMAIL_KEY = "cafe_admin_remember_email";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [loginMutation, { isLoading }] = useLoginMutation();
  const redirectTo =
    searchParams.get("redirectTo") || ROUTES.DASHBOARD.OVERVIEW;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      isOwnerLogin: false,
    },
  });

  const rememberMeValue = watch("rememberMe");
  const isOwnerLoginValue = watch("isOwnerLogin");

  // Hydrate saved "Remember Me" email if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem(REMEMBER_ME_EMAIL_KEY);
      if (savedEmail) {
        setValue("email", savedEmail);
        setValue("rememberMe", true);
      }
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);

    try {
      const response = await loginMutation({
        email: data.email,
        password: data.password,
        isOwnerLogin: data.isOwnerLogin,
      }).unwrap();

      if (response.success && response.data) {
        const { user, accessToken, refreshToken } = response.data;

        // Dispatch credentials to Redux store & localStorage
        dispatch(
          setCredentials({
            user,
            accessToken,
            refreshToken,
          }),
        );

        // Handle Remember Me persistence
        if (data.rememberMe) {
          localStorage.setItem(REMEMBER_ME_EMAIL_KEY, data.email);
        } else {
          localStorage.removeItem(REMEMBER_ME_EMAIL_KEY);
        }

        toast.success(`Welcome back, ${user.name}!`);
        const targetRoute =
          redirectTo && redirectTo !== "/dashboard"
            ? redirectTo
            : user.role === "STAFF" || (user.role as string) === "CASHIER"
              ? "/orders"
              : "/dashboard";
        router.push(targetRoute);
      } else {
        setServerError(
          response.message || "Login failed. Please check your credentials.",
        );
      }
    } catch (err: any) {
      const errorMsg =
        err?.data?.message ||
        err?.message ||
        "Invalid email or password. Please try again.";
      setServerError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Preset demo quick-fill helper
  const handleQuickFill = (
    email: string,
    pass: string,
    isOwner: boolean = false,
  ) => {
    setValue("email", email, { shouldValidate: true });
    setValue("password", pass, { shouldValidate: true });
    setValue("isOwnerLogin", isOwner);
    setServerError(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* ── Form Header ─────────────────────────── */}
      <div className="space-y-1 text-center lg:text-left">
        {/* Mobile-only coffee icon */}
        <div className="inline-flex lg:hidden items-center justify-center h-10 w-10 rounded-xl bg-amber-600 text-white mb-2 shadow-xs">
          <Coffee className="h-5 w-5" />
        </div>

        <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900">
          Welcome back
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Sign in to access your cafe management portal
        </p>
      </div>

      {/* ── Server Error Alert ───────────────────── */}
      {serverError && (
        <div className="flex items-start space-x-3 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 animate-in fade-in slide-in-from-top-2 duration-150">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          <span className="font-medium leading-relaxed">{serverError}</span>
        </div>
      )}

      {/* ── Form ────────────────────────────────── */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Email Address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <Input
              {...register("email")}
              type="email"
              placeholder="name@cafe.com"
              disabled={isLoading}
              className={`pl-10 h-10 bg-white border-slate-300 focus:border-amber-500 text-slate-900 placeholder:text-slate-400 rounded-xl transition-all shadow-2xs ${
                errors.email ? "border-rose-500 focus:ring-rose-500/15" : ""
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs font-medium text-rose-600 flex items-center gap-1 pl-0.5">
              <AlertCircle className="h-3 w-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Lock className="h-4 w-4" />
            </div>
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              disabled={isLoading}
              className={`pl-10 pr-10 h-10 bg-white border-slate-300 focus:border-amber-500 text-slate-900 placeholder:text-slate-400 rounded-xl transition-all shadow-2xs ${
                errors.password ? "border-rose-500 focus:ring-rose-500/15" : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-700 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs font-medium text-rose-600 flex items-center gap-1 pl-0.5">
              <AlertCircle className="h-3 w-3" />
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me & Owner Mode */}
        <div className="flex items-center justify-between pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 hover:text-slate-900 transition-colors">
            <input
              type="checkbox"
              {...register("rememberMe")}
              className="sr-only"
            />
            <span
              className={rememberMeValue ? "text-amber-600" : "text-slate-400"}
            >
              {rememberMeValue ? (
                <CheckSquare className="h-4 w-4" />
              ) : (
                <Square className="h-4 w-4" />
              )}
            </span>
            <span>Remember me</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs text-slate-500 hover:text-amber-700 transition-colors">
            <input
              type="checkbox"
              {...register("isOwnerLogin")}
              className="sr-only"
            />
            <span
              className={`font-medium transition-colors ${isOwnerLoginValue ? "text-amber-700" : ""}`}
            >
              Owner endpoint
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl shadow-xs transition-all duration-150 cursor-pointer disabled:opacity-70"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Authenticating...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <LogIn className="h-4 w-4 stroke-[2.2]" />
              <span>Sign In to Account</span>
              <ArrowRight className="h-4 w-4 stroke-[2]" />
            </div>
          )}
        </Button>
      </form>

      {/* ── Divider ─────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Quick Fill
        </span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* ── Demo Credentials ─────────────────────── */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
            Demo Credentials
          </span>
          <span className="text-[10px] text-slate-500 bg-white border border-slate-200 rounded-md px-1.5 py-0.5">
            1-click fill
          </span>
        </div>
      </div>
    </div>
  );
}
