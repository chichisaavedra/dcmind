import React, { useState } from 'react';
import { Check, Zap, Shield, Users, Star, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../hooks/useTranslation';

/**
 * `Pricing`
 * 
 * Vista de precios y planes de suscripción.
 * Permite al usuario cambiar entre facturación mensual/anual y actualizar su plan.
 * 
 * @param onUpgrade - Función ejecutada al seleccionar un nuevo plan
 * @param userPlan - Plan actual del usuario para deshabilitar el botón correspondiente
 */
export default function Pricing({
  onUpgrade,
  userPlan = 'Free'
}: {
  onUpgrade: (plan: string) => void,
  userPlan?: string
}) {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'FREE',
      price: '$0',
      period: '/mes',
      description: 'Prueba DocMind gratis. Perfecto para empezar.',
      features: [
        '10 archivos procesados / mes',
        '3 imágenes OCR / mes',
        '5 preguntas al chatbot',
        'Categorización automática',
        '500MB almacenamiento',
      ],
      color: 'slate',
      buttonText: userPlan === 'Free' ? 'Plan Actual' : 'Empezar Gratis',
      current: userPlan === 'Free'
    },
    {
      name: 'STARTER',
      price: isAnnual ? '$5.95' : '$7',
      period: '/mes',
      description: 'Para uso casual. Organiza tu conocimiento personal.',
      features: [
        '50 archivos procesados / mes',
        '15 imágenes OCR / mes',
        '20 preguntas al chatbot',
        '10 reglas personalizadas',
        '2GB almacenamiento',
        'IA Avanzada (Claude 3.5 Sonnet)',
        'Procesamiento rápido',
      ],
      color: 'indigo',
      buttonText: userPlan === 'Starter' ? 'Plan Actual' : 'Comenzar Prueba',
      current: userPlan === 'Starter'
    },
    {
      name: 'PRO',
      price: isAnnual ? '$12.75' : '$15',
      period: '/mes',
      description: 'Para profesionales con requerimientos avanzados.',
      features: [
        '150 archivos procesados / mes',
        '30 imágenes OCR / mes',
        '30 preguntas al chatbot',
        '25 reglas personalizadas',
        '5GB almacenamiento',
        'Procesamiento prioritario',
        'Búsqueda avanzada y notificaciones',
        'Integraciones (Drive, Dropbox)',
      ],
      color: 'purple',
      buttonText: userPlan === 'Pro' ? 'Plan Actual' : 'Comenzar Prueba',
      popular: true,
      current: userPlan === 'Pro'
    }
  ];

  return (
    <div className="space-y-20 animate-fade-in pb-20">

      {/* Header Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full">
          <Sparkles size={14} className="fill-indigo-600" />
          <span className="text-[10px] font-black uppercase tracking-widest">Nuevos Planes 2026</span>
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1]">
          Diseñado para <br /> mentes brillantes.
        </h2>
        <p className="text-xl text-gray-500 font-medium">
          Elige el plan que mejor se adapte a tu flujo de trabajo. Sin compromisos.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 pt-6">
          <span className={cn("text-sm font-bold transition-colors", !isAnnual ? "text-gray-900" : "text-gray-400")}>Mensual</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="w-14 h-8 bg-gray-900 rounded-full relative p-1 transition-all"
          >
            <div className={cn(
              "w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-300",
              isAnnual ? "translate-x-6" : "translate-x-0"
            )} />
          </button>
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-bold transition-colors", isAnnual ? "text-gray-900" : "text-gray-400")}>Anual</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg uppercase">Ahorra 15%</span>
          </div>
        </div>
      </div>

      {/* Plans Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative group p-10 rounded-[3.5rem] bg-white border border-gray-100 transition-all duration-500",
              "hover:shadow-2xl hover:shadow-gray-200/50 hover:-translate-y-2",
              plan.popular && "ring-2 ring-indigo-500 shadow-xl shadow-indigo-100/50"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                Recomendado
              </div>
            )}

            <div className="space-y-8 h-full flex flex-col">
              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">{plan.name}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                  {plan.period && <span className="text-gray-400 font-bold mb-2">{plan.period}</span>}
                </div>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="space-y-4 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center",
                      plan.popular ? "bg-indigo-50 text-indigo-600" : "bg-gray-50 text-gray-400"
                    )}>
                      <Check size={12} strokeWidth={4} />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => !plan.current && onUpgrade(plan.name)}
                className={cn(
                  "w-full py-5 rounded-[2rem] font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2",
                  plan.current
                    ? "bg-gray-100 text-gray-400 cursor-default"
                    : plan.popular
                      ? "bg-indigo-600 text-white hover:bg-black shadow-xl shadow-indigo-200"
                      : "bg-gray-900 text-white hover:bg-black shadow-xl shadow-gray-200"
                )}
              >
                {plan.buttonText}
                {(!plan.current && plan.popular) && <Zap size={16} className="fill-white" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise Section - Ultra Premium */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full -mr-40 -mt-40 blur-[120px] group-hover:bg-indigo-600/30 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/10 rounded-full -ml-20 -mb-20 blur-[100px]" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-xl">
                <Shield className="text-indigo-400" size={24} />
                <span className="text-xs font-black uppercase tracking-widest text-indigo-400">Enterprise Ready</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Soluciones para <br /> grandes equipos.
              </h3>
              <p className="text-gray-400 text-lg font-medium max-w-md mx-auto lg:mx-0">
                Seguridad de nivel corporativo, administración de usuarios y API personalizada para tu flujo de trabajo.
              </p>
              <button className="px-10 py-5 bg-white text-gray-900 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 mx-auto lg:mx-0">
                Contactar Ventas
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 h-full">
              {[
                { label: 'Uptime', value: '99.99%', icon: Zap, color: 'text-amber-400' },
                { label: 'Usuarios', value: 'Ilimitados', icon: Users, color: 'text-indigo-400' },
                { label: 'Seguridad', value: 'SSO / SAML', icon: Shield, color: 'text-emerald-400' },
                { label: 'IA', value: 'Custom Mix', icon: Star, color: 'text-purple-400' },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 transition-all hover:bg-white/10">
                  <item.icon className={cn("mb-4", item.color)} size={24} />
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-xl font-black">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
