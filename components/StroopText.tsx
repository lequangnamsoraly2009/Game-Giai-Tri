'use client';

import React from 'react';
import { Color, COLORS } from '@/types/game';
import { motion } from 'framer-motion';

interface StroopTextProps {
  text: string;
  textColor: Color;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function StroopText({ text, textColor, size = 'lg', animated = true }: StroopTextProps) {
  const colorValue = COLORS[textColor];
  
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  const content = (
    <span
      className={`font-bold ${sizeClasses[size]}`}
      style={{ color: colorValue }}
    >
      {text}
    </span>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center"
      >
        {content}
      </motion.div>
    );
  }

  return <div className="flex items-center justify-center">{content}</div>;
}

