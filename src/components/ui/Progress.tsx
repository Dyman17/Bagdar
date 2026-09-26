import React from 'react';
import { motion } from 'motion/react';

interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className = '' }) => {
  return (
    <div className={`clean-progress-track ${className}`}>
      <motion.div
        className="clean-progress-fill"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
};
