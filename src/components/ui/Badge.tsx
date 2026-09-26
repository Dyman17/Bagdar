import React from 'react';

interface BadgeProps {
  variant?: 'neutral' | 'accent' | 'success' | 'warning';
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  dot = false,
  children,
  className = '',
}) => {
  return (
    <span className={`clean-badge clean-badge-${variant} ${className}`}>
      {dot && <span className="clean-badge-dot" />}
      {children}
    </span>
  );
};
