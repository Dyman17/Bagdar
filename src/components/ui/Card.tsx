import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  hoverable?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  hoverable = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -3, transition: { duration: 0.2 } } : undefined}
      className={`clean-card ${hoverable ? 'clean-card-hoverable' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
