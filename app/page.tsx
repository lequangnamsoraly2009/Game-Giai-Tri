'use client';

import { useState, useEffect } from 'react';
import { GameState, Color, Shape, GameHistory } from '@/types/game';
import {
  createInitialState,
  generateGameDisplay,
  generateQuestion,
  getNextGameType,
} from '@/utils/gameEngine';
import { getGameTypeName } from '@/utils/gameTypes';
import ShapeDisplayComponent from '@/components/ShapeDisplay';
import ColorButton from '@/components/ColorButton';
import StroopText from '@/components/StroopText';
import AnimatedShapes from '@/components/AnimatedShapes';
import OverlappingShapes from '@/components/OverlappingShapes';
import PathTracking from '@/components/PathTracking';
import StroopHard from '@/components/StroopHard';
import WrongColorMix from '@/components/WrongColorMix';
import Toast from '@/components/Toast';
import ScoreDisplay from '@/components/ScoreDisplay';
import Logo from '@/components/Logo';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { SHAPES, COLOR_LABELS, COLORS } from '@/types/game';
import { calculateSpeedScore } from '@/utils/scoreCalculator';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<Color | Shape | string | number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);

  // Bắt đầu game mới
  const startNextGame = () => {
    const nextType = getNextGameType(gameState.playedTypes);
    
    if (!nextType) {
      // Đã chơi hết tất cả loại game
      setGameState(prev => ({ ...prev, currentStage: 'victory' }));
      return;
    }
    
    const { displayData, stageConfig } = generateGameDisplay(nextType);
    
    setGameState(prev => {
      // Lưu thông tin màn hiện tại vào history trước khi chuyển màn mới (nếu không phải màn đầu tiên)
      let newHistory = prev.history;
      if (prev.playedTypes.length > 0 && prev.displayData.shapes || prev.displayData.texts || prev.displayData.sequence) {
        const currentHistory: GameHistory = {
          stageType: prev.stageType,
          displayData: prev.displayData,
        };
        newHistory = [...prev.history, currentHistory];
      }
      
      return {
        ...prev,
        currentStage: 'display',
        stageType: nextType,
        stageConfig,
        displayData,
        playedTypes: [...prev.playedTypes, nextType],
        history: newHistory,
      };
    });
    setShowAnswer(false);
    setSelectedAnswer(null);
  };

  // Chuyển từ display sang question
  const showQuestion = () => {
    const questionData = generateQuestion(
      gameState.displayData,
      gameState.stageConfig,
      gameState.stageType,
      gameState.history
    );
    
    setGameState(prev => ({
      ...prev,
      currentStage: 'question',
      questionData,
    }));
    
    // Bắt đầu đếm thời gian
    setQuestionStartTime(Date.now());
  };

  // Xử lý đáp án
  const handleAnswer = (answer: Color | Shape | string | number) => {
    const correct = answer === gameState.questionData.correctAnswer;
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    // Tính điểm dựa trên tốc độ
    let speedScore = 0;
    if (correct && questionStartTime) {
      const responseTime = Date.now() - questionStartTime;
      speedScore = calculateSpeedScore(responseTime);
      
      // Cập nhật điểm
      setGameState(prev => ({ 
        ...prev, 
        score: prev.score + speedScore 
      }));
    }
    
    // Hiển thị Toast với điểm
    const toastMessage = correct 
      ? `Đúng rồi! +${speedScore.toLocaleString('vi-VN')} điểm` 
      : 'Sai rồi!';
    setToast({
      message: toastMessage,
      type: correct ? 'success' : 'error',
    });
    
    setTimeout(() => {
      if (correct) {
        // Đúng - chuyển game tiếp theo
        startNextGame();
      } else {
        // Sai - game over
        setGameState(prev => ({ ...prev, currentStage: 'game-over' }));
      }
      setSelectedAnswer(null);
      setToast(null);
      setQuestionStartTime(null);
    }, 1500);
  };

  // Auto transition từ display sang question
  useEffect(() => {
    if (gameState.currentStage === 'display' && gameState.playedTypes.length > 0) {
      const timer = setTimeout(() => {
        showQuestion();
      }, gameState.stageConfig.displayTime);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentStage, gameState.playedTypes.length, gameState.stageConfig.displayTime]);

  const resetGame = () => {
    setGameState(createInitialState());
    setShowAnswer(false);
    setSelectedAnswer(null);
  };

  const startGame = () => {
    startNextGame();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 relative p-4 pb-24 pt-20">
      <Logo />
      
      {/* Score Display */}
      {gameState.score > 0 && <ScoreDisplay score={gameState.score} />}
      
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={true}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {/* Menu */}
          {gameState.currentStage === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Game Ngu
              </h1>
              <p className="text-xl text-gray-700 mb-2">
                Kiểm tra trí nhớ và khả năng quan sát của bạn!
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Mỗi màn chơi là một thử thách khác nhau
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Bắt đầu chơi
              </motion.button>
            </motion.div>
          )}

          {/* Display Stage */}
          {gameState.currentStage === 'display' && (
            <motion.div
              key="display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold mb-2 text-gray-800">
                {getGameTypeName(gameState.stageType)}
              </h2>
              <p className="text-sm text-gray-600 mb-8">
                Màn {gameState.playedTypes.length} / 17
              </p>
              
              {/* Position Memory - Grid */}
              {gameState.stageType === 'position-memory' && gameState.displayData.grid && (
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((pos) => {
                    const item = gameState.displayData.grid?.find(g => g.position === pos);
                    const positionNumber = pos + 1; // 1-9
                    return (
                      <motion.div
                        key={pos}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: pos * 0.1 }}
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
                      </motion.div>
                    );
                  })}
                </div>
              )}
              
              {/* Hiển thị animated shapes (chạy) */}
              {gameState.stageType === 'animated-shapes' && gameState.displayData.shapes && gameState.displayData.shapes.length > 0 && (
                <div className="mb-8 flex justify-center">
                  <AnimatedShapes
                    shapes={gameState.displayData.shapes}
                    duration={gameState.stageConfig.displayTime}
                  />
                </div>
              )}

              {/* Path Tracking - Theo dõi đường đi */}
              {gameState.stageType === 'path-tracking' && gameState.displayData.paths && (
                <div className="mb-8 flex justify-center">
                  <PathTracking
                    paths={gameState.displayData.paths}
                    duration={gameState.stageConfig.displayTime}
                  />
                </div>
              )}

              {/* Hiển thị 2 hình dính nhau cho màn mixed */}
              {gameState.stageType === 'mixed' && gameState.displayData.shapes && gameState.displayData.shapes.length >= 2 && (
                <OverlappingShapes shapes={gameState.displayData.shapes.slice(0, 2)} />
              )}

              {/* Wrong Color Mix - Hiển thị nhóm màu */}
              {gameState.stageType === 'wrong-color-mix' && 
               gameState.displayData.shapes && 
               gameState.displayData.colorGroup && (
                <div className="mb-8 flex justify-center">
                  <WrongColorMix
                    colors={gameState.displayData.shapes.map(s => s.color)}
                    colorGroup={gameState.displayData.colorGroup}
                  />
                </div>
              )}

              {/* Hiển thị shapes tĩnh (không phải animated, mixed, position-memory, path-tracking, và wrong-color-mix) */}
              {gameState.stageType !== 'animated-shapes' && 
               gameState.stageType !== 'mixed' && 
               gameState.stageType !== 'position-memory' &&
               gameState.stageType !== 'path-tracking' &&
               gameState.stageType !== 'wrong-color-mix' &&
               gameState.displayData.shapes && 
               gameState.displayData.shapes.length > 0 && (
                <div className="flex flex-wrap justify-center gap-6 mb-8">
                  {gameState.displayData.shapes.map((shape, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ShapeDisplayComponent
                        shape={shape.shape}
                        color={shape.color}
                        size={150}
                      />
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Color Match - 2 cột */}
              {gameState.stageType === 'color-match' && gameState.displayData.leftColors && gameState.displayData.rightTexts && (
                <div className="flex justify-center gap-12 mb-8">
                  <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-center mb-2 text-gray-700">Màu</h3>
                    {gameState.displayData.leftColors.map((color, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="w-20 h-20 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: COLORS[color] }}
                      />
                    ))}
                  </div>
                  <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-center mb-2 text-gray-700">Text</h3>
                    {gameState.displayData.rightTexts.map((text, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="h-20 flex items-center"
                      >
                        <StroopText
                          text={text.text}
                          textColor={text.textColor}
                          size="lg"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stroop Hard - Chữ di chuyển và đổi màu */}
              {gameState.stageType === 'stroop-hard' && gameState.displayData.texts && (
                <div className="mb-8 flex justify-center">
                  <StroopHard
                    texts={gameState.displayData.texts}
                    duration={gameState.stageConfig.displayTime}
                  />
                </div>
              )}

              {/* Hiển thị texts (Stroop) - không phải color-match và stroop-hard */}
              {gameState.stageType !== 'color-match' &&
               gameState.stageType !== 'stroop-hard' &&
               gameState.displayData.texts && gameState.displayData.texts.length > 0 && (
                 <div className="space-y-6 mb-8">
                   {gameState.displayData.texts.map((text, index) => (
                     <motion.div
                       key={index}
                       initial={{ opacity: 0, x: -50 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: index * 0.2 }}
                     >
                       <StroopText
                         text={text.text}
                         textColor={text.textColor}
                         size="lg"
                       />
                     </motion.div>
                   ))}
                 </div>
               )}

              {/* Hiển thị sequence */}
              {gameState.displayData.sequence && gameState.displayData.sequence.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {gameState.displayData.sequence.map((color, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.15 }}
                      className="w-20 h-20 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}

              <p className="text-xl text-gray-600">Quan sát kỹ...</p>
            </motion.div>
          )}

          {/* Question Stage */}
          {gameState.currentStage === 'question' && (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold mb-2 text-gray-800">
                {getGameTypeName(gameState.stageType)}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Màn {gameState.playedTypes.length} / 17
              </p>
              <p className="text-2xl font-semibold mb-8 text-gray-700">
                {gameState.questionData.questionText}
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                {gameState.questionData.options?.map((option, index) => {
                  const isCorrect = option === gameState.questionData.correctAnswer;
                  const isSelected = selectedAnswer === option;
                  
                  // Kiểm tra nếu là Color
                  const isColor = typeof option === 'string' && 
                    ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black'].includes(option);
                  
                  // Kiểm tra nếu là Shape
                  const isShape = typeof option === 'string' && 
                    ['square', 'circle', 'triangle', 'diamond', 'star'].includes(option);
                  
                  if (isColor) {
                    // Color option
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
                    // Shape option - hiển thị hình dạng
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
                    // String hoặc Number option (cho các game mới)
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

          {/* Game Over */}
          {gameState.currentStage === 'game-over' && (
            <motion.div
              key="game-over"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <h2 className="text-5xl font-bold mb-4 text-red-600">Game Over!</h2>
              <p className="text-2xl text-gray-700 mb-2">Bạn đã trả lời sai 😢</p>
              <p className="text-lg text-gray-600 mb-2">
                Bạn đã hoàn thành {gameState.playedTypes.length - 1} / 17 loại game
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Tổng điểm: {gameState.score.toLocaleString('vi-VN')}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Chơi lại
              </motion.button>
            </motion.div>
          )}

          {/* Victory */}
          {gameState.currentStage === 'victory' && (
            <motion.div
              key="victory"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <motion.h2
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
              >
                🎉 Chúc mừng! 🎉
              </motion.h2>
              <p className="text-2xl text-gray-700 mb-2">
                Bạn không ngu! Bạn đã vượt qua tất cả 6 loại game!
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Tổng điểm: {gameState.score.toLocaleString('vi-VN')}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Chơi lại
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </main>
  );
}
