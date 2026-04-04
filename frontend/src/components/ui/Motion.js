import { motion } from "framer-motion";

export const MotionBox = motion.div;

export const fadeInUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const springTransition = {
  type: "spring",
  stiffness: 110,
  damping: 18,
};
