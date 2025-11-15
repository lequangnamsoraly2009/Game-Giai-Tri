import { StageConfig, StageType } from '@/types/game';

const TOTAL_LEVELS = 40;

export function getStageType(level: number): StageType {
  if (level <= 10) return 'shape-color';
  if (level <= 20) return 'stroop';
  if (level <= 30) return 'multi-shape';
  if (level <= 35) return 'color-sequence';
  if (level <= 38) return 'animated-shapes';
  return 'mixed';
}

export function getStageConfig(level: number): StageConfig {
  // Độ khó tăng dần theo level
  const baseDisplayTime = 3000;
  const baseOptions = 3;
  
  // Tính toán dựa trên level
  const displayTime = Math.max(500, baseDisplayTime - (level * 50)); // Giảm từ 3000ms xuống 500ms
  const numOptions = Math.min(6, baseOptions + Math.floor(level / 8)); // Tăng từ 3 lên 6
  const numShapes = level <= 10 ? 1 : Math.min(5, 1 + Math.floor((level - 10) / 5));
  const numTexts = level <= 20 ? 3 : Math.min(6, 3 + Math.floor((level - 20) / 3));
  
  // Xác định loại câu hỏi
  let questionType: 'color' | 'shape' | 'text-color' | 'missing-color' | 'sequence' | 'fastest-shape' | 'fastest-color' | 'slowest-shape' | 'slowest-color' = 'color';
  
  if (level <= 10) {
    questionType = level <= 5 ? 'color' : 'shape';
  } else if (level <= 20) {
    questionType = 'text-color';
  } else if (level <= 30) {
    questionType = level <= 25 ? 'color' : 'missing-color';
  } else if (level <= 35) {
    questionType = 'sequence';
  } else if (level <= 38) {
    // Animated shapes - hỏi về tốc độ
    const rand = level % 4;
    if (rand === 0) questionType = 'fastest-shape';
    else if (rand === 1) questionType = 'fastest-color';
    else if (rand === 2) questionType = 'slowest-shape';
    else questionType = 'slowest-color';
  } else {
    const rand = level % 3;
    if (rand === 0) questionType = 'color';
    else if (rand === 1) questionType = 'text-color';
    else questionType = 'missing-color';
  }
  
  return {
    displayTime,
    numOptions,
    numShapes,
    numTexts,
    questionType,
  };
}

export function getLevelProgress(level: number): number {
  return (level / TOTAL_LEVELS) * 100;
}

export function getLevelTitle(level: number): string {
  if (level <= 10) return 'Cấp độ Dễ';
  if (level <= 20) return 'Cấp độ Trung bình';
  if (level <= 30) return 'Cấp độ Khó';
  return 'Cấp độ Cực khó';
}

