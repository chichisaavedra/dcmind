import React, { useState, useEffect, FormEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, BrainCircuit, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { AppSimulation } from './ui/AppSimulation';

interface LoginProps {
  onLogin: () => void;
}

const customEase = [0.16, 1, 0.3, 1];

/* ─────────────────────────────────────────────────────────────────
   3D ABSTRACT SCULPTURE  —  Pure CSS @keyframes on each disc.
   No Framer Motion for the loops → eliminates the jump bug.
   Mouse parallax applied only to the outer perspective wrapper.
───────────────────────────────────────────────────────────────── */
const DISCS = [
  // [width, height, bg, border, rotateX, rotateY, rotateZ, duration, delay, top, left, blurPx]
  ['min(65vw,700px)', 'min(65vw,700px)', 'radial-gradient(circle at 30% 40%, rgba(249,115,22,0.18) 0%, rgba(24,24,27,0.0) 70%)', 'rgba(249,115,22,0.12)', -30, 20, 0, 28, 0, '5%', '20%', 0],
  ['min(50vw,560px)', 'min(50vw,560px)', 'radial-gradient(circle at 70% 60%, rgba(120,113,108,0.15) 0%, rgba(24,24,27,0.0) 60%)', 'rgba(255,255,255,0.06)', 20, -30, 15, 34, 2, '25%', '55%', 0],
  ['min(45vw,500px)', 'min(45vw,500px)', 'radial-gradient(circle at 50% 30%, rgba(251,146,60,0.12) 0%, rgba(24,24,27,0.0) 65%)', 'rgba(251,146,60,0.10)', 40, 10, -20, 22, 1, '50%', '10%', 0],
  ['min(40vw,420px)', 'min(40vw,420px)', 'radial-gradient(circle at 40% 70%, rgba(255,255,255,0.06)  0%, rgba(24,24,27,0.0) 55%)', 'rgba(255,255,255,0.08)', -15, 40, 35, 40, 3, '55%', '65%', 0],
  ['min(35vw,380px)', 'min(35vw,380px)', 'radial-gradient(circle at 60% 40%, rgba(234,88,12,0.14)  0%, rgba(24,24,27,0.0) 60%)', 'rgba(234,88,12,0.10)', 25, -20, -10, 18, 0.5, '15%', '75%', 0],
  ['min(30vw,320px)', 'min(30vw,320px)', 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04) 0%, rgba(24,24,27,0.0) 50%)', 'rgba(255,255,255,0.06)', -40, -5, 20, 45, 4, '70%', '30%', 0],
] as const;

function Sculpture({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  const rx = useTransform(mouseX, [0, 1], [-8, 8]);
  const ry = useTransform(mouseY, [0, 1], [6, -6]);

  return (
    <>
      {/* Per-disc CSS @keyframes injected once */}
      <style>{`
        ${DISCS.map((_, i) => `
          @keyframes discSpin${i} {
            0%   { transform: rotateX(${DISCS[i][4]}deg) rotateY(${DISCS[i][5]}deg) rotateZ(${DISCS[i][6]}deg); }
            33%  { transform: rotateX(${(DISCS[i][4] as number) + 60}deg) rotateY(${(DISCS[i][5] as number) + 40}deg) rotateZ(${(DISCS[i][6] as number) + 20}deg); }
            66%  { transform: rotateX(${(DISCS[i][4] as number) + 160}deg) rotateY(${(DISCS[i][5] as number) + 200}deg) rotateZ(${(DISCS[i][6] as number) + 80}deg); }
            100% { transform: rotateX(${(DISCS[i][4] as number) + 360}deg) rotateY(${(DISCS[i][5] as number) + 360}deg) rotateZ(${(DISCS[i][6] as number) + 180}deg); }
          }
        `).join('')}
      `}</style>

      {/* Mouse-tracked outer wrapper */}
      <motion.div
        style={{ rotateX: ry, rotateY: rx, transformStyle: 'preserve-3d' }}
        className="absolute inset-0"
      >
        <div style={{ perspective: '1800px', width: '100%', height: '100%', position: 'relative' }}>
          {DISCS.map(([w, h, bg, border, , , , dur, delay, top, left], i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: w as string,
                height: h as string,
                top: top as string,
                left: left as string,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: bg as string,
                border: `1px solid ${border}`,
                animation: `discSpin${i} ${dur}s linear infinite`,
                animationDelay: `${delay}s`,
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                backdropFilter: 'blur(0px)',
              }}
            />
          ))}
        </div>
      </motion.div>
    </>
  );
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Mouse tracking for sculpture parallax
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);
  const mouseX = useSpring(rawX, { damping: 30, stiffness: 40 });
  const mouseY = useSpring(rawY, { damping: 30, stiffness: 40 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      rawX.set(e.clientX / window.innerWidth);
      rawY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [rawX, rawY]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/waitlist-signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al unirse a la lista');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al unirse a la lista');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 flex w-full overflow-hidden font-sans selection:bg-orange-500/30 selection:text-orange-200">

      {/* ── 3D SCULPTURE BACKGROUND (Full Screen) ── */}
      <div className="absolute inset-0 pointer-events-none">
        <Sculpture mouseX={mouseX} mouseY={mouseY} />
      </div>

      {/* Vignette to deepen edges & keep card readable */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(9,9,11,0.85) 100%)' }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-screen"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
      />

      {/* ── FLOATING LOGO ── */}
      <motion.a
        href="/"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: customEase }}
        className="absolute top-8 left-10 text-white font-black text-base tracking-tight uppercase z-50 hover:text-zinc-300 transition-colors"
      >
        DocMind
      </motion.a>

      {/* ── LEFT PANE: GLASS CARD ── */}
      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: customEase, delay: 0.15 }}
          className="w-full max-w-[420px]"
        >
          {/* Glass surface */}
          <div
            className="relative rounded-[2.5rem] p-10 overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.045)',
              backdropFilter: 'blur(48px) saturate(160%)',
              WebkitBackdropFilter: 'blur(48px) saturate(160%)',
              border: '1px solid rgba(255,255,255,0.10)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
            }}
          >
            {/* Inner glass shimmer — top edge highlight */}
            <div
              className="absolute top-0 left-8 right-8 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }}
            />

            {/* Logo mark */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: -6 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(249,115,22,0.25)',
                boxShadow: '0 0 28px rgba(249,115,22,0.18)',
              }}
            >
              <BrainCircuit size={28} className="text-orange-400" />
            </motion.div>

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full flex flex-col"
                >
                  {/* Title */}
                  <div className="text-center mb-8">
                    <h1 className="text-[1.4rem] font-black tracking-tight text-white mb-2">
                      Únete a la lista de espera
                    </h1>
                    <p className="text-zinc-400 text-xs font-medium leading-relaxed max-w-[280px] mx-auto">
                      DocMind está actualmente en beta cerrada. Déjanos tu correo y te avisaremos cuando se haga público.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Error */}
                    <AnimatePresence>
                      {errorMsg && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.93 }}
                          className="p-3 rounded-2xl text-xs font-bold text-center text-red-300"
                          style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)' }}
                        >
                          {errorMsg}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <GlassInput
                      icon={<Mail size={14} />}
                      type="email"
                      placeholder="nombre@empresa.com"
                      label="Email"
                      value={email}
                      onChange={(v) => setEmail(v)}
                      required
                      disabled={isSubmitting}
                    />

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting || !email}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative group w-full py-4 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 disabled:opacity-50 mt-4"
                      style={{
                        background: 'rgba(255,255,255,0.95)',
                        color: '#09090b',
                        boxShadow: '0 8px 32px rgba(255,255,255,0.12)',
                      }}
                    >
                      <span className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-4 group-hover:ring-orange-500/25 transition-all duration-300" />
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-zinc-300/30 border-t-zinc-800 rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="relative z-10">Anotarme</span>
                          <ArrowRight size={15} className="relative z-10 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="w-full flex flex-col items-center justify-center text-center py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mb-6">
                    <Mail className="text-orange-400" size={28} />
                  </div>
                  <h2 className="text-xl font-black text-white mb-3">¡Estás en la lista!</h2>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-[260px]">
                    Gracias por tu interés en DocMind. Te enviaremos un correo a <strong className="text-zinc-200">{email}</strong> en cuanto haya un espacio disponible.
                  </p>
                  <motion.a
                    href="/"
                    whileHover={{ scale: 1.05 }}
                    className="mt-8 text-xs font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Volver al inicio
                  </motion.a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Privacy note */}
          <p className="text-center text-[10px] text-zinc-700 font-medium mt-6">
            Al anotarte, aceptas nuestros{' '}
            <a href="/terms" className="text-zinc-500 hover:text-zinc-300 transition-colors">Términos</a>
            {' '}y{' '}
            <a href="/privacy" className="text-zinc-500 hover:text-zinc-300 transition-colors">Privacidad</a>.
          </p>
        </motion.div>
      </div>

      {/* ── RIGHT PANE: APP SIMULATION ── */}
      <div
        className="hidden lg:flex relative z-10 w-1/2 flex-col justify-between"
        style={{
          background: 'linear-gradient(150deg, rgba(13,13,13,0.92) 0%, rgba(17,17,17,0.98) 100%)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255,255,255,0.055)',
          padding: '48px 40px',
        }}
      >
        <div className="space-y-2">
          <h2 className="font-black text-white leading-[1.08] tracking-tight" style={{ fontSize: 'clamp(1.9rem, 2.6vw, 2.6rem)' }}>
            Preguntale a la IA.<br />
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>Obtené la respuesta.</span>
          </h2>
        </div>

        <div className="flex-1 mt-8 min-h-0" style={{ transformOrigin: 'center center' }}>
          <AppSimulation />
        </div>

        <div className="mt-6 flex items-center gap-8">
          {[
            { value: '10K+', label: 'Documentos analizados' },
            { value: '97%', label: 'Precisión promedio' },
            { value: '< 3s', label: 'Por respuesta' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-base font-black text-white">{value}</p>
              <p className="text-[10px] text-zinc-600">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Reusable glass input ── */
function GlassInput({ icon, type, placeholder, label, value, onChange, required, disabled }: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5 w-full text-left">
      <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest block">{label}</label>
      <div
        className="relative transition-all duration-300"
        style={{
          background: focused ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
          border: focused ? '1px solid rgba(249,115,22,0.35)' : '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1rem',
          boxShadow: focused ? '0 0 0 3px rgba(249,115,22,0.08)' : 'none',
        }}
      >
        <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none ${focused ? 'text-orange-400' : 'text-zinc-600'}`}>
          {icon}
        </span>
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full pl-11 pr-4 py-3.5 bg-transparent text-sm font-medium text-white placeholder:text-zinc-700 outline-none rounded-[1rem] disabled:opacity-50 transition-colors"
        />
      </div>
    </div>
  );
}
