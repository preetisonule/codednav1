import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import ReadinessForm from "./components/readiness/ReadinessForm";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ReadinessPage from "./pages/ReadinessPage";
import GradientWaves from "./components/readiness/GradientWaves";
import ParticleText from "./components/readiness/ParticleText";
import Navbar from "./components/Navbar/Navbar";

import { analysisApi } from "./services/api";
import type { ReadinessResponse } from "./types/readiness";

function App() {
  const [analysis, setAnalysis] =
    useState<ReadinessResponse | null>(null);

  const [isLoadingAnalysis, setIsLoadingAnalysis] =
    useState(true);

  const [authMode, setAuthMode] =
    useState<"login" | "register">("login");

  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(() => {
      return Boolean(localStorage.getItem("accessToken"));
    });

    const navigate = useNavigate();

  // ============================================
  // AUTHENTICATION
  // ============================================

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    setIsAuthenticated(Boolean(token));
  }, []);

  // ============================================
  // LOAD LAST ANALYSIS
  // ============================================

  useEffect(() => {
    const loadLastAnalysis = async () => {
      if (!isAuthenticated) {
        setIsLoadingAnalysis(false);
        return;
      }

      const analysisId =
        localStorage.getItem("lastAnalysisId");

      if (!analysisId) {
        setIsLoadingAnalysis(false);
        return;
      }

      try {
        console.log(
          "🔄 Loading last analysis:",
          analysisId
        );

        const data =
          await analysisApi.getById(analysisId);

        setAnalysis(data);

        console.log(
          "✅ Analysis loaded:",
          data
        );
      } catch (error) {
        console.error(
          "❌ Failed to load analysis:",
          error
        );

        // If the analysis no longer exists,
        // remove the stale ID.
        localStorage.removeItem("lastAnalysisId");

        setAnalysis(null);
      } finally {
        setIsLoadingAnalysis(false);
      }
    };

    loadLastAnalysis();
  }, [isAuthenticated]);

  // ============================================
  // AUTH SUCCESS
  // ============================================

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setAuthMode("login");
  };

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("lastAnalysisId");

    setIsAuthenticated(false);
    setAnalysis(null);
  };

  // ============================================
  // ANALYSIS COMPLETE
  // ============================================

  const handleAnalysisComplete = (
  data: ReadinessResponse
) => {
  setAnalysis(data);

  if (data._id) {
    localStorage.setItem(
      "lastAnalysisId",
      data._id
    );

    console.log(
      "✅ Saved Analysis ID:",
      data._id
    );
  } else {
    console.warn(
      "⚠️ No _id found in analysis data:",
      data
    );
  }

  // Go to dashboard after successful analysis
  navigate("/dashboard");
};

  // ============================================
  // LOADING
  // ============================================

  if (isAuthenticated && isLoadingAnalysis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-white" />

          <p className="text-sm text-gray-400">
            Loading your analysis...
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
  <>
    {!isAuthenticated ? (
      // ========================================
      // AUTH ROUTES
      // ========================================
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPage
              onLoginSuccess={handleAuthSuccess}
              onSwitchToRegister={() =>
                setAuthMode("register")
              }
            />
          }
        />

        <Route
          path="/register"
          element={
            <RegisterPage
              onRegisterSuccess={handleAuthSuccess}
              onSwitchToLogin={() =>
                setAuthMode("login")
              }
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to={
                authMode === "register"
                  ? "/register"
                  : "/login"
              }
              replace
            />
          }
        />
      </Routes>
    ) : (
      // ========================================
      // AUTHENTICATED APP
      // ========================================
      <>
        <Navbar onLogout={handleLogout} />

        <main className="relative min-h-screen overflow-hidden bg-black pt-20">
          
          {/* ==============================
              BACKGROUND
          ============================== */}

          <div className="fixed inset-0 z-0">
            <GradientWaves />
          </div>

          <div className="fixed inset-0 z-0 bg-black/40" />

          <ParticleText />

          {/* ==============================
              CONTENT
          ============================== */}

          <div className="relative z-10 flex min-h-screen justify-center px-6 py-10">
            <Routes>

              {/* ==============================
                  DASHBOARD
                  Existing analysis
              ============================== */}

              <Route
                path="/dashboard"
                element={
                  analysis ? (
                    <ReadinessPage
                      data={analysis}
                    />
                  ) : (
                    <Navigate
                      to="/analyze"
                      replace
                    />
                  )
                }
              />

              {/* ==============================
                  ANALYZE
                  ALWAYS SHOW FORM
                  This is "Analyze Again"
              ============================== */}

              <Route
                path="/analyze"
                element={
                  <ReadinessForm
                    onSuccess={
                      handleAnalysisComplete
                    }
                  />
                }
              />

              {/* ==============================
                  PROFILE
              ============================== */}

              <Route
                path="/profile"
                element={<ProfilePage />}
              />

              {/* ==============================
                  ROOT
              ============================== */}

              <Route
                path="/"
                element={
                  <Navigate
                    to={
                      analysis
                        ? "/dashboard"
                        : "/analyze"
                    }
                    replace
                  />
                }
              />

              {/* ==============================
                  FALLBACK
              ============================== */}

              <Route
                path="*"
                element={
                  <Navigate
                    to={
                      analysis
                        ? "/dashboard"
                        : "/analyze"
                    }
                    replace
                  />
                }
              />

            </Routes>
          </div>
        </main>
      </>
    )}
  </>
);
}
export default App;