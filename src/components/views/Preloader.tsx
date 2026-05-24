import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Simulamos la carga ultra rápida
        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev + Math.floor(Math.random() * 15) + 5;
                if (next >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setIsExiting(true), 400); // Pequeña pausa al 100%
                    return 100;
                }
                return next;
            });
        }, 150);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence onExitComplete={onComplete}>
            {!isExiting && (
                <motion.div
                    key="preloader"
                    // Salida cinemática tipo cortina subiendo o desvaneciéndose
                    exit={{ opacity: 0, y: "-10vh" }}
                    transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[10000] bg-zinc-950 flex flex-col items-center justify-center text-white"
                >
                    {/* Logo / Número */}
                    <div className="flex flex-col items-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-2xl md:rounded-[1.5rem] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.15)] overflow-hidden relative"
                        >
                            {/* Animación estilo fill */}
                            <motion.div
                                className="absolute bottom-0 inset-x-0 bg-zinc-900"
                                initial={{ height: "100%" }}
                                animate={{ height: `${100 - progress}%` }}
                                transition={{ duration: 0.2 }}
                            />
                            <span className="text-zinc-950 font-black text-2xl md:text-3xl relative z-10 tracking-tighter mix-blend-difference text-white">
                                DM
                            </span>
                        </motion.div>

                        <div className="flex items-center gap-1 font-mono text-zinc-500 text-sm">
                            <span className="w-8 text-right text-zinc-300 font-medium">{progress}</span>
                            <span>%</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
