
import { useState } from "react";

import ReadinessForm from "./components/readiness/ReadinessForm";
import ReadinessPage from "./pages/ReadinessPage";

import type { ReadinessResponse } from "./types/readiness";
import ParticleText from "./components/readiness/ParticleText";
import GradientWaves from "./components/readiness/GradientWaves";

function App() {
  const [analysis, setAnalysis] =
    useState<ReadinessResponse | null>(null);

  // Show analysis page after form submission
  if (analysis) {
    return (
      <ReadinessPage data={analysis} />
    );
  }

  return (
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

          {/* Particle Text */}
          <ParticleText />

          {/* Main Heading */}
          <h1 className="mt-3 text-4xl font-bold text-white md:text-5xl">
            Know How Ready You Are
          </h1>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Analyze your GitHub, LeetCode and resume
            to discover your interview readiness and
            skill gaps.
          </p>

        </div>

        {/* ================= FORM ================= */}
        <ReadinessForm
          onSuccess={setAnalysis}
        />

      </div>
    </main>
  );
}

export default App;