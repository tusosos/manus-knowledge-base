import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const containerVariantsReduced = {
  hidden: { opacity: 1 },
  show: { opacity: 1 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const itemVariantsReduced = {
  hidden: { opacity: 1, y: 0 },
  show: { opacity: 1, y: 0 },
};

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div
      variants={shouldReduce ? containerVariantsReduced : containerVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const shouldReduce = useReducedMotion();
  return (
    <motion.div variants={shouldReduce ? itemVariantsReduced : itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

export { containerVariants, itemVariants };
