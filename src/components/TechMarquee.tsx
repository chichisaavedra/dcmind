import React, { useRef, useState } from 'react';
import { motion, useAnimationFrame, useSpring, useTransform, useMotionValue } from 'framer-motion';

const LOGOS = [
    'Claude 3.5 Sonnet',
    'OpenAI Vision',
    'Supabase Auth',
    'PostgreSQL',
    'Framer Motion',
    'React 18',
    'Tailwind v4',
    'Vercel',
    'Stripe'
];

export default function TechMarquee() {
    const baseX = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // La base velocity. Cuando haya hover, la bajaremos a 0.05
    const targetVelocity = useMotionValue(0.15); // Mucho más lento y fluido

    // Spring para suavizar el cambio de velocidad (progressive pause/resume)
    const velocitySpring = useSpring(targetVelocity, {
        stiffness: 30, // Más suave
        damping: 15,
        restDelta: 0.001
    });

    useAnimationFrame((time, delta) => {
        let moveBy = targetVelocity.get() * velocitySpring.get() * (delta / 16) * 1;

        // Si la velocidad spring es baja (cuando target es 0.05), el movimiento se ralentiza fluidamente
        let newX = baseX.get() - moveBy;

        // Asumiendo un ancho total por bloque para hacer el loop infinito sin saltos feos.
        // Usaremos un porcentaje para transformarlo luego.
        // Para simplificar, movemos de 0 a -50% y reseteamos, ya que doblamos el array.
        if (newX <= -50) {
            newX = 0;
        }
        baseX.set(newX);
    });

    const xTransform = useTransform(baseX, (v) => `${v}%`);

    const handleMouseEnter = () => targetVelocity.set(0.02); // Casi parado
    const handleMouseLeave = () => targetVelocity.set(0.15); // Velocidad crucero lenta

    // Duplicamos el array para el efecto carrusel infinito real
    const duplicatedLogos = [...LOGOS, ...LOGOS];

    return (
        <section className="py-24 bg-zinc-950 overflow-hidden relative select-none">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-[10px] tracking-[0.2em] text-zinc-500 text-center mb-16 font-black uppercase">
                    Potenciado por la mejor tecnología del mundo
                </p>
            </div>

            {/* Máscara de gradiente */}
            <div
                className="relative w-full overflow-hidden flex"
                style={{
                    maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handleMouseEnter}
                onTouchEnd={handleMouseLeave}
            >
                <motion.div
                    className="flex items-center gap-12 sm:gap-16 w-max flex-shrink-0"
                    style={{ x: xTransform, willChange: 'transform' }}
                >
                    {duplicatedLogos.map((logo, index) => {
                        const isHovered = hoveredIndex === index % LOGOS.length;

                        return (
                            <div
                                key={index}
                                className="flex items-center gap-12 sm:gap-16 flex-shrink-0 whitespace-nowrap cursor-default group"
                                onMouseEnter={() => setHoveredIndex(index % LOGOS.length)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <motion.span
                                    animate={{
                                        color: isHovered ? '#f4f4f5' : '#a1a1aa',
                                        textShadow: isHovered ? '0 0 15px rgba(255,255,255,0.5)' : '0 0 0px rgba(255,255,255,0)'
                                    }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight"
                                >
                                    {logo}
                                </motion.span>

                                {/* Bullet Estelar */}
                                <span className="text-orange-500/50 flex-shrink-0">✦</span>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
