import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function LiquidBackground() {
    const { style, mode } = useTheme();
    
    if (style !== "glass") return null;

    const isDark = mode === "dark";

    const blobs = [
        { color: isDark ? "rgba(70, 90, 255, 0.15)" : "rgba(100, 150, 255, 0.04)", size: "w-[80vw] h-[80vw]", x: ["-10%", "10%", "-5%"], y: ["-10%", "5%", "10%"], duration: 25 },
        { color: isDark ? "rgba(150, 70, 255, 0.15)" : "rgba(180, 150, 255, 0.04)", size: "w-[70vw] h-[70vw]", x: ["20%", "-10%", "15%"], y: ["10%", "20%", "-5%"], duration: 30 },
        { color: isDark ? "rgba(255, 50, 150, 0.08)" : "rgba(255, 220, 150, 0.03)", size: "w-[60vw] h-[60vw]", x: ["-5%", "15%", "0%"], y: ["20%", "-10%", "15%"], duration: 20 },
        { color: isDark ? "rgba(50, 200, 255, 0.08)" : "rgba(150, 255, 240, 0.03)", size: "w-[50vw] h-[50vw]", x: ["15%", "0%", "-10%"], y: ["-5%", "15%", "20%"], duration: 28 },
    ];

    return (
        <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-slate-50 dark:bg-[#0c0c0e]">
            {blobs.map((blob, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full blur-[80px] ${blob.size} opacity-60`}
                    style={{ 
                        backgroundColor: blob.color,
                        willChange: "transform",
                    }}
                    animate={{
                        x: blob.x,
                        y: blob.y,
                        scale: [1, 1.1, 0.9, 1],
                    }}
                    transition={{
                        duration: blob.duration,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
}
