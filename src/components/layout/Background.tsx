import { useEffect, useRef } from 'react';

export const Background = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        const orbs = [
            { x: width * 0.2, y: height * 0.2, r: 300, color: '#3b82f6', vx: 0.5, vy: 0.5 }, // Blue
            { x: width * 0.8, y: height * 0.8, r: 400, color: '#8b5cf6', vx: -0.5, vy: -0.5 }, // Purple
            { x: width * 0.5, y: height * 0.5, r: 350, color: '#06b6d4', vx: 0.3, vy: -0.3 }, // Cyan
        ];

        let animationFrameId: number;

        const animate = () => {
            ctx.fillStyle = '#030712'; // Very dark background
            ctx.fillRect(0, 0, width, height);

            // Draw Orbs
            orbs.forEach(orb => {
                orb.x += orb.vx;
                orb.y += orb.vy;

                if (orb.x < -orb.r || orb.x > width + orb.r) orb.vx *= -1;
                if (orb.y < -orb.r || orb.y > height + orb.r) orb.vy *= -1;

                const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
                gradient.addColorStop(0, `${orb.color}40`); // 25% opacity
                gradient.addColorStop(1, 'transparent');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // Add Noise Overlay
            // (Optional: can be done with CSS for better performance, but doing simple noise here if needed)

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none"
            style={{ filter: 'blur(60px)' }}
        />
    );
};
