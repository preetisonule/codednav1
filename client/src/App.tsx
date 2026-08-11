import { useEffect, useState } from "react";

import ReadinessForm from "./components/readiness/ReadinessForm";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ReadinessPage from "./pages/ReadinessPage";

import type { ReadinessResponse } from "./types/readiness";

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

  if (analysis) {
    return <ReadinessPage data={analysis} />;
  }

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold text-blue-400">CodeDNA</p>

          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            Know How Ready You Are
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Analyze your GitHub, LeetCode and resume to discover your interview
            readiness and skill gaps.
          </p>
        </div>

        <ReadinessForm onSuccess={setAnalysis} />
      </div>
    </main>
  );
}

export default App;