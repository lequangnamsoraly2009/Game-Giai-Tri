import { Color, Shape, ShapeDisplay, StroopDisplay, GameState, GameStage, SHAPES, COLORS, COLOR_LABELS, StageType, StageConfig, GameHistory } from '@/types/game';
import { ALL_GAME_TYPES, getGameConfig, getGameTypeName } from './gameTypes';

export function getRandomColor(exclude?: Color[]): Color {
  const colors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];
  const availableColors = exclude ? colors.filter(c => !exclude.includes(c)) : colors;
  if (availableColors.length === 0) return colors[0]; // Fallback
  return availableColors[Math.floor(Math.random() * availableColors.length)];
}

export function getRandomShape(exclude?: Shape[]): Shape {
  const availableShapes = exclude ? SHAPES.filter(s => !exclude.includes(s)) : SHAPES;
  if (availableShapes.length === 0) return SHAPES[0]; // Fallback
  return availableShapes[Math.floor(Math.random() * availableShapes.length)];
}

export function getRandomColors(count: number, exclude?: Color[]): Color[] {
  const allColors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black'];
  const excludeSet = exclude ? new Set(exclude) : new Set<Color>();
  const availableColors = allColors.filter(c => !excludeSet.has(c));
  
  if (availableColors.length < count) {
    // Nếu không đủ màu, lặp lại nhưng đảm bảo không trùng liên tiếp
    const result: Color[] = [];
    const shuffled = [...availableColors].sort(() => Math.random() - 0.5);
    for (let i = 0; i < count; i++) {
      result.push(shuffled[i % shuffled.length]);
    }
    return result;
  }
  
  const shuffled = [...availableColors].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRandomShapes(count: number, exclude?: Shape[]): Shape[] {
  const excludeSet = exclude ? new Set(exclude) : new Set<Shape>();
  const availableShapes = SHAPES.filter(s => !excludeSet.has(s));
  
  if (availableShapes.length < count) {
    // Nếu không đủ hình, lặp lại nhưng đảm bảo không trùng liên tiếp
    const result: Shape[] = [];
    const shuffled = [...availableShapes].sort(() => Math.random() - 0.5);
    for (let i = 0; i < count; i++) {
      result.push(shuffled[i % shuffled.length]);
    }
    return result;
  }
  
  const shuffled = [...availableShapes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateStage1Display(): ShapeDisplay {
  return {
    shape: getRandomShape(),
    color: getRandomColor(),
  };
}

export function generateStage1Options(correctColor: Color): Color[] {
  const options = [correctColor];
  const otherColors = getRandomColors(2, [correctColor]);
  options.push(...otherColors);
  return options.sort(() => Math.random() - 0.5);
}

export function generateStage2Display(): StroopDisplay[] {
  const colorWords: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  const textColors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'pink'];
  
  const displays: StroopDisplay[] = [];
  const usedWords = new Set<Color>();
  const usedTextColors = new Set<Color>();
  
  // Tạo 3 cặp text-color, đảm bảo text và màu text khác nhau
  for (let i = 0; i < 3; i++) {
    const availableWords = colorWords.filter(w => !usedWords.has(w));
    const word = availableWords[Math.floor(Math.random() * availableWords.length)];
    usedWords.add(word);
    
    const availableTextColors = textColors.filter(c => c !== word && !usedTextColors.has(c));
    const textColor = availableTextColors[Math.floor(Math.random() * availableTextColors.length)];
    usedTextColors.add(textColor);
    
    displays.push({
      text: COLOR_LABELS[word],
      textColor: textColor,
    });
  }
  
  return displays;
}

export function getStage2QuestionColor(displays: StroopDisplay[]): Color {
  // Lấy tất cả các màu text đã xuất hiện
  const textColors = displays.map(d => d.textColor);
  const allColors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'pink'];
  
  // Tìm màu không xuất hiện
  const missingColors = allColors.filter(c => !textColors.includes(c));
  
  if (missingColors.length > 0) {
    return missingColors[Math.floor(Math.random() * missingColors.length)];
  }
  
  // Fallback: trả về một màu ngẫu nhiên
  return getRandomColor();
}

export function generateStage2Options(correctColor: Color, displays: StroopDisplay[]): Color[] {
  const textColors = displays.map(d => d.textColor);
  const options = [correctColor];
  
  // Thêm 2 màu từ các màu đã xuất hiện
  const appearedColors = textColors.filter((c, i, arr) => arr.indexOf(c) === i);
  const shuffled = [...appearedColors].sort(() => Math.random() - 0.5);
  options.push(...shuffled.slice(0, 2));
  
  // Nếu chưa đủ 3, thêm màu ngẫu nhiên
  while (options.length < 3) {
    const randomColor = getRandomColor();
    if (!options.includes(randomColor)) {
      options.push(randomColor);
    }
  }
  
  return options.sort(() => Math.random() - 0.5);
}

export function createInitialState(): GameState {
  return {
    currentStage: 'menu',
    score: 0,
    stageType: 'shape-color',
    stageConfig: {
      displayTime: 6000,
      numOptions: 3,
      numShapes: 1,
      numTexts: 3,
      questionType: 'color',
    },
    playedTypes: [],
    history: [],
    displayData: {},
    questionData: {},
  };
}

// Chọn loại game tiếp theo chưa chơi
export function getNextGameType(playedTypes: StageType[]): StageType | null {
  const availableTypes = ALL_GAME_TYPES.filter(type => !playedTypes.includes(type));
  
  if (availableTypes.length === 0) {
    return null; // Đã chơi hết tất cả
  }
  
  // Chọn ngẫu nhiên từ các loại chưa chơi
  return availableTypes[Math.floor(Math.random() * availableTypes.length)];
}

export function generateGameDisplay(stageType: StageType): { displayData: GameState['displayData'], stageConfig: StageConfig } {
  const stageConfig = getGameConfig(stageType);
  const displayData: GameState['displayData'] = {};
  
  if (stageType === 'shape-color') {
    // Nâng cấp: Multiple rounds (3 hình liên tiếp) hoặc single với kích thước/fade
    const mode = Math.random() < 0.5 ? 'multiple-rounds' : 'single-enhanced';
    
    if (mode === 'multiple-rounds') {
      // Hiển thị 3 hình liên tiếp
      const shapes: ShapeDisplay[] = [];
      const usedShapes: Shape[] = [];
      const usedColors: Color[] = [];
      
      for (let i = 0; i < 3; i++) {
        const shape = getRandomShape(usedShapes);
        const color = getRandomColor(usedColors);
        
        shapes.push({
          shape,
          color,
          order: i + 1,
          fadeIn: true,
        });
        
        usedShapes.push(shape);
        usedColors.push(color);
      }
      displayData.shapes = shapes;
    } else {
      // Single với kích thước khác nhau
      const shapes: ShapeDisplay[] = [];
      const sizes = [100, 120, 150]; // 3 kích thước
      const shuffledSizes = [...sizes].sort(() => Math.random() - 0.5);
      
      for (let i = 0; i < 3; i++) {
        const shape = getRandomShape();
        const color = getRandomColor();
        
        shapes.push({
          shape,
          color,
          size: shuffledSizes[i],
          position: i === 0 ? 'left' : i === 1 ? 'center' : 'right',
          fadeIn: Math.random() < 0.5,
        });
      }
      displayData.shapes = shapes;
    }
  }
  
  if (stageType === 'multi-shape') {
    const shapes: ShapeDisplay[] = [];
    const usedShapes: Shape[] = [];
    const usedColors: Color[] = [];
    
    // Nâng cấp: 5 hình thay vì 3, có rotation và grid 3x3
    const numShapes = 5;
    const positions = [0, 1, 2, 3, 4]; // Grid 3x3: 0-8, nhưng chỉ dùng 5
    
    for (let i = 0; i < numShapes; i++) {
      const shape = getRandomShape(usedShapes);
      const color = getRandomColor(usedColors);
      const rotation = Math.random() < 0.5 ? Math.floor(Math.random() * 360) : 0;
      
      shapes.push({
        shape,
        color,
        position: positions[i],
        rotation: rotation !== 0 ? rotation : undefined,
      });
      
      usedShapes.push(shape);
      usedColors.push(color);
    }
    displayData.shapes = shapes;
  }
  
  if (stageType === 'animated-shapes') {
    const shapes: ShapeDisplay[] = [];
    const speeds: number[] = [];
    
    // Nâng cấp: Tốc độ thay đổi, đường cong, hoặc từ trên xuống
    const mode = Math.random() < 0.3 ? 'speed-change' : Math.random() < 0.5 ? 'curve' : 'normal';
    
    // Tạo tốc độ khác nhau cho mỗi shape
    const baseSpeed = 100;
    for (let i = 0; i < 3; i++) {
      // Tạo tốc độ khác nhau: chậm, trung bình, nhanh
      const speedVariation = [0.7, 1.0, 1.5][i]; // Tỷ lệ tốc độ
      speeds.push(baseSpeed * speedVariation);
    }
    
    // Xáo trộn thứ tự tốc độ để không dễ đoán
    const shuffledSpeeds = [...speeds].sort(() => Math.random() - 0.5);
    const usedShapes: Shape[] = [];
    const usedColors: Color[] = [];
    
    for (let i = 0; i < 3; i++) {
      const shape = getRandomShape(usedShapes);
      const color = getRandomColor(usedColors);
      
      const shapeData: ShapeDisplay = {
        shape,
        color,
        speed: shuffledSpeeds[i],
      };
      
      // Thêm speedChange nếu mode là speed-change
      if (mode === 'speed-change' && i === 0) {
        shapeData.speedChange = 1.5; // Tăng tốc
      } else if (mode === 'speed-change' && i === 1) {
        shapeData.speedChange = 0.7; // Giảm tốc
      }
      
      shapes.push(shapeData);
      
      usedShapes.push(shape);
      usedColors.push(color);
    }
    displayData.shapes = shapes;
  }
  
  if (stageType === 'stroop' || stageType === 'mixed') {
    const texts: StroopDisplay[] = [];
    const colorWords: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const textColors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'pink'];
    const usedWords = new Set<Color>();
    const usedTextColors = new Set<Color>();
    const positions: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right'];
    const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < stageConfig.numTexts; i++) {
      const availableWords = colorWords.filter(w => !usedWords.has(w));
      if (availableWords.length === 0) break;
      
      const word = availableWords[Math.floor(Math.random() * availableWords.length)];
      usedWords.add(word);
      
      const availableTextColors = textColors.filter(c => c !== word && !usedTextColors.has(c));
      if (availableTextColors.length === 0) break;
      
      const textColor = availableTextColors[Math.floor(Math.random() * availableTextColors.length)];
      usedTextColors.add(textColor);
      
      texts.push({
        text: COLOR_LABELS[word],
        textColor: textColor,
        position: shuffledPositions[i] || 'center',
        shuffled: stageType === 'stroop' && Math.random() < 0.3, // 30% khả năng shuffle
      });
    }
    displayData.texts = texts;
  }
  
  if (stageType === 'color-sequence') {
    // Nâng cấp: 7 màu thay vì 5, hoặc Simon game mode
    const mode = Math.random() < 0.3 ? 'simon' : 'sequence';
    
    if (mode === 'simon') {
      // Simon game: bắt đầu với 1 màu, mỗi vòng thêm 1
      const allColors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple'];
      const sequence: Color[] = [];
      const usedColors = new Set<Color>();
      
      for (let i = 0; i < 5; i++) {
        const available = allColors.filter(c => !usedColors.has(c));
        if (available.length === 0) break;
        const color = available[Math.floor(Math.random() * available.length)];
        sequence.push(color);
        usedColors.add(color);
      }
      displayData.sequence = sequence;
    } else {
      // Sequence 7 màu
      const allColors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black'];
      const shuffled = [...allColors].sort(() => Math.random() - 0.5);
      const sequence = shuffled.slice(0, 5); // 7 màu
      displayData.sequence = sequence;
    }
  }
  
  if (stageType === 'mixed') {
    // Nâng cấp: Combo 3 loại hoặc overlap xoay 45 độ
    const mode = Math.random() < 0.4 ? 'combo' : 'overlap-rotate';
    
    if (mode === 'combo') {
      // Combo: multi-shape + stroop + sequence
      const shapes: ShapeDisplay[] = [];
      const usedShapes: Shape[] = [];
      const usedColors: Color[] = [];
      
      // 2 hình
      for (let i = 0; i < 2; i++) {
        const shape = getRandomShape(usedShapes);
        const color = getRandomColor(usedColors);
        shapes.push({ shape, color });
        usedShapes.push(shape);
        usedColors.push(color);
      }
      displayData.shapes = shapes;
      
      // Texts đã được tạo ở trên (stroop)
      // Sequence
      const allColors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];
      const shuffled = [...allColors].sort(() => Math.random() - 0.5);
      displayData.sequence = shuffled.slice(0, 3);
    } else {
      // Overlap xoay 45 độ
      const shapes: ShapeDisplay[] = [];
      const usedShapes: Shape[] = [];
      const usedColors: Color[] = [];
      
      for (let i = 0; i < 2; i++) {
        const shape = getRandomShape(usedShapes);
        const color = getRandomColor(usedColors);
        
        shapes.push({
          shape,
          color,
          rotation: i === 1 ? 45 : 0, // Hình thứ 2 xoay 45 độ
        });
        
        usedShapes.push(shape);
        usedColors.push(color);
      }
      displayData.shapes = shapes;
      
      // Thêm texts nếu chưa có
      if (!displayData.texts) {
        const texts: StroopDisplay[] = [];
        const colorWords: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
        const textColors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'pink'];
        const usedWords = new Set<Color>();
        const usedTextColors = new Set<Color>();
        
        for (let i = 0; i < stageConfig.numTexts; i++) {
          const availableWords = colorWords.filter(w => !usedWords.has(w));
          if (availableWords.length === 0) break;
          
          const word = availableWords[Math.floor(Math.random() * availableWords.length)];
          usedWords.add(word);
          
          const availableTextColors = textColors.filter(c => c !== word && !usedTextColors.has(c));
          if (availableTextColors.length === 0) break;
          
          const textColor = availableTextColors[Math.floor(Math.random() * availableTextColors.length)];
          usedTextColors.add(textColor);
          
          texts.push({
            text: COLOR_LABELS[word],
            textColor: textColor,
          });
        }
        displayData.texts = texts;
      }
    }
  }
  
  // ========== 12 GAME MỚI ==========
  
  // 1. Position Memory - Grid 3x3 với 6 hình chấm tròn
  if (stageType === 'position-memory') {
    const grid: Array<{ position: number; color?: Color; shape?: Shape }> = [];
    const allPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // 3x3 grid
    const shuffledPositions = [...allPositions].sort(() => Math.random() - 0.5);
    const selectedPositions = shuffledPositions.slice(0, 6);
    const usedColors: Color[] = [];
    
    selectedPositions.forEach(pos => {
      const color = getRandomColor(usedColors);
      usedColors.push(color);
      grid.push({ position: pos, color, shape: 'circle' });
    });
    
    displayData.grid = grid;
  }
  
  // 2. Speed Reading - 10 màu chạy cực nhanh
  if (stageType === 'speed-reading') {
    const allColors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black'];
    const sequence: Color[] = [];
    for (let i = 0; i < 10; i++) {
      sequence.push(allColors[Math.floor(Math.random() * allColors.length)]);
    }
    displayData.sequence = sequence;
  }
  
  // 3. Shape Counting - 10 hình rơi xuống
  if (stageType === 'shape-counting') {
    const shapes: ShapeDisplay[] = [];
    const allShapes: Shape[] = ['square', 'circle', 'triangle', 'diamond', 'star'];
    
    for (let i = 0; i < 10; i++) {
      const shape = allShapes[Math.floor(Math.random() * allShapes.length)];
      const color = getRandomColor();
      shapes.push({
        shape,
        color,
        order: i + 1, // Thứ tự rơi
      });
    }
    displayData.shapes = shapes;
  }
  
  // 4. Color Match - 4 màu LEFT và 4 text RIGHT
  if (stageType === 'color-match') {
    const leftColors: Color[] = [];
    const rightTexts: StroopDisplay[] = [];
    const usedColors = new Set<Color>();
    const colorWords: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    
    // 4 màu bên trái
    for (let i = 0; i < 4; i++) {
      const color = getRandomColor(Array.from(usedColors));
      leftColors.push(color);
      usedColors.add(color);
    }
    
    // 4 text bên phải - 1 text không khớp
    const mismatchIndex = Math.floor(Math.random() * 4);
    for (let i = 0; i < 4; i++) {
      if (i === mismatchIndex) {
        // Text không khớp
        const wrongColor = getRandomColor([leftColors[i]]);
        rightTexts.push({
          text: COLOR_LABELS[leftColors[i]],
          textColor: wrongColor,
        });
      } else {
        // Text khớp
        rightTexts.push({
          text: COLOR_LABELS[leftColors[i]],
          textColor: leftColors[i],
        });
      }
    }
    
    displayData.leftColors = leftColors;
    displayData.rightTexts = rightTexts;
  }
  
  // 5. Flash Memory - Hình nhấp nháy 3 lần với 3 màu
  if (stageType === 'flash-memory') {
    const flashSequence: Color[] = [];
    const usedColors: Color[] = [];
    
    for (let i = 0; i < 3; i++) {
      const color = getRandomColor(usedColors);
      flashSequence.push(color);
      usedColors.push(color);
    }
    
    displayData.flashSequence = flashSequence;
    displayData.shapes = [{
      shape: getRandomShape(),
      color: flashSequence[0], // Màu đầu tiên
    }];
  }
  
  // 7. Increasing Sequence - Dãy 5 → 7 → 9 màu
  if (stageType === 'increasing-sequence') {
    const allColors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black'];
    const shuffled = [...allColors].sort(() => Math.random() - 0.5);
    const sequence = shuffled.slice(0, 9); // 9 màu
    displayData.sequence = sequence;
  }
  
  // 8. Partial Shapes - Chỉ hiện 1 phần của hình
  if (stageType === 'partial-shapes') {
    const shape = getRandomShape();
    const color = getRandomColor();
    const parts: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];
    const part = parts[Math.floor(Math.random() * parts.length)];
    
    displayData.partialShape = { shape, color, part };
    displayData.shapes = [{ shape, color }];
  }
  
  // 9. Overlapping Chaos - 5 hình overlay với opacity
  if (stageType === 'overlapping-chaos') {
    const shapes: ShapeDisplay[] = [];
    const usedShapes: Shape[] = [];
    const usedColors: Color[] = [];
    
    for (let i = 0; i < 5; i++) {
      const shape = getRandomShape(usedShapes);
      const color = getRandomColor(usedColors);
      shapes.push({
        shape,
        color,
        position: i, // Z-index
      });
      usedShapes.push(shape);
      usedColors.push(color);
    }
    displayData.shapes = shapes;
  }
  
  // 10. Path Tracking - 3 hình chạy theo 3 đường khác nhau
  if (stageType === 'path-tracking') {
    const paths: Array<{ shape: Shape; color: Color; path: 'straight' | 'curve' | 'zigzag' }> = [];
    const pathTypes: Array<'straight' | 'curve' | 'zigzag'> = ['straight', 'curve', 'zigzag'];
    const shuffledPaths = [...pathTypes].sort(() => Math.random() - 0.5);
    const usedShapes: Shape[] = [];
    const usedColors: Color[] = [];
    
    for (let i = 0; i < 3; i++) {
      const shape = getRandomShape(usedShapes);
      const color = getRandomColor(usedColors);
      paths.push({
        shape,
        color,
        path: shuffledPaths[i],
      });
      usedShapes.push(shape);
      usedColors.push(color);
    }
    
    displayData.paths = paths;
    displayData.shapes = paths.map(p => ({ shape: p.shape, color: p.color }));
  }
  
  // 11. Stroop Hard - Chữ di chuyển và đổi màu
  if (stageType === 'stroop-hard') {
    const texts: StroopDisplay[] = [];
    const colorWords: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const textColors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'pink'];
    const usedWords = new Set<Color>();
    const usedTextColors = new Set<Color>();
    
    // Đảm bảo có ít nhất 1 text đổi màu 2 lần (cho câu hỏi)
    const colorChangeCounts = [2, 1, 3]; // Số lần đổi màu cho mỗi text
    
    for (let i = 0; i < 3; i++) {
      const availableWords = colorWords.filter(w => !usedWords.has(w));
      if (availableWords.length === 0) break;
      
      const word = availableWords[Math.floor(Math.random() * availableWords.length)];
      usedWords.add(word);
      
      const availableTextColors = textColors.filter(c => c !== word && !usedTextColors.has(c));
      if (availableTextColors.length === 0) break;
      
      const textColor = availableTextColors[Math.floor(Math.random() * availableTextColors.length)];
      usedTextColors.add(textColor);
      
      texts.push({
        text: COLOR_LABELS[word],
        textColor: textColor,
        shuffled: true, // Di chuyển
        position: colorChangeCounts[i], // Lưu số lần đổi màu vào position (tạm thời)
      });
    }
    displayData.texts = texts;
  }
  
  // 12. Wrong Color Mix - 5 màu, 1 màu không thuộc nhóm
  if (stageType === 'wrong-color-mix') {
    const warmColors: Color[] = ['red', 'orange', 'yellow', 'pink'];
    const coolColors: Color[] = ['blue', 'green', 'purple'];
    const group = Math.random() < 0.5 ? 'warm' : 'cool';
    const groupColors = group === 'warm' ? warmColors : coolColors;
    const otherColors = group === 'warm' ? coolColors : warmColors;
    
    const shapes: ShapeDisplay[] = [];
    const usedColors = new Set<Color>();
    
    // Lấy tất cả màu cùng nhóm (đảm bảo không trùng)
    const shuffledGroupColors = [...groupColors].sort(() => Math.random() - 0.5);
    for (const color of shuffledGroupColors) {
      usedColors.add(color);
      shapes.push({
        shape: getRandomShape(),
        color,
      });
    }
    
    // 1 màu lạc nhóm (đảm bảo không trùng với các màu đã chọn)
    const availableWrongColors = otherColors.filter(c => !usedColors.has(c));
    if (availableWrongColors.length > 0) {
      const wrongColor = availableWrongColors[Math.floor(Math.random() * availableWrongColors.length)];
      usedColors.add(wrongColor);
      shapes.push({
        shape: getRandomShape(),
        color: wrongColor,
      });
    }
    
    // Nếu chưa đủ 5 màu, thêm màu từ các màu còn lại (ưu tiên màu không thuộc cả 2 nhóm như black)
    const allColors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'pink'];
    const neutralColors: Color[] = ['black']; // Màu không thuộc nhóm nào
    const remainingColors = allColors.filter(c => !usedColors.has(c));
    
    // Ưu tiên thêm màu neutral (black) nếu có
    const availableNeutral = neutralColors.filter(c => !usedColors.has(c));
    if (shapes.length < 5 && availableNeutral.length > 0) {
      const neutralColor = availableNeutral[0];
      usedColors.add(neutralColor);
      shapes.push({
        shape: getRandomShape(),
        color: neutralColor,
      });
    }
    
    // Nếu vẫn chưa đủ 5 màu, thêm từ remainingColors
    while (shapes.length < 5 && remainingColors.length > 0) {
      const randomColor = remainingColors[Math.floor(Math.random() * remainingColors.length)];
      if (!usedColors.has(randomColor)) {
        usedColors.add(randomColor);
        shapes.push({
          shape: getRandomShape(),
          color: randomColor,
        });
      }
      // Xóa màu đã dùng khỏi remainingColors
      const index = remainingColors.indexOf(randomColor);
      if (index > -1) {
        remainingColors.splice(index, 1);
      }
    }
    
    // Shuffle để không dễ đoán
    const shuffled = [...shapes].sort(() => Math.random() - 0.5);
    displayData.shapes = shuffled;
    displayData.colorGroup = group;
  }
  
  return { displayData, stageConfig };
}

export function generateQuestion(displayData: GameState['displayData'], stageConfig: StageConfig, stageType: StageType, history: GameHistory[] = []): GameState['questionData'] {
  const questionData: GameState['questionData'] = {};
  
  // ========== SHAPE-COLOR: Câu hỏi mới ==========
  if (stageType === 'shape-color' && displayData.shapes) {
    const shapes = displayData.shapes;
    
    // Nếu có multiple rounds (3 hình với order)
    if (shapes.length === 3 && shapes[0].order) {
      const questionTypes = ['first-color', 'largest-color', 'position-color'];
      const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      if (randomType === 'first-color') {
        // Màu xuất hiện đầu tiên
        const firstShape = shapes.find(s => s.order === 1) || shapes[0];
        const correctColor = firstShape.color;
        const options = generateColorOptions(correctColor, stageConfig.numOptions);
        questionData.correctAnswer = correctColor;
        questionData.options = options;
        questionData.questionText = 'Màu xuất hiện đầu tiên là gì?';
        return questionData;
      } else if (randomType === 'largest-color' && shapes.some(s => s.size)) {
        // Hình to nhất có màu gì
        const largestShape = shapes.reduce((max, s) => (s.size || 0) > (max.size || 0) ? s : max);
        const correctColor = largestShape.color;
        const options = generateColorOptions(correctColor, stageConfig.numOptions);
        questionData.correctAnswer = correctColor;
        questionData.options = options;
        questionData.questionText = 'Hình to nhất có màu gì?';
        return questionData;
      } else if (randomType === 'position-color') {
        // Hình có màu X nằm ở vị trí nào
        const targetColor = shapes[Math.floor(Math.random() * shapes.length)].color;
        const targetShape = shapes.find(s => s.color === targetColor) || shapes[0];
        const position = targetShape.position || 'center';
        const positionOptions: Array<'left' | 'center' | 'right'> = ['left', 'center', 'right'];
        const correctPosition = typeof position === 'string' ? position : 'center';
        const options = positionOptions.filter(p => p !== correctPosition);
        options.push(correctPosition);
        questionData.correctAnswer = correctPosition as any; // Tạm thời
        questionData.options = options.sort(() => Math.random() - 0.5) as any;
        questionData.questionText = `Hình có màu ${COLOR_LABELS[targetColor]} nằm ở vị trí nào?`;
        return questionData;
      }
    }
    
    // Nếu có kích thước khác nhau
    if (shapes.some(s => s.size)) {
      const questionTypes = ['largest-color', 'count-color'];
      const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      if (randomType === 'largest-color') {
        const largestShape = shapes.reduce((max, s) => (s.size || 0) > (max.size || 0) ? s : max);
        const correctColor = largestShape.color;
        const options = generateColorOptions(correctColor, stageConfig.numOptions);
        questionData.correctAnswer = correctColor;
        questionData.options = options;
        questionData.questionText = 'Hình to nhất có màu gì?';
        return questionData;
      } else if (randomType === 'count-color') {
        // Đếm màu xuất hiện nhiều nhất
        const colorCount = new Map<Color, number>();
        shapes.forEach(s => {
          colorCount.set(s.color, (colorCount.get(s.color) || 0) + 1);
        });
        let maxCount = 0;
        let mostColor: Color = shapes[0].color;
        colorCount.forEach((count, color) => {
          if (count > maxCount) {
            maxCount = count;
            mostColor = color;
          }
        });
        const correctColor = mostColor;
        const options = generateColorOptions(correctColor, stageConfig.numOptions);
        questionData.correctAnswer = correctColor;
        questionData.options = options;
        questionData.questionText = 'Màu nào xuất hiện nhiều lần nhất?';
        return questionData;
      }
    }
  }
  
  // ========== STROOP: Câu hỏi mới ==========
  if (stageType === 'stroop' && displayData.texts) {
    const texts = displayData.texts;
    const questionTypes = ['correct-stroop', 'different-stroop'];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    if (randomType === 'correct-stroop') {
      // Từ nào có màu chữ đúng với ý nghĩa
      const correctText = texts.find(t => {
        const wordColor = Object.keys(COLOR_LABELS).find(c => COLOR_LABELS[c as Color] === t.text) as Color;
        return wordColor && wordColor === t.textColor;
      });
      
      if (correctText) {
        const correctAnswer = correctText.text;
        const options = texts.map(t => t.text).sort(() => Math.random() - 0.5);
        questionData.correctAnswer = correctAnswer as any;
        questionData.options = options as any;
        questionData.questionText = 'Từ nào có màu chữ đúng với ý nghĩa?';
        return questionData;
      }
    } else if (randomType === 'different-stroop') {
      // Từ nào KHÁC màu so với 2 từ còn lại
      const colorCount = new Map<Color, number>();
      texts.forEach(t => {
        colorCount.set(t.textColor, (colorCount.get(t.textColor) || 0) + 1);
      });
      let differentColor: Color | null = null;
      colorCount.forEach((count, color) => {
        if (count === 1) differentColor = color;
      });
      
      if (differentColor) {
        const differentText = texts.find(t => t.textColor === differentColor);
        if (differentText) {
          const correctAnswer = differentText.text;
          const options = texts.map(t => t.text).sort(() => Math.random() - 0.5);
          questionData.correctAnswer = correctAnswer as any;
          questionData.options = options as any;
          questionData.questionText = 'Từ nào KHÁC màu so với 2 từ còn lại?';
          return questionData;
        }
      }
    }
  }
  
  // ========== MULTI-SHAPE: Câu hỏi mới ==========
  if (stageType === 'multi-shape' && displayData.shapes && displayData.shapes.length >= 5) {
    const shapes = displayData.shapes;
    const questionTypes = ['fourth-color', 'count-color'];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    if (randomType === 'fourth-color' && shapes.length >= 4) {
      // Hình thứ 4 có màu gì
      const fourthShape = shapes[3];
      const correctColor = fourthShape.color;
      const options = generateColorOptions(correctColor, stageConfig.numOptions);
      questionData.correctAnswer = correctColor;
      questionData.options = options;
      questionData.questionText = 'Hình thứ 4 có màu gì?';
      return questionData;
    } else if (randomType === 'count-color') {
      // Có bao nhiêu hình màu X
      const targetColor = shapes[Math.floor(Math.random() * shapes.length)].color;
      const count = shapes.filter(s => s.color === targetColor).length;
      const countOptions = [count - 1, count, count + 1, count + 2].filter(c => c >= 0 && c <= shapes.length);
      const correctCount = count;
      questionData.correctAnswer = correctCount as any;
      questionData.options = countOptions.sort(() => Math.random() - 0.5) as any;
      questionData.questionText = `Có bao nhiêu hình màu ${COLOR_LABELS[targetColor]}?`;
      return questionData;
    }
  }
  
  // ========== COLOR-SEQUENCE: Câu hỏi mới ==========
  if (stageType === 'color-sequence' && displayData.sequence) {
    const sequence = displayData.sequence;
    const questionTypes = ['before-color', 'last-two-colors'];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    if (randomType === 'before-color' && sequence.length > 1) {
      // Màu đứng trước màu X
      const targetIndex = Math.floor(Math.random() * (sequence.length - 1)) + 1;
      const targetColor = sequence[targetIndex];
      const beforeColor = sequence[targetIndex - 1];
      const options = generateColorOptions(beforeColor, stageConfig.numOptions);
      questionData.correctAnswer = beforeColor;
      questionData.options = options;
      questionData.questionText = `Màu đứng trước màu ${COLOR_LABELS[targetColor]} là gì?`;
      return questionData;
    } else if (randomType === 'last-two-colors' && sequence.length >= 2) {
      // Hai màu cuối cùng
      const lastTwo = sequence.slice(-2);
      // Câu hỏi này cần format đặc biệt, tạm thời hỏi màu cuối
      const correctColor = lastTwo[1];
      const options = generateColorOptions(correctColor, stageConfig.numOptions);
      questionData.correctAnswer = correctColor;
      questionData.options = options;
      questionData.questionText = 'Màu cuối cùng trong dãy là gì?';
      return questionData;
    }
  }
  
  // ========== ANIMATED-SHAPES: Câu hỏi mới ==========
  if (stageType === 'animated-shapes') {
    const questionTypes: Array<'fastest-shape' | 'fastest-color' | 'slowest-shape' | 'slowest-color' | 'speed-change-shape' | 'finish-first'> = [
      'fastest-shape',
      'fastest-color',
      'slowest-shape',
      'slowest-color',
      'speed-change-shape',
      'finish-first',
    ];
    const randomQuestionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    // Câu hỏi mới: Hình nào đổi tốc độ?
    if (randomQuestionType === 'speed-change-shape' && displayData.shapes) {
      const shapeWithSpeedChange = displayData.shapes.find(s => s.speedChange);
      if (shapeWithSpeedChange) {
        const correctShape = shapeWithSpeedChange.shape;
        const options = generateShapeOptions(correctShape, stageConfig.numOptions);
        questionData.correctAnswer = correctShape;
        questionData.options = options;
        questionData.questionText = 'Hình nào đổi tốc độ?';
        return questionData;
      }
    }
    
    // Câu hỏi mới: Hình nào cán đích đầu tiên? (nhanh nhất)
    if (randomQuestionType === 'finish-first' && displayData.shapes) {
      const shapesWithSpeed = displayData.shapes.map((shape, index) => ({
        shape: shape.shape,
        speed: shape.speed || 100,
        index,
      }));
      const sorted = [...shapesWithSpeed].sort((a, b) => b.speed - a.speed);
      const targetShape = sorted[0].shape;
      const options = generateShapeOptions(targetShape, stageConfig.numOptions);
      questionData.correctAnswer = targetShape;
      questionData.options = options;
      questionData.questionText = 'Hình nào cán đích đầu tiên?';
      return questionData;
    }
    
    if (displayData.shapes && displayData.shapes.length > 0) {
      if (randomQuestionType === 'fastest-shape' || randomQuestionType === 'slowest-shape') {
        const shapesWithSpeed = displayData.shapes.map((shape, index) => ({
          shape: shape.shape,
          speed: shape.speed || 100,
          index,
        }));
        
        const sorted = [...shapesWithSpeed].sort((a, b) => {
          if (randomQuestionType === 'fastest-shape') {
            return b.speed - a.speed; // Nhanh nhất
          } else {
            return a.speed - b.speed; // Chậm nhất
          }
        });
        
        const targetShape = sorted[0].shape;
        const options = generateShapeOptions(targetShape, stageConfig.numOptions);
        questionData.correctAnswer = targetShape;
        questionData.options = options;
        questionData.questionText = randomQuestionType === 'fastest-shape'
          ? 'Hình nào chạy nhanh nhất?'
          : 'Hình nào chạy chậm nhất?';
      } else {
        // fastest-color hoặc slowest-color
        const shapesWithSpeed = displayData.shapes.map((shape, index) => ({
          color: shape.color,
          speed: shape.speed || 100,
          index,
        }));
        
        const sorted = [...shapesWithSpeed].sort((a, b) => {
          if (randomQuestionType === 'fastest-color') {
            return b.speed - a.speed; // Nhanh nhất
          } else {
            return a.speed - b.speed; // Chậm nhất
          }
        });
        
        const targetColor = sorted[0].color;
        const options = generateColorOptions(targetColor, stageConfig.numOptions);
        questionData.correctAnswer = targetColor;
        questionData.options = options;
        questionData.questionText = randomQuestionType === 'fastest-color'
          ? 'Màu nào chạy nhanh nhất?'
          : 'Màu nào chạy chậm nhất?';
      }
    }
    
    return questionData;
  }
  
  if (stageConfig.questionType === 'color') {
    if (displayData.shapes && displayData.shapes.length > 0) {
      // Hỏi màu của hình đầu tiên hoặc hình cuối
      const targetIndex = displayData.shapes.length > 1 ? displayData.shapes.length - 1 : 0;
      const correctColor = displayData.shapes[targetIndex].color;
      const options = generateColorOptions(correctColor, stageConfig.numOptions);
      questionData.correctAnswer = correctColor;
      questionData.options = options;
      questionData.questionText = displayData.shapes.length > 1
        ? 'Màu của hình cuối cùng là gì?'
        : 'Màu của hình vừa xuất hiện là gì?';
    }
  } else if (stageConfig.questionType === 'shape') {
    if (displayData.shapes && displayData.shapes.length > 0) {
      const correctShape = displayData.shapes[0].shape;
      const options = generateShapeOptions(correctShape, stageConfig.numOptions);
      questionData.correctAnswer = correctShape;
      questionData.options = options;
      questionData.questionText = 'Hình dạng vừa xuất hiện là gì?';
    }
  } else if (stageConfig.questionType === 'text-color') {
    if (displayData.texts && displayData.texts.length > 0) {
      // Hỏi màu của text (không phải nghĩa của text)
      const targetIndex = displayData.texts.length > 2 ? displayData.texts.length - 1 : Math.floor(displayData.texts.length / 2);
      const correctColor = displayData.texts[targetIndex].textColor;
      const options = generateColorOptions(correctColor, stageConfig.numOptions);
      questionData.correctAnswer = correctColor;
      questionData.options = options;
      questionData.questionText = displayData.texts.length > 2
        ? 'Màu của chữ cuối cùng là gì?'
        : 'Màu của chữ ở giữa là gì?';
    }
  } else if (stageConfig.questionType === 'missing-color') {
    if (displayData.texts && displayData.texts.length > 0) {
      const textColors = displayData.texts.map(t => t.textColor);
      const allColors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'black', 'pink'];
      const missingColors = allColors.filter(c => !textColors.includes(c));
      const correctColor = missingColors.length > 0 
        ? missingColors[Math.floor(Math.random() * missingColors.length)]
        : getRandomColor();
      const options = generateColorOptions(correctColor, stageConfig.numOptions, textColors);
      questionData.correctAnswer = correctColor;
      questionData.options = options;
      questionData.questionText = 'Màu nào KHÔNG xuất hiện?';
    }
  } else if (stageConfig.questionType === 'appear-twice') {
    // Màu nào xuất hiện đúng 2 lần (cho mixed combo)
    if (displayData.shapes && displayData.texts && displayData.sequence) {
      const allColors: Color[] = [];
      displayData.shapes.forEach(s => allColors.push(s.color));
      displayData.texts.forEach(t => allColors.push(t.textColor));
      displayData.sequence.forEach(c => allColors.push(c));
      
      const colorCount = new Map<Color, number>();
      allColors.forEach(c => {
        colorCount.set(c, (colorCount.get(c) || 0) + 1);
      });
      
      const twiceColors: Color[] = [];
      colorCount.forEach((count, color) => {
        if (count === 2) twiceColors.push(color);
      });
      
      if (twiceColors.length > 0) {
        const correctColor = twiceColors[Math.floor(Math.random() * twiceColors.length)];
        const options = generateColorOptions(correctColor, stageConfig.numOptions);
        questionData.correctAnswer = correctColor;
        questionData.options = options;
        questionData.questionText = 'Màu nào xuất hiện đúng 2 lần?';
      }
    }
  } else if (stageConfig.questionType === 'overlap-top') {
    // Trong 2 hình overlap, hình nào nằm trên (cho mixed overlap-rotate)
    if (displayData.shapes && displayData.shapes.length === 2) {
      // Hình thứ 2 (có rotation) nằm trên
      const topShape = displayData.shapes[1];
      const correctShape = topShape.shape;
      const options = generateShapeOptions(correctShape, stageConfig.numOptions);
      questionData.correctAnswer = correctShape;
      questionData.options = options;
      questionData.questionText = 'Trong 2 hình overlap, hình nào nằm trên?';
    }
  } else if (stageConfig.questionType === 'sequence') {
    if (displayData.sequence && displayData.sequence.length > 0) {
      // Random câu hỏi: màu ở giữa, bên trái cùng, hoặc bên phải cùng
      const questionTypes = ['middle', 'left', 'right'];
      const randomQuestionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      let targetIndex: number;
      let questionText: string;
      
      if (randomQuestionType === 'middle') {
        // Màu ở giữa (index 2 trong dãy 5 màu)
        targetIndex = Math.floor(displayData.sequence.length / 2);
        questionText = 'Màu ở giữa dãy là gì?';
      } else if (randomQuestionType === 'left') {
        // Màu bên trái cùng (index 0)
        targetIndex = 0;
        questionText = 'Màu bên trái cùng là gì?';
      } else {
        // Màu bên phải cùng (index cuối)
        targetIndex = displayData.sequence.length - 1;
        questionText = 'Màu bên phải cùng là gì?';
      }
      
      const correctColor = displayData.sequence[targetIndex];
      const options = generateColorOptions(correctColor, stageConfig.numOptions);
      questionData.correctAnswer = correctColor;
      questionData.options = options;
      questionData.questionText = questionText;
    }
  } else if (stageConfig.questionType === 'fastest-shape' || stageConfig.questionType === 'slowest-shape') {
    if (displayData.shapes && displayData.shapes.length > 0) {
      // Tìm shape nhanh nhất hoặc chậm nhất
      const shapesWithSpeed = displayData.shapes.map((shape, index) => ({
        shape: shape.shape,
        speed: shape.speed || 100,
        index,
      }));
      
      const sorted = [...shapesWithSpeed].sort((a, b) => {
        if (stageConfig.questionType === 'fastest-shape') {
          return b.speed - a.speed; // Nhanh nhất (tốc độ cao nhất)
        } else {
          return a.speed - b.speed; // Chậm nhất (tốc độ thấp nhất)
        }
      });
      
      const targetShape = sorted[0].shape;
      const options = generateShapeOptions(targetShape, stageConfig.numOptions);
      questionData.correctAnswer = targetShape;
      questionData.options = options;
      questionData.questionText = stageConfig.questionType === 'fastest-shape'
        ? 'Hình nào chạy nhanh nhất?'
        : 'Hình nào chạy chậm nhất?';
    }
  } else if (stageConfig.questionType === 'fastest-color' || stageConfig.questionType === 'slowest-color') {
    if (displayData.shapes && displayData.shapes.length > 0) {
      // Tìm màu của shape nhanh nhất hoặc chậm nhất
      const shapesWithSpeed = displayData.shapes.map((shape, index) => ({
        color: shape.color,
        speed: shape.speed || 100,
        index,
      }));
      
      const sorted = [...shapesWithSpeed].sort((a, b) => {
        if (stageConfig.questionType === 'fastest-color') {
          return b.speed - a.speed; // Nhanh nhất
        } else {
          return a.speed - b.speed; // Chậm nhất
        }
      });
      
      const targetColor = sorted[0].color;
      const options = generateColorOptions(targetColor, stageConfig.numOptions);
      questionData.correctAnswer = targetColor;
      questionData.options = options;
      questionData.questionText = stageConfig.questionType === 'fastest-color'
        ? 'Màu nào chạy nhanh nhất?'
        : 'Màu nào chạy chậm nhất?';
    }
  }
  
  // ========== 12 GAME MỚI: Câu hỏi ==========
  
  // 1. Position Memory
  if (stageType === 'position-memory' && displayData.grid) {
    const questionTypes = ['position-number', 'empty-position'];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    if (randomType === 'position-number') {
      // Hình màu X nằm ở ô số mấy?
      const targetItem = displayData.grid[Math.floor(Math.random() * displayData.grid.length)];
      const correctPosition = targetItem.position + 1; // 1-9 thay vì 0-8
      const allPositions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const options = allPositions.filter(p => p !== correctPosition).slice(0, stageConfig.numOptions - 1);
      options.push(correctPosition);
      questionData.correctAnswer = correctPosition;
      questionData.options = options.sort(() => Math.random() - 0.5);
      questionData.questionText = `Hình màu ${COLOR_LABELS[targetItem.color!]} nằm ở ô số mấy?`;
      return questionData;
    } else {
      // Ô nào KHÔNG có hình?
      const usedPositions = displayData.grid.map(g => g.position);
      const allPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const emptyPositions = allPositions.filter(p => !usedPositions.includes(p));
      if (emptyPositions.length > 0) {
        const correctPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)] + 1;
        const options = [correctPosition, correctPosition + 1, correctPosition - 1, correctPosition + 2].filter(p => p >= 1 && p <= 9);
        questionData.correctAnswer = correctPosition;
        questionData.options = options.sort(() => Math.random() - 0.5);
        questionData.questionText = 'Ô nào KHÔNG có hình?';
        return questionData;
      }
    }
  }
  
  // 2. Speed Reading
  if (stageType === 'speed-reading' && displayData.sequence) {
    const questionTypes = ['nth-color', 'color-exists'];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    if (randomType === 'nth-color') {
      // Màu thứ 7 là gì?
      const nth = 7;
      const correctColor = displayData.sequence[nth - 1];
      const options = generateColorOptions(correctColor, stageConfig.numOptions);
      questionData.correctAnswer = correctColor;
      questionData.options = options;
      questionData.questionText = `Màu thứ ${nth} là gì?`;
      return questionData;
    } else {
      // Có xuất hiện màu X không?
      const targetColor = displayData.sequence[Math.floor(Math.random() * displayData.sequence.length)];
      const exists = displayData.sequence.includes(targetColor);
      const options = ['Có', 'Không'];
      questionData.correctAnswer = exists ? 'Có' : 'Không';
      questionData.options = options;
      questionData.questionText = `Có xuất hiện màu ${COLOR_LABELS[targetColor]} không?`;
      return questionData;
    }
  }
  
  // 3. Shape Counting
  if (stageType === 'shape-counting' && displayData.shapes) {
    const questionTypes = ['shape-count', 'first-shape'];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    if (randomType === 'shape-count') {
      // Có bao nhiêu hình tam giác?
      const targetShape = displayData.shapes[Math.floor(Math.random() * displayData.shapes.length)].shape;
      const count = displayData.shapes.filter(s => s.shape === targetShape).length;
      const options = [count - 1, count, count + 1, count + 2].filter(c => c >= 0);
      questionData.correctAnswer = count;
      questionData.options = options.sort(() => Math.random() - 0.5);
      questionData.questionText = `Có bao nhiêu hình ${SHAPES.find(s => s === targetShape)}?`;
      return questionData;
    } else {
      // Hình xuất hiện đầu tiên là gì?
      const firstShape = displayData.shapes.find(s => s.order === 1) || displayData.shapes[0];
      const options = generateShapeOptions(firstShape.shape, stageConfig.numOptions);
      questionData.correctAnswer = firstShape.shape;
      questionData.options = options;
      questionData.questionText = 'Hình xuất hiện đầu tiên là gì?';
      return questionData;
    }
  }
  
  // 4. Color Match
  if (stageType === 'color-match' && displayData.leftColors && displayData.rightTexts) {
    // Text nào KHÔNG khớp màu với bên trái?
    const mismatchIndex = displayData.rightTexts.findIndex((text, i) => {
      const leftColor = displayData.leftColors![i];
      return text.textColor !== leftColor;
    });
    
    if (mismatchIndex >= 0) {
      const correctText = displayData.rightTexts[mismatchIndex].text;
      const options = displayData.rightTexts.map(t => t.text).sort(() => Math.random() - 0.5);
      questionData.correctAnswer = correctText;
      questionData.options = options;
      questionData.questionText = 'Text nào KHÔNG khớp màu với bên trái?';
      return questionData;
    }
  }
  
  // 5. Flash Memory
  if (stageType === 'flash-memory' && displayData.flashSequence) {
    const questionTypes = ['flash-color', 'flash-exists'];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    if (randomType === 'flash-color') {
      // Lần nhấp thứ 2 là màu gì?
      const correctColor = displayData.flashSequence[1];
      const options = generateColorOptions(correctColor, stageConfig.numOptions);
      questionData.correctAnswer = correctColor;
      questionData.options = options;
      questionData.questionText = 'Lần nhấp thứ 2 là màu gì?';
      return questionData;
    } else {
      // Có nhấp nháy màu X không?
      const targetColor = displayData.flashSequence[Math.floor(Math.random() * displayData.flashSequence.length)];
      const exists = displayData.flashSequence.includes(targetColor);
      const options = ['Có', 'Không'];
      questionData.correctAnswer = exists ? 'Có' : 'Không';
      questionData.options = options;
      questionData.questionText = `Có nhấp nháy màu ${COLOR_LABELS[targetColor]} không?`;
      return questionData;
    }
  }
  
  // 7. Increasing Sequence
  if (stageType === 'increasing-sequence' && displayData.sequence) {
    // 3 màu cuối là gì? (hỏi màu cuối cùng)
    const correctColor = displayData.sequence[displayData.sequence.length - 1];
    const options = generateColorOptions(correctColor, stageConfig.numOptions);
    questionData.correctAnswer = correctColor;
    questionData.options = options;
    questionData.questionText = 'Màu cuối cùng trong dãy là gì?';
    return questionData;
  }
  
  // 8. Partial Shapes
  if (stageType === 'partial-shapes' && displayData.partialShape) {
    const questionTypes = ['partial-shape-type', 'partial-shape-color'];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    if (randomType === 'partial-shape-type') {
      const correctShape = displayData.partialShape.shape;
      const options = generateShapeOptions(correctShape, stageConfig.numOptions);
      questionData.correctAnswer = correctShape;
      questionData.options = options;
      questionData.questionText = 'Đây là hình gì?';
      return questionData;
    } else {
      const correctColor = displayData.partialShape.color;
      const options = generateColorOptions(correctColor, stageConfig.numOptions);
      questionData.correctAnswer = correctColor;
      questionData.options = options;
      questionData.questionText = 'Hình này có màu gì?';
      return questionData;
    }
  }
  
  // 9. Overlapping Chaos
  if (stageType === 'overlapping-chaos' && displayData.shapes) {
    const questionTypes = ['top-shape', 'color-count-chaos'];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    if (randomType === 'top-shape') {
      // Hình nào nằm trên cùng? (position cao nhất = index cuối)
      const topShape = displayData.shapes[displayData.shapes.length - 1];
      const options = generateShapeOptions(topShape.shape, stageConfig.numOptions);
      questionData.correctAnswer = topShape.shape;
      questionData.options = options;
      questionData.questionText = 'Hình nào nằm trên cùng?';
      return questionData;
    } else {
      // Có mấy hình màu X?
      const targetColor = displayData.shapes[Math.floor(Math.random() * displayData.shapes.length)].color;
      const count = displayData.shapes.filter(s => s.color === targetColor).length;
      const options = [count - 1, count, count + 1, count + 2].filter(c => c >= 0);
      questionData.correctAnswer = count;
      questionData.options = options.sort(() => Math.random() - 0.5);
      questionData.questionText = `Có mấy hình màu ${COLOR_LABELS[targetColor]}?`;
      return questionData;
    }
  }
  
  // 10. Path Tracking
  if (stageType === 'path-tracking' && displayData.paths) {
    const questionTypes = ['path-shape', 'direction-change'];
    const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    
    if (randomType === 'path-shape') {
      // Hình tam giác chạy đường nào?
      const targetPath = displayData.paths[Math.floor(Math.random() * displayData.paths.length)];
      const pathLabels: Record<'straight' | 'curve' | 'zigzag', string> = {
        straight: 'Thẳng',
        curve: 'Cong',
        zigzag: 'Zigzag',
      };
      const correctPath = pathLabels[targetPath.path];
      const options = ['Thẳng', 'Cong', 'Zigzag'].filter(p => p !== correctPath);
      options.push(correctPath);
      questionData.correctAnswer = correctPath;
      questionData.options = options.sort(() => Math.random() - 0.5);
      questionData.questionText = `Hình ${SHAPES.find(s => s === targetPath.shape)} chạy đường nào?`;
      return questionData;
    } else {
      // Hình nào đổi hướng? (zigzag đổi hướng)
      const zigzagShape = displayData.paths.find(p => p.path === 'zigzag');
      if (zigzagShape) {
        const options = displayData.paths.map(p => p.shape);
        questionData.correctAnswer = zigzagShape.shape;
        questionData.options = options.sort(() => Math.random() - 0.5);
        questionData.questionText = 'Hình nào đổi hướng?';
        return questionData;
      }
    }
  }
  
  // 11. Stroop Hard
  if (stageType === 'stroop-hard' && displayData.texts) {
    // Chữ thay đổi màu 2 lần là chữ nào?
    // position được dùng để lưu số lần đổi màu (tạm thời)
    const textWith2Changes = displayData.texts.find(t => t.position === 2);
    if (textWith2Changes) {
      const options = displayData.texts.map(t => t.text).sort(() => Math.random() - 0.5);
      questionData.correctAnswer = textWith2Changes.text;
      questionData.options = options;
      questionData.questionText = 'Chữ thay đổi màu 2 lần là chữ nào?';
      return questionData;
    }
  }
  
  // 12. Wrong Color Mix
  if (stageType === 'wrong-color-mix' && displayData.shapes && displayData.colorGroup) {
    // Màu nào không thuộc nhóm?
    const warmColors: Color[] = ['red', 'orange', 'yellow', 'pink'];
    const coolColors: Color[] = ['blue', 'green', 'purple'];
    const groupColors = displayData.colorGroup === 'warm' ? warmColors : coolColors;
    
    const wrongColor = displayData.shapes.find(s => !groupColors.includes(s.color));
    if (wrongColor) {
      const options = generateColorOptions(wrongColor.color, stageConfig.numOptions);
      questionData.correctAnswer = wrongColor.color;
      questionData.options = options;
      questionData.questionText = 'Màu nào không thuộc nhóm?';
      return questionData;
    }
  }
  
  return questionData;
}

function generateColorOptions(correctColor: Color, count: number, excludeColors: Color[] = []): Color[] {
  const options = [correctColor];
  const allColors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black'];
  const excludeSet = new Set([correctColor, ...excludeColors]);
  const availableColors = allColors.filter(c => !excludeSet.has(c));
  
  // Đảm bảo không trùng lặp trong options
  const usedColors = new Set([correctColor]);
  const shuffled = [...availableColors].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < count - 1 && i < shuffled.length; i++) {
    if (!usedColors.has(shuffled[i])) {
      options.push(shuffled[i]);
      usedColors.add(shuffled[i]);
    }
  }
  
  // Nếu chưa đủ, lấy thêm từ các màu còn lại
  while (options.length < count && availableColors.length > 0) {
    const remaining = availableColors.filter(c => !usedColors.has(c));
    if (remaining.length === 0) break;
    const randomColor = remaining[Math.floor(Math.random() * remaining.length)];
    options.push(randomColor);
    usedColors.add(randomColor);
  }
  
  return options.sort(() => Math.random() - 0.5);
}

function generateShapeOptions(correctShape: Shape, count: number, excludeShapes: Shape[] = []): Shape[] {
  const options = [correctShape];
  const excludeSet = new Set([correctShape, ...excludeShapes]);
  const availableShapes = SHAPES.filter(s => !excludeSet.has(s));
  
  // Đảm bảo không trùng lặp trong options
  const usedShapes = new Set([correctShape]);
  const shuffled = [...availableShapes].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < count - 1 && i < shuffled.length; i++) {
    if (!usedShapes.has(shuffled[i])) {
      options.push(shuffled[i]);
      usedShapes.add(shuffled[i]);
    }
  }
  
  // Nếu chưa đủ, lấy thêm từ các hình còn lại
  while (options.length < count && availableShapes.length > 0) {
    const remaining = availableShapes.filter(s => !usedShapes.has(s));
    if (remaining.length === 0) break;
    const randomShape = remaining[Math.floor(Math.random() * remaining.length)];
    options.push(randomShape);
    usedShapes.add(randomShape);
  }
  
  return options.sort(() => Math.random() - 0.5);
}

