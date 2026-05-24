import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';
import { FileText, Image as ImageIcon, FileSpreadsheet, Receipt, Folder } from 'lucide-react';

// Generar 50 tarjetas aleatorias
const generateCards = (isMobile: boolean) => {
    const cards = [];
    const types = ['pdf', 'img', 'sheet', 'receipt'];
    const colors: Record<string, string> = {
        pdf: 'bg-red-500/10 text-red-500 border-red-500/20',
        img: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
        sheet: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        receipt: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    };
    const bgCards: Record<string, string> = {
        pdf: 'bg-zinc-900/80',
        img: 'bg-zinc-900/80',
        sheet: 'bg-zinc-900/80',
        receipt: 'bg-zinc-900/80'
    };
    const icons: Record<string, any> = {
        pdf: FileText,
        img: ImageIcon,
        sheet: FileSpreadsheet,
        receipt: Receipt
    };

    const W = window.innerWidth;
    const H = window.innerHeight;

    const yTargetBase = isMobile ? H * 0.75 : H * 0.8;

    for (let i = 0; i < 15; i++) {
        const typeIndex = i % 4;
        const type = types[typeIndex];

        // Spread inicial caótico
        const startX = (Math.random() - 0.5) * (W * 1.4);
        const startY = (Math.random() - 0.5) * (H * 0.8);
        const startRotate = (Math.random() - 0.5) * 180;
        const startScale = 0.6 + Math.random() * 0.8;
        const zIndexBase = Math.floor(Math.random() * 10);

        // Posición estructurada final (4 Pilas) coincidiendo visualmente
        const targetX = (typeIndex * (W / 4)) - (W / 2) + (W / 8) + (Math.random() * 10 - 5);
        const targetY = yTargetBase + (Math.random() * 12 - 6) - (H / 2);
        const targetRotate = (Math.random() * 8 - 4);
        const targetScale = isMobile ? 0.35 : 0.45;

        cards.push({
            id: i,
            type,
            color: colors[type],
            bgCard: bgCards[type],
            Icon: icons[type],
            zIndexBase,
            startX, startY, startRotate, startScale,
            targetX, targetY, targetRotate, targetScale
        });
    }
    return cards;
};

const ScrollCard = ({ card, smoothProgress }: { key?: React.Key, card: any, smoothProgress: MotionValue<number> }) => {
    const x = useTransform(smoothProgress, [0, 0.2, 0.75, 1], [card.startX, card.startX, card.targetX, card.targetX]);
    const y = useTransform(smoothProgress, [0, 0.2, 0.75, 1], [card.startY, card.startY, card.targetY, card.targetY]);
    const rotateZ = useTransform(smoothProgress, [0, 0.2, 0.75, 1], [card.startRotate, card.startRotate, card.targetRotate, card.targetRotate]);
    const scale = useTransform(smoothProgress, [0, 0.2, 0.75, 1], [card.startScale, card.startScale, card.targetScale, card.targetScale]);
    const opacity = useTransform(smoothProgress, [0, 0.02], [0, 1]);

    return (
        <motion.div
            style={{
                x, y, rotateZ, scale, opacity,
                zIndex: card.zIndexBase,
                willChange: 'transform'
            }}
            className={`absolute w-24 h-32 md:w-36 md:h-48 backdrop-blur-2xl border border-white/5 rounded-2xl p-3 md:p-4 flex flex-col shadow-2xl ${card.bgCard}`}
        >
            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center mb-2 md:mb-3 border bg-opacity-20 backdrop-blur-md ${card.color}`}>
                <card.Icon size={14} className="md:w-4 md:h-4 w-3 h-3" />
            </div>
            <div className="space-y-1.5 md:space-y-2 mt-auto">
                <div className="w-full h-1 md:h-1.5 bg-white/10 rounded-full" />
                <div className="w-[85%] h-1 md:h-1.5 bg-white/10 rounded-full" />
                <div className="w-[60%] h-1 md:h-1.5 bg-white/10 rounded-full" />
            </div>
        </motion.div>
    );
};

export default function ScrollMagicSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [cards, setCards] = useState<any[]>([]);

    useEffect(() => {
        setCards(generateCards(window.innerWidth < 768));
    }, []);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 60,
        damping: 25,
        restDelta: 0.001
    });

    const t1Opacity = useTransform(smoothProgress, [0, 0.2, 0.3], [1, 1, 0]);
    const t1Y = useTransform(smoothProgress, [0, 0.3], [0, -50]);

    const t2Opacity = useTransform(smoothProgress, [0.35, 0.45, 0.55, 0.65], [0, 1, 1, 0]);
    const t2Scale = useTransform(smoothProgress, [0.35, 0.45, 0.55, 0.65], [0.9, 1, 1, 1.1]);

    const t3Opacity = useTransform(smoothProgress, [0.75, 0.85, 1], [0, 1, 1]);
    const t3Scale = useTransform(smoothProgress, [0.75, 0.85, 1], [0.9, 1, 1]);
    const t3Y = useTransform(smoothProgress, [0.75, 0.85], [50, 0]);

    return (
        <section id="how" ref={containerRef} className="h-[300vh] bg-zinc-950 relative w-full">
            <div className="h-screen sticky top-0 overflow-hidden flex items-center justify-center">

                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08)_0%,transparent_60%)] pointer-events-none" />

                <div className="absolute z-40 text-center w-full px-6 flex flex-col items-center justify-center pointer-events-none">
                    <motion.h2
                        style={{ opacity: t1Opacity, y: t1Y }}
                        className="absolute text-5xl md:text-7xl font-black text-white tracking-tight"
                    >
                        El caos masivo <br className="md:hidden" /> de tus archivos.
                    </motion.h2>

                    <motion.h2
                        style={{ opacity: t2Opacity, scale: t2Scale }}
                        className="absolute text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-rose-400 drop-shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                    >
                        La IA de DocMind <br className="md:hidden" /> lee por ti.
                    </motion.h2>

                    <motion.div style={{ opacity: t3Opacity, scale: t3Scale, y: t3Y }} className="absolute flex flex-col items-center">
                        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight">
                            Orden absoluto. <br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">Automático.</span>
                        </h2>
                        <p className="mt-6 text-zinc-400 font-medium text-lg md:text-xl max-w-xl leading-relaxed">
                            Tus facturas, contratos y notas clasificados mágicamente con precisión algorítmica.
                        </p>
                    </motion.div>
                </div>

                {/* VISUAL FOLDERS AT BOTTOM */}
                <motion.div
                    style={{
                        opacity: t3Opacity,
                        y: t3Y
                    }}
                    className="absolute bottom-[10vh] w-full flex z-10 pointer-events-none"
                >
                    {[
                        { label: 'Contratos', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20' },
                        { label: 'Imágenes', color: 'text-purple-500', bg: 'bg-purple-500/10 border-purple-500/20' },
                        { label: 'Métricas', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                        { label: 'Facturas', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
                    ].map((f, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 w-1/4">
                            <div className={`w-14 h-10 md:w-20 md:h-14 rounded-xl border flex items-center justify-center shadow-inner backdrop-blur-md ${f.bg}`}>
                                <Folder size={24} className={f.color} />
                            </div>
                            <span className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{f.label}</span>
                        </div>
                    ))}
                </motion.div>

                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none perspective-[1200px]">
                    {cards.length > 0 && cards.map((card) => (
                        <ScrollCard key={card.id} card={card} smoothProgress={smoothProgress} />
                    ))}
                </div>

            </div>
        </section>
    );
}
