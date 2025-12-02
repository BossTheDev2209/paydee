import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function NextArrow(props) {
    const { style, onClick } = props;
    return (
        <div
            className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center -right-6 z-10 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors`}
            style={{ ...style }}
            onClick={onClick}
        >
            <i className="fa-solid fa-chevron-right text-2xl"></i>
        </div>
    );
}

function PrevArrow(props) {
    const { style, onClick } = props;
    return (
        <div
            className={`absolute top-1/2 -translate-y-1/2 flex items-center justify-center -left-6 z-10 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors`}
            style={{ ...style }}
            onClick={onClick}
        >
            <i className="fa-solid fa-chevron-left text-2xl"></i>
        </div>
    );
}

export default function CalculatorCarousel({ items }) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
        appendDots: dots => (
            <div style={{ bottom: "-30px" }}>
                <ul className="m-0 p-0 flex justify-center gap-1"> {dots} </ul>
            </div>
        ),
        customPaging: i => (
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 hover:bg-[#ffcc00] transition-colors dot-custom"></div>
        )
    };

    return (
        <div className="px-2 pb-8">
            <Slider {...settings}>
                {items.map((item) => (
                    <div key={item.id} className="px-3 h-full">
                        <Link to={item.path} className="block h-full">
                            <div
                                className={`relative h-48 rounded-xl p-5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] overflow-visible`}
                                style={{ backgroundColor: item.bgColor }}
                            >
                                <div className="flex justify-between items-start">
                                    {item.icon && (
                                        <div className="text-2xl text-black/20">
                                            <i className={item.icon}></i>
                                        </div>
                                    )}
                                    {item.isAi && item.aiIcon && (
                                        <div className="group/icon relative">
                                            <img
                                                src={item.aiIcon}
                                                alt="AI"
                                                className="w-16 h-16 object-contain animate-spin-slow filter drop-shadow-[0_0_25px_rgba(59,130,246,1)] md:drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] md:group-hover/icon:drop-shadow-[0_0_25px_rgba(59,130,246,1)]"
                                                style={{ animation: 'spin 3s linear infinite' }}
                                            />
                                            <div className="absolute top-1/2 -translate-y-1/2 left-[calc(100%+8px)] w-max px-3 py-1.5 bg-black/90 text-white text-xs rounded opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
                                                เครื่องคำนวณปัญญาประดิษฐ์
                                                <div className="absolute top-1/2 -translate-y-1/2 right-full border-[6px] border-transparent border-r-black/90"></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 className="text-xl font-bold text-[#2b2b2b] mb-1 leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-[#2b2b2b]/70 text-xs font-medium">
                                        {item.details}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
}
