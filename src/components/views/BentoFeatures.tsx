import React, { useState, useRef } from 'react';
import { Search, Bot, Cloud, Slack } from 'lucide-react';

export default function BentoFeatures() {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left - 150,
            y: e.clientY - rect.top - 150,
        });
    };

    return (
        <section id="features" className="py-32 bg-zinc-950 relative overflow-hidden bento-section">
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center mb-24">
                    <h2 className="text-5xl md:text-7xl font-sans font-black tracking-tighter text-zinc-100 leading-tight">
                        Inteligencia en cada píxel.
                    </h2>
                </div>

                <div className="bento-grid">
                    
                    {/* 1. ENCUENTRA IDEAS */}
                    <div 
                        ref={cardRef} 
                        className="capability-card primary group" 
                        onMouseMove={handleMouseMove}
                    >
                        <div className="glow-effect" style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }} />
                        
                        <div className="bento-content">
                            <div className="search-demo relative z-10 mb-5">
                                <div className="search-bar">
                                    <span className="search-icon">
                                        <Search size={18} strokeWidth={3} className="text-zinc-400" />
                                    </span>
                                    <div className="search-text-container">
                                        <span className="typing-text"></span>
                                    </div>
                                    <span className="search-status">✓ ENCONTRADO</span>
                                </div>
                            </div>

                            {/* Resultado simulado de la búsqueda IA */}
                            <div className="ai-result-card relative z-10 mb-5">
                                <div className="ai-result-header">
                                    <span className="ai-badge">IA</span>
                                    <span className="ai-source">Contrato_García_2024.pdf · Cláusula 8.3</span>
                                </div>
                                <p className="ai-result-text">
                                    "El contrato podrá rescindirse con un preaviso mínimo de <mark className="ai-highlight">30 días hábiles</mark>, siempre que la parte incumplidora haya recibido notificación formal..."
                                </p>
                                <div className="ai-meta">
                                    <span className="ai-confidence">Confianza 97%</span>
                                    <span className="ai-dot" />
                                    <span className="ai-page">Pág. 14</span>
                                </div>
                            </div>

                            <h3 className="relative z-10">Encuentra ideas, no palabras.</h3>
                            <p className="relative z-10 mt-3">
                                La IA entiende el contexto de tus contratos. Pregunta en lenguaje natural y obtén respuestas precisas con la fuente exacta.
                            </p>
                        </div>
                    </div>

                    {/* 2. ORGANIZACIÓN EN MASA */}
                    <div className="capability-card organization group">
                        <div className="bento-content h-full flex flex-col">
                            <div className="files-animation flex-1 flex items-center justify-center relative mb-6">
                                <div className="file-stack chaotic">
                                    <div className="file bg-gradient-to-br from-red-500/20 to-red-900/40 border-red-500/50">PDF</div>
                                    <div className="file bg-gradient-to-br from-blue-500/20 to-blue-900/40 border-blue-500/50">DOCX</div>
                                    <div className="file bg-gradient-to-br from-green-500/20 to-green-900/40 border-green-500/50">XLSX</div>
                                    <div className="file bg-gradient-to-br from-orange-500/20 to-orange-900/40 border-orange-500/50">PPTX</div>
                                </div>
                                <div className="transform-arrow text-2xl text-amber-500 mx-6 font-bold">→</div>
                                <div className="file-stack organized flex flex-col gap-2">
                                    <div className="folder">📁 Legal</div>
                                    <div className="folder">📁 Finanzas</div>
                                    <div className="folder">📁 Estudio</div>
                                </div>
                            </div>
                            <div>
                                <h3>Organización en Masa.</h3>
                                <p className="mt-2">Clasifica cientos de documentos simultáneamente sin esfuerzo.</p>
                            </div>
                        </div>
                    </div>

                    {/* 3. PRIVACIDAD */}
                    <div className="capability-card privacy">
                        <div className="bento-content h-full flex flex-col justify-between">
                            <div className="privacy-animation">
                                <div className="document-icon">
                                    <svg viewBox="0 0 100 100" className="doc-svg">
                                        <rect x="20" y="10" width="60" height="80" rx="4" />
                                        <line x1="30" y1="30" x2="70" y2="30" />
                                        <line x1="30" y1="45" x2="70" y2="45" />
                                        <line x1="30" y1="60" x2="70" y2="60" />
                                    </svg>
                                </div>
                                
                                <div className="shield-icon">
                                    <svg viewBox="0 0 100 100" className="shield-svg animate-pulse-ring">
                                        <path d="M50 10 L80 25 L80 50 Q80 75 50 90 Q20 75 20 50 L20 25 Z" />
                                        <circle cx="50" cy="50" r="12" className="shield-lock" />
                                    </svg>
                                </div>
                                
                                <div className="particles">
                                    <span className="particle"></span>
                                    <span className="particle"></span>
                                    <span className="particle"></span>
                                    <span className="particle"></span>
                                </div>
                            </div>
                            
                            <div>
                                <h3>Tu privacidad es el núcleo.</h3>
                                <div className="security-badges">
                                    <span className="badge">AES-256</span>
                                    <span className="badge">Zero-Trust</span>
                                </div>
                                <p>
                                    Encriptación AES-256 en reposo y en tránsito. Arquitectura Zero-Trust integrada nativamente.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 4. EXTRACCIÓN QUIRÚRGICA */}
                    <div className="capability-card extraction">
                        <div className="bento-content h-full flex flex-col">
                            <div className="receipt-demo flex-1 flex items-center justify-center relative mb-6">
                                <div className="receipt-paper">
                                    <div className="receipt-header mb-4 text-[10px] font-mono text-zinc-500 border-b border-zinc-800 pb-2">RECIBO #08492</div>
                                    <div className="receipt-line">
                                        <span className="label">Fecha:</span>
                                        <span className="value w-20 bg-zinc-800 h-4 rounded ml-auto"></span>
                                    </div>
                                    <div className="receipt-line">
                                        <span className="label">Nombre:</span>
                                        <span className="value w-24 bg-zinc-800 h-4 rounded ml-auto"></span>
                                    </div>
                                    <div className="receipt-line mt-4 pt-2 border-t border-zinc-800/50">
                                        <span className="label text-zinc-400">Total:</span>
                                        <span className="value highlight text-lg ml-auto">$125.00</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3>Extracción Quirúrgica.</h3>
                                <p className="mt-2">Captura montos, fechas y nombres clave inteligentemente.</p>
                            </div>
                        </div>
                    </div>

                    {/* 5. ECOSISTEMA */}
                    <div className="capability-card ecosystem">
                        <div className="bento-content h-full flex flex-col md:flex-row justify-between md:items-center gap-8">
                            <div className="integrations-flow flex items-center justify-center md:w-1/2 pt-6 md:pt-0">
                                <div className="integration-node">
                                    <div className="logo drive flex items-center justify-center">
                                        <Cloud size={20} className="text-blue-400" />
                                    </div>
                                </div>
                                
                                <svg className="connection-line w-16 h-8">
                                    <path className="path-line" d="M0,16 L64,16" />
                                    <circle className="flow-dot" cx="0" cy="16" />
                                </svg>
                                
                                <div className="integration-node center">
                                    <div className="logo docmind flex items-center justify-center shadow-[0_0_20px_rgba(255,193,7,0.3)]">
                                        <Bot size={28} className="text-amber-500" />
                                    </div>
                                </div>
                                
                                <svg className="connection-line w-16 h-8">
                                    <path className="path-line" d="M0,16 L64,16" />
                                    <circle className="flow-dot delay-1" cx="0" cy="16" />
                                </svg>
                                
                                <div className="integration-node">
                                    <div className="logo slack flex items-center justify-center">
                                        <Slack size={20} className="text-emerald-400" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="md:w-1/2">
                                <h3>Se conecta con tu ecosistema.</h3>
                                <p className="mt-3">Google Drive, Notion, Slack y Dropbox sincronizados en tiempo real y gestionados desde un solo tablero.</p>
                            </div>
                        </div>
                    </div>

                    {/* 6. WORKFLOWS */}
                    <div className="capability-card workflows">
                        <div className="bento-content h-full flex flex-col">
                            <div className="workflow-demo flex-1 flex items-center justify-center relative mb-6">
                                <div className="workflow-step bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex flex-col items-center gap-2 z-10">
                                    <div className="icon bg-zinc-800 p-2 rounded-lg">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-300">Factura {'>'} $500</span>
                                </div>
                                
                                <div className="transform-arrow text-amber-500 font-bold mx-2">→</div>
                                
                                <div className="workflow-step bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex flex-col items-center gap-2 z-10 shadow-[0_0_15px_rgba(255,193,7,0.15)]">
                                    <div className="icon bg-amber-500/20 p-2 rounded-lg">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                                    </div>
                                    <span className="text-[10px] font-bold text-amber-500">Notificar</span>
                                </div>
                                <div className="bg-gradient-to-r from-transparent via-amber-500/5 to-transparent workflow-bg-scan pointer-events-none absolute inset-0"></div>
                            </div>
                            <div>
                                <h3>Workflows en Autopiloto.</h3>
                                <p className="mt-2 text-sm">Crea reglas: "Si entra una factura mayor a $500, notificar a Slack".</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                :root {
                  --card-bg: rgba(20, 20, 20, 0.8);
                  --card-border: rgba(255, 255, 255, 0.08);
                  --card-border-top: rgba(255, 255, 255, 0.12);
                  --text-primary: #ffffff;
                  --text-secondary: rgba(255, 255, 255, 0.65);
                  --radius: 20px;
                  --shadow: 
                    0 0 0 1px rgba(0, 0, 0, 0.05),
                    0 2px 4px rgba(0, 0, 0, 0.1),
                    0 8px 24px rgba(0, 0, 0, 0.15);
                }

                .bento-grid {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  grid-auto-rows: 320px;
                  gap: 20px;
                  max-width: 1400px;
                  margin: 0 auto;
                }

                .capability-card {
                  background: var(--card-bg);
                  backdrop-filter: blur(20px);
                  -webkit-backdrop-filter: blur(20px);
                  border: 1px solid var(--card-border);
                  border-top: 1px solid var(--card-border-top);
                  border-radius: var(--radius);
                  box-shadow: var(--shadow);
                  padding: 32px;
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  position: relative;
                  overflow: visible; /* Prevent text clipping */
                  display: flex;
                  flex-direction: column;
                }

                .capability-card:hover {
                  background: rgba(25, 25, 25, 0.85);
                  border-color: rgba(255, 255, 255, 0.15);
                  transform: translateY(-2px);
                  box-shadow: 
                    0 0 0 1px rgba(0, 0, 0, 0.05),
                    0 4px 8px rgba(0, 0, 0, 0.15),
                    0 16px 32px rgba(0, 0, 0, 0.2);
                }

                .bento-content {
                    z-index: 10;
                    height: 100%;
                }

                /* Tipografía Apple */
                .capability-card h3 {
                  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
                  font-size: 24px;
                  font-weight: 600;
                  line-height: 1.3;
                  letter-spacing: -0.02em;
                  color: var(--text-primary);
                  margin: 0;
                  overflow-wrap: break-word;
                }

                .capability-card p {
                  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif;
                  font-size: 15px;
                  font-weight: 400;
                  line-height: 1.6;
                  color: var(--text-secondary);
                  margin: 0;
                  overflow-wrap: break-word;
                }

                /* GRID LAYOUT ASYMMETRY */
                .capability-card.primary {
                  grid-column: span 1;
                  grid-row: span 2;
                  overflow: hidden; /* only hide glow effect here */
                }
                .capability-card.organization {
                  grid-column: span 1;
                  grid-row: span 1;
                }
                .capability-card.privacy {
                  grid-column: span 1;
                  grid-row: span 2;
                }
                .capability-card.extraction {
                  grid-column: span 1;
                  grid-row: span 1;
                }
                .capability-card.ecosystem {
                  grid-column: span 2;
                  grid-row: span 1;
                }
                .capability-card.workflows {
                  grid-column: span 1;
                  grid-row: span 1;
                }

                @media (max-width: 1024px) {
                  .bento-grid {
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                  }
                  .capability-card.ecosystem {
                    grid-column: span 2;
                  }
                }

                @media (max-width: 640px) {
                  .bento-grid {
                    grid-template-columns: 1fr;
                    gap: 12px;
                    grid-auto-rows: auto;
                  }
                  .capability-card {
                    padding: 24px;
                  }
                  .capability-card,
                  .capability-card.primary,
                  .capability-card.privacy,
                  .capability-card.ecosystem {
                    grid-column: span 1;
                    grid-row: span 1;
                  }
                }

                /* -- 1. Encuentra Ideas (Search) -- */
                .search-bar {
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  background: rgba(255, 255, 255, 0.05);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  border-radius: 14px;
                  padding: 14px 18px;
                }
                .search-icon {
                  color: rgba(255, 255, 255, 0.4);
                  flex-shrink: 0;
                }
                .search-text-container {
                  flex: 1;
                  overflow: hidden;
                  position: relative;
                  min-height: 22px;
                  display: flex;
                  align-items: center;
                }

                /* The ::after pseudo-element shows the text via content */
                .typing-text {
                  display: inline-block;
                  color: rgba(255, 255, 255, 0.9);
                  font-size: 13.5px;
                  white-space: nowrap;
                  overflow: hidden;
                  width: 0;
                  border-right: 2px solid #ffc107;
                  padding-right: 2px;
                  animation: typingFull 5s steps(52, end) infinite;
                }
                .typing-text::before {
                  content: '¿Cuál es la cláusula de rescisión del contrato de García?';
                }
                @keyframes typingFull {
                  /* Type out */
                  0%   { width: 0ch; }
                  50%  { width: 52ch; }
                  /* Hold fully typed */
                  70%  { width: 52ch; }
                  /* Erase */
                  92%  { width: 0ch; }
                  100% { width: 0ch; }
                }

                /* ENCONTRADO badge — fades in when text is complete */
                .search-status {
                  color: #22c55e;
                  font-size: 11px;
                  font-weight: 700;
                  white-space: nowrap;
                  flex-shrink: 0;
                  padding-left: 12px;
                  border-left: 1px solid rgba(34, 197, 94, 0.25);
                  letter-spacing: 0.04em;
                  opacity: 0;
                  animation: statusAppear 5s infinite;
                }
                @keyframes statusAppear {
                  /* Same timing as typingFull — appear when text is done */
                  0%   { opacity: 0; }
                  48%  { opacity: 0; }
                  55%  { opacity: 1; }
                  70%  { opacity: 1; }
                  78%  { opacity: 0; }
                  100% { opacity: 0; }
                }

                /* ── AI Result Card ── */
                .ai-result-card {
                  background: rgba(255,255,255,0.04);
                  border: 1px solid rgba(255,255,255,0.08);
                  border-radius: 14px;
                  padding: 14px 16px;
                  animation: resultSlideIn 5s infinite;
                }
                @keyframes resultSlideIn {
                  0%   { opacity: 0; transform: translateY(8px); }
                  52%  { opacity: 0; transform: translateY(8px); }
                  62%  { opacity: 1; transform: translateY(0); }
                  72%  { opacity: 1; transform: translateY(0); }
                  80%  { opacity: 0; }
                  100% { opacity: 0; }
                }
                .ai-result-header {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  margin-bottom: 10px;
                }
                .ai-badge {
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  width: 22px;
                  height: 22px;
                  background: rgba(255,193,7,0.15);
                  border: 1px solid rgba(255,193,7,0.3);
                  border-radius: 6px;
                  font-size: 9px;
                  font-weight: 800;
                  color: #ffc107;
                  letter-spacing: 0.04em;
                  flex-shrink: 0;
                }
                .ai-source {
                  font-size: 10px;
                  font-weight: 600;
                  color: rgba(255,255,255,0.35);
                  letter-spacing: 0.02em;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .ai-result-text {
                  font-size: 12.5px !important;
                  line-height: 1.65 !important;
                  color: rgba(255,255,255,0.7) !important;
                  margin: 0 0 10px 0 !important;
                  font-style: italic;
                }
                mark.ai-highlight {
                  background: rgba(255,193,7,0.18);
                  color: #ffc107;
                  padding: 0 3px;
                  border-radius: 3px;
                  font-style: normal;
                  font-weight: 700;
                }
                .ai-meta {
                  display: flex;
                  align-items: center;
                  gap: 6px;
                }
                .ai-confidence {
                  font-size: 10px;
                  font-weight: 700;
                  color: #22c55e;
                }
                .ai-dot {
                  width: 3px;
                  height: 3px;
                  background: rgba(255,255,255,0.2);
                  border-radius: 50%;
                }
                .ai-page {
                  font-size: 10px;
                  font-weight: 600;
                  color: rgba(255,255,255,0.3);
                }
                .glow-effect {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 300px;
                  height: 300px;
                  background: radial-gradient(circle, rgba(255, 193, 7, 0.08) 0%, transparent 60%);
                  pointer-events: none;
                  transition: opacity 0.3s ease;
                  opacity: 0;
                  z-index: 0;
                }
                .capability-card.primary:hover .glow-effect { opacity: 1; }

                /* -- 2. Organización -- */
                .file-stack {
                  position: relative;
                  width: 60px;
                  height: 80px;
                }
                .file, .folder {
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  background: rgba(39, 39, 42, 0.8);
                  border: 1px solid rgba(63, 63, 70, 0.8);
                  border-radius: 8px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 10px;
                  font-weight: bold;
                  color: white;
                  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .file-stack.chaotic .file:nth-child(1) { transform: translate(-20px, -15px) rotate(-15deg); z-index: 1; }
                .file-stack.chaotic .file:nth-child(2) { transform: translate(15px, -5px) rotate(8deg); z-index: 2; }
                .file-stack.chaotic .file:nth-child(3) { transform: translate(-5px, 15px) rotate(-5deg); z-index: 3; }
                .file-stack.chaotic .file:nth-child(4) { transform: translate(10px, 20px) rotate(12deg); z-index: 4; }
                .capability-card:hover .file-stack.chaotic .file { transform: translate(0, 0) rotate(0deg) !important; }

                .file-stack.organized {
                  position: relative;
                  opacity: 0;
                  transform: translateX(20px);
                  transition: all 0.5s ease;
                }
                .folder {
                  position: relative;
                  height: 24px;
                  justify-content: flex-start;
                  padding-left: 8px;
                  background: transparent;
                  border: 1px dashed rgba(255, 193, 7, 0.4);
                  color: #d4d4d8;
                }
                .capability-card:hover .file-stack.organized { opacity: 1; transform: translateX(0); }
                .transform-arrow { opacity: 0.2; transition: opacity 0.3s; }
                .capability-card:hover .transform-arrow { opacity: 1; animation: pulseArrow 1s infinite alternate; }
                @keyframes pulseArrow { 100% { transform: scale(1.2); } }

                /* -- 3. Privacidad -- */
                .privacy-animation {
                  position: relative;
                  width: 120px;
                  height: 120px;
                  margin: 0 auto 32px;
                }
                .document-icon {
                  position: absolute;
                  inset: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  opacity: 1;
                  animation: fadeToShield 3s ease-in-out infinite;
                }
                .doc-svg {
                  width: 80px;
                  height: 80px;
                  fill: none;
                  stroke: rgba(255, 193, 7, 0.5);
                  stroke-width: 2;
                }
                .shield-icon {
                  position: absolute;
                  inset: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  opacity: 0;
                  animation: fadeFromDoc 3s ease-in-out infinite;
                }
                .shield-svg {
                  width: 100px;
                  height: 100px;
                  fill: rgba(255, 193, 7, 0.15);
                  stroke: #ffc107;
                  stroke-width: 2;
                }
                .shield-lock { fill: #ffc107; }

                @keyframes fadeToShield {
                  0%, 30% { opacity: 1; transform: scale(1) rotate(0deg); }
                  45% { opacity: 0; transform: scale(0.8) rotate(-10deg); }
                  55%, 100% { opacity: 0; transform: scale(0.8) rotate(-10deg); }
                }
                @keyframes fadeFromDoc {
                  0%, 45% { opacity: 0; transform: scale(1.2) rotate(10deg); }
                  55% { opacity: 1; transform: scale(1) rotate(0deg); }
                  85% { opacity: 1; transform: scale(1) rotate(0deg); }
                  100% { opacity: 0; transform: scale(0.8); }
                }

                .particles {
                  position: absolute;
                  inset: 0;
                  pointer-events: none;
                }
                .particle {
                  position: absolute;
                  width: 4px;
                  height: 4px;
                  background: #ffc107;
                  border-radius: 50%;
                  opacity: 0;
                  animation: particleBurst 3s ease-out infinite;
                }
                .particle:nth-child(1) { top: 50%; left: 50%; animation-delay: 0s; --x: 1; --y: -1; }
                .particle:nth-child(2) { top: 50%; left: 50%; animation-delay: 0.1s; --x: -1; --y: -1; }
                .particle:nth-child(3) { top: 50%; left: 50%; animation-delay: 0.2s; --x: 1; --y: 1; }
                .particle:nth-child(4) { top: 50%; left: 50%; animation-delay: 0.3s; --x: -1; --y: 1; }

                @keyframes particleBurst {
                  0%, 45% { opacity: 0; transform: translate(0, 0) scale(0); }
                  50% { opacity: 1; }
                  55% { opacity: 1; transform: translate(calc(var(--x, 0) * 30px), calc(var(--y, 0) * 30px)) scale(1); }
                  60%, 100% { opacity: 0; }
                }

                .security-badges {
                  display: flex;
                  gap: 8px;
                  margin: 16px 0;
                }
                .badge {
                  display: inline-flex;
                  align-items: center;
                  padding: 6px 12px;
                  background: rgba(255, 193, 7, 0.1);
                  border: 1px solid rgba(255, 193, 7, 0.3);
                  border-radius: 8px;
                  font-size: 12px;
                  font-weight: 600;
                  color: #ffc107;
                  letter-spacing: 0.02em;
                }

                /* -- 4. Extracción -- */
                .receipt-paper {
                  background: #18181b;
                  border: 1px solid #27272a;
                  border-radius: 8px;
                  padding: 16px;
                  width: 100%;
                  max-width: 200px;
                  position: relative;
                  overflow: hidden;
                  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .receipt-line { display: flex; align-items: center; margin-bottom: 8px; }
                .receipt-line .label { font-size: 11px; color: #71717a; }
                .value.highlight { position: relative; color: #ffc107; font-weight: 700; }
                .value.highlight::before {
                  content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 2px;
                  background: linear-gradient(90deg, #ffc107, #ff6b6b);
                  animation: underline 2s ease-in-out infinite alternate;
                }
                @keyframes underline { 0%, 20% { width: 0; } 80%, 100% { width: 100%; } }
                .receipt-paper::after {
                  content: ''; position: absolute; top: -100px; left: 0; width: 100%; height: 100px;
                  background: linear-gradient(to bottom, transparent, rgba(255, 193, 7, 0.1));
                  border-bottom: 2px solid rgba(255, 193, 7, 0.8);
                  animation: scanDown 3s ease-in-out infinite;
                }
                @keyframes scanDown {
                  0%, 100% { transform: translateY(-50px); opacity: 0; }
                  50% { transform: translateY(250px); opacity: 1; }
                }

                /* -- 5. Ecosistema -- */
                .integration-node {
                  background: #18181b;
                  border: 1px solid #27272a;
                  border-radius: 12px;
                  padding: 12px;
                  z-index: 2;
                }
                .integration-node.center {
                  border-color: rgba(255, 193, 7, 0.3);
                  background: #27272a;
                }
                .connection-line { overflow: visible; }
                .path-line { stroke: rgba(255, 193, 7, 0.2); stroke-width: 2; stroke-dasharray: 4 4; }
                .flow-dot { r: 3; fill: #ffc107; animation: flowPath 2s ease-in-out infinite; }
                .flow-dot.delay-1 { animation-delay: 1s; }
                @keyframes flowPath {
                  0% { cx: 0; opacity: 0; }
                  50% { opacity: 1; transform: scale(1.5); }
                  100% { cx: 64px; opacity: 0; }
                }

                /* -- 6. Workflows -- */
                .workflow-demo {
                  position: relative;
                }
                .workflow-bg-scan { animation: sideScan 3s linear infinite; }
                @keyframes sideScan {
                  0% { transform: translateX(-100%); opacity: 0; }
                  50% { opacity: 1; }
                  100% { transform: translateX(100%); opacity: 0; }
                }
            `}} />
        </section>
    );
}
