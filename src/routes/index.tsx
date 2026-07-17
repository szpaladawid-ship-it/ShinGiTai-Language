import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  Bot,
  Check,
  Globe2,
  Languages,
  Laptop,
  Menu,
  Moon,
  Play,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";
import { useTheme } from "@/lib/theme";
import { BrandLogo } from "@/components/brand-logo";
import { Button } from "@/components/ui/button";
import heroArtwork from "@/assets/shingitai-language-login-hero.png";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "ShinGiTai Language — Learn without limits" },
      {
        name: "description",
        content:
          "Learn vocabulary, grammar, pronunciation and real conversations with an adaptive AI tutor powered by ShinGiTai OpenAI.",
      },
    ],
  }),
});

const features = [
  { icon: ShieldCheck, title: "Secure Authentication", detail: "Private by design" },
  { icon: Bot, title: "AI Tutor", detail: "Adapts to your level" },
  { icon: Languages, title: "28 Languages", detail: "One focused platform" },
  { icon: Laptop, title: "Cross Platform", detail: "Learn from anywhere" },
] as const;

function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f9ff] text-slate-950 dark:bg-[#0b1020] dark:text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.13),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.14),transparent_35%)]" />
      <header className="relative z-40 border-b border-slate-900/5 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b1020]/70">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo priority className="h-12 w-12" />
            <div>
              <div className="font-semibold tracking-tight">ShinGiTai Language</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-500">
                Powered by ShinGiTai OpenAI
              </div>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-slate-600 dark:text-slate-300 md:flex">
            <a href="#home" className="transition hover:text-cyan-500">
              Home
            </a>
            <a href="#features" className="transition hover:text-cyan-500">
              Features
            </a>
            <a href="#pricing" className="transition hover:text-cyan-500">
              Pricing
            </a>
            <a href="#about" className="transition hover:text-cyan-500">
              About
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              className="hidden rounded-full border border-slate-900/10 px-3 py-2 text-xs dark:border-white/10 sm:block"
              aria-label="Language selector"
            >
              EN
            </button>
            <button
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-900/10 transition hover:bg-slate-900/5 dark:border-white/10 dark:hover:bg-white/10"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button
              asChild
              size="sm"
              className="hidden rounded-full bg-white text-slate-950 hover:bg-cyan-100 dark:flex"
            >
              <Link to="/auth">Sign in</Link>
            </Button>
            <Menu className="h-5 w-5 md:hidden" />
          </div>
        </div>
      </header>

      <main className="relative">
        <section
          id="home"
          className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="relative z-10 max-w-xl"
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-600 dark:text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" /> Powered by ShinGiTai OpenAI
            </div>
            <h1 className="font-display text-5xl font-semibold leading-[0.96] tracking-[-0.055em] sm:text-6xl xl:text-7xl">
              Learn without limits.
              <span className="mt-3 block bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                Speak with confidence.
              </span>
            </h1>
            <p className="mt-7 text-lg leading-8 text-slate-600 dark:text-slate-300">
              One adaptive language-learning platform powered by your personal AI tutor. Learn
              vocabulary, grammar, pronunciation and real conversations in one place.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-13 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-7 text-white shadow-[0_12px_40px_rgba(34,211,238,.25)] transition hover:-translate-y-0.5"
              >
                <Link to="/auth">
                  Start Learning <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-13 rounded-full border-slate-900/10 bg-white/50 px-7 backdrop-blur dark:border-white/15 dark:bg-white/5"
              >
                <a href="#demo">
                  <Play className="h-4 w-4 fill-current" /> Watch Demo
                </a>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
              {["Start free", "No credit card", "Learn at your pace"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-cyan-500" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            id="demo"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.12 }}
            className="relative"
          >
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-tr from-cyan-500/20 via-transparent to-violet-500/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-2 shadow-2xl shadow-violet-950/20 backdrop-blur-sm dark:border-white/10">
              <img
                src={heroArtwork}
                alt="ShinGiTai Language learning world powered by artificial intelligence"
                width={1536}
                height={1024}
                className="h-auto w-full rounded-[1.55rem] object-contain"
                fetchPriority="high"
              />
            </div>
          </motion.div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, detail }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="group rounded-3xl border border-slate-900/5 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.045]"
              >
                <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-500">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{detail}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          id="about"
          className="border-y border-slate-900/5 bg-white/50 py-24 text-center dark:border-white/10 dark:bg-white/[0.025]"
        >
          <div className="mx-auto max-w-3xl px-5">
            <Globe2 className="mx-auto h-8 w-8 text-cyan-500" />
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              One platform. Every language journey.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-slate-600 dark:text-slate-300">
              Built for focused learning, meaningful practice and steady progress — never as another
              general-purpose AI assistant.
            </p>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-5 py-24 text-center lg:px-8">
          <p className="text-sm font-medium text-cyan-500">Simple by design</p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight">
            Start learning today.
          </h2>
          <Button
            asChild
            size="lg"
            className="mt-8 rounded-full bg-gradient-to-r from-cyan-400 to-violet-600 px-8 text-white"
          >
            <Link to="/auth">Create your account</Link>
          </Button>
        </section>
      </main>

      <footer className="relative border-t border-slate-900/5 px-5 py-10 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p>© 2026 ShinGiTai Holding Groupe</p>
            <p className="mt-1">Created by ShinGiTai Holding Groupe · All Rights Reserved</p>
            <p className="mt-1 text-cyan-500">Powered by ShinGiTai OpenAI</p>
          </div>
          <div className="flex flex-wrap gap-5">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookies</a>
            <a href="mailto:contact@shingitai.com">Contact</a>
            <a href="https://github.com/szpaladawid-ship-it/ShinGiTai-Language">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
