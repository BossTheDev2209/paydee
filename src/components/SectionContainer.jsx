export default function SectionContainer({ title, children, className = "", featured = false }) {
    return (
        <div className={`w-full rounded-2xl p-6 md:p-8 mb-8 transition-all duration-300 ${featured
                ? "bg-gradient-to-br from-[#2b2b2b] to-[#1a1a1a] shadow-2xl border border-[#ffcc00]/20"
                : "bg-white dark:bg-[#3d3d3d] shadow-sm"
            } ${className}`}>
            <h2 className={`text-xl md:text-2xl font-bold mb-6 ${featured
                    ? "text-white flex items-center gap-3"
                    : "text-[#3d3d3d] dark:text-[#f2f1f1]"
                }`}>
                {featured && <span className="w-1.5 h-8 bg-[#ffcc00] rounded-full"></span>}
                {title}
            </h2>
            {children}
        </div>
    );
}
