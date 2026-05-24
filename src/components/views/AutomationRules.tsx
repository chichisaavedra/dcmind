import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Plus, Trash2, Zap, Shield, Sparkles, ArrowRight, X, MessageSquare, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * `AutomationRules`
 * 
 * Interfaz para definir reglas de enrutamiento de documentos.
 * Soporta dos modos:
 * 1. "Reglas Comunes": Basadas en palabras clave simples (ej. si contiene "Factura", mover a /Facturas)
 * 2. "AI-Powered": Reglas de razonamiento complejo evaluadas por Claude 3.5 Sonnet.
 * 
 * @param rules - Lista actual de reglas activas del usuario
 * @param setRules - Función para actualizar la lista de reglas (ej. eliminar)
 * @param onCreateRule - Función para añadir una nueva regla al estado global
 */
export default function AutomationRules({
    rules,
    setRules,
    onCreateRule
}: {
    rules: any[],
    setRules: (rules: any[]) => void,
    onCreateRule: (rule: any) => void
}) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'common' | 'advanced'>('common');
    const [showNewRuleModal, setShowNewRuleModal] = useState(false);
    const [newRule, setNewRule] = useState({ keyword: '', targetFolder: 'Facturas', targetSubfolder: 'Pendientes' });
    const [aiPrompt, setAiPrompt] = useState('');

    const handleSaveRule = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRule.keyword.trim()) return;
        onCreateRule(newRule);
        setNewRule({ keyword: '', targetFolder: 'Facturas', targetSubfolder: 'Pendientes' });
        setShowNewRuleModal(false);
    };

    const handleAiSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiPrompt.trim()) return;
        onCreateRule({
            id: Math.random().toString(),
            keyword: 'Prompt IA: ' + aiPrompt.slice(0, 20) + '...',
            targetFolder: 'AI Managed',
            targetSubfolder: 'Auto'
        });
        setAiPrompt('');
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Reglas de Automatización</h2>
                    <p className="text-gray-500 font-medium max-w-xl">Entrena a la IA para organizar tus documentos automáticamente basándose en palabras clave o razonamiento complejo.</p>
                </div>
                {activeTab === 'common' && (
                    <button
                        onClick={() => setShowNewRuleModal(true)}
                        className="flex items-center justify-center gap-3 px-8 py-5 bg-gray-900 text-white rounded-[1.5rem] font-black text-sm hover:bg-black shadow-xl shadow-gray-200 transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        Crear Regla Simple
                    </button>
                )}
            </div>

            {/* Modern Tabs */}
            <div className="flex p-1 bg-gray-100/80 backdrop-blur-md rounded-3xl w-fit">
                <button
                    onClick={() => setActiveTab('common')}
                    className={cn(
                        "px-8 py-3 rounded-[1.25rem] text-sm font-bold transition-all flex items-center gap-2",
                        activeTab === 'common' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Settings size={16} />
                    Reglas Comunes
                </button>
                <button
                    onClick={() => setActiveTab('advanced')}
                    className={cn(
                        "px-8 py-3 rounded-[1.25rem] text-sm font-bold transition-all flex items-center gap-2",
                        activeTab === 'advanced' ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Sparkles size={16} className={activeTab === 'advanced' ? "text-indigo-400" : ""} />
                    AI-Powered (Avanzadas)
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'common' ? (
                    <motion.div
                        key="common"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        {/* Rules Grid */}
                        <div className="grid grid-cols-1 gap-6">
                            {rules.map((rule) => (
                                <div key={rule.id} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/30 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-700" />

                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                                        <div className="flex items-start gap-8">
                                            <div className="w-16 h-16 bg-gray-900 text-white rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-gray-200">
                                                <Zap size={28} />
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Regla de Enrutamiento</h3>
                                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100/50">
                                                        <Shield size={12} />
                                                        Activa
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <span>Si contiene:</span>
                                                        <span className="text-gray-900 bg-gray-50 px-3 py-1 rounded-xl">"{rule.keyword}"</span>
                                                    </div>
                                                    <ArrowRight size={16} className="text-gray-300" />
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <span>Mover a:</span>
                                                        <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl font-bold">
                                                            {rule.targetFolder} <span className="text-indigo-300 mx-1">/</span> {rule.targetSubfolder}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setRules(rules.filter(r => r.id !== rule.id))}
                                            className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all self-end md:self-center"
                                        >
                                            <Trash2 size={22} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {rules.length === 0 && (
                                <div className="text-center py-32 bg-gray-50/50 rounded-[4rem] border-2 border-gray-100 border-dashed">
                                    <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
                                        <Settings size={40} className="text-gray-200" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Sin Automatizaciones</h3>
                                    <p className="text-gray-500 font-medium max-w-sm mx-auto">
                                        Crea reglas simples para enviar facturas o recibos a su destino al instante.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="advanced"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-[3rem] p-10 lg:p-14 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                        <div className="relative z-10 max-w-2xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-[1.5rem] flex items-center justify-center shadow-lg">
                                    <Bot size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Instrucciones de Lógica Superior</h3>
                                    <p className="text-sm font-bold text-indigo-500 mt-1 uppercase tracking-widest">Claude 3.5 Sonnet</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <p className="text-gray-600 font-medium leading-relaxed">
                                    Describe en lenguaje natural cómo quieres que la IA asigne tus archivos. La IA leerá el contenido, interpretará tus condiciones y tomará la decisión correcta sin depender de nombres de archivo.
                                </p>

                                <form onSubmit={handleAiSave} className="relative">
                                    <div className="absolute top-6 left-6 text-gray-300">
                                        <MessageSquare size={24} />
                                    </div>
                                    <textarea
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        placeholder="Ejemplo: Si el texto trata sobre arrendamientos o alquileres de vehículos comerciales, o menciona a 'AutosCorp', mételo en la carpeta 'Bienes Raíces / Vehículos'."
                                        className="w-full h-40 pl-16 pr-6 py-6 bg-gray-50 border border-gray-200/60 rounded-[2rem] text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium text-gray-800 resize-none shadow-inner"
                                    />
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={!aiPrompt.trim()}
                                            className="px-8 py-5 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-[1.5rem] font-bold text-sm shadow-xl hover:shadow-indigo-500/20 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                                        >
                                            Activar Regla Cognitiva
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* New Rule Modal - High End */}
            {showNewRuleModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl animate-fade-in" onClick={() => setShowNewRuleModal(false)} />
                    <div className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-2xl p-12 animate-slide-up border border-white">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-200">
                                    <Zap size={24} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Regla de Enrutamiento</h3>
                            </div>
                            <button onClick={() => setShowNewRuleModal(false)} className="p-3 text-gray-400 hover:bg-gray-50 rounded-full transition-all">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveRule} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Palabra Clave (Trigger)</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={newRule.keyword}
                                    onChange={(e) => setNewRule({ ...newRule, keyword: e.target.value })}
                                    placeholder="Ej: Nomina, Amazon, Contrato..."
                                    className="w-full px-8 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-gray-900 font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Carpeta</label>
                                    <select
                                        value={newRule.targetFolder}
                                        onChange={(e) => setNewRule({ ...newRule, targetFolder: e.target.value })}
                                        className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-gray-900 font-bold outline-none appearance-none cursor-pointer"
                                    >
                                        <option>Facturas</option>
                                        <option>Legal</option>
                                        <option>Estudio</option>
                                        <option>Oficina</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Subcarpeta</label>
                                    <input
                                        type="text"
                                        value={newRule.targetSubfolder}
                                        onChange={(e) => setNewRule({ ...newRule, targetSubfolder: e.target.value })}
                                        placeholder="Ej: 2026"
                                        className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] text-gray-900 font-bold outline-none focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-black shadow-2xl shadow-gray-200 transition-all active:scale-95"
                                >
                                    Guardar Regla
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
