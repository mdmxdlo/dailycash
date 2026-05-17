"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useStore } from "@/store/useStore";
import { Loader2, TrendingUp, ArrowRight, ArrowLeft, Check } from "lucide-react";

// ─── Data ───────────────────────────────────────────────────────────────────

const FREELANCE_TYPES = [
  { id: "dev",       emoji: "💻", label: "Développeur",     sub: "Web, mobile, logiciel" },
  { id: "design",    emoji: "🎨", label: "Designer",        sub: "UI/UX, graphisme, brand" },
  { id: "video",     emoji: "🎬", label: "Vidéaste/Monteur",sub: "Production, montage" },
  { id: "content",   emoji: "✍️", label: "Rédacteur",       sub: "Copywriting, blogging" },
  { id: "marketing", emoji: "📱", label: "Marketing",       sub: "Social media, ads" },
  { id: "consult",   emoji: "📊", label: "Consultant",      sub: "Stratégie, coaching" },
  { id: "photo",     emoji: "📷", label: "Photographe",     sub: "Portrait, événement" },
  { id: "other",     emoji: "🔧", label: "Autre",           sub: "Autre spécialité" },
];

const EXPERIENCE_LEVELS = [
  { id: "beginner",      emoji: "🌱", label: "Débutant",       sub: "Moins d'1 an" },
  { id: "intermediate",  emoji: "📈", label: "Intermédiaire",  sub: "1 à 3 ans" },
  { id: "expert",        emoji: "🏆", label: "Expert",         sub: "Plus de 3 ans" },
];

const CURRENCIES = [
  { value: "FCFA", label: "Franc CFA (FCFA)" },
  { value: "EUR",  label: "Euro (€)" },
  { value: "USD",  label: "Dollar ($)" },
  { value: "GNF",  label: "Franc Guinéen (GNF)" },
];

const CHALLENGES = [
  { id: "clients",  emoji: "🎯", label: "Trouver des clients",    sub: "Prospecter & convertir" },
  { id: "finance",  emoji: "💰", label: "Gérer mes finances",     sub: "Revenus & dépenses" },
  { id: "organize", emoji: "📅", label: "Rester organisé",        sub: "Tâches & priorités" },
  { id: "growth",   emoji: "🚀", label: "Faire croître mon CA",   sub: "Augmenter les revenus" },
];

// ─── Step components ─────────────────────────────────────────────────────────

function StepCard({ emoji, label, sub, selected, onClick }: {
  emoji: string; label: string; sub: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-3 ${
        selected
          ? "border-green-500 bg-green-50 shadow-sm shadow-green-100"
          : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/40"
      }`}
    >
      <span className="text-2xl shrink-0">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{sub}</p>
      </div>
      {selected && (
        <div className="shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [freelanceType, setFreelanceType] = useState("");
  const [experience, setExperience] = useState("");
  const [goal, setGoal] = useState("");
  const [currency, setCurrency] = useState("FCFA");
  const [challenge, setChallenge] = useState("");
  const [saving, setSaving] = useState(false);

  const TOTAL_STEPS = 3;

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/login"); return; }
      const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "";
      setUserName(name.split(" ")[0]);
    });
  }, []);

  const canNext = [
    freelanceType !== "",
    experience !== "" && goal !== "",
    challenge !== "",
  ];

  const handleFinish = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("profiles").update({
      freelance_type: freelanceType,
      goal: Number(goal) || 0,
      currency,
      onboarded: true,
    }).eq("id", user.id);

    useStore.setState({ isInitialized: false });
    router.push("/dashboard");
  };

  const stepTitles = [
    { title: "Ton métier freelance", sub: "Dis-nous ce que tu fais pour personnaliser ton expérience." },
    { title: "Tes objectifs financiers", sub: "Fixons ensemble ton cap pour les prochains mois." },
    { title: "Ton principal défi", sub: "On va t'aider à le surmonter dès le premier jour." },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-gray-900 text-lg">Daily Cash</span>
        </div>
        <span className="text-sm text-gray-400 font-medium">Étape {step + 1} sur {TOTAL_STEPS}</span>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-green-500 transition-all duration-500 ease-out"
          style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-lg">

          {/* Welcome message — only on step 0 */}
          {step === 0 && (
            <div className="text-center mb-8">
              <p className="text-4xl mb-3">👋</p>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
                Bienvenue{userName ? `, ${userName}` : ""} !
              </h1>
              <p className="text-gray-500 text-sm">2 minutes pour personnaliser ton Daily Cash.</p>
            </div>
          )}

          {/* Step heading */}
          <div className={step === 0 ? "" : "mb-6"}>
            {step > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-extrabold text-gray-900">{stepTitles[step].title}</h2>
                <p className="text-sm text-gray-500 mt-1">{stepTitles[step].sub}</p>
              </div>
            )}
          </div>

          {/* Step 0 — Freelance type */}
          {step === 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">{stepTitles[0].title}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FREELANCE_TYPES.map(t => (
                  <StepCard
                    key={t.id}
                    emoji={t.emoji}
                    label={t.label}
                    sub={t.sub}
                    selected={freelanceType === t.id}
                    onClick={() => setFreelanceType(t.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 1 — Finances */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Ton expérience freelance</p>
                <div className="grid grid-cols-3 gap-3">
                  {EXPERIENCE_LEVELS.map(e => (
                    <StepCard
                      key={e.id}
                      emoji={e.emoji}
                      label={e.label}
                      sub={e.sub}
                      selected={experience === e.id}
                      onClick={() => setExperience(e.id)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Objectif mensuel de revenus</p>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="0"
                      value={goal}
                      onChange={e => setGoal(e.target.value)}
                      placeholder="ex: 500 000"
                      className="w-full bg-white border-2 border-gray-200 focus:border-green-500 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all"
                    />
                  </div>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="bg-white border-2 border-gray-200 focus:border-green-500 rounded-2xl px-3 py-3 text-sm text-gray-900 focus:outline-none transition-all"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.value} value={c.value}>{c.value}</option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-gray-400 mt-2">Tu pourras modifier cela à tout moment dans les paramètres.</p>
              </div>
            </div>
          )}

          {/* Step 2 — Challenge */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CHALLENGES.map(c => (
                <StepCard
                  key={c.id}
                  emoji={c.emoji}
                  label={c.label}
                  sub={c.sub}
                  selected={challenge === c.id}
                  onClick={() => setChallenge(c.id)}
                />
              ))}
            </div>
          )}

          {/* Navigation */}
          <div className={`flex items-center ${step > 0 ? "justify-between" : "justify-end"} mt-8`}>
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
            )}

            {step < TOTAL_STEPS - 1 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={!canNext[step]}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-green-200"
              >
                Continuer
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canNext[step] || saving}
                className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-green-200"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Commencer Daily Cash</>}
              </button>
            )}
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i === step ? "w-6 h-2 bg-green-500" : i < step ? "w-2 h-2 bg-green-300" : "w-2 h-2 bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
