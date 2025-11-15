'use client';

import React from 'react';
import { ShapeDisplay } from '@/types/game';
import ShapeDisplayComponent from './ShapeDisplay';
import { motion } from 'framer-motion';

interface OverlappingShapesProps {
  shapes: ShapeDisplay[];
}

export default function OverlappingShapes({ shapes }: OverlappingShapesProps) {
  if (shapes.length < 2) return null;
  
  return (
    <div className="relative flex items-center justify-center mb-8" style={{ height: '200px' }}>
      {/* Hình đầu tiên */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="relative"
      >
        <ShapeDisplayComponent
          shape={shapes[0].shape}
          color={shapes[0].color}
          size={150}
        />
      </motion.div>
      
      {/* Hình thứ hai - cách nhau 100px */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, type: 'spring' }}
        className="relative"
        style={{ 
          marginLeft: '100px', // Cách nhau 100px
        }}
      >
        <ShapeDisplayComponent
          shape={shapes[1].shape}
          color={shapes[1].color}
          size={150}
        />
      </motion.div>
    </div>
  );
}

