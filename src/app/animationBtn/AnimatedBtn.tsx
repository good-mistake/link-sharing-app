import { motion } from "framer-motion";
import "./animatedBtn.scss";
interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  className,
}) => {
  return (
    <motion.button
      whileHover={{
        backgroundPosition: "200% 0%",
        transition: { duration: 1, repeat: Infinity, repeatType: "reverse" },
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`animated-btn ${className}`}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
