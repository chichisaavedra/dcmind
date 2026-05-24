import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Scale, Building2, Briefcase, Stethoscope,
  Code2, FlaskConical, MoreHorizontal, Check, Sparkles, BrainCircuit, ArrowRight
} from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import { supabase } from '../lib/supabase';

interface OnboardingProps {
  onComplete: () => void;
}

const PROFILES = [
  { id: 'estudiante', label: 'Estudiante', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'abogado', label: 'Abogado / Legal', icon: Scale, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'contador', label: 'Contador', icon: Building2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'empresario', label: 'Empresario / Ejecutivo', icon: Briefcase, color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'medico', label: 'Profesional de la Salud', icon: Stethoscope, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'dev', label: 'Ing. / Desarrollador', icon: Code2, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'investigador', label: 'Investigador Académico', icon: FlaskConical, color: 'text-teal-500', bg: 'bg-teal-50' },
  { id: 'otro', label: 'Otro...', icon: MoreHorizontal, color: 'text-gray-500', bg: 'bg-gray-50' },
];

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '60%' : '-60%',
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction < 0 ? '60%' : '-60%',
    opacity: 0,
  }),
};

const pageTransition = { type: 'spring', stiffness: 280, damping: 30 };

/**
 * `Onboarding`
 * 
 * Flujo de bienvenida inicial para nuevos usuarios tras el login.
 * Recopila el rol/profesión del usuario y sus objetivos principales
 * para almacenar en la tabla `profiles` de Supabase y así personalizar la IA.
 * 
 * @param onComplete - Función ejecutada al finalizar el guardado exitoso
 */
export default function Onboarding({ onComplete }: OnboardingProps) {
  // Manejo de pasos: 0 = Perfil (Ocupación), 1 = Objetivo (Prompt base)
  const [step, setStep] = useState(0);       // 0 = profile, 1 = goal
  const [direction, setDirection] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [otherDescription, setOtherDescription] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const goToStep = (nextStep: number) => {
    setDirection(nextStep > step ? 1 : -1);
    setStep(nextStep);
  };

  const handleFinish = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const roleLabel = selectedProfile === 'otro'
          ? otherDescription
          : PROFILES.find(p => p.id === selectedProfile)?.label ?? selectedProfile;

        // UPDATE profiles table — columns: user_role, user_role_description, ai_context_goal
        await supabase.from('profiles').upsert({
          id: user.id,
          user_role: selectedProfile,
          user_role_description: selectedProfile === 'otro' ? otherDescription : roleLabel,
          ai_context_goal: customGoal,
          onboarded_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      // If profiles table isn't set up yet, continue anyway
      console.warn('Supabase profiles update pending:', err);
    } finally {
      localStorage.setItem('docmind_onboarded', 'true');
      setIsSaving(false);
      onComplete();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-gradient-to-br from-[#f8f9fa] to-[#eef2f5] selection:bg-indigo-100 selection:text-indigo-900">
      <ParticleBackground density={0.00015} globalOpacity={0.5} />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" style={{ animation: 'pulse 6s ease-in-out infinite' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-5xl bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.10)] border border-white/80 overflow-hidden flex flex-col md:flex-row"
      >

        {/* ─── Left Panel ─── */}
        <div className="md:w-5/12 bg-gray-900 p-10 lg:p-14 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
              <BrainCircuit size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Conozcámonos.</h1>
            <p className="text-gray-300 font-medium leading-relaxed text-sm">
              Vamos a personalizar tu caja fuerte digital. Selecciona tu perfil y cuéntanos para qué usarás la app — la IA adaptará su terminología a tu flujo de trabajo real.
            </p>

            {/* Step indicator */}
            <div className="flex gap-2 mt-10">
              {[0, 1].map(i => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-500 ${step === i ? 'w-10 bg-white' : 'w-3 bg-white/20'}`}
                />
              ))}
            </div>
          </div>

          {/* AI note card */}
          <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-3xl">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Sparkles size={12} /> Nota de IA
            </p>
            <p className="text-xs font-medium text-gray-300 leading-relaxed">
              "Recordaré todos los nombres, proveedores y entidades importantes que me comentes aquí para personalizar cada respuesta futura."
            </p>
          </div>
        </div>

        {/* ─── Right Panel ─── */}
        <div className="md:w-7/12 p-8 lg:p-12 relative overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">

            {/* ── STEP 0: Profile Selection ── */}
            {step === 0 && (
              <motion.div
                key="step-profiles"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="space-y-8"
              >
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Paso 1 de 2</p>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">¿A qué te dedicas?</h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    Cuéntanos un poco más sobre lo que haces para que la IA adapte su terminología a tu flujo de trabajo.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {PROFILES.map(({ id, label, icon: Icon, color, bg }) => {
                    const isSelected = selectedProfile === id;
                    return (
                      <motion.button
                        key={id}
                        onClick={() => setSelectedProfile(id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className={`relative p-4 rounded-2xl border-2 transition-colors flex items-center gap-3 text-left
                          ${isSelected
                            ? 'border-gray-900 bg-gray-900 text-white shadow-lg shadow-gray-300/30'
                            : 'border-transparent bg-white shadow-sm hover:border-gray-200 text-gray-600'
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/20' : bg}`}>
                          <Icon size={20} className={isSelected ? 'text-white' : color} />
                        </div>
                        <span className="font-bold text-sm tracking-tight leading-snug">{label}</span>
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <Check size={16} strokeWidth={3} className="text-white" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* "Otro" custom description  — pop-in effect */}
                <AnimatePresence>
                  {selectedProfile === 'otro' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    >
                      <input
                        autoFocus
                        type="text"
                        value={otherDescription}
                        onChange={e => setOtherDescription(e.target.value)}
                        placeholder="Ej: Diseñador gráfico, Consultor fiscal, Músico..."
                        className="w-full px-5 py-4 bg-white border-2 border-indigo-200 rounded-2xl text-sm font-medium text-gray-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-end">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => goToStep(1)}
                    disabled={!selectedProfile || (selectedProfile === 'otro' && !otherDescription.trim())}
                    className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-black shadow-xl shadow-gray-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continuar
                    <ArrowRight size={18} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 1: Context Goal ── */}
            {step === 1 && (
              <motion.div
                key="step-goal"
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={pageTransition}
                className="space-y-8"
              >
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Paso 2 de 2</p>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">¿Qué necesitas que resuelva la IA?</h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    Opcional pero poderoso. Cuéntale a tu IA personal cuál es tu mayor desafío documental y quiénes son tus clientes o proveedores principales.
                  </p>
                </div>

                <textarea
                  autoFocus
                  className="w-full h-44 p-6 bg-white border-2 border-transparent rounded-[1.5rem] focus:border-indigo-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all duration-300 text-sm font-medium text-gray-900 shadow-sm resize-none"
                  placeholder={`Ej: Soy ${PROFILES.find(p => p.id === selectedProfile)?.label ?? 'profesional'} y quiero que me resumas contratos y detectes fechas clave. Mis clientes principales son Empresa ABC y Acme Corp...`}
                  value={customGoal}
                  onChange={e => setCustomGoal(e.target.value)}
                />

                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => goToStep(0)}
                    className="text-sm font-bold text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    ← Atrás
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleFinish}
                    disabled={isSaving}
                    className="group relative px-10 py-4 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-black shadow-xl shadow-gray-200 transition-all duration-300 active:scale-[0.98] disabled:opacity-60 flex items-center gap-3"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] rounded-full" />
                    {isSaving ? 'Guardando...' : 'Comenzar a usar DocMind'}
                    <Sparkles size={16} className="text-indigo-400 group-hover:text-white transition-colors" />
                  </motion.button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
