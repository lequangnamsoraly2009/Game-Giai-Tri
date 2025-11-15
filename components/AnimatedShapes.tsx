'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ShapeDisplay } from '@/types/game';
import ShapeDisplayComponent from './ShapeDisplay';
import { motion } from 'framer-motion';

interface AnimatedShapesProps {
  shapes: ShapeDisplay[];
  duration: number; // Thời gian animation (ms)
  onComplete?: () => void;
}

export default function AnimatedShapes({ shapes, duration, onComplete }: AnimatedShapesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Tính toán tốc độ cho mỗi shape
  const speeds = shapes.map(shape => shape.speed || 100);
  const maxSpeed = Math.max(...speeds);
  const minSpeed = Math.min(...speeds);

  // Tính thời gian animation cho mỗi shape dựa trên tốc độ
  // Tất cả chạy trong 3 giây, nhưng tốc độ khác nhau
  const getAnimationDuration = (speed: number) => {
    if (maxSpeed === minSpeed) return 3.0; // 3 giây
    
    // Normalize speed: 0 (chậm nhất) đến 1 (nhanh nhất)
    const normalizedSpeed = (speed - minSpeed) / (maxSpeed - minSpeed);
    
    // Nhanh nhất: 2.1 giây, Chậm nhất: 3.0 giây
    const minDuration = 2.1;
    const maxDuration = 3.0;
    
    // Shape nhanh hơn -> thời gian ngắn hơn
    return maxDuration - (normalizedSpeed * (maxDuration - minDuration));
  };

  const distance = containerWidth - 80; // Khoảng cách di chuyển

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-48 overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200"
      style={{ maxWidth: '800px', minHeight: '150px' }}
    >
      {/* Đường đích */}
      <div className="absolute right-0 top-0 bottom-0 w-2 bg-red-500 opacity-50" />
      
      {shapes.map((shape, index) => {
        const animationDuration = getAnimationDuration(shape.speed || 100);
        const startY = 20 + index * 50; // Vị trí Y khác nhau cho mỗi shape
        
        return (
          <motion.div
            key={index}
            initial={{ x: -60 }}
            animate={{ 
              x: distance, // Chạy từ trái qua phải một lần
            }}
            transition={{
              duration: animationDuration,
              ease: 'linear',
            }}
            className="absolute"
            style={{ top: startY }}
          >
            <ShapeDisplayComponent
              shape={shape.shape}
              color={shape.color}
              size={50}
              animated={false}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

