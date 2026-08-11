<<<<<<< HEAD
import { useEffect, useState } from "react";
=======

import { useState } from "react";
>>>>>>> e1d888ebcff29f6ad1f5cf45f279abce81117494

import ReadinessForm from "./components/readiness/ReadinessForm";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ReadinessPage from "./pages/ReadinessPage";

import type { ReadinessResponse } from "./types/readiness";
import ParticleText from "./components/readiness/ParticleText";
import GradientWaves from "./components/readiness/GradientWaves";

function App() {
  const [analysis, setAnalysis] =
    useState<ReadinessResponse | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem("accessToken"));
  });

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem("accessToken")));
  }, [authMode]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setAuthMode("login");
  };

  if (!isAuthenticated) {
    if (authMode === "register") {
      return (
        <RegisterPage
          onRegisterSuccess={handleAuthSuccess}
          onSwitchToLogin={() => setAuthMode("login")}
        />
      );
    }

    return (
      <LoginPage
        onLoginSuccess={handleAuthSuccess}
        onSwitchToRegister={() => setAuthMode("register")}
      />
    );
  }

  // Show analysis page after form submission
  if (analysis) {
    return <ReadinessPage data={analysis} />;
  }

  return (
<<<<<<< HEAD
    <main className="min-h-screen bg-gray-950 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold text-blue-400">CodeDNA</p>
=======
    <main className="relative min-h-screen overflow-hidden bg-black">

      {/* ================= BACKGROUND ================= */}
      <div className="fixed inset-0 z-0">
        <GradientWaves />
      </div>

      {/* Dark overlay to make text readable */}
      <div className="fixed inset-0 z-0 bg-black/40" />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 flex min-h-screen flex-col items-center px-6 py-16">

        {/* ================= HEADER ================= */}
        <div className="mb-10 text-center">
>>>>>>> e1d888ebcff29f6ad1f5cf45f279abce81117494

          {/* Particle Text */}
          <ParticleText />

          {/* Main Heading */}
          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            Know How Ready You Are
          </h1>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Analyze your GitHub, LeetCode and resume to discover your interview
            readiness and skill gaps.
          </p>

        </div>

<<<<<<< HEAD
        <ReadinessForm onSuccess={setAnalysis} />
=======
        {/* ================= FORM ================= */}
        <ReadinessForm
          onSuccess={setAnalysis}
        />

>>>>>>> e1d888ebcff29f6ad1f5cf45f279abce81117494
      </div>
    </main>
  );
}

export default App;