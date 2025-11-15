export type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'black' | 'pink';

export type Shape = 'square' | 'circle' | 'triangle' | 'diamond' | 'star';

export interface ColorOption {
  color: Color;
  label: string;
}

export interface ShapeDisplay {
  shape: Shape;
  color: Color;
  speed?: number; // Tốc độ animation (pixels per second)
  size?: number; // Kích thước hình (px)
  position?: 'left' | 'center' | 'right' | number; // Vị trí (left/center/right hoặc index trong grid)
  rotation?: number; // Góc xoay (degrees)
  order?: number; // Thứ tự xuất hiện (cho multiple rounds)
  fadeIn?: boolean; // Có fade in không
  speedChange?: number; // Thay đổi tốc độ (cho animated shapes)
}

export interface StroopDisplay {
  text: string;
  textColor: Color;
  position?: 'left' | 'center' | 'right' | number; // Vị trí text
  shuffled?: boolean; // Có bị shuffle không
}

export type StageType = 
  | 'shape-color' | 'stroop' | 'multi-shape' | 'color-sequence' | 'mixed' | 'animated-shapes'
  | 'position-memory' | 'speed-reading' | 'shape-counting' | 'color-match' | 'distraction-test' | 'flash-memory'
  | 'increasing-sequence' | 'partial-shapes' | 'overlapping-chaos' | 'path-tracking' | 'stroop-hard' | 'wrong-color-mix';

export type GameStage = 'menu' | 'display' | 'question' | 'game-over' | 'victory';

export interface StageConfig {
  displayTime: number; // Thời gian hiển thị (ms)
  numOptions: number; // Số lựa chọn
  numShapes: number; // Số hình hiển thị
  numTexts: number; // Số text hiển thị
  questionType: 
    | 'color' | 'shape' | 'text-color' | 'missing-color' | 'sequence' | 'fastest-shape' | 'fastest-color' | 'slowest-shape' | 'slowest-color' 
    | 'largest-color' | 'first-color' | 'position-color' | 'count-color' | 'correct-stroop' | 'different-stroop' | 'before-color' | 'last-two-colors' 
    | 'speed-change-shape' | 'finish-first' | 'overlap-top' | 'appear-twice'
    | 'position-number' | 'empty-position' | 'nth-color' | 'color-exists' | 'shape-count' | 'first-shape' | 'color-mismatch'
    | 'main-color' | 'main-position' | 'flash-color' | 'flash-exists' | 'last-three-colors' | 'partial-shape-type' | 'partial-shape-color'
    | 'top-shape' | 'color-count-chaos' | 'path-shape' | 'direction-change' | 'color-change-count' | 'wrong-group-color';
}

export interface GameHistory {
  stageType: StageType;
  displayData: {
    shapes?: ShapeDisplay[];
    texts?: StroopDisplay[];
    sequence?: Color[];
    grid?: Array<{ position: number; color?: Color; shape?: Shape }>;
    flashSequence?: Color[];
    paths?: Array<{ shape: Shape; color: Color; path: 'straight' | 'curve' | 'zigzag' }>;
    mainShape?: ShapeDisplay;
    distractionShapes?: ShapeDisplay[];
    leftColors?: Color[];
    rightTexts?: StroopDisplay[];
    partialShape?: { shape: Shape; color: Color; part: 'top' | 'bottom' | 'left' | 'right' };
    colorGroup?: 'warm' | 'cool';
  };
}

export interface GameState {
  currentStage: GameStage;
  score: number;
  stageType: StageType;
  stageConfig: StageConfig;
  playedTypes: StageType[]; // Các loại game đã chơi
  history: GameHistory[]; // Lịch sử các màn chơi trước
  displayData: {
    shapes?: ShapeDisplay[];
    texts?: StroopDisplay[];
    sequence?: Color[];
    grid?: Array<{ position: number; color?: Color; shape?: Shape }>;
    flashSequence?: Color[];
    paths?: Array<{ shape: Shape; color: Color; path: 'straight' | 'curve' | 'zigzag' }>;
    mainShape?: ShapeDisplay;
    distractionShapes?: ShapeDisplay[];
    leftColors?: Color[];
    rightTexts?: StroopDisplay[];
    partialShape?: { shape: Shape; color: Color; part: 'top' | 'bottom' | 'left' | 'right' };
    colorGroup?: 'warm' | 'cool';
  };
  questionData: {
    correctAnswer?: Color | Shape | number | string;
    options?: (Color | Shape | number | string)[];
    questionText?: string;
  };
}

export const COLORS: Record<Color, string> = {
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#10B981',
  yellow: '#FBBF24',
  purple: '#A855F7',
  orange: '#F97316',
  black: '#000000',
  pink: '#EC4899',
};

export const COLOR_LABELS: Record<Color, string> = {
  red: 'Đỏ',
  blue: 'Xanh dương',
  green: 'Xanh lá',
  yellow: 'Vàng',
  purple: 'Tím',
  orange: 'Cam',
  black: 'Đen',
  pink: 'Hồng',
};

export const SHAPES: Shape[] = ['square', 'circle', 'triangle', 'diamond', 'star'];

