import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Apple, Loader2, Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLogo } from "@/components/brand-logo";
import heroArtwork from "@/assets/shingitai-language-login-hero.png";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

type Mode = "signin" | "signup";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, authLoading, navigate]);

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/dashboard",
        },
      });

      if (error) {
        toast.error("Google sign-in failed. Please try again.");
        setLoading(false);
      }
    } catch {
      toast.error("Something went wrong with Google sign-in.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin + "/dashboard",
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Welcome to ShinGiTai Language! Your journey begins now.");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1020] text-white">
      <img
        src={heroArtwork}
        alt=""
        aria-hidden="true"
        width={1536}
        height={1024}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#07101f]/25 via-[#07101f]/20 to-[#07101f]/90" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1020]/55 via-transparent to-[#0b1020]/15" />
      <div className="relative mx-auto grid min-h-screen max-w-[1600px] items-center gap-10 px-5 py-8 lg:grid-cols-[1.15fr_.85fr] lg:px-10 xl:px-16">
        <div className="order-2 lg:order-1">
          <Link
            to="/"
            className="mb-7 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
          <div className="hidden max-w-lg rounded-3xl border border-white/15 bg-[#07101f]/35 p-7 shadow-2xl backdrop-blur-md lg:block">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-cyan-300">
              Your world of languages
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">
              Learn without limits.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Vocabulary, grammar, pronunciation and real conversations guided by your adaptive AI
              tutor.
            </p>
          </div>
          <div className="mt-6 hidden items-center gap-6 text-xs text-white/70 sm:flex">
            {["Adaptive lessons", "Real conversations", "Secure progress"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-cyan-400" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="order-1 mx-auto w-full max-w-md lg:order-2">
          <Link to="/" className="mb-8 flex items-center justify-center gap-3 lg:justify-start">
            <BrandLogo priority className="h-14 w-14" />
            <div>
              <div className="font-semibold">ShinGiTai Language</div>
              <div className="text-[10px] uppercase tracking-[.2em] text-cyan-400">
                Powered by ShinGiTai OpenAI
              </div>
            </div>
          </Link>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.075] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-8">
            <div className="mb-7">
              <h1 className="text-3xl font-semibold tracking-tight">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="mt-2 text-sm text-white/55">
                {mode === "signin"
                  ? "Continue your language learning journey."
                  : "Start learning any language with your AI tutor."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display name</Label>
                  <Input
                    className="h-12 border-white/10 bg-black/20 text-white placeholder:text-white/25"
                    id="displayName"
                    type="text"
                    placeholder="Alex Linguist"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="h-12 border-white/10 bg-black/20 text-white placeholder:text-white/25"
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "signin" && (
                    <Link
                      to="/reset-password"
                      className="text-xs font-medium text-cyan-400 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Input
                    className="h-12 border-white/10 bg-black/20 pr-11 text-white placeholder:text-white/25"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {mode === "signin" && (
                <label className="flex cursor-pointer items-center gap-2 text-xs text-white/55">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-white/20 accent-cyan-400"
                  />
                  Remember me
                </label>
              )}

              <Button
                type="submit"
                size="lg"
                className="h-12 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-950/30"
                disabled={loading}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] uppercase tracking-[.2em] text-white/35">
                or continue with
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="h-11 border-white/10 bg-white/5 text-white hover:bg-white/10"
                onClick={handleGoogle}
                disabled={loading}
              >
                <GoogleIcon />
                Google
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 border-white/10 bg-white/5 text-white hover:bg-white/10"
                disabled
                title="Apple sign-in is not configured yet"
              >
                <Apple className="h-5 w-5" />
                Apple
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-white/50">
              {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="font-semibold text-cyan-400 hover:underline"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
