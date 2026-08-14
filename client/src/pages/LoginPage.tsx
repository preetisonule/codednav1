import { useState } from "react";
import { login } from "../services/api";
import { Eye, EyeOff } from "lucide-react";
import favicon from "/favicon.svg";

interface Props {
  onLoginSuccess: (token: string) => void;
  onSwitchToRegister: () => void;
}

export default function LoginPage({
  onLoginSuccess,
  onSwitchToRegister,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await login(email.trim(), password);

      if (!response.token) {
        setError(response.message || "Login failed.");
        return;
      }

      localStorage.setItem("accessToken", response.token);
      if (rememberMe) {
        // Optional: Handle persistent login logic here if your backend supports it
        localStorage.setItem("rememberMe", "true");
      }
      onLoginSuccess(response.token);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Login failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white md:flex-row">
      {/* Left Side - Login Form */}
      <div className="flex w-full flex-col justify-center px-8 py-12 md:w-1/2 md:px-20 lg:px-32">
        {/* Logo */}
        <div className="mb-10 flex items-center gap-2">
          {/* Replace the SVG with the image from your public folder */}
          <img src={favicon} alt="CodeDNA Logo" className="h-8 w-8" />

          <span className="text-2xl font-bold text-gray-900">CodeDNA</span>
        </div>

        {/* Headings */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Welcome Back
          </h1>
          <p className="mt-2 text-gray-500">
            Enter your email and password to access your account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sellostore@company.com"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-[#4452fe] focus:ring-1 focus:ring-[#4452fe]"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-[#4452fe] focus:ring-1 focus:ring-[#4452fe]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}


          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#0B0909] px-5 py-3 font-semibold text-white transition hover:bg-[#2C2C2C] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>


          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Don't Have An Account?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-semibold text-[#9929EA] hover:text-[#CC66DA]"
            >
              Register Now.
            </button>
          </p>
        </form>
      </div>

        {/* Right Side - Hero / Visuals */}
  <div className="hidden w-1/2 flex-col justify-center bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] p-12 text-white md:flex overflow-hidden relative">
    
    {/* Subtle background decorative circles for depth */}
    <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
    <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

    <div className="relative z-10">
      {/* Hero Headline */}
      <div className="max-w-lg">
        <div className="inline-block rounded-full bg-blue-500/20 px-4 py-1.5 text-xs font-medium text-blue-300 backdrop-blur-sm ring-1 ring-white/10 mb-6">
          AI-Powered Analysis
        </div>
        <h2 className="text-4xl font-bold leading-tight">
          Don't just prepare, <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Outperform.
          </span>
        </h2>
        <p className="mt-4 text-lg text-slate-400 max-w-md">
          Log in to your account to access your dashboard and track your progress.
        </p>
      </div>

      {/* "Pretty" Floating Dashboard Preview */}
      <div className="relative mt-16 flex justify-center">
        {/* Main Glass Card */}
        <div className="relative w-[450px] rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-sm font-medium text-slate-300">CodeDNA Readiness</span>
            <span className="text-xs text-slate-400">Updated just now</span>
          </div>

          {/* Big Score - Centerpiece */}
          <div className="mt-6 flex items-center justify-between rounded-xl bg-white/5 p-6 ring-1 ring-white/5">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Overall Score</p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white">68</span>
                <span className="text-lg text-slate-500">/100</span>
              </div>
            </div>
            <div className="h-16 w-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 animate-spin-slow flex items-center justify-center">
              <span className="text-xs font-bold text-slate-300">68%</span>
            </div>
          </div>

          {/* Pretty Visual Graph/Charts */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/5">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>GitHub</span>
                <span className="text-white">34</span>
              </div>
              {/* Bar Chart */}
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-700/50">
                <div className="h-1.5 w-[34%] rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
              </div>
            </div>
            <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/5">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>LeetCode</span>
                <span className="text-white">90</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-700/50">
                <div className="h-1.5 w-[90%] rounded-full bg-gradient-to-r from-green-400 to-emerald-400" />
              </div>
            </div>
            <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/5">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Projects</span>
                <span className="text-white">80</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-700/50">
                <div className="h-1.5 w-[80%] rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
              </div>
            </div>
          </div>

          {/* Hint of the skill gaps below */}
          <div className="mt-5 rounded-lg bg-red-500/10 p-3 ring-1 ring-red-500/20 flex items-center gap-3">
            <span className="text-red-400 text-sm font-bold">!</span>
            <div className="flex-1">
              <p className="text-xs font-medium text-red-300">System Design Gap Detected</p>
              <p className="text-[10px] text-red-400/70 mt-0.5">Study APIs & caching</p>
            </div>
          </div>

          {/* Decorative floating elements for aesthetic */}
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-blue-500/20 blur-xl" />
          <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-purple-500/20 blur-xl" />
        </div>
      </div>
    </div>
  </div>
    </div>
  );
}

// --- Icons ---
function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.04 3.88-.58 4.83 1.27 2.56 10.6.04 12.81zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.16 2.33-2.06 4.19-3.74 4.25z" />
    </svg>
  );
}
