import React, { useEffect, useState, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, FileText, Image as ImageIcon, Layout, FileType } from 'lucide-react';

export default function LandingHero() {
    const navigate = useNavigate();
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const [isHoverable, setIsHoverable] = useState(false);
    const [showSubtitle, setShowSubtitle] = useState(false);

    useEffect(() => {
        const hoverMedia = window.matchMedia('(hover: hover)');
        setIsHoverable(hoverMedia.matches);

        const updateHoverState = (e: MediaQueryListEvent) => setIsHoverable(e.matches);
        hoverMedia.addEventListener('change', updateHoverState);

        const handleMouseMove = (e: MouseEvent) => {
            if (!hoverMedia.matches) return;
            mouseX.set(e.clientX / window.innerWidth);
            mouseY.set(e.clientY / window.innerHeight);
        };
        const handleMouseLeave = () => {
            if (!hoverMedia.matches) return;
            mouseX.set(0.5);
            mouseY.set(0.5);
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.documentElement.addEventListener('mouseleave', handleMouseLeave);

        const t = setTimeout(() => setShowSubtitle(true), 1800);

        return () => {
            hoverMedia.removeEventListener('change', updateHoverState);
            window.removeEventListener('mousemove', handleMouseMove);
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
            clearTimeout(t);
        };
    }, [mouseX, mouseY]);

    const springConfig = { damping: 22, stiffness: 45, mass: 1.2 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);
    const rotateX = useTransform(smoothY, [0, 1], [12, -12]);
    const rotateY = useTransform(smoothX, [0, 1], [-12, 12]);

    const customEase = [0.16, 1, 0.3, 1];

    const wordVariants = {
        hidden: { opacity: 0, filter: 'blur(20px)', y: 40, scale: 1.05 },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            scale: 1,
            transition: { duration: 1.3, ease: customEase }
        }
    };

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.14 } }
    };

    const floatingDocs = useMemo(() => {
        const types = [FileText, ImageIcon, Layout, FileType];
        return Array.from({ length: 16 }).map((_, i) => {
            const y = i % 4;
            const S = Math.floor(i / 4);
            const ne = (y - 1.5) * 120 + (Math.random() - 0.5) * 80;
            const ee = (S - 1.5) * 120 + (Math.random() - 0.5) * 80;
            const B = (Math.random() - 0.5) * 500;
            const fe = 12 + Math.random() * 8;
            const le = (Math.random() - 0.5) * 100;

            return {
                id: i,
                ne, // marginLeft (X grid pos)
                ee, // marginTop (Y grid pos)
                B,  // translateZ
                fe, // duration
                le, // initial rotation
                Icon: types[i % 4],
                opacity: 0.4 + Math.random() * 0.6
            };
        });
    }, []);

    const renderFloatingDocs = () => {
        return (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-end -z-10" style={{ perspective: "1400px" }}>
                <motion.div
                    style={{
                        rotateX: isHoverable ? rotateX : 0,
                        rotateY: isHoverable ? rotateY : 0,
                        transformStyle: "preserve-3d"
                    }}
                    className="w-full md:w-[60%] h-[80%] flex items-center justify-center relative translate-x-[15%] md:translate-x-0"
                >
                    {floatingDocs.map((doc) => {
                        const IconComponent = doc.Icon;
                        const ce = `float-${doc.id}`;

                        return (
                            <React.Fragment key={doc.id}>
                                <style>{`
                                    @keyframes ${ce} {
                                        from {
                                            transform: rotateX(${doc.le}deg) rotateY(${doc.le * 0.6}deg) rotateZ(${doc.le * 0.3}deg);
                                        }
                                        to {
                                            transform: rotateX(${doc.le + 360}deg) rotateY(${doc.le * 0.6 + 240}deg) rotateZ(${doc.le * 0.3 + 120}deg);
                                        }
                                    }
                                `}</style>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: doc.opacity, scale: 1 }}
                                    transition={{
                                        opacity: { duration: 1.2, delay: 0.3 + doc.id * 0.07 },
                                        scale: { duration: 1, type: "spring", stiffness: 90, damping: 22, delay: 0.3 + doc.id * 0.07 }
                                    }}
                                    style={{
                                        position: "absolute",
                                        left: "50%",
                                        top: "50%",
                                        marginLeft: `${doc.ne}px`,
                                        marginTop: `${doc.ee}px`,
                                        translateZ: doc.B,
                                        willChange: "transform"
                                    }}
                                >
                                    <div
                                        style={{
                                            animation: `${ce} ${doc.fe}s linear infinite`,
                                            transformStyle: "preserve-3d",
                                            willChange: "transform"
                                        }}
                                        className="w-20 h-28 md:w-28 md:h-40 bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-3 md:p-4 flex flex-col justify-start items-start shadow-2xl"
                                    >
                                        <IconComponent className="text-white/30 mb-auto" size={18} />
                                        <div className="w-full h-[2px] bg-white/10 rounded-full mb-1.5" />
                                        <div className="w-3/4 h-[2px] bg-white/10 rounded-full mb-1.5" />
                                        <div className="w-1/2 h-[2px] bg-white/10 rounded-full" />
                                    </div>
                                </motion.div>
                            </React.Fragment>
                        );
                    })}
                </motion.div>
            </div>
        );
    };

    return (
        <div className="relative min-h-screen bg-zinc-950 overflow-hidden font-sans selection:bg-orange-500/30 selection:text-orange-200">
            {/* Film Grain */}
            <div
                className="absolute inset-0 z-10 opacity-[0.025] pointer-events-none mix-blend-screen"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
            />

            {/* Massive Ambient Glow */}
            <motion.div
                animate={{ scale: [1, 1.06, 1], opacity: [0.25, 0.35, 0.25] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 right-0 md:right-[10%] -translate-y-1/2 w-[90vw] h-[90vw] max-w-[1100px] bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-orange-500/20 via-red-900/8 to-transparent blur-[130px] rounded-full z-[0] pointer-events-none"
            />

            {/* ── Glassmorphism Pill Navbar ── */}
            <motion.nav
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.1, ease: customEase }}
                className="fixed top-0 left-0 right-0 z-50 px-4 md:px-10 py-4"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between bg-zinc-950/60 backdrop-blur-xl border border-white/8 rounded-2xl px-5 py-3 shadow-2xl shadow-black/30">
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="text-white font-black text-base tracking-tight uppercase cursor-pointer hover:text-zinc-300 transition-colors"
                    >
                        DocMind
                    </a>

                    <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                        <a onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors duration-300 cursor-pointer">Características</a>
                        <a onClick={(e) => { e.preventDefault(); document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors duration-300 cursor-pointer">Filosofía</a>
                        <a onClick={(e) => { e.preventDefault(); document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white transition-colors duration-300 cursor-pointer">Planes</a>
                    </div>

                    <motion.button
                        onClick={() => navigate('/login')}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        className="px-5 py-2 text-[11px] font-bold text-white uppercase tracking-widest rounded-full border border-white/15 bg-white/5 hover:bg-white hover:text-black transition-all duration-300"
                    >
                        Comenzar
                    </motion.button>
                </div>
            </motion.nav>

            {/* ── 3D Floating Core ── */}
            <div className="relative z-20 w-full h-screen flex flex-col justify-end pb-16 md:pb-24 overflow-hidden px-6 md:px-12 pointer-events-none">
                <div className="absolute inset-0 pointer-events-none z-[-10]">
                    <div className="absolute inset-0 w-full h-full">
                        {renderFloatingDocs()}
                    </div>
                </div>

                {/* ── Hero Typography — font-sans unificado ── */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-7xl pt-40"
                    style={{ pointerEvents: 'auto' }}
                >
                    <h1 className="text-[3.5rem] md:text-[6rem] lg:text-[8.5rem] font-sans font-black tracking-tighter leading-[0.88] text-white">
                        <div className="flex flex-wrap items-baseline gap-x-[0.18em]">
                            {['Organiza', 'el', 'caos.'].map((word, i) => (
                                <motion.span
                                    key={`l1-${i}`}
                                    variants={wordVariants}
                                    style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </div>
                        <div className="flex flex-wrap items-baseline gap-x-[0.18em] mt-2 md:mt-4">
                            {['Encuentra', 'la'].map((word, i) => (
                                <motion.span
                                    key={`l2-${i}`}
                                    variants={wordVariants}
                                    style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}
                                >
                                    {word}
                                </motion.span>
                            ))}
                            <motion.span
                                variants={wordVariants}
                                className="bg-clip-text text-transparent bg-gradient-to-r from-orange-200 via-white to-orange-200 ml-[0.12em]"
                                style={{
                                    display: 'inline-block',
                                    willChange: 'transform, filter, opacity',
                                    backgroundSize: '200% auto',
                                    animation: 'heroShine 4s linear infinite'
                                }}
                            >
                                paz.
                            </motion.span>
                        </div>
                    </h1>

                    {/* Subtitle — reveals with delay */}
                    <motion.p
                        initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                        animate={showSubtitle ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                        transition={{ duration: 1, ease: customEase }}
                        className="mt-7 md:mt-9 text-base md:text-lg text-zinc-400 font-medium max-w-lg leading-relaxed"
                        style={{ pointerEvents: 'auto' }}
                    >
                        Tus documentos saben más de tu negocio de lo que crees.
                        DocMind los lee, los entiende, los organiza y los conecta —
                        para que tú solo tengas que decidir.
                    </motion.p>

                    {/* CTA */}
                    <motion.button
                        initial={{ opacity: 0, y: 16 }}
                        animate={showSubtitle ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.9, delay: 0.2, ease: customEase }}
                        onClick={() => navigate('/login')}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-8 md:mt-10 px-8 py-4 bg-white text-black rounded-full font-bold text-sm tracking-wide hover:bg-zinc-100 transition-colors shadow-2xl shadow-white/10"
                        style={{ pointerEvents: 'auto' }}
                    >
                        Crear cuenta gratis →
                    </motion.button>
                </motion.div>
            </div>

            {/* Bottom fade — seamless bleed into next section */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-zinc-950 pointer-events-none z-30" />
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="absolute bottom-12 right-6 md:right-12 z-30 text-right pointer-events-none"
            >
                <div className="text-zinc-500 text-xs font-medium tracking-widest uppercase mb-1">Gestión Documental IA</div>
                <div className="text-white/30 text-[10px] font-mono">
                    {new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date())}
                </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: 1.2 }}
                className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 cursor-pointer pointer-events-auto group"
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <span className="text-[9px] text-zinc-600 uppercase tracking-[0.3em] font-bold hidden md:block group-hover:text-zinc-400 transition-colors">
                    Scroll to explore
                </span>
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col items-center gap-0.5"
                >
                    <ChevronDown size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    <ChevronDown size={14} className="text-zinc-700 group-hover:text-zinc-500 transition-colors -mt-1" />
                </motion.div>
            </motion.div>

            <style>{`
                @keyframes heroShine {
                    from { background-position: 200% center; }
                    to   { background-position: -200% center; }
                }
            `}</style>
        </div>
    );
}
