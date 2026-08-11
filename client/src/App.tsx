import { useEffect, useState } from "react";

import ReadinessForm from "./components/readiness/ReadinessForm";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ReadinessPage from "./pages/ReadinessPage";
import GradientWaves from "./components/readiness/GradientWaves";

import type { ReadinessResponse } from "./types/readiness";
import ParticleText from "./components/readiness/ParticleText";

function App() {
  const [analysis, setAnalysis] =
    useState<ReadinessResponse | null>(null);

  const [authMode, setAuthMode] =
    useState<"login" | "register">("login");

  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(() => {
      return Boolean(localStorage.getItem("accessToken"));
    });

  // Check authentication status
  useEffect(() => {
    setIsAuthenticated(
      Boolean(localStorage.getItem("accessToken"))
    );
  }, []);

  // Called after successful login/register
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setAuthMode("login");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");

    setIsAuthenticated(false);

    // Reset analysis data
    setAnalysis(null);
  };

  // Called after readiness analysis is completed
  const handleAnalysisComplete = (
    data: ReadinessResponse
  ) => {
    setAnalysis(data);
  };

  // =========================
  // NOT AUTHENTICATED
  // =========================

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
        onSwitchToRegister={() =>
          setAuthMode("register")
        }
      />
    );
  }

  // =========================
  // ANALYSIS RESULT PAGE
  // =========================

  if (analysis) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black">
        {/* Background */}
        <div className="fixed inset-0 z-0">
          <GradientWaves />
        </div>

        {/* Dark overlay */}
        <div className="fixed inset-0 z-0 bg-black/40" />
        <ParticleText/>

        {/* Analysis content */}
        <div className="relative z-10 min-h-screen px-6 py-16">
          <ReadinessPage data={analysis} />
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="fixed right-4 top-4 z-50 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-500"
        >
          Logout
        </button>
      </main>
    );
  }

  // =========================
  // READINESS FORM PAGE
  // =========================

  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <GradientWaves />
      </div>

      {/* Dark overlay */}
      <div className="fixed inset-0 z-0 bg-black/40" />
      <ParticleText/>
      {/* Form content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center px-6 py-16">
        <ReadinessForm
          onSuccess={handleAnalysisComplete}
        />
      </div>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="fixed right-4 top-4 z-50 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-500"
      >
        Logout
      </button>
    </main>
  );
}

export default App;