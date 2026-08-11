import { useState } from "react";
import { login, register } from "../services/api";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Clear previous errors
    setError("");

    // -------------------------
    // Basic validation
    // -------------------------

    if (!name.trim() || !email.trim() || !password) {
      setError("Name, email and password are required.");
      return;
    }

    // -------------------------
    // Email validation
    // -------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // -------------------------
    // Password validation
    // -------------------------

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Register
      const registerResponse = await register(
        name.trim(),
        email.trim(),
        password,
      );

      if (!registerResponse) {
        setError("Registration failed. Please try again.");
        return;
      }

      // Step 2: Auto-login
      const loginResponse = await login(email.trim(), password);

      if (!loginResponse.token) {
        setError(
          loginResponse?.message ||
            "Account created but auto-login failed. Please login manually.",
        );
        return;
      }

      // Step 3: Store token
      localStorage.setItem("accessToken", loginResponse.token);

      // Notify parent
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
    <main className="flex min-h-screen items-center justify-center bg-black px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">Create account</h1>

          <p className="mt-2 text-gray-400">
            Join CodeDNA and start tracking your growth
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-gray-800 bg-gray-950 p-8"
        >
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Full name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-white outline-none focus:border-blue-500"
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-white outline-none focus:border-blue-500"
              disabled={loading}
            />

            <p className="mt-1 text-xs text-gray-500">
              Enter a valid email address
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-700 bg-black px-4 py-3 text-white outline-none focus:border-blue-500"
              disabled={loading}
            />

            <p className="mt-1 text-xs text-gray-500">
              Password must be at least 6 characters
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          {/* Login */}
          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-semibold text-blue-400 hover:text-blue-300"
              disabled={loading}
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </main>
  );
}
