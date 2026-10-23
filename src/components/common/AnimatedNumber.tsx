import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

interface AnimatedNumberProps {
  value: number;
  format: (value: number) => string;
}

// Counts from the previous value to the new one
export function AnimatedNumber({ value, format }: AnimatedNumberProps) {
  const reduceMotion = useReducedMotion();
  const spring = useSpring(value, { stiffness: 90, damping: 20 });
  const text = useTransform(spring, (current) => format(Math.round(current)));

  useEffect(() => {
    if (reduceMotion) spring.jump(value);
    else spring.set(value);
  }, [reduceMotion, spring, value]);

  return <motion.span>{text}</motion.span>;
}
