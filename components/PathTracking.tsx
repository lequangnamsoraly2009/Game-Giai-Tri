'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ShapeDisplay } from '@/types/game';
import ShapeDisplayComponent from './ShapeDisplay';
import { motion } from 'framer-motion';

interface PathTrackingProps {
  paths: Array<{ shape: ShapeDisplay['shape']; color: ShapeDisplay['color']; path: 'straight' | 'curve' | 'zigzag' }>;
  duration: number; // Thời gian animation (ms)
  onComplete?: () => void;
}

export default function PathTracking({ paths, duration, onComplete }: PathTrackingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [containerHeight, setContainerHeight] = useState(300);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const distance = containerWidth - 100; // Khoảng cách di chuyển
  const durationSeconds = duration / 1000; // Chuyển sang giây

  // Tính toán vị trí Y cho mỗi shape (phân bố đều)
  const getYPosition = (index: number, total: number) => {
    const spacing = containerHeight / (total + 1);
    return spacing * (index + 1); // Vị trí Y của đường path
  };

  // Tính toán vị trí theo thời gian cho từng loại path
  const getPositionAtTime = (pathType: 'straight' | 'curve' | 'zigzag', progress: number, startY: number) => {
    const x = progress * distance;
    
    if (pathType === 'straight') {
      // Đường thẳng: y không đổi
      return { x, y: startY };
    } else if (pathType === 'curve') {
      // Đường cong (parabola): y thay đổi theo x
      // Parabola: y = a*x^2 + b*x + c
      // Điểm đầu: (0, startY), điểm giữa: (distance/2, startY - 50), điểm cuối: (distance, startY)
      const midY = startY - 50;
      const a = (2 * (startY - midY)) / (distance * distance);
      const y = a * x * x - (2 * a * distance * x) / 2 + startY;
      return { x, y: Math.max(startY - 60, Math.min(startY + 10, y)) };
    } else {
      // Zigzag: y thay đổi theo từng đoạn
      if (progress < 1/3) {
        // Đoạn 1: đi lên
        const segmentProgress = progress * 3;
        const y = startY - (segmentProgress * 40);
        return { x, y };
      } else if (progress < 2/3) {
        // Đoạn 2: đi xuống
        const segmentProgress = (progress - 1/3) * 3;
        const y = (startY - 40) + (segmentProgress * 80);
        return { x, y };
      } else {
        // Đoạn 3: đi lên về vị trí ban đầu
        const segmentProgress = (progress - 2/3) * 3;
        const y = (startY + 40) - (segmentProgress * 40);
        return { x, y };
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200"
      style={{ maxWidth: '800px', minHeight: '300px', height: '300px' }}
    >
      {/* Đường đích */}
      <div className="absolute right-0 top-0 bottom-0 w-2 bg-red-500 opacity-50" />
      
      {/* Vẽ đường path */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        {paths.map((pathData, index) => {
          const startY = getYPosition(index, paths.length);
          let pathD = '';
          
          if (pathData.path === 'straight') {
            pathD = `M 0 ${startY} L ${distance} ${startY}`;
          } else if (pathData.path === 'curve') {
            const midX = distance / 2;
            const midY = startY - 50;
            pathD = `M 0 ${startY} Q ${midX} ${midY} ${distance} ${startY}`;
          } else {
            const segment1 = distance / 3;
            const segment2 = (distance * 2) / 3;
            const zigzagY1 = startY - 40;
            const zigzagY2 = startY + 40;
            pathD = `M 0 ${startY} L ${segment1} ${zigzagY1} L ${segment2} ${zigzagY2} L ${distance} ${startY}`;
          }
          
          return (
            <path
              key={index}
              d={pathD}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          );
        })}
      </svg>
      
      {/* Animate shapes theo path */}
      {paths.map((pathData, index) => {
        const startY = getYPosition(index, paths.length);
        
        // Tính toán keyframes cho animation
        let xKeyframes: number[] = [];
        let yKeyframes: number[] = [];
        let times: number[] = [];
        
        if (pathData.path === 'straight') {
          // Đường thẳng: x thay đổi, y không đổi
          xKeyframes = [-60, distance];
          yKeyframes = [startY, startY];
          times = [0, 1];
        } else if (pathData.path === 'curve') {
          // Đường cong: x thay đổi, y tạo đường cong
          xKeyframes = [-60, distance / 2, distance];
          yKeyframes = [startY, startY - 50, startY];
          times = [0, 0.5, 1];
        } else {
          // Zigzag: x thay đổi, y zigzag
          xKeyframes = [-60, distance / 3, (distance * 2) / 3, distance];
          yKeyframes = [startY, startY - 40, startY + 40, startY];
          times = [0, 0.33, 0.67, 1];
        }
        
        return (
          <motion.div
            key={index}
            initial={{ x: xKeyframes[0], y: yKeyframes[0] }}
            animate={{ 
              x: xKeyframes,
              y: yKeyframes,
            }}
            transition={{
              duration: durationSeconds,
              ease: pathData.path === 'curve' ? [0.25, 0.1, 0.25, 1] : 'linear',
              times: times,
            }}
            className="absolute"
          >
            <div
              style={{
                transform: 'translate(-50%, -50%)', // Căn giữa shape với điểm path
              }}
            >
              <ShapeDisplayComponent
                shape={pathData.shape}
                color={pathData.color}
                size={60}
                animated={false}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

