/**
 * OnboardingTour.tsx
 *
 * El modal bloqueante de bienvenida fue eliminado.
 * Este archivo exporta <HelpTooltip> — un ícono "?" sutil que muestra
 * un globo con backdrop-blur al hacer hover o tap. Se renderiza en un
 * portal (document.body) para que nunca sea recortado por overflow:hidden
 * del sidebar ni otro contenedor.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle } from 'lucide-react';

interface HelpTooltipProps {
  text: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function HelpTooltip({ text, side = 'top' }: HelpTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const TOOLTIP_W = 220;
    const TOOLTIP_H = 70;
    const GAP = 10;

    let top = 0;
    let left = 0;

    if (side === 'top') {
      top = r.top + window.scrollY - TOOLTIP_H - GAP;
      left = r.left + window.scrollX + r.width / 2 - TOOLTIP_W / 2;
    } else if (side === 'bottom') {
      top = r.bottom + window.scrollY + GAP;
      left = r.left + window.scrollX + r.width / 2 - TOOLTIP_W / 2;
    } else if (side === 'right') {
      top = r.top + window.scrollY + r.height / 2 - TOOLTIP_H / 2;
      left = r.right + window.scrollX + GAP;
    } else {
      top = r.top + window.scrollY + r.height / 2 - TOOLTIP_H / 2;
      left = r.left + window.scrollX - TOOLTIP_W - GAP;
    }

    // Clamp to viewport
    left = Math.max(8, Math.min(left, window.innerWidth - TOOLTIP_W - 8));
    top = Math.max(8, top);

    setCoords({ top, left });
  }, [side]);

  const show = () => { updatePosition(); setVisible(true); };
  const hide = () => setVisible(false);

  // Hide on scroll / resize
  useEffect(() => {
    if (!visible) return;
    const handle = () => setVisible(false);
    window.addEventListener('scroll', handle, true);
    window.addEventListener('resize', handle);
    return () => {
      window.removeEventListener('scroll', handle, true);
      window.removeEventListener('resize', handle);
    };
  }, [visible]);

  const tooltipEl = visible
    ? createPortal(
      <div
        style={{
          position: 'fixed',
          top: coords.top,
          left: coords.left,
          zIndex: 99999,
          width: 220,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 16,
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
            padding: '12px 14px',
            fontSize: 12,
            fontWeight: 500,
            color: '#374151',
            lineHeight: 1.5,
            textTransform: 'none',        // override any parent uppercase
            letterSpacing: 'normal',
            textAlign: 'left',
            fontFamily: 'inherit',
          }}
        >
          {text}
        </div>
      </div>,
      document.body
    )
    : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Ayuda contextual"
        onMouseEnter={show}
        onMouseLeave={hide}
        onClick={(e) => { e.stopPropagation(); setVisible(v => !v); }}
        style={{ textTransform: 'none', fontWeight: 'normal', letterSpacing: 'normal' }}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-300 hover:text-indigo-400 transition-colors duration-200 flex-shrink-0"
      >
        <HelpCircle size={14} strokeWidth={2.2} />
      </button>
      {tooltipEl}
    </>
  );
}

/** Default export renders nothing — tour modal was removed. */
export default function OnboardingTour() {
  return null;
}
