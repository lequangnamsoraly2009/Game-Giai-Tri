'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { StroopDisplay, Color, COLORS } from '@/types/game';
import { motion } from 'framer-motion';

interface StroopHardProps {
  texts: StroopDisplay[];
  duration: number; // Thời gian hiển thị (ms)
  onComplete?: () => void;
}

interface TextWithColorChanges extends StroopDisplay {
  colorChanges: number; // Số lần đổi màu
  colorSequence: Color[]; // Dãy màu sẽ đổi
}

// Component riêng cho mỗi text
function StroopHardText({ textData, duration }: { textData: TextWithColorChanges; duration: number }) {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  
  // Tính toán thời gian cho mỗi lần đổi màu
  const colorChangeInterval = duration / (textData.colorSequence.length + 1);
  const moveAmount = 15; // Khoảng cách di chuyển (px)

  useEffect(() => {
    // Đổi màu theo sequence
    const colorInterval = setInterval(() => {
      setCurrentColorIndex((prev) => {
        if (prev < textData.colorSequence.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, colorChangeInterval);

    return () => {
      clearInterval(colorInterval);
    };
  }, [textData.colorSequence.length, colorChangeInterval]);

  const currentColor = textData.colorSequence[currentColorIndex] || textData.textColor;

  return (
    <motion.div
      animate={{
        x: [0, moveAmount, -moveAmount, 0],
        y: [0, -moveAmount, moveAmount, 0],
      }}
      transition={{
        duration: 2,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'loop',
      }}
      className="flex items-center justify-center"
    >
      <motion.span
        key={currentColorIndex} // Force re-render khi đổi màu
        className="text-6xl font-bold"
        style={{ color: COLORS[currentColor] }}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {textData.text}
      </motion.span>
    </motion.div>
  );
}

export default function StroopHard({ texts, duration, onComplete }: StroopHardProps) {
  // Tạo dãy màu và số lần đổi màu cho mỗi text
  const textsWithChanges = useMemo(() => {
    const allColors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'pink'];
    return texts.map((text, index) => {
      // Số lần đổi màu: text đầu tiên đổi 2 lần (theo position từ gameEngine)
      const colorChanges = typeof text.position === 'number' ? text.position : (index === 0 ? 2 : index === 1 ? 1 : 3);
      
      // Tạo dãy màu: màu ban đầu + các màu đổi
      const colorSequence: Color[] = [text.textColor];
      const usedColors = new Set<Color>([text.textColor]);
      
      for (let i = 0; i < colorChanges; i++) {
        const availableColors = allColors.filter(c => !usedColors.has(c));
        if (availableColors.length > 0) {
          const newColor = availableColors[Math.floor(Math.random() * availableColors.length)];
          colorSequence.push(newColor);
          usedColors.add(newColor);
        }
      }
      
      return {
        ...text,
        colorChanges,
        colorSequence,
      } as TextWithColorChanges;
    });
  }, [texts]);

  return (
    <div className="flex flex-col gap-8 items-center">
      {textsWithChanges.map((textData, index) => (
        <StroopHardText
          key={index}
          textData={textData}
          duration={duration}
        />
      ))}
    </div>
  );
}

