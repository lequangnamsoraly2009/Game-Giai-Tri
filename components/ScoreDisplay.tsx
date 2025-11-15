'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
}

export default function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-20 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-3"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 font-semibold">Điểm:</span>
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {score.toLocaleString('vi-VN')}
        </span>
      </div>
    </motion.div>
  );
}

