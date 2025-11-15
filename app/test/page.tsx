'use client';

import { useState, useEffect } from 'react';
import { GameState, Color, Shape } from '@/types/game';
import {
  createInitialState,
  generateGameDisplay,
  generateQuestion,
} from '@/utils/gameEngine';
import { getGameTypeName, ALL_GAME_TYPES } from '@/utils/gameTypes';
import ShapeDisplayComponent from '@/components/ShapeDisplay';
import ColorButton from '@/components/ColorButton';
import StroopText from '@/components/StroopText';
import AnimatedShapes from '@/components/AnimatedShapes';
import OverlappingShapes from '@/components/OverlappingShapes';
import PathTracking from '@/components/PathTracking';
import StroopHard from '@/components/StroopHard';
import WrongColorMix from '@/components/WrongColorMix';
import Toast from '@/components/Toast';
import { motion } from 'framer-motion';
import { SHAPES, COLOR_LABELS, COLORS } from '@/types/game';
import { calculateSpeedScore } from '@/utils/scoreCalculator';

// Flash Memory Component
function FlashMemoryDisplay({ shape, flashSequence }: { shape: any; flashSequence: Color[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < flashSequence.length) {
      const timer = setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, flashSequence.length]);
  
  const currentColor = flashSequence[currentIndex] || flashSequence[0];
  
  return (
    <div className="flex justify-center">
      <ShapeDisplayComponent
        shape={shape}
        color={currentColor}
        size={150}
      />
    </div>
  );
}

export default function TestPage() {
  const [selectedGameType, setSelectedGameType] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<Color | Shape | string | number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [currentStage, setCurrentStage] = useState<'display' | 'question'>('display');

  // Load game khi chọn game type
  useEffect(() => {
    if (selectedGameType) {
      const { displayData, stageConfig } = generateGameDisplay(selectedGameType as any);
      setGameState({
        ...createInitialState(),
        stageType: selectedGameType as any,
        stageConfig,
        displayData,
        currentStage: 'display',
      });
      setCurrentStage('display');
      setShowAnswer(false);
      setSelectedAnswer(null);
      setToast(null);
    }
  }, [selectedGameType]);

  // Auto transition từ display sang question
  useEffect(() => {
    if (currentStage === 'display' && gameState) {
      const timer = setTimeout(() => {
        const questionData = generateQuestion(
          gameState.displayData,
          gameState.stageConfig,
          gameState.stageType
        );
        setGameState(prev => prev ? { ...prev, questionData, currentStage: 'question' } : null);
        setCurrentStage('question');
        setQuestionStartTime(Date.now());
      }, gameState.stageConfig.displayTime);
      return () => clearTimeout(timer);
    }
  }, [currentStage, gameState]);

  const handleAnswer = (answer: Color | Shape | string | number) => {
    if (!gameState) return;
    
    const correct = answer === gameState.questionData.correctAnswer;
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    // Tính điểm
    let speedScore = 0;
    if (correct && questionStartTime) {
      const responseTime = Date.now() - questionStartTime;
      speedScore = calculateSpeedScore(responseTime);
    }
    
    // Hiển thị Toast
    const toastMessage = correct 
      ? `Đúng rồi! +${speedScore.toLocaleString('vi-VN')} điểm` 
      : 'Sai rồi!';
    setToast({
      message: toastMessage,
      type: correct ? 'success' : 'error',
    });
    
    setTimeout(() => {
      setShowAnswer(false);
      setSelectedAnswer(null);
      setToast(null);
      setQuestionStartTime(null);
      // Reset về display để test lại
      const { displayData, stageConfig } = generateGameDisplay(gameState.stageType);
      const questionData = generateQuestion(displayData, stageConfig, gameState.stageType);
      setGameState({
        ...gameState,
        displayData,
        stageConfig,
        questionData,
        currentStage: 'display',
      });
      setCurrentStage('display');
    }, 2000);
  };

  const resetGame = () => {
    if (selectedGameType) {
      const { displayData, stageConfig } = generateGameDisplay(selectedGameType as any);
      setGameState({
        ...createInitialState(),
        stageType: selectedGameType as any,
        stageConfig,
        displayData,
        currentStage: 'display',
      });
      setCurrentStage('display');
      setShowAnswer(false);
      setSelectedAnswer(null);
      setToast(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🧪 Test Game Modes
        </h1>

        {/* Game Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Chọn game để test:</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {ALL_GAME_TYPES.map((gameType) => (
              <motion.button
                key={gameType}
                onClick={() => setSelectedGameType(gameType)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-4 py-2 rounded-lg font-semibold text-sm transition-all
                  ${selectedGameType === gameType
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-purple-100 border-2 border-gray-200'
                  }
                `}
              >
                {getGameTypeName(gameType)}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Game Display */}
        {gameState && (
          <div className="bg-white rounded-xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {getGameTypeName(gameState.stageType)}
              </h2>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-gray-700"
              >
                🔄 Reset
              </button>
            </div>

            {/* Display Stage */}
            {currentStage === 'display' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p className="text-sm text-gray-600 mb-4">
                  Hiển thị trong {gameState.stageConfig.displayTime}ms...
                </p>

                {/* Position Memory - Grid */}
                {gameState.stageType === 'position-memory' && gameState.displayData.grid && (
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((pos) => {
                      const item = gameState.displayData.grid?.find(g => g.position === pos);
                      const positionNumber = pos + 1; // 1-9
                      return (
                        <div
                          key={pos}
                          className="aspect-square border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 relative"
                        >
                          {/* Số thứ tự ở góc trái trên */}
                          <div className="absolute top-1 left-1 text-sm font-bold text-gray-600">
                            {positionNumber}
                          </div>
                          {item && item.color && (
                            <div
                              className="w-12 h-12 rounded-full"
                              style={{ backgroundColor: COLORS[item.color] }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Speed Reading - Sequence */}
                {gameState.stageType === 'speed-reading' && gameState.displayData.sequence && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {gameState.displayData.sequence.map((color, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.4, duration: 0.2 }}
                        className="w-16 h-16 rounded-lg"
                        style={{ backgroundColor: COLORS[color] }}
                      />
                    ))}
                  </div>
                )}

                {/* Shape Counting */}
                {gameState.stageType === 'shape-counting' && gameState.displayData.shapes && (
                  <div className="flex flex-wrap justify-center gap-4">
                    {gameState.displayData.shapes.map((shape, index) => (
                      <motion.div
                        key={index}
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <ShapeDisplayComponent
                          shape={shape.shape}
                          color={shape.color}
                          size={80}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Color Match */}
                {gameState.stageType === 'color-match' && gameState.displayData.leftColors && gameState.displayData.rightTexts && (
                  <div className="flex justify-center gap-12">
                    <div className="flex flex-col gap-4">
                      <h3 className="font-semibold text-center mb-2">Màu</h3>
                      {gameState.displayData.leftColors.map((color, index) => (
                        <div
                          key={index}
                          className="w-20 h-20 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: COLORS[color] }}
                        />
                      ))}
                    </div>
                    <div className="flex flex-col gap-4">
                      <h3 className="font-semibold text-center mb-2">Text</h3>
                      {gameState.displayData.rightTexts.map((text, index) => (
                        <div key={index} className="h-20 flex items-center">
                          <StroopText
                            text={text.text}
                            textColor={text.textColor}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Distraction Test */}
                {gameState.stageType === 'distraction-test' && gameState.displayData.mainShape && (
                  <div className="relative">
                    <div className="flex justify-center">
                      <ShapeDisplayComponent
                        shape={gameState.displayData.mainShape.shape}
                        color={gameState.displayData.mainShape.color}
                        size={150}
                      />
                    </div>
                    {gameState.displayData.distractionShapes && (
                      <div className="flex justify-center gap-4 mt-4">
                        {gameState.displayData.distractionShapes.map((shape, index) => (
                          <ShapeDisplayComponent
                            key={index}
                            shape={shape.shape}
                            color={shape.color}
                            size={60}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Flash Memory */}
                {gameState.stageType === 'flash-memory' && gameState.displayData.flashSequence && gameState.displayData.shapes && (
                  <FlashMemoryDisplay
                    shape={gameState.displayData.shapes[0].shape}
                    flashSequence={gameState.displayData.flashSequence}
                  />
                )}

                {/* Wrong Color Mix */}
                {gameState.stageType === 'wrong-color-mix' && 
                 gameState.displayData.shapes && 
                 gameState.displayData.colorGroup && (
                  <WrongColorMix
                    colors={gameState.displayData.shapes.map(s => s.color)}
                    colorGroup={gameState.displayData.colorGroup}
                  />
                )}

                {/* Standard shapes display */}
                {gameState.displayData.shapes && 
                 !['position-memory', 'speed-reading', 'shape-counting', 'color-match', 'distraction-test', 'flash-memory', 'wrong-color-mix'].includes(gameState.stageType) && (
                  <div className="flex justify-center gap-4 flex-wrap">
                    {gameState.displayData.shapes.map((shape, index) => (
                      <ShapeDisplayComponent
                        key={index}
                        shape={shape.shape}
                        color={shape.color}
                        size={shape.size || 120}
                      />
                    ))}
                  </div>
                )}

                {/* Stroop Hard */}
                {gameState.stageType === 'stroop-hard' && gameState.displayData.texts && (
                  <StroopHard
                    texts={gameState.displayData.texts}
                    duration={gameState.stageConfig.displayTime}
                  />
                )}

                {/* Stroop texts - không phải stroop-hard */}
                {gameState.stageType !== 'stroop-hard' &&
                 gameState.displayData.texts && (
                  <div className="flex flex-col gap-4 items-center">
                    {gameState.displayData.texts.map((text, index) => (
                      <StroopText
                        key={index}
                        text={text.text}
                        textColor={text.textColor}
                      />
                    ))}
                  </div>
                )}

                {/* Color sequence */}
                {gameState.displayData.sequence && 
                 gameState.stageType !== 'speed-reading' && (
                  <div className="flex justify-center gap-2 flex-wrap">
                    {gameState.displayData.sequence.map((color, index) => (
                      <div
                        key={index}
                        className="w-16 h-16 rounded-lg"
                        style={{ backgroundColor: COLORS[color] }}
                      />
                    ))}
                  </div>
                )}

                {/* Animated Shapes */}
                {gameState.stageType === 'animated-shapes' && gameState.displayData.shapes && (
                  <AnimatedShapes
                    shapes={gameState.displayData.shapes}
                    duration={gameState.stageConfig.displayTime}
                  />
                )}

                {/* Path Tracking */}
                {gameState.stageType === 'path-tracking' && gameState.displayData.paths && (
                  <PathTracking
                    paths={gameState.displayData.paths}
                    duration={gameState.stageConfig.displayTime}
                  />
                )}

                {/* Overlapping Shapes */}
                {gameState.stageType === 'mixed' && gameState.displayData.shapes && (
                  <OverlappingShapes shapes={gameState.displayData.shapes} />
                )}
              </motion.div>
            )}

            {/* Question Stage */}
            {currentStage === 'question' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <p className="text-2xl font-semibold mb-8 text-gray-700">
                  {gameState.questionData.questionText}
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  {gameState.questionData.options?.map((option, index) => {
                    const isCorrect = option === gameState.questionData.correctAnswer;
                    const isSelected = selectedAnswer === option;
                    
                    const isColor = typeof option === 'string' && 
                      ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black'].includes(option);
                    
                    const isShape = typeof option === 'string' && 
                      ['square', 'circle', 'triangle', 'diamond', 'star'].includes(option);
                    
                    if (isColor) {
                      return (
                        <motion.div
                          key={index}
                          animate={showAnswer && isCorrect ? { scale: [1, 1.2, 1], rotate: [0, 360] } : {}}
                          transition={{ duration: 0.6 }}
                        >
                          <ColorButton
                            color={option as Color}
                            onClick={() => handleAnswer(option)}
                            disabled={showAnswer}
                          />
                        </motion.div>
                      );
                    } else if (isShape) {
                      const shapeName: Record<Shape, string> = {
                        square: 'Vuông',
                        circle: 'Tròn',
                        triangle: 'Tam giác',
                        diamond: 'Kim cương',
                        star: 'Sao',
                      };
                      
                      return (
                        <motion.button
                          key={index}
                          whileHover={!showAnswer ? { scale: 1.05 } : {}}
                          whileTap={!showAnswer ? { scale: 0.95 } : {}}
                          onClick={() => handleAnswer(option)}
                          disabled={showAnswer}
                          animate={showAnswer && isCorrect ? { scale: [1, 1.2, 1], rotate: [0, 360] } : {}}
                          transition={{ duration: 0.6 }}
                          className={`
                            px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition-all
                            ${showAnswer && isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}
                            ${showAnswer ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}
                          `}
                        >
                          {shapeName[option as Shape]}
                        </motion.button>
                      );
                    } else {
                      return (
                        <motion.button
                          key={index}
                          whileHover={!showAnswer ? { scale: 1.05 } : {}}
                          whileTap={!showAnswer ? { scale: 0.95 } : {}}
                          onClick={() => handleAnswer(option)}
                          disabled={showAnswer}
                          animate={showAnswer && isCorrect ? { scale: [1, 1.2, 1], rotate: [0, 360] } : {}}
                          transition={{ duration: 0.6 }}
                          className={`
                            px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition-all
                            ${showAnswer && isCorrect ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}
                            ${showAnswer ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'}
                          `}
                        >
                          {String(option)}
                        </motion.button>
                      );
                    }
                  })}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={true}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}

