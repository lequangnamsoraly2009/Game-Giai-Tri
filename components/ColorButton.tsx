'use client';

import React from 'react';
import { Color, COLORS, COLOR_LABELS } from '@/types/game';
import { motion } from 'framer-motion';

interface ColorButtonProps {
  color: Color;
  onClick: () => void;
  disabled?: boolean;
}

export default function ColorButton({ color, onClick, disabled = false }: ColorButtonProps) {
  const colorValue = COLORS[color];
  const label = COLOR_LABELS[color];

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-8 py-4 rounded-xl font-bold text-white text-lg
        shadow-lg transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl active:scale-95'}
      `}
      style={{ backgroundColor: colorValue }}
    >
      {label}
    </motion.button>
  );
}

