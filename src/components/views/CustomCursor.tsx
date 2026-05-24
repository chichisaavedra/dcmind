import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Springs magnéticos súper suaves para el cursor
    const springX = useSpring(mouseX, { stiffness: 400, damping: 28, mass: 0.5 });
    const springY = useSpring(mouseY, { stiffness: 400, damping: 28, mass: 0.5 });

    useEffect(() => {
        // Si estamos en táctil, no iniciamos el cursor
        if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);
            mouseX.set(e.clientX - 4); // Ajuste centrado (- half width)
            mouseY.set(e.clientY - 4);
        };

        const handleMouseLeave = () => setIsVisible(false);

        // Sistema rudimentario pero eficaz para detectar si estamos sobre un "botón" / link
        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable = !!target.closest('button, a, input, [role="button"]');
            setIsHovering(isClickable);
        };

        window.addEventListener('mousemove', handleMouseMove);
        document.documentElement.addEventListener('mouseleave', handleMouseLeave);
        document.documentElement.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
            document.documentElement.removeEventListener('mouseover', handleMouseOver);
        };
    }, [mouseX, mouseY, isVisible]);

    if (!isVisible) return null;

    return (
        <motion.div
            style={{ x: springX, y: springY }}
            animate={{
                scale: isHovering ? 3.5 : 1,
                backgroundColor: isHovering ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,1)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[10000] shadow-[0_0_10px_rgba(255,255,255,0.5)] ${isHovering ? 'backdrop-blur-sm shadow-none' : ''}`}
        />
    );
}
