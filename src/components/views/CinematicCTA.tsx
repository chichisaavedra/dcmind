import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CinematicCTA() {
    const navigate = useNavigate();
    const year = new Date().getFullYear();

    return (
        <section className="relative w-full bg-zinc-950 flex flex-col pt-32 pb-8 overflow-hidden z-10">

            {/* Cinematic Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-[80vh] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-900/25 via-zinc-950 to-zinc-950 pointer-events-none z-0" />

            {/* Background subtle grid */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none z-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '80px 80px'
                }}
            />

            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center flex flex-col items-center justify-center min-h-[50vh]">

                {/* Headline */}
                <motion.h2
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="text-5xl md:text-7xl font-sans font-black tracking-tighter text-white mb-6 leading-[0.9]"
                >
                    Deja de buscar.
                    <br />
                    <span
                        className="bg-clip-text text-transparent bg-gradient-to-r from-orange-300 via-white to-orange-200"
                        style={{ backgroundSize: '200% auto', animation: 'ctaShine 5s linear infinite' }}
                    >
                        Empieza a encontrar.
                    </span>
                </motion.h2>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-base md:text-lg text-zinc-400 font-medium max-w-xl mb-12 leading-relaxed"
                >
                    Únete a los profesionales que ya automatizaron su archivo documental con IA.
                </motion.p>

                {/* CTA Button */}
                <motion.button
                    onClick={() => navigate('/login')}
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    viewport={{ once: true }}
                    transition={{
                        opacity: { duration: 0.5, delay: 0.2 },
                        scale: { type: 'spring', stiffness: 400, damping: 25 }
                    }}
                    className="group relative px-8 py-4 bg-white text-black text-sm font-bold rounded-full flex items-center gap-3 shadow-2xl shadow-white/10 hover:shadow-orange-500/20 hover:bg-zinc-100 transition-all duration-300"
                >
                    {/* Orange glow ring on hover */}
                    <span className="absolute inset-0 rounded-full ring-0 group-hover:ring-4 group-hover:ring-orange-500/25 transition-all duration-300" />
                    <span className="relative z-10">Crear mi cuenta gratis</span>
                    <ArrowRight size={16} className="relative z-10 group-hover:translate-x-0.5 transition-transform duration-200" />
                </motion.button>

                {/* Social proof */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-6 text-xs text-zinc-600 font-medium"
                >
                    Sin tarjeta de crédito · Plan gratuito incluido
                </motion.p>
            </div>

            {/* Footer */}
            <div className="mt-24 px-6 relative z-10 w-full">
                <div className="max-w-7xl mx-auto border-t border-zinc-900/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-white font-black text-sm tracking-tight uppercase">DocMind</span>
                        <span className="text-zinc-700 text-xs">© {year} DocMind Inc.</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/privacy" className="text-zinc-600 hover:text-zinc-300 text-xs font-medium transition-colors">Privacidad</Link>
                        <Link to="/terms" className="text-zinc-600 hover:text-zinc-300 text-xs font-medium transition-colors">Términos</Link>
                        <a href="#" className="text-zinc-600 hover:text-zinc-300 text-xs font-medium transition-colors">X / Twitter</a>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes ctaShine {
                    from { background-position: 200% center; }
                    to { background-position: -200% center; }
                }
            `}</style>
        </section>
    );
}
