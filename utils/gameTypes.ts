import { StageType, StageConfig } from '@/types/game';

// Danh sách tất cả các loại game
export const ALL_GAME_TYPES: StageType[] = [
  'shape-color',
  'stroop',
  'multi-shape',
  'color-sequence',
  'animated-shapes',
  'mixed',
  // 12 game mới
  'position-memory',
  'speed-reading',
  'shape-counting',
  'color-match',
  'distraction-test',
  'flash-memory',
  'increasing-sequence',
  'partial-shapes',
  'overlapping-chaos',
  'path-tracking',
  'stroop-hard',
  'wrong-color-mix',
];

// Cấu hình cho mỗi loại game
export function getGameConfig(stageType: StageType): StageConfig {
  const configs: Record<StageType, StageConfig> = {
    'shape-color': {
      displayTime: 2000,
      numOptions: 3,
      numShapes: 1,
      numTexts: 0,
      questionType: 'color',
    },
    'stroop': {
      displayTime: 3000,
      numOptions: 3,
      numShapes: 0,
      numTexts: 3,
      questionType: 'text-color',
    },
    'multi-shape': {
      displayTime: 2500,
      numOptions: 4,
      numShapes: 3,
      numTexts: 0,
      questionType: 'color',
    },
    'color-sequence': {
      displayTime: 3000,
      numOptions: 4,
      numShapes: 5,
      numTexts: 0,
      questionType: 'sequence',
    },
    'animated-shapes': {
      displayTime: 3000, // 3 giây
      numOptions: 3,
      numShapes: 3,
      numTexts: 0,
      questionType: 'fastest-shape', // Sẽ được random trong generateQuestion
    },
    'mixed': {
      displayTime: 3500,
      numOptions: 5,
      numShapes: 2,
      numTexts: 3,
      questionType: 'missing-color',
    },
    // 12 game mới
    'position-memory': {
      displayTime: 2000,
      numOptions: 4,
      numShapes: 6,
      numTexts: 0,
      questionType: 'position-number',
    },
    'speed-reading': {
      displayTime: 4000, // 10 màu x 0.4s = 4s (chậm hơn)
      numOptions: 4,
      numShapes: 0,
      numTexts: 0,
      questionType: 'nth-color',
    },
    'shape-counting': {
      displayTime: 5000, // 3 giây (tăng từ 1 giây)
      numOptions: 4,
      numShapes: 10,
      numTexts: 0,
      questionType: 'shape-count',
    },
    'color-match': {
      displayTime: 3000,
      numOptions: 4,
      numShapes: 0,
      numTexts: 4,
      questionType: 'color-mismatch',
    },
    'distraction-test': {
      displayTime: 3000,
      numOptions: 4,
      numShapes: 1,
      numTexts: 0,
      questionType: 'main-color',
    },
    'flash-memory': {
      displayTime: 1500, // 3 lần nhấp nháy
      numOptions: 4,
      numShapes: 1,
      numTexts: 0,
      questionType: 'flash-color',
    },
    'increasing-sequence': {
      displayTime: 4000,
      numOptions: 4,
      numShapes: 9,
      numTexts: 0,
      questionType: 'last-three-colors',
    },
    'partial-shapes': {
      displayTime: 2000,
      numOptions: 4,
      numShapes: 1,
      numTexts: 0,
      questionType: 'partial-shape-type',
    },
    'overlapping-chaos': {
      displayTime: 3000,
      numOptions: 4,
      numShapes: 5,
      numTexts: 0,
      questionType: 'top-shape',
    },
    'path-tracking': {
      displayTime: 3000,
      numOptions: 3,
      numShapes: 3,
      numTexts: 0,
      questionType: 'path-shape',
    },
    'stroop-hard': {
      displayTime: 4000,
      numOptions: 3,
      numShapes: 0,
      numTexts: 3,
      questionType: 'color-change-count',
    },
    'wrong-color-mix': {
      displayTime: 2500,
      numOptions: 5,
      numShapes: 5,
      numTexts: 0,
      questionType: 'wrong-group-color',
    },
  };
  
  return configs[stageType];
}

// Lấy tên hiển thị cho mỗi loại game
export function getGameTypeName(stageType: StageType): string {
  const names: Record<StageType, string> = {
    'shape-color': 'Hình dạng & Màu sắc',
    'stroop': 'Stroop Test',
    'multi-shape': 'Nhiều Hình dạng',
    'color-sequence': 'Dãy Màu sắc',
    'animated-shapes': 'Shapes Chạy',
    'mixed': 'Kết hợp',
    // 12 game mới
    'position-memory': 'Ghi nhớ Vị trí',
    'speed-reading': 'Đọc nhanh Màu sắc',
    'shape-counting': 'Đếm nhanh',
    'color-match': 'Ghép cặp Màu',
    'distraction-test': 'Gây nhiễu',
    'flash-memory': 'Chớp tắt',
    'increasing-sequence': 'Dãy Tăng dần',
    'partial-shapes': 'Hình Một phần',
    'overlapping-chaos': 'Overlap Hỗn loạn',
    'path-tracking': 'Theo dõi Đường đi',
    'stroop-hard': 'Stroop Khó',
    'wrong-color-mix': 'Màu Lạc nhóm',
  };
  
  return names[stageType];
}

