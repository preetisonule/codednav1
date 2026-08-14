import { useState, useEffect } from "react";
import { analysisApi } from "../services/api";
import type { ReadinessResponse } from "../types/readiness"; // Import your exact types
import {  
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Award,
  Target,
  Clock
} from "lucide-react";

export default function ProfilePage() {
  // ✅ State uses your actual backend shape + the MongoDB _id
const [analysis, setAnalysis] = useState<ReadinessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  const fetchAnalysis = async () => {
    try {
      const storedAnalysisId = localStorage.getItem("lastAnalysisId");
      
      // 🟢 Check if it exists, but don't show error immediately if the user just analyzed
      if (!storedAnalysisId) {
        // Only show error if they have been on the page for 3 seconds with no ID
        const timeout = setTimeout(() => {
          setError("No previous analysis found. Please run a new analysis.");
          setLoading(false);
        }, 3000);
        
        // If the ID appears within 3 seconds, cancel the error
        const checkForId = setInterval(() => {
          if (localStorage.getItem("lastAnalysisId")) {
            clearTimeout(timeout);
            clearInterval(checkForId);
            fetchAnalysis(); // Restart the fetch
          }
        }, 500);

        return; 
      }

      const data = await analysisApi.getById(storedAnalysisId);
      setAnalysis(data);
      setLoading(false);
      
    } catch (err) {
      console.error("Failed to load analysis", err);
      setError("Failed to load profile data");
      setLoading(false);
    }
  };

  fetchAnalysis();
}, []);;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117] text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#4452fe] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d1117] text-gray-400">
        <div className="text-center">
          <p>{error || "No analysis data available."}</p>
        </div>
      </div>
    );
  }

  // ✅ Destructure directly from analysis
const {
  targetRole,
  preparationDays,
  readiness,
  skillGaps,
  github,
  // _id,
} = analysis;

  // Calculate overall score from the readiness object
  const overallScore = readiness.overallScore;

  return (
    <div className="min-h-screen bg-[#0d1117] p-6 md:p-10 text-gray-200">
      {/* Main Grid Container */}
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. PROFILE CARD */}
          <div className="relative overflow-hidden rounded-2xl bg-[#161b22] p-6 border border-[#4452fe]/30 shadow-lg">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#4452fe]/10 blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* PFP (Uses GitHub Avatar) */}
              <div className="relative shrink-0">
                <div className="h-24 w-24 rounded-full border-4 border-[#4452fe] bg-gray-700 overflow-hidden">
                  <img 
                    src={github?.profile?.avatar_url || `https://ui-avatars.com/api/?name=User&background=4452fe&color=fff&size=128`}
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0 right-2 h-4 w-4 rounded-full bg-green-500 border-2 border-[#161b22]"></span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">{github?.profile?.name || github?.profile?.login || "User"}</h2>
                <div className="flex items-center gap-2 text-gray-400 mt-1">
                  <Target size={16} className="text-[#4452fe]" />
                  <span className="text-sm font-medium">{targetRole || "No target role set"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 mt-1 text-xs">
                  <Clock size={14} />
                  {/* If createdAt isn't in the type, we use a fallback */}
                  <span>Analyzed recently</span>
                </div>
              </div>

              {/* Readiness Score Badge */}
              <div className="mt-4 md:mt-0 flex flex-col items-center bg-[#1c2431]/50 rounded-xl px-6 py-4 border border-[#4452fe]/20">
                <p className="text-xs text-gray-400 uppercase tracking-widest">Readiness</p>
                <div className="relative h-20 w-20 mt-1 flex items-center justify-center">
                  <svg className="h-20 w-20 -rotate-90">
                    <circle cx="40" cy="40" r="36" stroke="#2a3342" strokeWidth="6" fill="none" />
                    <circle 
                      cx="40" cy="40" r="36" 
                      stroke="#4452fe" strokeWidth="6" fill="none" 
                      strokeDasharray={`${2 * Math.PI * 36}`}
                      strokeDashoffset={`${2 * Math.PI * 36 * (1 - overallScore / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span className="absolute text-xl font-bold text-white">{overallScore}<span className="text-sm text-gray-500">%</span></span>
                </div>
                <span className={`text-xs font-semibold mt-1 ${overallScore >= 70 ? 'text-green-400' : overallScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {readiness.status}
                </span>
              </div>
            </div>
          </div>

          {/* 2. STRENGTHS & WEAKNESSES GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#161b22] p-5 border border-[#4452fe]/20">
              <h3 className="text-sm font-semibold text-green-400 flex items-center gap-2 mb-4">
                <TrendingUp size={16} /> Recommendations
              </h3>
              <div className="space-y-3">
                {readiness.recommendations.length > 0 ? (
                  readiness.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-center gap-2 border-b border-white/5 pb-2">
                      <CheckCircle size={14} className="text-green-500 shrink-0" />
                      <span className="text-gray-300 text-sm">{rec}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">No recommendations available.</p>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-[#161b22] p-5 border border-[#4452fe]/20">
              <h3 className="text-sm font-semibold text-red-400 flex items-center gap-2 mb-4">
                <XCircle size={16} /> Skill Gaps
              </h3>
              <div className="space-y-3">
                {skillGaps.length > 0 ? (
                  skillGaps.slice(0, 5).map((gap, i) => ( // Limit to top 5
                    <div key={i} className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-300 text-sm">{gap.skill}</span>
                      <span className={`text-xs font-bold ${gap.priority === 'High' ? 'text-red-400' : gap.priority === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                        {gap.currentLevel}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 italic">No major skill gaps detected!</p>
                )}
              </div>
            </div>
          </div>

          {/* 3. SKILL GAPS / ROADMAP DETAILS */}
          <div className="rounded-2xl bg-[#161b22] p-6 border border-[#4452fe]/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award size={20} className="text-[#4452fe]" /> Priority Fixes
              </h3>
              <span className="text-xs text-gray-500">{preparationDays || 30} Day Plan</span>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {skillGaps.filter(g => g.priority === "High").length > 0 ? (
                skillGaps.filter(g => g.priority === "High").map((gap, index) => (
                  <div 
                    key={index}
                    className="rounded-lg bg-[#1c2431] p-4 transition hover:bg-[#222b3d] border-l-4 border-[#4452fe]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">{gap.skill}</h4>
                        <p className="text-xs text-gray-400 mt-1">{gap.reason}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-xs font-bold text-red-400`}>
                          {gap.priority} Priority
                        </span>
                        <span className="text-[10px] text-gray-500 mt-1">Score: {gap.score}/100</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 bg-[#0d1117] p-2 rounded text-xs text-blue-300 border border-blue-900/30">
                      <span className="font-bold text-blue-400">Recommended:</span> {gap.recommendedAction}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-6 text-sm">No high-priority skill gaps identified. Keep up the great work!</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          <div className="relative rounded-2xl bg-[#161b22] p-6 border border-[#4452fe]/30 flex flex-col items-center justify-center h-48">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4452fe]/5 to-transparent rounded-2xl"></div>
            <div className="relative text-center">
              <div className="text-4xl font-bold text-white mb-1">{overallScore}%</div>
              <p className="text-sm text-gray-400 mb-3">Overall Interview Readiness</p>
              <div className="inline-flex items-center gap-1 rounded-full bg-[#4452fe]/20 px-3 py-1 text-xs text-[#4452fe]">
                <Award size={12} />
                {overallScore >= 70 ? "Strong Profile" : overallScore >= 50 ? "Moderate Profile" : "Improvement Needed"}
              </div>
            </div>
          </div>

          {/* Breakdown Score Widgets based on CategoryScores */}
          <div className="space-y-4">
            {Object.entries(readiness.categoryScores).map(([key, value]) => (
              <div key={key} className="rounded-xl bg-[#161b22] p-4 border border-[#4452fe]/20">
                <div className="flex justify-between text-xs text-gray-400">
                  <span className="capitalize">{key}</span>
                  <span className="text-white">{value}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-[#1c2431]">
                  <div className="h-1.5 rounded-full bg-[#4452fe]" style={{ width: `${value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}