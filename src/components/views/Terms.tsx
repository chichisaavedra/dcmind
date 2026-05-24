import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-300 font-sans selection:bg-orange-500/30 selection:text-orange-200">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} /> Volver
                    </button>
                    <span className="text-white font-black tracking-tight uppercase">DocMind</span>
                </div>
            </nav>

            {/* Content */}
            <main className="pt-32 pb-24 px-6 relative z-10">
                <div className="max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-md bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-400">
                            Última actualización: Marzo 2026
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-12">
                            Términos de Servicio
                        </h1>

                        <div className="space-y-12 text-lg leading-relaxed text-zinc-400 bg-zinc-900/30 p-8 md:p-12 rounded-3xl border border-white/5">
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">1. Aceptación de los Términos</h2>
                                <p>
                                    Al acceder y utilizar DocMind ("el Servicio"), usted acepta estar sujeto a estos Términos de Servicio. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestro Servicio.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">2. Descripción del Servicio</h2>
                                <p>
                                    DocMind es una plataforma B2B de gestión documental y automatización impulsada por IA. Proporcionamos herramientas para el análisis, extracción y organización de información de documentos comerciales y legales.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">3. Privacidad y Seguridad de Datos</h2>
                                <p>
                                    Nuestra prioridad es la seguridad de sus datos. Garantizamos que sus documentos se procesan bajo protocolos de encriptación AES-256. Sus documentos no son utilizados para entrenar modelos de lenguaje públicos. Para más detalles, consulte nuestra <button onClick={() => navigate('/privacy')} className="text-orange-400 hover:text-orange-300 underline underline-offset-4">Política de Privacidad</button>.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">4. Disponibilidad del Servicio</h2>
                                <p>
                                    Nos esforzamos por asegurar una disponibilidad del 99.9% de nuestro Servicio, sin embargo, no garantizamos que el servicio sea ininterrumpido o libre de errores operativos durante mantenimientos programados.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">5. Propiedad Intelectual</h2>
                                <p>
                                    El Servicio y sus contenidos originales, características y funcionalidades son y seguirán siendo propiedad exclusiva de DocMind Inc y sus licenciantes. Nada en estos términos le otorga un derecho o licencia para usar nuestras marcas registradas o la interfaz propietaria de nuestra IA.
                                </p>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
