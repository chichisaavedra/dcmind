import { useEffect, useRef } from 'react';

// --- INICIO CÓDIGO ANTERIOR Y MODIFICACIONES NUEVAS ---
// El desarrollador anterior creó este canvas de partículas con bolitas.
// Se modificó para utilizar pequeñas imágenes en forma de logo (BrainCircuit).
// Se añadieron props de densidad y opacidad para ser re-utilizado.

interface ParticleBackgroundProps {
  density?: number;
  globalOpacity?: number;
}

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  imgVariant: HTMLImageElement;
}

const svgToDataUrl = (color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M9 13a4.5 4.5 0 0 0 3-4"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M12 13h4"/><path d="M12 18h6a2 2 0 0 1 2 2v1"/><path d="M12 8h8"/><path d="M16 8V5a2 2 0 0 1 2-2"/><circle cx="16" cy="13" r=".5"/><circle cx="18" cy="3" r=".5"/><circle cx="20" cy="21" r=".5"/><circle cx="20" cy="8" r=".5"/></svg>`;
  return 'data:image/svg+xml;base64,' + btoa(svg);
};

// Caching rendered svgs to in-memory canvases to prevent browser layout lag
const createCachedCanvas = (imgSrc: string, size: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const img = new Image();
  img.src = imgSrc;
  return new Promise<HTMLCanvasElement>((resolve) => {
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, size, size);
      resolve(canvas);
    };
  });
};

export default function ParticleBackground({ density = 0.000085, globalOpacity = 1 }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Precargar las imágenes
    const img1 = new Image();
    img1.src = svgToDataUrl('rgba(99, 102, 241, 0.4)'); // Indigo
    const img2 = new Image();
    img2.src = svgToDataUrl('rgba(165, 180, 252, 0.3)'); // Violeta claro

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: 0, y: 0, active: false };
    const interactionRadius = 150;

    let cache1: HTMLCanvasElement;
    let cache2: HTMLCanvasElement;

    // We increase density by 1.3x as requested, adjusting base default to match
    const adjustedDensity = density * 1.3;

    const init = () => {
      particles = [];
      const particleCount = Math.floor(canvas.width * canvas.height * adjustedDensity);

      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particles.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: 0,
          vy: 0,
          size: Math.random() * 4 + 3, // slightly bigger logo particles
          imgVariant: Math.random() > 0.5 ? (cache1 as any) : (cache2 as any),
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = globalOpacity;

      particles.forEach((p, i) => {
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < interactionRadius) {
            const force = (interactionRadius - distance) / interactionRadius;
            const angle = Math.atan2(dy, dx);
            const targetX = p.x - Math.cos(angle) * force * 50;
            const targetY = p.y - Math.sin(angle) * force * 50;

            p.vx += (targetX - p.x) * 0.1;
            p.vy += (targetY - p.y) * 0.1;
            p.size = Math.min(4, p.size + force * 0.5);
          } else {
            p.size = Math.max(p.size - 0.05, Math.random() * 2 + 1);
          }
        } else {
          p.size = Math.max(p.size - 0.05, Math.random() * 2 + 1);
        }

        p.vx += (p.originX - p.x) * 0.05;
        p.vy += (p.originY - p.y) * 0.05;
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;

        // Draw via lag-proof in-memory cached canvas
        if (p.imgVariant) {
          ctx.drawImage(
            p.imgVariant as unknown as HTMLCanvasElement,
            p.x - p.size,
            p.y - p.size,
            p.size * 2,
            p.size * 2
          );
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    // Prepare cache once, then start animation to completely kill lag
    Promise.all([
      createCachedCanvas(svgToDataUrl('rgba(99, 102, 241, 0.5)'), 32),
      createCachedCanvas(svgToDataUrl('rgba(165, 180, 252, 0.5)'), 32)
    ]).then(([c1, c2]) => {
      cache1 = c1;
      cache2 = c2;
      window.addEventListener('resize', resize);
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
      resize();
      draw();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [density, globalOpacity]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${globalOpacity < 1 ? 'z-0 mix-blend-multiply opacity-50' : 'z-0'}`}
      style={{ background: globalOpacity === 1 ? 'linear-gradient(to bottom right, #ffffff, #f3f4f6, #ede9fe)' : 'transparent' }}
    />
  );
}
// --- FIN CÓDIGO ---
