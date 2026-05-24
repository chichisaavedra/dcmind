import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader2, Sparkles, FileSearch, Lightbulb, History, MoreVertical, Paperclip, Settings, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../hooks/useTranslation';
import { askGemini } from '../../lib/gemini';

/**
 * `AIAssistant`
 * 
 * Interfaz de chat conversacional estilo ChatGPT para interactuar con los documentos.
 * Permite hacer consultas en lenguaje natural, resúmenes y extracción de datos.
 * Las sugerencias ('chips') cambian dinámicamente según si hay archivos cargados.
 * 
 * @param files - Archivos cargados en el contexto del chat (Mocks visuales)
 * @param rawFiles - Objetos de archivo nativos listos para enviar al modelo Multimodal
 */
export default function AIAssistant({ files = [], rawFiles = [] }: { files?: any[], rawFiles?: File[] }) {
  const { t } = useTranslation();
  // Estado local del historial de mensajes
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: '¡Hola! Soy tu asistente de DocMind. ¿En qué te ayudo hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determina qué sugerencias mostrar según el estado del contexto
  const [contextState, setContextState] = useState<'empty' | 'uploaded' | 'settings'>('empty');

  useEffect(() => {
    if (files.length > 0 || rawFiles.length > 0) {
      setContextState('uploaded');
    } else {
      setContextState('empty');
    }
  }, [files, rawFiles]);

  const dynamicSuggestions = {
    empty: [
      { icon: Lightbulb, text: '¿Cómo empiezo?' },
      { icon: Sparkles, text: '¿Qué puedo hacer aquí?' },
      { icon: FileSearch, text: 'Explícame cómo funciona' }
    ],
    uploaded: [
      { icon: FileSearch, text: 'Resume este documento' },
      { icon: Lightbulb, text: 'Extrae los puntos clave' },
      { icon: Sparkles, text: '¿Hay fechas importantes?' }
    ],
    settings: [
      { icon: Settings, text: '¿Cómo cambio mi plan?' },
      { icon: Zap, text: '¿Cómo conectar mi API?' }
    ]
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const responseText = await askGemini(userMsg, rawFiles);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error: any) {
      let errorMsg = 'Lo siento, ha ocurrido un error al conectar con la inteligencia artificial.';

      const errorMessage = error.message || '';

      if (errorMessage.includes('429') || errorMessage.includes('Resource has been exhausted')) {
        errorMsg = '⚠️ La cuota gratuita de Gemini se ha agotado temporalmente. Por favor, reintenta en unos minutos o verifica tu consola de Google AI Studio.';
      } else if (errorMessage.includes('API key')) {
        errorMsg = '🔑 Error: No se encontró una clave de API válida. Por favor, verifica tu archivo .env (VITE_GEMINI_API_KEY).';
      } else if (errorMessage.includes('404')) {
        errorMsg = '❌ Error: El modelo Gemini no se encuentra o no está disponible en tu región actualmente.';
      } else if (errorMessage.includes('fetch')) {
        errorMsg = '🌐 Error de red: No se pudo conectar con los servidores de Google AI. Revisa tu conexión a internet.';
      }

      setMessages(prev => [...prev, { role: 'model', text: errorMsg }]);
      console.error('DocMind AI Gemini Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)] animate-fade-in">

      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-white rounded-[3rem] border border-gray-200/50 shadow-sm overflow-hidden relative">
        {/* Header */}
        <div className="px-10 py-6 border-b border-gray-100 flex items-center justify-between bg-white/50 backdrop-blur-xl z-10">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-gray-200">
              <Bot size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">DocMind AI</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest uppercase">Inteligencia Activa</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 text-gray-400 hover:bg-gray-50 rounded-full transition-all">
              <History size={20} />
            </button>
            <button className="p-3 text-gray-400 hover:bg-gray-50 rounded-full transition-all">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-[radial-gradient(#f1f1f1_1px,transparent_1px)] [background-size:20px_20px]">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex gap-5 animate-fade-in", msg.role === 'user' ? 'flex-row-reverse' : '')}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-md",
                msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-gradient-to-tr from-indigo-500 to-purple-500 text-white'
              )}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={cn(
                "max-w-[75%] px-7 py-5 text-sm leading-relaxed font-medium transition-all",
                msg.role === 'user'
                  ? 'bg-gray-900 text-white rounded-[2rem] rounded-tr-[0.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-[2rem] rounded-tl-[0.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
              )}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                <Bot size={18} />
              </div>
              <div className="px-7 py-5 bg-white border border-gray-100 shadow-sm rounded-[2rem] rounded-tl-sm flex items-center gap-4">
                <Loader2 size={18} className="animate-spin text-indigo-600" />
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">IA Analizando...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input & Chips */}
        <div className="relative p-6 pt-0 bg-white border-t border-gray-100 flex flex-col justify-end">

          {/* Contextual Chips Layer */}
          <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-4 pt-4 hide-scrollbar">
            {dynamicSuggestions[contextState].map((s, i) => (
              <button
                key={`${contextState}-${i}`}
                onClick={() => handleSend(s.text)}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-100 rounded-full text-xs font-bold text-gray-600 hover:text-indigo-700 transition-all group animate-[fadeIn_0.5s_ease-out_forwards] opacity-0"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <s.icon size={14} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                {s.text}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregunta algo sobre tus documentos..."
                className="w-full pl-6 pr-24 py-5 bg-gray-50 border border-gray-200/60 rounded-[2rem] text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium shadow-sm"
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button type="button" className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                  <Paperclip size={20} />
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-3 bg-gray-900 text-white rounded-xl hover:bg-black disabled:opacity-30 transition-all shadow-xl shadow-gray-200 active:scale-95"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Sidebar Suggestions */}
      <div className="w-80 space-y-6 hidden lg:block">
        <div className="bg-white p-8 rounded-[3rem] border border-gray-200/50 shadow-sm space-y-8">
          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-1">Atajos Inteligentes</h3>
            <div className="space-y-3">
              {dynamicSuggestions.uploaded.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s.text)}
                  className="w-full text-left p-5 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-[1.5rem] transition-all group scale-100 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <s.icon size={18} className="text-gray-400 group-hover:text-indigo-600 mb-3 transition-colors" />
                  <p className="text-xs font-bold text-gray-700 leading-snug">{s.text}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 space-y-4">
            <div className="flex items-center gap-3 text-gray-400">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Capacidades</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
              DocMind AI utiliza Gemini 1.5 Flash para razonamiento documental avanzado, análisis multilingüe y procesamiento visual de archivos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
