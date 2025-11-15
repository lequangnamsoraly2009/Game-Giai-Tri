'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-4 z-10"
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg"
        >
          <span className="text-2xl font-bold text-white">G</span>
        </motion.div>
        <div className="flex flex-col">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Game Ngu
          </span>
          <span className="text-xs text-gray-500">Test Não của bạn</span>
        </div>
      </div>
    </motion.div>
  );
}

