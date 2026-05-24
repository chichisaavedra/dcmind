import { useState, useRef } from 'react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, LineChart, Line
} from 'recharts';
import { Download, TrendingUp, FileText, Bot, Zap, ArrowUpRight, Clock, DollarSign } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../hooks/useTranslation';

const TIME_SAVED_DATA = [
  { name: 'Lun', horasIA: 2.5, horasManual: 0.5 },
  { name: 'Mar', horasIA: 3.0, horasManual: 0.8 },
  { name: 'Mié', horasIA: 4.2, horasManual: 1.0 },
  { name: 'Jue', horasIA: 3.8, horasManual: 0.7 },
  { name: 'Vie', horasIA: 5.1, horasManual: 1.2 },
  { name: 'Sáb', horasIA: 1.2, horasManual: 0.2 },
  { name: 'Dom', horasIA: 0.5, horasManual: 0.1 },
];

// TODO: Replace with real data from Supabase once documents are processed
// Query: SELECT week, AVG(ai_confidence_score) FROM documents GROUP BY week ORDER BY week
const ACCURACY_DATA = [
  { name: 'Semana 1', precision: 90 },
  { name: 'Semana 2', precision: 93 },
  { name: 'Semana 3', precision: 96 },
  { name: 'Semana 4', precision: 100 },
];

const DOC_TYPES_DATA = [
  { name: 'Facturas', value: 340, color: '#6366f1' },
  { name: 'Contratos', value: 210, color: '#8b5cf6' },
  { name: 'Recibos', value: 150, color: '#a855f7' },
  { name: 'Notas', value: 80, color: '#cbd5e1' },
];

// ─── Tooltip ícono "?" corregido: usa estado local en lugar de group-hover ───
// Así el tooltip SOLO aparece cuando el cursor está encima del ícono pequeño,
// no cuando está sobre el gráfico completo.
const TooltipInfo = ({ text }: { text: string }) => {
  const [visible, setVisible] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-2 cursor-help align-middle">
      <span
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs hover:bg-indigo-100 hover:text-indigo-600 transition-colors shadow-sm select-none"
      >
        ?
      </span>
      {visible && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-gray-900 text-white text-xs font-medium rounded-2xl shadow-2xl z-[100] text-center pointer-events-none"
          style={{ textTransform: 'none', letterSpacing: 'normal', fontWeight: 500 }}
        >
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" />
        </span>
      )}
    </span>
  );
};

interface AnalyticsProps {
  filesCount?: number; // passed from App to show real vs empty precision chart
}

type WidgetType = 'roi' | 'time' | 'precision' | 'types';

/**
 * `Analytics`
 * 
 * Vista de métricas y rendimiento. Presenta un diseño modular donde el usuario
 * puede ocultar o mostrar widgets ("Añadir Widget" en la parte inferior).
 * 
 * @param filesCount - Usado para determinar si el usuario ha procesado archivos 
 *                     y mostrar datos reales vs estado vacío en los gráficos.
 */
export default function Analytics({ filesCount = 0 }: AnalyticsProps) {
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState('7d');

  // Estado del layout modular: controla qué gráficos están visibles
  // Por defecto: Solo el gráfico principal de precisión.
  const [visibleWidgets, setVisibleWidgets] = useState<WidgetType[]>(['precision']);
  const [showWidgetMenu, setShowWidgetMenu] = useState(false);

  const hasRealData = filesCount > 0;

  const toggleWidget = (widget: WidgetType) => {
    setVisibleWidgets(prev =>
      prev.includes(widget) ? prev.filter(w => w !== widget) : [...prev, widget]
    );
  };

  const widgetMenuRef = useRef<HTMLDivElement>(null);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20 relative">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Inteligencia y Rendimiento</h2>
          <p className="text-gray-500 font-medium text-lg">Visualiza el impacto de la IA en tus tiempos y organización.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1.5 rounded-[1.25rem] border border-gray-200/50 shadow-sm">
            {[{ id: '7d', label: '7 Días' }, { id: '30d', label: '30 Días' }].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTimeframe(opt.id)}
                className={cn(
                  "px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all",
                  timeframe === opt.id ? "bg-gray-900 text-white shadow-md" : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button className="p-4 bg-white text-gray-900 border border-gray-200/50 rounded-[1.25rem] hover:bg-gray-50 transition-all shadow-sm">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Stats Grid — 4 cards, ROI replaced with two clearer metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Documentos Procesados',
            value: '1,248',
            trend: '+14%',
            icon: FileText,
            color: 'indigo',
            tooltip: 'Total de documentos leídos y analizados por la IA este mes.'
          },
          {
            label: 'Tiempo Ahorrado',
            value: '42h',
            trend: '+5h vs mes anterior',
            icon: Clock,
            color: 'violet',
            tooltip: 'Horas que habrías tardado procesando manualmente a una tasa de 20 min/documento.'
          },
          {
            label: 'Precisión Global IA',
            value: '99.2%',
            trend: '+0.4%',
            icon: Bot,
            color: 'emerald',
            tooltip: 'Porcentaje de campos extraídos correctamente sin corrección manual del usuario.'
          },
          {
            label: 'Ahorro Estimado',
            value: '$2,850',
            trend: '+$310 este mes',
            icon: DollarSign,
            color: 'blue',
            tooltip: 'Costo estimado de las horas manuales ahorradas (42h × $68/h tarifa promedio profesional).'
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", `bg-${stat.color}-50 text-${stat.color}-600`)}>
                <stat.icon size={22} />
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <ArrowUpRight size={14} strokeWidth={3} />
                <span className="text-[11px] font-black">{stat.trend}</span>
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
              {stat.label}
              <TooltipInfo text={stat.tooltip} />
            </p>
            <p className="text-3xl font-black text-gray-900 mt-2 tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ROI breakdown strip — clearer context */}
      {visibleWidgets.includes('roi') && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up">
          {[
            { label: 'ROI sobre suscripción', value: '315%', desc: 'Comparado contra el costo mensual del plan Pro' },
            { label: 'ROI sobre tiempo laboral', value: '12.4×', desc: 'Por cada hora invertida en setup, la IA devuelve 12.4h' },
            { label: 'ROI sobre errores evitados', value: '98%', desc: 'Reducción de re-trabajos por archivos mal clasificados' },
          ].map((roi, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0">
                <TrendingUp size={24} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">{roi.label}</p>
                <p className="text-2xl font-black text-gray-900 tracking-tight">{roi.value}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">{roi.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Chart: Tiempo Ahorrado */}
      {visibleWidgets.includes('time') && (
        <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden group animate-slide-up">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/40 rounded-full -mr-40 -mt-40 blur-3xl transition-all duration-700 group-hover:bg-indigo-100/40 group-hover:scale-110" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center">
                Horas de Trabajo Ahorradas
                <TooltipInfo text="Diferencia entre el tiempo que tomó la IA vs el tiempo estimado hacerlo manualmente (20 min/documento)." />
              </h3>
              <p className="text-sm text-gray-500 font-medium mt-1">Impacto directo en tu productividad diaria.</p>
            </div>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-200" />
                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Tiempo Ahorrado (IA)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tiempo de Revisión</span>
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TIME_SAVED_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorManual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '24px', padding: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="horasIA" stroke="#6366f1" fillOpacity={1} fill="url(#colorIA)" strokeWidth={4} activeDot={{ r: 8, strokeWidth: 0, fill: '#6366f1' }} />
                <Area type="monotone" dataKey="horasManual" stroke="#cbd5e1" fillOpacity={1} fill="url(#colorManual)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Precision Chart */}
        {visibleWidgets.includes('precision') && (
          <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm group hover:shadow-xl transition-all duration-500 animate-slide-up">
            <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight flex items-center">
              Evolución de Precisión IA
              <TooltipInfo text="Mide la exactitud en la extracción de datos de tus documentos. El modelo mejora con tus correcciones y reglas." />
            </h3>
            <p className="text-sm text-gray-500 font-medium mb-10">Crecimiento continuo mediante feedback y reglas.</p>

            {hasRealData ? (
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={ACCURACY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} dy={15} />
                    <YAxis domain={[85, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                    <RechartsTooltip
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                      formatter={(value: any) => [`${value}%`, 'Precisión']}
                    />
                    <Line type="monotone" dataKey="precision" stroke="#8b5cf6" strokeWidth={5} dot={{ r: 6, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center bg-gray-50/60 rounded-[2rem] border-2 border-dashed border-gray-200">
                <Bot size={40} className="text-gray-200 mb-4" />
                <p className="text-sm font-bold text-gray-400 text-center max-w-xs">
                  Los datos de precisión aparecerán aquí después de procesar tus primeros documentos con IA.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tipos de Documentos */}
        {visibleWidgets.includes('types') && (
          <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm flex flex-col animate-slide-up">
            <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight flex items-center">
              Volumen por Tipo de Origen
              <TooltipInfo text="Desglose del tipo de documentos que más procesa la IA en tu cuenta." />
            </h3>
            <p className="text-sm text-gray-500 font-medium mb-10">Análisis del contenido de tus repositorios.</p>

            <div className="space-y-6 flex-1">
              {DOC_TYPES_DATA.map((item, i) => {
                const max = Math.max(...DOC_TYPES_DATA.map(d => d.value));
                const percentage = (item.value / max) * 100;
                return (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-700">{item.name}</span>
                      <span className="text-lg font-black text-gray-900">{item.value} <span className="text-xs text-gray-400 font-medium">docs</span></span>
                    </div>
                    <div className="h-4 bg-gray-50 rounded-full overflow-hidden p-0.5 border border-gray-100">
                      <div
                        className="h-full rounded-full transition-all duration-[1500ms] shadow-inner"
                        style={{ width: `${percentage}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 p-6 bg-indigo-50/50 rounded-[2rem] border border-indigo-100/50 flex items-start gap-4">
              <div className="w-10 h-10 bg-white text-indigo-500 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 mt-1">
                <Zap size={20} />
              </div>
              <p className="text-xs font-medium text-gray-600 leading-relaxed">
                Tus <span className="text-indigo-700 font-bold">Facturas</span> representan el 43% de tus archivos. Creemos que automatizar su categorización es el próximo paso lógico.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Widget Button */}
      <div className="flex justify-center mt-8 relative">
        <button
          onClick={() => setShowWidgetMenu(!showWidgetMenu)}
          className="w-14 h-14 bg-white hover:bg-gray-50 text-gray-900 rounded-full shadow-lg border border-gray-200/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-40"
        >
          <div className={cn("transition-transform duration-300", showWidgetMenu ? "rotate-45" : "rotate-0")}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
        </button>

        {/* Widget Menu Popover */}
        {showWidgetMenu && (
          <div className="absolute bottom-[calc(100%+24px)] mb-2 p-4 bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white w-72 flex flex-col gap-2 z-50 animate-slide-up origin-bottom">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 pb-2">Añadir Widget</h4>

            {[
              { id: 'precision', label: 'Evolución de Precisión', icon: <Bot size={16} /> },
              { id: 'time', label: 'Horas Ahorradas', icon: <Clock size={16} /> },
              { id: 'roi', label: 'Desglose de ROI', icon: <TrendingUp size={16} /> },
              { id: 'types', label: 'Tipos de Documento', icon: <FileText size={16} /> },
            ].map((widget) => {
              const isAdded = visibleWidgets.includes(widget.id as WidgetType);
              return (
                <button
                  key={widget.id}
                  onClick={() => toggleWidget(widget.id as WidgetType)}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-100/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", isAdded ? "bg-gray-100 text-gray-400" : "bg-indigo-50 text-indigo-600")}>
                      {widget.icon}
                    </div>
                    <span className={cn("text-sm font-bold", isAdded ? "text-gray-400" : "text-gray-900")}>{widget.label}</span>
                  </div>
                  {isAdded ? (
                    <span className="text-[10px] uppercase font-bold text-gray-400 mr-2">Ocultar</span>
                  ) : (
                    <span className="text-[10px] uppercase font-bold text-indigo-600 mr-2">Añadir</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
