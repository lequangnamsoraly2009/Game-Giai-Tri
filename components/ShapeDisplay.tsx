'use client';

import React from 'react';
import { Shape, Color, COLORS } from '@/types/game';
import { motion } from 'framer-motion';

interface ShapeDisplayProps {
    shape: Shape;
    color: Color;
    size?: number;
    animated?: boolean;
}

export default function ShapeDisplay({ shape, color, size = 120, animated = true }: ShapeDisplayProps) {
    const colorValue = COLORS[color];

    const shapeComponents = {
        square: (
            <div
                className="rounded-lg"
                style={{
                    width: size,
                    height: size,
                    backgroundColor: colorValue,
                }}
            />
        ),
        circle: (
            <div
                className="rounded-full"
                style={{
                    width: size,
                    height: size,
                    backgroundColor: colorValue,
                }}
            />
        ),
        triangle: (
            <div
                style={{
                    width: 0,
                    height: 0,
                    borderLeft: `${size / 2}px solid transparent`,
                    borderRight: `${size / 2}px solid transparent`,
                    borderBottom: `${size}px solid ${colorValue}`,
                }}
            />
        ),
        diamond: (
            <div
                className="rotate-45"
                style={{
                    width: size * 0.7,
                    height: size * 0.7,
                    backgroundColor: colorValue,
                }}
            />
        ),
        star: (
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill={colorValue}
            >
                <path d="M50 0 L61 35 L98 35 L68 57 L79 92 L50 70 L21 92 L32 57 L2 35 L39 35 Z" />
            </svg>
        ),
    };

    const content = shapeComponents[shape];

    if (animated) {
        return (
            <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 180 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="flex items-center justify-center"
            >
                {content}
            </motion.div>
        );
    }

    return <div className="flex items-center justify-center">{content}</div>;
}

