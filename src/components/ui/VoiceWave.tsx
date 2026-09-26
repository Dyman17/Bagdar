import React from 'react';
import { motion } from 'motion/react';

interface VoiceWaveProps {
  active?: boolean;
  bars?: number;
  className?: string;
}

export const VoiceWave: React.FC<VoiceWaveProps> = ({
  active = true,
  bars = 24,
  className = '',
}) => {
  return (
    <div className={`clean-voice-wave-container ${className}`}>
      {Array.from({ length: bars }).map((_, i) => {
        const delay = (i % 6) * 0.1;
        const baseHeight = 8 + (Math.sin(i * 0.5) + 1) * 6;
        const targetHeight = active ? 16 + (Math.sin(i * 0.6) + 1) * 16 : 6;

        return (
          <motion.div
            key={i}
            className="clean-voice-bar"
            animate={
              active
                ? {
                    height: [baseHeight, targetHeight, baseHeight * 0.8, targetHeight * 0.9, baseHeight],
                  }
                : { height: 4 }
            }
            transition={
              active
                ? {
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay,
                  }
                : { duration: 0.3 }
            }
          />
        );
      })}
    </div>
  );
};
