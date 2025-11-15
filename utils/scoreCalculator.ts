// Tính điểm dựa trên tốc độ trả lời
// Trả lời càng nhanh, điểm càng cao

export function calculateSpeedScore(responseTime: number, maxTime: number = 10000): number {
  // maxTime: thời gian tối đa để đạt điểm (ms)
  // responseTime: thời gian người chơi trả lời (ms)
  
  if (responseTime <= 0) return 1000; // Trả lời ngay lập tức = điểm tối đa
  if (responseTime >= maxTime) return 100; // Trả lời quá chậm = điểm tối thiểu
  
  // Tính điểm: từ 1000 (nhanh nhất) xuống 100 (chậm nhất)
  // Công thức: điểm = 1000 - (responseTime / maxTime) * 900
  const score = Math.max(100, Math.round(1000 - (responseTime / maxTime) * 900));
  
  return score;
}

export function formatScore(score: number): string {
  return score.toLocaleString('vi-VN');
}

