export default function SectionContainer({ title, children, className = "" }) {
    return (
        <div className={`w-full bg-white dark:bg-[#3d3d3d] rounded-2xl p-6 shadow-sm mb-8 ${className}`}>
            <h2 className="text-xl font-bold text-[#3d3d3d] dark:text-[#f2f1f1] mb-6">
                {title}
            </h2>
            {children}
        </div>
    );
}
