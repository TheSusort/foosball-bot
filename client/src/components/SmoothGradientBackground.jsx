import React, { useEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate, animate } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const SmoothGradientBackground = ({ children }) => {
    const location = useLocation();

    // Motion values for smooth color transitions
    const color1 = useMotionValue("#A78BFA"); // purple-400
    const color2 = useMotionValue("#F472B6"); // pink-400
    const color3 = useMotionValue("#F87171"); // red-400
    const baseColor = useMotionValue("#94A3B8"); // slate-400

    // Create the animated gradient template
    const backgroundGradient = useMotionTemplate`
        radial-gradient(circle at 20% 80%, ${color1} 0%, transparent 70%),
        radial-gradient(circle at 80% 20%, ${color2} 0%, transparent 70%),
        radial-gradient(circle at 40% 40%, ${color3} 0%, transparent 70%),
        linear-gradient(135deg, ${baseColor} 0%, ${color1} 100%)
    `;

    // Define color schemes that flow smoothly into each other (medium-tone variants)
    const colorSchemes = [
        // Sunset → Fire (medium purple → medium pink → medium red → medium orange)
        { colors: ["#A78BFA", "#F472B6", "#F87171", "#8B5CF6"], name: "sunset" },
        { colors: ["#F87171", "#FB923C", "#FBBF24", "#F472B6"], name: "fire" },

        // Fire → Spring (medium orange → medium yellow → medium green)
        { colors: ["#FB923C", "#FBBF24", "#4ADE80", "#FB923C"], name: "spring" },
        { colors: ["#FBBF24", "#4ADE80", "#22D3EE", "#FBBF24"], name: "nature" },

        // Nature → Ocean (medium green → medium teal → medium blue)
        { colors: ["#4ADE80", "#22D3EE", "#60A5FA", "#4ADE80"], name: "ocean" },
        { colors: ["#22D3EE", "#60A5FA", "#818CF8", "#22D3EE"], name: "sky" },

        // Sky → Royal (medium blue → medium indigo → medium purple)
        { colors: ["#60A5FA", "#818CF8", "#A78BFA", "#60A5FA"], name: "royal" },
        { colors: ["#818CF8", "#A78BFA", "#C084FC", "#818CF8"], name: "mystical" },

        // Mystical → Aurora (medium purple → medium violet → medium cyan)
        { colors: ["#A78BFA", "#C084FC", "#22D3EE", "#A78BFA"], name: "aurora" },
        { colors: ["#C084FC", "#22D3EE", "#F472B6", "#C084FC"], name: "cosmic" },

        // Game mode (vibrant energy colors)
        { colors: ["#F87171", "#FB923C", "#FBBF24", "#F87171"], name: "game-mode" }
    ];


    // Animate to a specific color scheme
    const animateToScheme = (schemeIndex, duration = 3) => {
        const scheme = colorSchemes[schemeIndex];

        animate(color1, scheme.colors[0], {
            duration,
            ease: "easeInOut"
        });
        animate(color2, scheme.colors[1], {
            duration,
            ease: "easeInOut"
        });
        animate(color3, scheme.colors[2], {
            duration,
            ease: "easeInOut"
        });
        animate(baseColor, scheme.colors[3], {
            duration,
            ease: "easeInOut"
        });
    };

    // Handle route-based color changes
    useEffect(() => {
        if (location.pathname === '/current-match') {
            // Instantly switch to game mode
            animateToScheme(colorSchemes.length - 1, 1); // Game mode with 1s transition
        } else {
            // Start with first scheme when not in game mode
            animateToScheme(0, 2);
        }
    }, [location.pathname]);

    // Auto-cycle through all color schemes (but not during games)
    useEffect(() => {
        if (location.pathname === '/current-match') return;

        let currentSchemeIndex = 0;

        const interval = setInterval(() => {
            // Move to next scheme (skip game mode - last item in array)
            currentSchemeIndex = (currentSchemeIndex + 1) % (colorSchemes.length - 1);
            animateToScheme(currentSchemeIndex, 2); // 2 second smooth transition
        }, 6000); // Every 6 seconds

        return () => clearInterval(interval);
    }, [location.pathname]);

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Main animated gradient background */}
            <motion.div
                className="fixed inset-0"
                style={{
                    background: backgroundGradient,
                }}
            />

            {/* Subtle animated overlay for depth */}
            <motion.div
                className="fixed inset-0 opacity-20"
                animate={{
                    background: [
                        "radial-gradient(circle at 60% 60%, rgba(255,255,255,0.1) 0%, transparent 60%)",
                        "radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 0%, transparent 60%)",
                        "radial-gradient(circle at 80% 40%, rgba(255,255,255,0.1) 0%, transparent 60%)",
                        "radial-gradient(circle at 60% 60%, rgba(255,255,255,0.1) 0%, transparent 60%)"
                    ]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Floating orbs for extra movement */}
            <div className="fixed inset-0 opacity-10">
                <motion.div
                    className="absolute w-96 h-96 bg-white rounded-full blur-3xl"
                    animate={{
                        x: [100, 300, 100],
                        y: [100, 200, 100],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute w-80 h-80 bg-white rounded-full blur-2xl"
                    style={{ right: 100, bottom: 100 }}
                    animate={{
                        x: [-50, 50, -50],
                        y: [-30, 30, -30],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative">
                {children}
            </div>
        </div>
    );
};

export default SmoothGradientBackground;