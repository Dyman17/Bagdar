import React from 'react';
import { motion } from 'motion/react';

export interface TabItem {
  id: string;
  label: string;
  num?: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  className = '',
}) => {
  return (
    <div className={`clean-tabs-container ${className}`}>
      {items.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`clean-tab-btn ${isActive ? 'active' : ''}`}
            type="button"
          >
            {isActive && (
              <motion.div
                layoutId="clean-tab-active-pill"
                className="clean-tab-active-bg"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="clean-tab-content">
              {tab.num && <span className="clean-tab-num">{tab.num}</span>}
              {tab.icon && <span className="clean-tab-icon">{tab.icon}</span>}
              <span className="clean-tab-label">{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
