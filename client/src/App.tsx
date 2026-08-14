import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

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

  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(() => {
      return Boolean(
        localStorage.getItem("accessToken")
      );
    });

  const navigate = useNavigate();

  // ============================================
  // AUTHENTICATION
  // ============================================

  useEffect(() => {
    const token =
      localStorage.getItem("accessToken");

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

        localStorage.removeItem(
          "lastAnalysisId"
        );

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

    // After login/register, go to the correct page.
    const hasAnalysis =
      Boolean(
        localStorage.getItem(
          "lastAnalysisId"
        )
      );

    navigate(
      hasAnalysis
        ? "/dashboard"
        : "/analyze",
      { replace: true }
    );
  };

  // ============================================
  // LOGOUT
  // ============================================

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("lastAnalysisId");

    setIsAuthenticated(false);
    setAnalysis(null);

    navigate("/login", {
      replace: true,
    });
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

    // New analysis → Dashboard
    navigate("/dashboard", {
      replace: true,
    });
  };

  // ============================================
  // LOADING
  // ============================================

  if (
    isAuthenticated &&
    isLoadingAnalysis
  ) {
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
          {/* LOGIN */}
          <Route
            path="/login"
            element={
              <LoginPage
                onLoginSuccess={
                  handleAuthSuccess
                }
                onSwitchToRegister={() =>
                  navigate("/register")
                }
              />
            }
          />

          {/* REGISTER */}
          <Route
            path="/register"
            element={
              <RegisterPage
                onRegisterSuccess={
                  handleAuthSuccess
                }
                onSwitchToLogin={() =>
                  navigate("/login")
                }
              />
            }
          />

          {/* UNKNOWN AUTH ROUTE */}
          <Route
            path="*"
            element={
              <Navigate
                to="/login"
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
          <Navbar
            onLogout={handleLogout}
          />

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
                    Always shows the form
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
                  element={
                    <ProfilePage />
                  }
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