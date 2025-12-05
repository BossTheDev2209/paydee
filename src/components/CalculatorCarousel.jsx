import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Link } from "react-router-dom"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export default function CalculatorCarousel({ items, large = false }) {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false })
    )
    const [api, setApi] = React.useState()
    const lastScrollTime = React.useRef(0);
    const COOLDOWN = 500; // ms

    // Use a ref for the container to attach native event listener
    const containerRef = React.useRef(null);

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container || !api) return;

        const onWheel = (e) => {
            // Prevent default page scroll
            e.preventDefault();

            const now = Date.now();
            if (now - lastScrollTime.current < COOLDOWN) return;

            if (e.deltaY > 0) {
                api.scrollNext();
                lastScrollTime.current = now;
            } else if (e.deltaY < 0) {
                api.scrollPrev();
                lastScrollTime.current = now;
            }
        };

        // Add non-passive event listener to allow preventing default
        container.addEventListener('wheel', onWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', onWheel);
        };
    }, [api]);

    return (
        <div ref={containerRef} className="w-full px-8 md:px-12">
            <Carousel
                setApi={setApi}
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent className="-ml-4">
                    {items.map((item) => (
                        <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                            <div className="h-full">
                                <Link to={item.path} className="block h-full">
                                    <div
                                        className={`relative rounded-xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] border border-transparent hover:border-gray-200 shadow-sm ${large ? "h-64 md:h-56 p-6" : "h-56 md:h-48 p-5"
                                            }`}
                                        style={{ backgroundColor: item.bgColor }}
                                    >
                                        <div className="flex justify-between items-start">
                                            {/* Normal Icon */}
                                            {item.icon && (
                                                <div className="text-2xl text-black/20">
                                                    <i className={item.icon}></i>
                                                </div>
                                            )}

                                            {/* AI Icon */}
                                            {item.isAi && item.aiIcon && (
                                                <div className="group/icon relative">
                                                    <img
                                                        src={item.aiIcon}
                                                        alt="AI"
                                                        className="w-16 h-16 object-contain animate-spin-slow filter drop-shadow-[0_0_25px_rgba(59,130,246,1)] md:drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] md:group-hover/icon:drop-shadow-[0_0_25px_rgba(59,130,246,1)]"
                                                        style={{
                                                            animation: "spin 3s linear infinite",
                                                        }}
                                                    />
                                                    <div className="absolute top-1/2 -translate-y-1/2 left-[calc(100%+8px)] w-max px-3 py-1.5 bg-black/90 text-white text-xs rounded opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
                                                        เครื่องคำนวณปัญญาประดิษฐ์
                                                        {/* Arrow pointing left */}
                                                        <div className="absolute top-1/2 -translate-y-1/2 right-full border-[6px] border-transparent border-r-black/90"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-bold text-[#2b2b2b] mb-1 leading-tight">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-[#2b2b2b]/70 line-clamp-2">
                                                {item.details}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className={`flex -left-8 md:-left-12 border-none bg-white/80 hover:bg-white shadow-md ${large ? "text-[#2b2b2b] hover:text-[#ffcc00]" : "text-gray-600 hover:text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"}`} />
                <CarouselNext className={`flex -right-8 md:-right-12 border-none bg-white/80 hover:bg-white shadow-md ${large ? "text-[#2b2b2b] hover:text-[#ffcc00]" : "text-gray-600 hover:text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"}`} />
            </Carousel>
        </div>
    )
}
