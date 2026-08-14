import { useState } from "react";
import { login, register } from "../services/api";
import { Eye, EyeOff } from "lucide-react";
import favicon from "/favicon.svg";

interface Props {
  onRegisterSuccess: (token: string) => void;
  onSwitchToLogin: () => void;
}

export default function RegisterPage({
  onRegisterSuccess,
  onSwitchToLogin,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Name, email and password are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const registerResponse = await register(
        name.trim(),
        email.trim(),
        password,
      );

      if (!registerResponse) {
        setError("Registration failed. Please try again.");
        return;
      }

      const loginResponse = await login(email.trim(), password);

      if (!loginResponse.token) {
        setError(
          loginResponse?.message ||
            "Account created but auto-login failed. Please login manually.",
        );
        return;
      }

      localStorage.setItem("accessToken", loginResponse.token);
      onRegisterSuccess(loginResponse.token);
    } catch (error) {
      console.error("Registration error:", error);

      if (error instanceof Error) {
        if (
          error.message.includes("duplicate") ||
          error.message.includes("already exists")
        ) {
          setError(
            "An account with this email already exists. Please login instead.",
          );
        } else {
          setError(error.message);
        }
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white md:flex-row">
      
      {/* Left Side - Registration Form (Kept White for contrast) */}
      <div className="flex w-full flex-col justify-center bg-white px-8 py-12 md:w-1/2 md:px-20 lg:px-32">
        
        {/* Logo */}
        <div className="mb-10 flex items-center gap-2">
          <img src={favicon} alt="CodeDNA Logo" className="h-8 w-8" />
          <span className="text-2xl font-bold text-gray-900">CodeDNA</span>
        </div>

        {/* Headings */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Create Account
          </h1>
          <p className="mt-2 text-gray-500">
            Join CodeDNA and start tracking your growth.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Name Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-[#4452fe] focus:ring-1 focus:ring-[#4452fe] disabled:opacity-50"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-[#4452fe] focus:ring-1 focus:ring-[#4452fe] disabled:opacity-50"
            />
            <p className="mt-1 text-xs text-gray-400">
              Enter a valid email address
            </p>
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
                disabled={loading}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 outline-none focus:border-[#4452fe] focus:ring-1 focus:ring-[#4452fe] disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Password must be at least 6 characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#0B0909] px-5 py-3 font-semibold text-white transition hover:bg-[#2C2C2C] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-semibold text-[#9929EA] hover:text-[#CC66DA]"
              disabled={loading}
            >
              Login
            </button>
          </p>
        </form>
      </div>

      {/* Right Side - Hero / Visuals (UPDATED BACKGROUND) */}
      <div className="hidden w-1/2 flex-col justify-center bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] p-12 text-white md:flex overflow-hidden relative">
        
        {/* Subtle dark background glow effects */}
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

        <div className="relative z-10">
          
          {/* Hero Text */}
          <div className="max-w-lg">
            <div className="inline-block rounded-full bg-blue-500/20 px-4 py-1.5 text-xs font-medium text-blue-300 backdrop-blur-sm ring-1 ring-white/10 mb-6">
              AI-Powered Analysis
            </div>
            <h2 className="text-4xl font-bold leading-tight">
              Turn your code into <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                interview confidence.
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-md">
              Get a clear, data-driven roadmap to ace your next technical interview.
            </p>
          </div>

          {/* "Pretty" Floating Dashboard Preview (Adjusted for Dark Background) */}
          <div className="relative mt-16 flex justify-center">
            <div className="relative w-[450px] rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-sm font-medium text-slate-300">CodeDNA Readiness</span>
                <span className="text-xs text-slate-400">Updated just now</span>
              </div>

              {/* Big Score */}
              <div className="mt-6 flex items-center justify-between rounded-xl bg-white/5 p-6 ring-1 ring-white/5">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Overall Score</p>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-white">68</span>
                    <span className="text-lg text-slate-500">/100</span>
                  </div>
                </div>
                <div className="h-16 w-16 rounded-full border-4 border-blue-500/30 border-t-blue-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-300">68%</span>
                </div>
              </div>

              {/* Graph/Charts */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-white/5 p-3 ring-1 ring-white/5">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>GitHub</span>
                    <span className="text-white">34</span>
                  </div>
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

              {/* Teaser banner */}
              <div className="mt-5 rounded-lg bg-red-500/10 p-3 ring-1 ring-red-500/20 flex items-center gap-3">
                <span className="text-red-400 text-sm font-bold">!</span>
                <div className="flex-1">
                  <p className="text-xs font-medium text-red-300">System Design Gap Detected</p>
                  <p className="text-[10px] text-red-400/70 mt-0.5">Study APIs & caching</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}