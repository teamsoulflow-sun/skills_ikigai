import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  ArrowRight,
  Share2,
  Copy,
  Check,
  Loader2,
  Brain,
  MessageSquare
} from "lucide-react";
import Markdown from "react-markdown";
import confetti from "canvas-confetti";
import {
  SkillZone,
  STATEMENTS,
  SKILL_ZONES_INFO,
  AssessmentResult,
  AGE_BANDS,
  ROLE_CATEGORIES,
  PRIMARY_GOALS,
  EVIDENCE_MCQS,
  CONSTRAINT_MCQS
} from "./constants";
import { generateSkillReport } from "./services/geminiService";

type Step = "landing" | "basics" | "sectionA" | "sectionB" | "sectionC" | "loading" | "results";

export default function App() {
  const [step, setStep] = useState<Step>("landing");
  const [formData, setFormData] = useState({
    name: "",
    ageBand: "",
    roleCategory: "",
    primaryGoal: "",
    personalityType: "",
    evidenceMCQs: {} as Record<string, string>,
    evidenceReflective: "",
    constraintMCQs: {} as Record<string, string>,
    constraintReflective: "",
  });
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loadingMessage, setLoadingMessage] = useState("Analyzing your patterns...");
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Result sharing is now via summary copy only as we are moving to static hosting
  const handleStart = () => setStep("basics");

  const handleBasicsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.ageBand || !formData.roleCategory || !formData.primaryGoal) {
      alert("Please select all options.");
      return;
    }
    setStep("sectionA");
  };

  const handleSectionASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("sectionB");
  };

  const handleSliderChange = (statementId: string, value: number) => {
    setScores(prev => ({ ...prev, [statementId]: value }));
  };

  const calculateFinalScores = () => {
    const zoneScores: Record<string, number> = {};
    Object.values(SkillZone).forEach(zone => {
      const zoneStatements = STATEMENTS.filter(s => s.zone === zone);
      const sum = zoneStatements.reduce((acc, s) => acc + (scores[s.id] || 3), 0);
      zoneScores[zone] = sum;
    });
    return zoneScores as Record<SkillZone, number>;
  };

  const handleSectionBSubmit = () => {
    setStep("sectionC");
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("loading");

    const finalScores = calculateFinalScores();
    const id = Math.random().toString(36).substring(2, 15);

    const initialResult: AssessmentResult = {
      id,
      ...formData,
      scores: finalScores,
      createdAt: new Date().toISOString(),
    };

    const messages = [
      "Consulting the Oracle...",
      "Architecting your skill stack...",
      "Alchemizing your evidence...",
      "Amplifying your hidden strengths...",
      "Finalizing your SoulGrow diagnostic..."
    ];

    let msgIndex = 0;
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingMessage(messages[msgIndex]);
    }, 2000);

    try {
      const report = await generateSkillReport(initialResult);
      const finalResult = { ...initialResult, report };

      setResult(finalResult);
      setStep("results");
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#5A5A40", "#f5f5f0", "#1a1a1a"]
      });
    } catch (error) {
      console.error("Submission error:", error);
      setStep("sectionC");
      alert("Something went wrong. Please try again.");
    } finally {
      clearInterval(interval);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `SoulGrow Skill Diagnostic Result for ${result.name}\n\n${result.report}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    if (!result) return;
    const text = encodeURIComponent(`I just completed my SoulGrow Skill Stack! 🌿\n\nGet your diagnostic here: ${window.location.origin}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const MCQGroup = ({ title, options, value, onChange }: { title: string, options: any[], value: string, onChange: (val: string) => void }) => (
    <div className="space-y-4">
      <label className="text-sm uppercase tracking-wider font-semibold opacity-70">{title}</label>
      <div className="grid grid-cols-1 gap-3">
        {options.map(opt => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`p-4 rounded-2xl text-left border transition-all ${value === opt.id
              ? "bg-brand-olive text-white border-brand-olive shadow-md"
              : "bg-white border-brand-ink/10 hover:border-brand-olive/50"
              }`}
          >
            <span className="text-base md:text-lg font-serif">{opt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {step === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <div className="mb-8 inline-block p-4 rounded-full bg-brand-olive/10">
              <Sparkles className="w-12 h-12 text-brand-olive" />
            </div>
            <h1 className="text-4xl md:text-6xl font-display mb-6 leading-tight">
              Skill Clarity <br /><span className="italic">Diagnostic</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-brand-ink/70 max-w-md mx-auto leading-relaxed px-4">
              A psychologically intelligent assessment to uncover your unique superpowers and align with your Ikigai.
            </p>
            <button
              onClick={handleStart}
              className="bg-brand-olive text-white px-10 py-4 rounded-full text-lg font-medium hover:opacity-90 transition-all flex items-center gap-2 mx-auto"
            >
              Begin Assessment <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-6 text-sm text-brand-ink/40 uppercase tracking-widest">Takes 6–8 minutes</p>
          </motion.div>
        )}

        {step === "basics" && (
          <motion.form
            key="basics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleBasicsSubmit}
            className="w-full space-y-10 py-8"
          >
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-display">The Basics</h2>
              <p className="text-brand-ink/60 text-sm md:text-base">Let's start with who you are.</p>
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-sm uppercase tracking-wider font-semibold opacity-70">Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border-b border-brand-ink/20 p-3 focus:border-brand-olive outline-none text-xl font-serif"
                  placeholder="Your Name"
                />
              </div>

              <MCQGroup
                title="Age Band"
                options={AGE_BANDS}
                value={formData.ageBand}
                onChange={val => setFormData({ ...formData, ageBand: val })}
              />

              <MCQGroup
                title="Current Role Category"
                options={ROLE_CATEGORIES}
                value={formData.roleCategory}
                onChange={val => setFormData({ ...formData, roleCategory: val })}
              />

              <MCQGroup
                title="Primary Goal"
                options={PRIMARY_GOALS}
                value={formData.primaryGoal}
                onChange={val => setFormData({ ...formData, primaryGoal: val })}
              />

              <div className="space-y-2">
                <label className="text-sm uppercase tracking-wider font-semibold opacity-70">16P Type (Optional)</label>
                <input
                  type="text"
                  value={formData.personalityType}
                  onChange={e => setFormData({ ...formData, personalityType: e.target.value })}
                  className="w-full bg-white border-b border-brand-ink/20 p-3 focus:border-brand-olive outline-none text-xl font-serif uppercase"
                  placeholder="e.g. INFJ"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-olive text-white py-4 rounded-full text-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              Next Step <ChevronRight className="w-5 h-5" />
            </button>
          </motion.form>
        )}

        {step === "sectionA" && (
          <motion.form
            key="sectionA"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleSectionASubmit}
            className="w-full space-y-10 py-8"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-display italic">Section A: Evidence</h2>
              <p className="text-brand-ink/60">Let's look at your moments of flow and impact.</p>
            </div>

            <div className="space-y-8">
              {EVIDENCE_MCQS.map(mcq => (
                <MCQGroup
                  key={mcq.id}
                  title={mcq.question}
                  options={mcq.options}
                  value={formData.evidenceMCQs[mcq.id] || ""}
                  onChange={val => setFormData({
                    ...formData,
                    evidenceMCQs: { ...formData.evidenceMCQs, [mcq.id]: val }
                  })}
                />
              ))}

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand-olive">
                  <MessageSquare className="w-5 h-5" />
                  <label className="text-sm uppercase tracking-wider font-semibold opacity-70">Reflective Prompt</label>
                </div>
                <p className="text-brand-ink/60 text-sm italic">
                  Think of a specific time you felt most 'in flow'. <br />
                  • What exactly were you doing? <br />
                  • What was the outcome for others? <br />
                  • Why did it feel effortless?
                </p>
                <textarea
                  required
                  value={formData.evidenceReflective}
                  onChange={e => setFormData({ ...formData, evidenceReflective: e.target.value })}
                  rows={6}
                  className="w-full bg-white border border-brand-ink/10 rounded-2xl p-6 focus:border-brand-olive outline-none text-lg font-serif leading-relaxed shadow-sm"
                  placeholder="Describe your flow state in detail..."
                  style={{ fontSize: '16px' }}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep("basics")}
                className="flex-1 border border-brand-olive text-brand-olive py-4 rounded-full text-lg font-medium hover:bg-brand-olive/5 transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
              <button
                type="submit"
                className="flex-[2] bg-brand-olive text-white py-4 rounded-full text-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Next Step <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.form>
        )}

        {step === "sectionB" && (
          <motion.div
            key="sectionB"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full space-y-12 py-8"
          >
            <div className="space-y-2 sticky top-0 bg-brand-paper/90 backdrop-blur-sm py-4 z-10 border-b border-brand-ink/5">
              <h2 className="text-3xl font-display italic">Section B: Resonance</h2>
              <p className="text-brand-ink/60">Rate how much these statements feel like 'you' (1-5).</p>
            </div>

            <div className="space-y-16">
              {STATEMENTS.map((s, index) => (
                <div key={s.id} className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <span className="text-sm font-mono opacity-30 mt-1">{(index + 1).toString().padStart(2, '0')}</span>
                    <p className="text-lg md:text-xl leading-snug">{s.text}</p>
                  </div>
                  <div className="flex justify-between items-center gap-4 px-2">
                    <span className="text-xs uppercase tracking-tighter opacity-40">Not me</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={scores[s.id] || 3}
                      onChange={e => handleSliderChange(s.id, parseInt(e.target.value))}
                      className="flex-1 accent-brand-olive h-1 bg-brand-ink/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs uppercase tracking-tighter opacity-40">Exactly me</span>
                  </div>
                  <div className="flex justify-center">
                    <span className="text-brand-olive font-display text-2xl">{scores[s.id] || 3}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-8">
              <button
                type="button"
                onClick={() => setStep("sectionA")}
                className="flex-1 border border-brand-olive text-brand-olive py-4 rounded-full text-lg font-medium hover:bg-brand-olive/5 transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
              <button
                onClick={handleSectionBSubmit}
                className="flex-[2] bg-brand-olive text-white py-4 rounded-full text-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === "sectionC" && (
          <motion.form
            key="sectionC"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={handleFinalSubmit}
            className="w-full space-y-10 py-8"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-display italic">Section C: Constraints</h2>
              <p className="text-brand-ink/60">What is holding you back from your next level?</p>
            </div>

            <div className="space-y-8">
              {CONSTRAINT_MCQS.map(mcq => (
                <MCQGroup
                  key={mcq.id}
                  title={mcq.question}
                  options={mcq.options}
                  value={formData.constraintMCQs[mcq.id] || ""}
                  onChange={val => setFormData({
                    ...formData,
                    constraintMCQs: { ...formData.constraintMCQs, [mcq.id]: val }
                  })}
                />
              ))}

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand-olive">
                  <MessageSquare className="w-5 h-5" />
                  <label className="text-sm uppercase tracking-wider font-semibold opacity-70">Reflective Prompt</label>
                </div>
                <p className="text-brand-ink/60 text-sm italic">
                  Be honest with yourself about your current environment. <br />
                  • What is the one thing you want to achieve this year? <br />
                  • What internal or external noise is stopping you? <br />
                  • What would change if you had total clarity?
                </p>
                <textarea
                  required
                  value={formData.constraintReflective}
                  onChange={e => setFormData({ ...formData, constraintReflective: e.target.value })}
                  rows={6}
                  className="w-full bg-white border border-brand-ink/10 rounded-2xl p-6 focus:border-brand-olive outline-none text-lg font-serif leading-relaxed shadow-sm"
                  placeholder="Reflect on your growth edge..."
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep("sectionB")}
                className="flex-1 border border-brand-olive text-brand-olive py-4 rounded-full text-lg font-medium hover:bg-brand-olive/5 transition-all flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>
              <button
                type="submit"
                className="flex-[2] bg-brand-olive text-white py-4 rounded-full text-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Generate My Report <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </motion.form>
        )}

        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center space-y-8"
          >
            <div className="relative">
              <Loader2 className="w-16 h-16 text-brand-olive animate-spin" />
              <Brain className="w-8 h-8 text-brand-olive absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-display italic animate-pulse">{loadingMessage}</h2>
              <p className="text-brand-ink/40 uppercase tracking-widest text-xs">This may take up to 30 seconds</p>
            </div>
          </motion.div>
        )}

        {step === "results" && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-12 py-8"
          >
            <div className="text-center space-y-4">
              <div className="inline-block px-4 py-1 rounded-full border border-brand-olive/30 text-brand-olive text-xs uppercase tracking-widest mb-2">
                Diagnostic Complete
              </div>
              <h2 className="text-5xl font-display">Your Skill Stack, <br /><span className="italic">{result.name}</span></h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {Object.entries(result.scores)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([zone, score], i) => (
                  <div key={zone} className="bg-white p-8 rounded-3xl shadow-sm border border-brand-ink/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <span className="text-8xl font-display">0{i + 1}</span>
                    </div>
                    <h3 className="text-2xl font-display mb-2">{zone}</h3>
                    <p className="text-brand-ink/60 mb-4">{SKILL_ZONES_INFO[zone as SkillZone].description}</p>
                    <div className="flex flex-wrap gap-2">
                      {SKILL_ZONES_INFO[zone as SkillZone].traits.map(trait => (
                        <span key={trait} className="px-3 py-1 bg-brand-olive/10 text-brand-olive text-xs rounded-full uppercase tracking-wider">{trait}</span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            <div className="bg-brand-olive text-white p-8 rounded-3xl shadow-lg space-y-4">
              <div className="flex items-center gap-2 text-white/70 uppercase tracking-widest text-xs font-semibold">
                <Target className="w-4 h-4" /> Hidden Strength
              </div>
              <h3 className="text-3xl font-display italic">
                {Object.entries(result.scores).sort(([, a], [, b]) => b - a)[3][0]}
              </h3>
              <p className="text-white/80 leading-relaxed">
                This is your unused superpower. It's the skill that often sits in the background but has the potential to multiply your impact when intentionally activated.
              </p>
            </div>

            <div className="markdown-body bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-brand-ink/5">
              <Markdown>{result.report}</Markdown>
            </div>

            <div className="flex flex-col gap-4 pt-8">
              <div className="flex gap-4">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-white border border-brand-ink/10 py-4 rounded-full text-lg font-medium hover:bg-brand-ink/5 transition-all flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                  {copied ? "Copied!" : "Copy Summary"}
                </button>
                <button
                  onClick={shareToWhatsApp}
                  className="flex-1 bg-brand-olive text-white py-4 rounded-full text-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" /> Share Result
                </button>
              </div>
              <button
                onClick={() => {
                  window.location.href = window.location.origin;
                }}
                className="text-brand-ink/40 uppercase tracking-widest text-xs font-semibold hover:text-brand-ink transition-colors"
              >
                Retake Assessment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-auto py-12 text-center opacity-30 text-xs uppercase tracking-[0.2em]">
        SoulGrow &copy; {new Date().getFullYear()} — Zen Gym for the Soul
      </footer>
    </div>
  );
}
