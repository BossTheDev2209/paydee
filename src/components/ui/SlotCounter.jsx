import { useEffect, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export default function SlotCounter({ value }) {
    const springValue = useSpring(0, {
        stiffness: 50,
        damping: 15,
        mass: 1,
    });

    const displayValue = useTransform(springValue, (current) =>
        Math.round(current).toLocaleString()
    );

    useEffect(() => {
        springValue.set(value);
    }, [value, springValue]);

    return <motion.span>{displayValue}</motion.span>;
}
