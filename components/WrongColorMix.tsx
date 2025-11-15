'use client';

import React from 'react';
import { Color, COLORS, COLOR_LABELS } from '@/types/game';
import { motion } from 'framer-motion';

interface WrongColorMixProps {
  colors: Color[];
  colorGroup: 'warm' | 'cool';
}

export default function WrongColorMix({ colors, colorGroup }: WrongColorMixProps) {
  const groupName = colorGroup === 'warm' ? 'Màu nóng' : 'Màu lạnh';
  const groupDescription = colorGroup === 'warm' 
    ? 'Đỏ, Cam, Vàng, Hồng' 
    : 'Xanh dương, Xanh lá, Tím';

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Hiển thị tên nhóm */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Nhóm: {groupName}
        </h3>
        <p className="text-sm text-gray-600">
          ({groupDescription})
        </p>
      </div>

      {/* Hiển thị 5 ô màu */}
      <div className="flex flex-wrap justify-center gap-4">
        {colors.map((color, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="w-24 h-24 rounded-lg border-4 border-gray-300 shadow-lg"
              style={{ backgroundColor: COLORS[color] }}
            />
            <span className="text-sm font-medium text-gray-700">
              {COLOR_LABELS[color]}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

