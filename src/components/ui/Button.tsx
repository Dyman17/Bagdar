import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`clean-btn clean-btn-${variant} clean-btn-${size} ${className}`}
      {...props}
    >
      {icon && <span className="clean-btn-icon">{icon}</span>}
      <span className="clean-btn-text">{children}</span>
    </motion.button>
  );
};
