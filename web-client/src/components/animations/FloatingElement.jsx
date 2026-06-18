import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function FloatingElement({
  children,
  className,
  yOffset = 15,
  duration = 4,
  delay = 0,
}) {
  return (
    <motion.div
      animate={{
        y: [0, -yOffset, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
