import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { useNavigate } from "react-router-dom"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import DisclaimerModal from "./DisclaimerModal"
import TermsModal from "./TermsModal"

export default function CalculatorCarousel({ items, large = false }) {
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: false })
    )
    const navigate = useNavigate();
    const [api, setApi] = React.useState()
    const [showDisclaimer, setShowDisclaimer] = React.useState(false);
    const [showTerms, setShowTerms] = React.useState(false);
    const [selectedPath, setSelectedPath] = React.useState(null);
    const [selectedCalculatorType, setSelectedCalculatorType] = React.useState(null);
    const lastScrollTime = React.useRef(0);
    const COOLDOWN = 500; // ms

    // Use a ref for the container to attach native event listener
    const containerRef = React.useRef(null);

    const handleCardClick = (e, item) => {
        e.preventDefault();
        setSelectedPath(item.path);

        if (item.calculatorType) {
            setSelectedCalculatorType(item.calculatorType);
            setShowTerms(true);
        } else {
            setShowDisclaimer(true);
        }
    };

    const handleAccept = () => {
        setShowDisclaimer(false);
        setShowTerms(false);
        if (selectedPath) {
            navigate(selectedPath);
        }
    };

    const handleReject = () => {
        setShowDisclaimer(false);
        setShowTerms(false);
        setSelectedPath(null);
        setSelectedCalculatorType(null);
    };

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
                                <button
                                    onClick={(e) => handleCardClick(e, item)}
                                    className="block w-full h-full text-left"
                                >
                                    <div
                                        className={`glass-card relative rounded-xl flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] cursor-pointer ${large ? "h-64 md:h-56 p-6" : "h-56 md:h-48 p-5"
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
                                                        className="w-16 h-16 object-contain pulse-glow md:group-hover/icon:drop-shadow-[0_0_25px_rgba(59,130,246,1)]"
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

                                            {/* Tags */}
                                            {item.tags && item.tags.length > 0 && (
                                                <div className="card-tag-container flex flex-wrap gap-1 mt-3">
                                                    {item.tags.map((tag, idx) => (
                                                        <span key={idx} className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/40 text-[#2b2b2b]/80 border border-black/5">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="glass-arrow flex -left-8 md:-left-12 border-none transition-all duration-300 shadow-lg" />
                <CarouselNext className="glass-arrow flex -right-8 md:-right-12 border-none transition-all duration-300 shadow-lg" />
            </Carousel>

            {/* Disclaimer Modal */}
            <DisclaimerModal
                isOpen={showDisclaimer}
                onClose={() => setShowDisclaimer(false)}
                onAccept={handleAccept}
                onReject={handleReject}
            />

            {/* Terms Modal */}
            <TermsModal
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
                onAccept={handleAccept}
                onReject={handleReject}
                calculatorType={selectedCalculatorType}
                showButtons={true}
            />
        </div>
    )
}
