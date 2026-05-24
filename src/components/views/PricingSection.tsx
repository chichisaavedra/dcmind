import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../hooks/useTranslation';

const PLANS = [
    {
        name: 'FREE',
        description: 'Prueba DocMind gratis. Perfecto para empezar.',
        priceMonthly: '$0',
        priceAnnual: '$0',
        features: ['10 archivos procesados / mes', '3 imágenes OCR / mes', '5 chatbot queries / mes', 'Categorización automática', '500MB almacenamiento'],
        highlighted: false
    },
    {
        name: 'STARTER',
        description: 'Para uso casual. Organiza tu conocimiento personal.',
        priceMonthly: '$7',
        priceAnnual: '$5.95',
        features: ['50 archivos procesados / mes', '15 imágenes OCR / mes', '20 chatbot queries / mes', '10 reglas personalizadas', '2GB almacenamiento', 'Claude 3.5 Sonnet'],
        highlighted: false
    },
    {
        name: 'PRO',
        description: 'Para profesionales con requerimientos avanzados.',
        priceMonthly: '$15',
        priceAnnual: '$12.75',
        features: ['150 archivos procesados / mes', '30 imágenes OCR / mes', '30 chatbot queries / mes', '25 reglas personalizadas', '5GB almacenamiento', 'Procesamiento prioritario', 'Soporte VIP'],
        highlighted: true
    }
];

export default function PricingSection() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <section id="pricing" className="py-32 bg-zinc-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Encabezado */}
                <div className="flex flex-col items-center text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400">
                        Inversión transparente.
                    </h2>
                    <p className="text-zinc-400 font-medium text-lg">
                        Ahorra 2 meses con el plan anual.
                    </p>

                    {/* Toggle Switch */}
                    <div className="mt-8 flex items-center p-1 bg-zinc-900 ring-1 ring-white/10 rounded-full relative">
                        {['Mensual', 'Anual'].map((cycle) => {
                            const isActive = (cycle === 'Anual') === isAnnual;
                            return (
                                <button
                                    key={cycle}
                                    onClick={() => setIsAnnual(cycle === 'Anual')}
                                    className={cn(
                                        "relative px-6 py-2.5 text-sm font-bold rounded-full transition-colors z-10",
                                        isActive ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="pricing-pill"
                                            className="absolute inset-0 bg-zinc-800 rounded-full shadow-md z-[-1]"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    {cycle}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tarjetas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
                    {PLANS.map((plan, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                                "relative flex flex-col p-8 rounded-[2rem] bg-zinc-900/30 backdrop-blur-xl border transition-colors h-full",
                                plan.highlighted
                                    ? "border-orange-500/50 shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)] bg-gradient-to-b from-zinc-900/80 to-orange-900/10"
                                    : "border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/50"
                            )}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-orange-500 text-white text-[10px] uppercase tracking-widest font-black rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(249,115,22,0.5)]">
                                    <Sparkles size={12} />
                                    Más Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-sm text-zinc-500 mb-6 min-h-[40px]">{plan.description}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-white">
                                        {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                                    </span>
                                    {plan.priceMonthly !== 'Personalizado' && (
                                        <span className="text-zinc-500 font-medium">/mes</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1">
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <CheckCircle2 size={18} className={plan.highlighted ? "text-orange-400 mt-0.5" : "text-zinc-600 mt-0.5"} />
                                            <span className="text-zinc-300 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={() => navigate('/login')}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold transition-all",
                                    plan.highlighted
                                        ? "bg-white text-black hover:bg-zinc-200"
                                        : "bg-zinc-800 text-white hover:bg-zinc-700"
                                )}
                            >
                                {plan.priceMonthly === 'Personalizado' ? 'Contactar Ventas' : 'Comenzar Gratis'}
                            </button>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
