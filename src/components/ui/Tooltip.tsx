'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 300,
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Positioning calculations
  const getPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return {};
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    const positions = {
      top: {
        x: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
        y: triggerRect.top - tooltipRect.height - 8,
      },
      right: {
        x: triggerRect.right + 8,
        y: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
      },
      bottom: {
        x: triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2,
        y: triggerRect.bottom + 8,
      },
      left: {
        x: triggerRect.left - tooltipRect.width - 8,
        y: triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2,
      },
    };
    
    return positions[position];
  };

  // Cleanup on unmount
  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setIsMounted(false);
    };
  }, []);
  
  // Handle mouse events
  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };
  
  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsVisible(false);
  };
  
  // Animations for each position
  const animations = {
    top: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 10 },
    },
    right: {
      initial: { opacity: 0, x: -10 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -10 },
    },
    bottom: {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
    },
    left: {
      initial: { opacity: 0, x: 10 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 10 },
    },
  };
  
  // Arrows for indicating direction
  const arrowClasses = {
    top: 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45',
    right: 'left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45',
    bottom: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45',
    left: 'right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45',
  };
  
  return (
    <>
      <div 
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      
      {isMounted && (
        <AnimatePresence>
          {isVisible && (
            <motion.div
              ref={tooltipRef}
              initial={animations[position].initial}
              animate={animations[position].animate}
              exit={animations[position].exit}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                zIndex: 50,
                ...getPosition(),
              }}
              className={`pointer-events-none ${className}`}
            >
              <div className="relative px-3 py-2 bg-gray-800 text-white text-sm rounded-md shadow-md">
                {content}
                <div 
                  className={`absolute w-2 h-2 bg-gray-800 ${arrowClasses[position]}`}
                ></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
} 