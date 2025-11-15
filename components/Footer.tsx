'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 py-4 px-6 shadow-lg"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            © 2025 Soraly Game Ngu - Kiểm tra trí nhớ và khả năng quan sát
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

