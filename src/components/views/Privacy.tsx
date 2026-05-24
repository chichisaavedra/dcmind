import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Privacy() {
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
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                <Shield className="text-orange-400" size={24} />
                            </div>
                            <div className="inline-flex items-center px-3 py-1 rounded-md bg-zinc-900 border border-white/10 text-xs font-medium text-zinc-400">
                                Efectivo: Marzo 2026
                            </div>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-8">
                            Política de Privacidad
                        </h1>
                        
                        <p className="text-xl text-zinc-400 mb-12">
                            Su privacidad es nuestra máxima prioridad. En DocMind, construimos nuestras capacidades de IA con un enfoque <span className="text-white font-semibold">Zero-Trust</span>, asegurando que su información confidencial esté blindada en todo momento.
                        </p>

                        <div className="space-y-12 text-lg leading-relaxed text-zinc-400 bg-zinc-900/30 p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden">
                            
                            {/* Decorative background blur */}
                            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

                            <section className="relative z-10">
                                <h2 className="text-2xl font-bold text-white mb-4">1. Recopilación de Datos</h2>
                                <p>
                                    Recopilamos únicamente la información necesaria para proporcionar y mejorar nuestro servicio: información de su cuenta (nombre, correo electrónico), metadatos de uso para fines estadísticos, y los documentos que usted sube activamente a nuestra plataforma para su procesamiento.
                                </p>
                            </section>

                            <section className="relative z-10">
                                <h2 className="text-2xl font-bold text-white mb-4">2. Uso de Modelos AI y Sus Datos</h2>
                                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6 my-6">
                                    <h3 className="text-orange-400 font-bold mb-2">Garantía estricta de aislamiento</h3>
                                    <p className="text-zinc-300 text-base m-0">
                                        Ninguno de los documentos, textos, cláusulas o facturas cargados en DocMind son utilizados por nosotros ni por proveedores externos para entrenar grandes modelos de lenguaje (LLMs) de uso público o general. Sus datos empresariales se infieren en un entorno cerrado (sandboxed) y se destruyen del almacenamiento en caché una vez procesados, si no requiere persistencia.
                                    </p>
                                </div>
                            </section>

                            <section className="relative z-10">
                                <h2 className="text-2xl font-bold text-white mb-4">3. Almacenamiento y Cifrado</h2>
                                <p>
                                    Todos los datos en reposo y en tránsito están encriptados utilizando el estándar industrial AES-256. Proveemos nuestro hospedaje a través de infraestructura de grado empresarial que cuenta con certificaciones SOC2 Tipo II e ISO 27001. Usted retiene toda la propiedad y control sobre sus datos almacenados y puede solicitar su borrado permanente en cualquier momento.
                                </p>
                            </section>

                            <section className="relative z-10">
                                <h2 className="text-2xl font-bold text-white mb-4">4. Retención de Datos</h2>
                                <p>
                                    Mantenemos sus datos únicamente mientras su cuenta permanezca activa. Si usted decide cancelar su suscripción, sus documentos y toda información personal identificable se elimina de nuestros servidores de producción dentro de los siguientes 30 días calendario.
                                </p>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
