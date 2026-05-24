import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  User,
  Shield,
  CreditCard,
  Bell,
  LogOut,
  Zap,
  ChevronRight,
  Globe,
  Lock,
  X,
  Check,
  Settings as SettingsIcon,
  Smartphone,
  Mail,
  Moon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from '../../hooks/useTranslation';
import { HelpTooltip } from '../OnboardingTour';

/**
 * Propiedades para la vista de Configuración
 */
interface SettingsProps {
  userPlan: string;
  onUpgrade: () => void;
}

/**
 * `Settings`
 * 
 * Vista de administración de cuenta, seguridad y preferencias.
 * Utiliza `createPortal` para renderizar los modales emergentes (ej. "Claves de API")
 * directamente en el `document.body`, asegurando que el fondo borroso cubra
 * toda la pantalla sin verse afectado por contextos locales de CSS (transforms/overflows).
 * 
 * @param userPlan - Plan actual para mostrar la insignia (Básico/Premium)
 * @param onUpgrade - Callback para redirigir a Pricing si el usuario es Free
 */
export default function Settings({ userPlan, onUpgrade }: SettingsProps) {
  const { t } = useTranslation();
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const sections = [
    {
      title: 'Cuenta',
      items: [
        { id: 'profile', label: 'Información Personal', desc: 'Nombre, avatar y correo electrónico', icon: User },
        { id: 'security', label: 'Seguridad y Acceso', desc: 'Contraseña y verificación en dos pasos', icon: Shield },
        { id: 'devices', label: 'Dispositivos', desc: 'Sesiones activas en otros navegadores', icon: Smartphone },
      ]
    },
    {
      title: 'Suscripción',
      items: [
        {
          id: 'plan',
          label: 'Tu Plan Actual',
          desc: `Actualmente en el Plan ${userPlan}`,
          icon: Zap,
          badge: userPlan === 'Free' ? 'Básico' : 'Premium',
          onClick: userPlan === 'Free' ? onUpgrade : () => setActiveItem('plan')
        },
        { id: 'billing', label: 'Métodos de Pago', desc: 'Gestiona tus tarjetas y facturas', icon: CreditCard },
      ]
    },
    {
      title: 'Preferencias',
      items: [
        { id: 'notifications', label: 'Notificaciones', desc: 'Alertas IA y resúmenes semanales', icon: Bell },
        { id: 'appearance', label: 'Apariencia', desc: 'Modo oscuro y personalización', icon: Moon },
        { id: 'language', label: 'Idioma y Región', desc: 'Español (España)', icon: Globe },
        { id: 'apikeys', label: 'Claves de API', desc: 'Conecta tus proveedores de IA (Claude, OpenAI)', icon: Lock },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-20">

      <div className="space-y-2">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Configuración</h2>
        <p className="text-gray-500 font-medium">Personaliza tu experiencia y gestiona tu seguridad.</p>
      </div>

      <div className="space-y-12">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-6">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4">
              {section.title}
            </h3>
            <div className="bg-white rounded-[2.5rem] border border-gray-200/50 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:shadow-gray-200/30">
              <div className="divide-y divide-gray-100">
                {section.items.map((item, i) => (
                  <div
                    key={i}
                    onClick={item.onClick || (() => setActiveItem(item.id))}
                    className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-300">
                        <item.icon size={22} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 leading-tight">{item.label}</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">{item.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {item.badge && (
                        <span className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                          item.badge === 'Premium' ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"
                        )}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="pt-8 flex flex-col md:flex-row gap-4">
          <button className="flex-1 py-5 bg-white border border-red-200 text-red-500 rounded-[2rem] font-bold text-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2">
            <LogOut size={18} />
            Cerrar Sesión Global
          </button>
          <button className="flex-1 py-5 bg-gray-50 text-gray-400 rounded-[2rem] font-bold text-sm hover:text-gray-900 transition-all">
            Desactivar Cuenta
          </button>
        </div>
      </div>

      {/* 
        Modificación: Uso de createPortal para evitar que un ancestro con 'transform' restrinja 
        el contenedor fixed, resolviendo el bug del fondo borroso al tamaño del celular. 
      */}
      {activeItem && createPortal(
        <div className="fixed inset-0 top-0 left-0 w-screen h-screen z-[9999] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl animate-fade-in" onClick={() => setActiveItem(null)} />

          {activeItem === 'apikeys' ? (
            /* ── API Key Panel ── */
            <div className="relative w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl p-12 animate-slide-up border border-white">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Lock size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                      Claves de API
                      <HelpTooltip
                        text="Tus claves nunca se envían a nuestros servidores. Se guardan cifradas en tu perfil de Supabase y solo se usan desde el servidor de procesamiento."
                        side="right"
                      />
                    </h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Cifradas &amp; seguras</p>
                  </div>
                </div>
                <button onClick={() => setActiveItem(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                {[
                  { label: 'Anthropic Claude', placeholder: 'sk-ant-...', color: 'from-orange-500 to-red-500' },
                  { label: 'OpenAI GPT-4o', placeholder: 'sk-proj-...', color: 'from-emerald-500 to-teal-500' },
                  { label: 'DeepSeek (Plan Free)', placeholder: 'sk-...', color: 'from-blue-500 to-indigo-500' },
                ].map(({ label, placeholder, color }) => (
                  <div key={label} className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full bg-gradient-to-r ${color}`} />
                      {label}
                    </label>
                    <input
                      type="password"
                      placeholder={placeholder}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200/60 rounded-2xl text-sm font-mono text-gray-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <button onClick={() => setActiveItem(null)} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all">
                  Cancelar
                </button>
                <button className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-xl shadow-gray-200">
                  Guardar Claves
                </button>
              </div>
            </div>
          ) : (
            /* ── Generic Panel ── */
            <div className="relative w-full max-w-lg bg-white rounded-[3.5rem] shadow-2xl p-12 animate-slide-up border border-white text-center">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8">
                <SettingsIcon size={32} />
              </div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-4 lowercase first-letter:uppercase">
                {activeItem}
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed mb-10 px-4">
                Esta sección está lista para la integración final. Podrás gestionar tus preferencias y sincronizar tus datos en tiempo real.
              </p>
              <div className="space-y-3 mb-10">
                <div className="p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100 flex items-center gap-4">
                  <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-500">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Listo para producción</span>
                </div>
                <div className="p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100 flex items-center gap-4">
                  <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-500">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Conexión Segura con Supabase</span>
                </div>
              </div>
              <button
                onClick={() => setActiveItem(null)}
                className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl shadow-gray-200"
              >
                Cerrar Ajustes
              </button>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
