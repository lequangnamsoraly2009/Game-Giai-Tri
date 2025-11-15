'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { getLevelProgress, getLevelTitle } from '@/utils/difficulty';

interface LevelProgressProps {
  level: number;
  totalLevels?: number;
}

export default function LevelProgress({ level, totalLevels = 40 }: LevelProgressProps) {
  const progress = getLevelProgress(level);
  const title = getLevelTitle(level);
  
  if (level === 0) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-2xl px-4"
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Level {level}/{totalLevels}
            </h3>
            <p className="text-xs text-gray-600">{title}</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-purple-600">{Math.round(progress)}%</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}

