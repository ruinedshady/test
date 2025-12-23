import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Heart = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ y: "110vh", opacity: 0, scale: 0.5 }}
    animate={{ 
      y: "-10vh", 
      opacity: [0, 1, 1, 0],
      scale: [0.5, 1, 0.8]
    }}
    transition={{ 
      duration: Math.random() * 10 + 10, 
      repeat: Infinity, 
      delay: delay,
      ease: "linear"
    }}
    className="absolute text-pink-200/40 select-none pointer-events-none"
    style={{ 
      left: `${Math.random() * 100}%`,
      fontSize: `${Math.random() * 2 + 1}rem`
    }}
  >
    ❤
  </motion.div>
);

export function HeartBackground() {
  const [hearts, setHearts] = useState<number[]>([]);

  useEffect(() => {
    // Create 20 floating hearts with random delays
    setHearts(Array.from({ length: 20 }, (_, i) => i));
  }, []);

  return (
    <div className="heart-animation fixed inset-0 z-[-1] overflow-hidden bg-gradient-to-b from-pink-50 to-white">
      {hearts.map((i) => (
        <Heart key={i} delay={Math.random() * 20} />
      ))}
    </div>
  );
}
