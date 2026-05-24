import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, FileText, CheckCircle2, Zap, BrainCircuit, Bot, Search, Star, ChevronRight, Send, LayoutDashboard, Settings } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

type ExchangeType = 'chat' | 'upload';

interface Exchange {
    type: ExchangeType;
    user?: string;
    ai?: string;
    source?: string;
    confidence?: string;
}

const EXCHANGES: Exchange[] = [
    { type: 'chat', user: '¿Cuál es la cláusula de rescisión del contrato García?', ai: 'Según la Cláusula 8.3, podés rescindir con un preaviso de 30 días hábiles. La penalidad por incumplimiento es el 15% del valor anual.', source: 'Pág. 14 · Cláusula 8.3', confidence: '97%' },
    { type: 'chat', user: 'Resumí los puntos clave del Balance Q3 2024.', ai: 'Ingresos: $2.4M (+18% YoY). EBITDA: $380K. Se identificaron 3 gastos extraordinarios en marketing que impactan el margen neto.', source: 'Balance_Q3_2024.xlsx · Hoja 1', confidence: '99%' },
    { type: 'upload' },
    { type: 'chat', user: '¿Cuánto fue el total facturado por Proveedor Tech en 2024?', ai: 'El total facturado fue $48,320 en 8 facturas. La más alta fue la Factura #0312 por $12,800 en septiembre.', source: 'Facturas_ProveedorTech.pdf · 8 entradas', confidence: '100%' },
    { type: 'chat', user: '¿Hay diferencias entre el contrato de enero y el de marzo?', ai: 'Sí. El contrato de marzo aumenta la tarifa mensual en un 12%, agrega una cláusula de exclusividad y reduce el período de gracia de 15 a 7 días.', source: 'Contrato_Mar2025.docx · Comparación', confidence: '96%' },
    { type: 'chat', user: '¿El NDA con Empresa XYZ ya venció?', ai: 'No. El NDA vence el 15 de marzo de 2026 con renovación automática por 12 meses si no se notifica con 60 días de anticipación.', source: 'NDA_EmpresaXYZ.docx · Cláusula 5', confidence: '95%' }
];

const UPLOAD_FILES = [
    { name: 'Factura_Agosto.pdf', type: 'PDF' },
    { name: 'Contrato_Nuevo.docx', type: 'DOC' },
    { name: 'Balance_Anual.xlsx', type: 'XLS' },
    { name: 'Acta_Directorio.pdf', type: 'PDF' },
];

function UploadPhase() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from('.upload-item', { x: -15, opacity: 0, duration: 0.4, stagger: 0.6, ease: "back.out(1.5)" }, 0.2);
        tl.to('.upload-progress', { width: '100%', duration: 0.8, stagger: 0.6, ease: "power2.inOut" }, 0.4);
        tl.add(() => {
            document.querySelectorAll('.upload-loader').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.upload-done').forEach(el => el.classList.remove('hidden'));
        }, ">");
        tl.from('.ai-org-response', { y: 10, opacity: 0, duration: 0.5, ease: "back.out(1.2)" }, "+=0.3");
        tl.to('.upload-scene', { opacity: 0, duration: 0.4 }, 6.1);
    }, { scope: container });

    const typeColor = (ext: string) =>
        ext === 'PDF' ? { bg: '#ef444418', color: '#ef4444' } :
            ext === 'XLS' ? { bg: '#22c55e18', color: '#22c55e' } :
                { bg: '#3b82f618', color: '#3b82f6' };

    return (
        <div ref={container} className="flex-1 px-4 py-4 flex flex-col gap-3">
            <div className="upload-scene space-y-1.5 w-full">
                <p className="text-[8.5px] font-black text-zinc-400 uppercase tracking-wider">Subiendo archivos…</p>
                {UPLOAD_FILES.map((f, i) => {
                    const c = typeColor(f.type);
                    return (
                        <div key={i} className="upload-item flex items-center gap-2 px-2.5 py-1.5 rounded-lg opacity-100" style={{ background: '#f5f5f7', border: '1px solid rgba(0,0,0,0.06)' }}>
                            <div className="w-5 h-5 rounded flex items-center justify-center text-[7px] font-black flex-shrink-0" style={{ background: c.bg, color: c.color }}>{f.type[0]}</div>
                            <span className="text-[8.5px] font-semibold text-zinc-700 flex-1 truncate">{f.name}</span>
                            <div className="upload-loader w-10 h-1 rounded-full bg-zinc-200 overflow-hidden flex-shrink-0">
                                <div className="upload-progress h-full rounded-full" style={{ background: c.color, width: '0%' }} />
                            </div>
                            <CheckCircle2 size={10} className="upload-done text-emerald-500 hidden flex-shrink-0" />
                        </div>
                    );
                })}
                <div className="ai-org-response flex gap-2 items-start mt-4">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)' }}>
                        <Sparkles size={9} className="text-orange-400" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                        <div className="px-3 py-2 rounded-2xl rounded-tl-sm" style={{ background: '#f5f5f7' }}>
                            <p className="text-[8.5px] text-zinc-600 leading-relaxed font-medium">Listos. Organisé <span className="font-black text-zinc-800">4 documentos</span> automáticamente:</p>
                            <div className="mt-1.5 space-y-1">
                                {['📁 Finanzas · 2 archivos', '📁 Legal · 1 archivo', '📁 Interno · 1 archivo'].map(f => (
                                    <div key={f} className="flex items-center gap-1"><span className="text-[8px] text-zinc-500">{f}</span></div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full w-fit" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                            <Zap size={7} className="text-orange-400" />
                            <span className="text-[7px] font-bold text-orange-400">Organizados por IA</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ChatPhaseUI({ ex }: { ex: Exchange }) {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from('.user-msg', { y: 10, opacity: 0, duration: 0.4, ease: "back.out(1.2)" }, 0.2);
        tl.fromTo('.typing-msg', { y: 10, opacity: 0, display: 'none' }, { y: 0, opacity: 1, display: 'flex', duration: 0.3, ease: "power2.out" }, "+=0.2");
        tl.to('.typing-dot', { y: -4, duration: 0.4, stagger: 0.15, yoyo: true, repeat: 3, ease: "power1.inOut" }, "<");
        tl.to('.typing-msg', { opacity: 0, display: 'none', duration: 0.2 }, "+=0.2");
        tl.fromTo('.ai-response', { y: 10, opacity: 0, display: 'none' }, { y: 0, opacity: 1, display: 'flex', duration: 0.4, ease: "back.out(1.2)" }, "<");
        tl.to('.chat-block', { opacity: 0, duration: 0.4 }, 6.6);
    }, { scope: container });

    return (
        <div ref={container} className="flex-1 overflow-hidden px-4 py-4 space-y-3">
            <div className="chat-block space-y-3">
                <div className="user-msg flex justify-end">
                    <div className="max-w-[82%] px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-[9px] font-medium leading-relaxed" style={{ background: '#1a1a1a', color: '#e4e4e7', border: '1px solid rgba(255,255,255,0.07)' }}>
                        {ex.user}
                    </div>
                </div>
                <div className="typing-msg flex gap-2 items-center" style={{ display: 'none' }}>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)' }}><Sparkles size={9} className="text-orange-400" /></div>
                    <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm flex items-center gap-1.5" style={{ background: '#f5f5f7' }}>{[1, 2, 3].map(i => <div key={i} className="typing-dot w-1.5 h-1.5 rounded-full bg-zinc-400" />)}</div>
                </div>
                <div className="ai-response flex gap-2 items-start" style={{ display: 'none' }}>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.2)' }}><Sparkles size={9} className="text-orange-400" /></div>
                    <div className="max-w-[90%] space-y-1.5">
                        <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm" style={{ background: '#f5f5f7' }}><p className="text-[9px] text-zinc-600 leading-relaxed">{ex.ai}</p></div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}><FileText size={7} className="text-orange-400" /><span className="text-[7px] font-bold text-orange-400">{ex.source}</span></div>
                            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}><CheckCircle2 size={7} className="text-emerald-500" /><span className="text-[7px] font-bold text-emerald-500">{ex.confidence} confianza</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ConversationLoop() {
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const t = setInterval(() => {
            setIdx(i => (i + 1) % EXCHANGES.length);
        }, 7000);
        return () => clearInterval(t);
    }, []);

    const ex = EXCHANGES[idx];

    return (
        <div className="flex-1 overflow-hidden flex flex-col relative w-full h-full">
            <React.Fragment key={idx}>
                {ex.type === 'upload' ? <UploadPhase /> : <ChatPhaseUI ex={ex} />}
            </React.Fragment>
        </div>
    );
}

export function AppSimulation() {
    const comp = useRef(null);

    useGSAP(() => {
        gsap.from('.mock-sidebar > div', { x: -15, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'back.out(2)' });
        gsap.from('.mock-file', { x: -15, opacity: 0, stagger: 0.05, duration: 0.4, ease: 'power2.out', delay: 0.2 });
    }, { scope: comp });

    return (
        <div ref={comp} className="w-full h-full flex rounded-[22px] overflow-hidden bg-white" style={{ border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 32px 90px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.3)' }}>
            <div className="mock-sidebar w-[48px] flex flex-col items-center py-4 gap-2 flex-shrink-0" style={{ background: '#0f0f0f', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.25)' }}>
                    <BrainCircuit size={13} className="text-orange-400" />
                </div>
                {([LayoutDashboard, FileText, Bot, Settings] as const).map((Icon, i) => (
                    <div key={i} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: i === 2 ? 'rgba(249,115,22,0.12)' : 'transparent', color: i === 2 ? '#f97316' : 'rgba(255,255,255,0.2)' }}>
                        <Icon size={14} />
                    </div>
                ))}
            </div>

            <div className="w-[140px] flex flex-col flex-shrink-0" style={{ background: '#fafafa', borderRight: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="px-3 pt-3 pb-2 space-y-2">
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">Documentos</p>
                    <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg" style={{ background: '#efefef' }}><Search size={9} className="text-zinc-400" /><span className="text-[8px] text-zinc-400">Buscar...</span></div>
                </div>
                <div className="flex-1 px-2 space-y-0.5 overflow-hidden">
                    {[
                        { name: 'Contrato García', ext: 'PDF', color: '#ef4444', active: true, star: true },
                        { name: 'Balance Q3 2024', ext: 'XLS', color: '#22c55e', active: false, star: false },
                        { name: 'NDA Empresa', ext: 'DOC', color: '#3b82f6', active: false, star: false },
                        { name: 'Presupuesto', ext: 'PDF', color: '#ef4444', active: false, star: true },
                        { name: 'Acta Reunión', ext: 'DOC', color: '#3b82f6', active: false, star: false },
                    ].map((f, i) => (
                        <div key={i} className="mock-file flex items-center gap-1.5 px-2 py-1.5 rounded-lg" style={{ background: f.active ? 'rgba(249,115,22,0.07)' : 'transparent' }}>
                            <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 text-[7px] font-black" style={{ background: `${f.color}18`, color: f.color }}>{f.ext[0]}</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[8.5px] font-semibold truncate" style={{ color: f.active ? '#f97316' : '#374151' }}>{f.name}</p>
                                <p className="text-[7px] text-zinc-400">{f.ext}</p>
                            </div>
                            {f.star && <Star size={7} fill="#f59e0b" className="text-amber-400 flex-shrink-0" />}
                        </div>
                    ))}
                </div>
                <div className="px-3 pb-3 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <div className="flex justify-between text-[7.5px] text-zinc-400 mb-1"><span>Almacenamiento</span><span>2.4 / 5 GB</span></div>
                    <div className="h-1 rounded-full bg-zinc-200 overflow-hidden"><div className="h-full rounded-full bg-orange-400" style={{ width: '48%' }} /></div>
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 py-2.5 flex items-center gap-2 flex-shrink-0" style={{ background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: '#111' }}><Bot size={11} className="text-orange-400" /></div>
                    <div>
                        <p className="text-[9.5px] font-black text-zinc-800">DocMind AI</p>
                        <div className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-emerald-500 block" /><span className="text-[7.5px] text-zinc-400">Activo</span></div>
                    </div>
                    <ChevronRight size={11} className="text-zinc-300 ml-auto" />
                </div>
                <ConversationLoop />
                <div className="px-3 pb-3 flex-shrink-0">
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl" style={{ background: '#f5f5f7', border: '1px solid rgba(0,0,0,0.07)' }}>
                        <span className="text-[8px] text-zinc-400 flex-1">Pregunta sobre tus documentos...</span>
                        <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: '#111' }}><Send size={8} className="text-white" /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
