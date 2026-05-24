import React, { useEffect, useRef } from 'react';

// ─────────────────────────────────────────────
//  FloatingDocCards
//  Pure CSS + requestAnimationFrame approach.
//  Cards are real DOM nodes — glassmorphism,
//  rounded, semi-transparent — with chaos→order
//  interaction driven by mouse proximity.
// ─────────────────────────────────────────────

const TYPES = ['PDF', 'DOCX', 'XLSX', 'IMG', 'PPTX', 'CSV', 'PDF', 'DOCX', 'XLSX', 'IMG', 'PPTX', 'PDF', 'DOCX', 'XLSX', 'IMG', 'CSV'];
const COUNT = 14;

/* SVG icons per type */
function iconSVG(type: string): string {
    const stroke = 'rgba(255,255,255,0.55)';
    const s = `stroke="${stroke}" stroke-width="2" fill="none"`;
    switch (type) {
        case 'PDF': case 'CSV':
            return `<svg width="15" height="15" viewBox="0 0 24 24" ${s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`;
        case 'XLSX':
            return `<svg width="15" height="15" viewBox="0 0 24 24" ${s}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/></svg>`;
        case 'DOCX':
            return `<svg width="15" height="15" viewBox="0 0 24 24" ${s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/></svg>`;
        case 'IMG':
            return `<svg width="15" height="15" viewBox="0 0 24 24" ${s}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`;
        case 'PPTX':
            return `<svg width="15" height="15" viewBox="0 0 24 24" ${s}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
        default:
            return `<svg width="15" height="15" viewBox="0 0 24 24" ${s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
    }
}

/* Line pattern for each card — gives every card a slightly unique look */
function buildLines(type: string, count: number): Array<{ w: number }> {
    const base = type === 'XLSX'
        ? [60, 90, 60, 90, 60]   // grid-like short lines
        : [85, 68, 78, 55, 70, 62, 80];
    return Array.from({ length: count }, (_, i) => ({ w: base[i % base.length] }));
}

type State = {
    // chaos base position (relative to origin CX, CY)
    bx: number; by: number;
    // chaos base rotation (degrees)
    brx: number; bry: number; brz: number;
    // current live values
    cx: number; cy: number;
    crx: number; cry: number; crz: number;
    // continuous Y rotation (always spinning)
    ry: number;
    // ordered target position
    tx: number; ty: number;
    floatPhase: number;
    el: HTMLDivElement | null;
};

const INFLUENCE_RADIUS = 400;
const ORDER_SPEED = 0.065;
const CHAOS_SPEED = 0.022;
const ROT_Y_SPEED = 0.45;      // °/frame
const FLOAT_AMOUNT = 12;        // px
const FLOAT_SPEED = 0.00075;

export default function FloatingDocCards() {
    const containerRef = useRef<HTMLDivElement>(null);
    const statesRef = useRef<State[]>([]);
    const mouseRef = useRef({ rx: 0, ry: 0, sx: 0, sy: 0 }); // raw + smooth
    const animRef = useRef<number | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const W = window.innerWidth;
        const H = window.innerHeight;

        // Origin: right-center of screen where docs cluster
        const OX = W * 0.695;
        const OY = H * 0.50;

        // ── Golden-angle spiral distribution on the right side ──
        const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle

        const states: State[] = [];

        for (let i = 0; i < COUNT; i++) {
            const r = Math.sqrt(i / COUNT) * 285;
            const theta = i * phi;

            const bx = Math.cos(theta) * r;
            const by = Math.sin(theta) * r * 0.75;
            const brx = (Math.random() - 0.5) * 52;
            const bry = (Math.random() - 0.5) * 75;
            const brz = (Math.random() - 0.5) * 38;

            // ordered row: horizontal line of cards
            const half = COUNT / 2;
            const tx = (i - half) * 90;
            const ty = 0;

            states.push({
                bx, by, brx, bry, brz,
                cx: bx, cy: by,
                crx: brx, cry: bry, crz: brz,
                ry: bry,
                tx, ty,
                floatPhase: i * 0.71,
                el: null,
            });
        }

        // ── Build DOM cards ──
        states.forEach((s, i) => {
            const type = TYPES[i % TYPES.length];
            const card = document.createElement('div');
            const lineCount = 4 + (i % 3);
            const lines = buildLines(type, lineCount);

            card.style.cssText = `
                position: absolute;
                left: ${OX}px;
                top: ${OY}px;
                width: 84px;
                height: 116px;
                margin-left: -42px;
                margin-top: -58px;
                border-radius: 13px;
                background: rgba(14, 14, 16, 0.62);
                border: 1px solid rgba(255, 255, 255, 0.12);
                box-shadow: 0 6px 28px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
                backdrop-filter: blur(14px);
                -webkit-backdrop-filter: blur(14px);
                transform-style: preserve-3d;
                transform-origin: center center;
                pointer-events: none;
                will-change: transform;
                display: flex;
                flex-direction: column;
                padding: 9px 10px 8px;
                gap: 0;
                box-sizing: border-box;
                overflow: hidden;
            `;

            // Top row: type label + icon
            const topRow = document.createElement('div');
            topRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:9px;flex-shrink:0;';

            const labelEl = document.createElement('span');
            labelEl.style.cssText = 'font-size:7.5px;font-weight:800;letter-spacing:0.1em;color:rgba(255,255,255,0.28);font-family:monospace;';
            labelEl.textContent = type;

            const iconEl = document.createElement('div');
            iconEl.style.cssText = `
                width: 22px; height: 22px;
                border-radius: 6px;
                background: rgba(255,255,255,0.055);
                border: 1px solid rgba(255,255,255,0.1);
                display: flex; align-items: center; justify-content: center;
                flex-shrink: 0;
            `;
            iconEl.innerHTML = iconSVG(type);

            topRow.appendChild(labelEl);
            topRow.appendChild(iconEl);
            card.appendChild(topRow);

            // Content lines
            const linesWrap = document.createElement('div');
            linesWrap.style.cssText = 'display:flex;flex-direction:column;gap:5px;flex:1;justify-content:flex-end;';

            lines.forEach(({ w }) => {
                const line = document.createElement('div');
                line.style.cssText = `
                    width: ${w}%;
                    height: 4px;
                    border-radius: 2px;
                    background: rgba(255, 255, 255, 0.13);
                `;
                linesWrap.appendChild(line);
            });

            card.appendChild(linesWrap);
            container.appendChild(card);
            s.el = card;
        });

        statesRef.current = states;

        // ── Mouse tracking (relative to doc cluster origin) ──
        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current.rx = e.clientX - OX;
            mouseRef.current.ry = e.clientY - OY;
        };
        window.addEventListener('mousemove', onMouseMove);

        // ── Animation loop ──
        function animate() {
            animRef.current = requestAnimationFrame(animate);
            const time = Date.now() * FLOAT_SPEED;

            const m = mouseRef.current;
            m.sx += (m.rx - m.sx) * 0.07;
            m.sy += (m.ry - m.sy) * 0.07;

            statesRef.current.forEach((s) => {
                if (!s.el) return;

                // Always-on Y rotation
                s.ry += ROT_Y_SPEED;

                const float = Math.sin(time + s.floatPhase) * FLOAT_AMOUNT;

                // ── CHAOS: always drift back to base ──
                s.cx += (s.bx - s.cx) * CHAOS_SPEED;
                s.cy += (s.by + float - s.cy) * CHAOS_SPEED;
                s.crx += (s.brx - s.crx) * CHAOS_SPEED;
                s.crz += (s.brz - s.crz) * CHAOS_SPEED;

                s.el.style.transform = `translate3d(${s.cx | 0}px, ${s.cy | 0}px, 0px) rotateX(${s.crx.toFixed(1)}deg) rotateY(${s.ry.toFixed(1)}deg) rotateZ(${s.crz.toFixed(1)}deg)`;
            });
        }

        animate();

        // Resize: rebuild positions
        const onResize = () => {
            // just update mouse reference point — no need to rebuild all cards
        };
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            if (animRef.current !== null) cancelAnimationFrame(animRef.current);
            statesRef.current.forEach(s => {
                if (s.el && container.contains(s.el)) container.removeChild(s.el);
            });
            statesRef.current = [];
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0"
            style={{
                perspective: '900px',
                perspectiveOrigin: '70% 50%',
                pointerEvents: 'none',
                zIndex: 0,
            }}
        />
    );
}
