import { useEffect, useRef } from 'react';
import { useThemeStore } from '../../stores/themeStore';

export const Background = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const theme = useThemeStore((state) => state.theme);

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

        // Theme-aware colors
        const isDark = theme === 'dark';
        const bgColor = isDark ? '#030712' : '#FFFFFF';
        const orbColors = isDark
            ? ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
            : ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];
        const orbOpacity = isDark ? '50' : '30';
        const gridOpacity = isDark ? 0.03 : 0.02;
        const particleOpacity = isDark ? 0.3 : 0.2;

        // More orbs for fuller coverage
        const orbs = [
            { x: width * 0.15, y: height * 0.15, r: 350, color: orbColors[0], vx: 0.4, vy: 0.4 },
            { x: width * 0.85, y: height * 0.85, r: 450, color: orbColors[1], vx: -0.4, vy: -0.4 },
            { x: width * 0.5, y: height * 0.5, r: 400, color: orbColors[2], vx: 0.3, vy: -0.3 },
            { x: width * 0.7, y: height * 0.3, r: 300, color: orbColors[3], vx: -0.3, vy: 0.4 },
            { x: width * 0.3, y: height * 0.7, r: 320, color: orbColors[4], vx: 0.35, vy: -0.35 },
        ];

        // Particles for additional visual interest
        const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number }> = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }

        let animationFrameId: number;

        const animate = () => {
            // Gradient background
            const bgGradient = ctx.createLinearGradient(0, 0, width, height);
            if (isDark) {
                bgGradient.addColorStop(0, '#030712');
                bgGradient.addColorStop(0.5, '#0c1220');
                bgGradient.addColorStop(1, '#030712');
            } else {
                bgGradient.addColorStop(0, '#FFFFFF');
                bgGradient.addColorStop(0.5, '#F8FAFC');
                bgGradient.addColorStop(1, '#FFFFFF');
            }
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, width, height);

            // Draw subtle grid
            ctx.strokeStyle = `rgba(59, 130, 246, ${gridOpacity})`;
            ctx.lineWidth = 1;
            const gridSize = 50;
            for (let x = 0; x < width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            for (let y = 0; y < height; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y);
                ctx.stroke();
            }

            // Draw Orbs
            orbs.forEach(orb => {
                orb.x += orb.vx;
                orb.y += orb.vy;

                if (orb.x < -orb.r || orb.x > width + orb.r) orb.vx *= -1;
                if (orb.y < -orb.r || orb.y > height + orb.r) orb.vy *= -1;

                const gradient = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.r);
                gradient.addColorStop(0, `${orb.color}${orbOpacity}`);
                gradient.addColorStop(0.5, `${orb.color}20`);
                gradient.addColorStop(1, 'transparent');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw particles
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > height) particle.vy *= -1;

                ctx.fillStyle = `rgba(59, 130, 246, ${particleOpacity})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="fixed inset-0 z-[-1] pointer-events-none"
                style={{ filter: 'blur(80px)' }}
            />
            {/* Additional pattern overlay */}
            <div
                className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59, 130, 246) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }}
            />
        </>
    );
};
