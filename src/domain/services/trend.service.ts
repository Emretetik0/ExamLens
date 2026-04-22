import { ExamResult, TrendDirection } from '../models/student.model';

export function calculateLinearTrend(results: ExamResult[]): {
  trendValue: number;
  direction: TrendDirection;
} {
  if (!results || results.length < 2) return { trendValue: 0, direction: 'stable' };

  // Sort by date ascending
  const sorted = [...results].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let totalChange = 0;
  for (let i = 1; i < sorted.length; i++) {
    totalChange += sorted[i].score - sorted[i - 1].score;
  }
  
  const trendValue = totalChange / (sorted.length - 1);
  
  let direction: TrendDirection = 'stable';
  if (trendValue > 2) direction = 'up';
  else if (trendValue < -2) direction = 'down';

  return { trendValue, direction };
}

export function getAverageScore(results: ExamResult[]): number {
  if (!results || results.length === 0) return 0;
  const total = results.reduce((sum, r) => sum + r.score, 0);
  return total / results.length;
}

export function getRecentDrop(results: ExamResult[], examCount: number = 2): number {
  if (!results || results.length < examCount) return 0;
  const sorted = [...results].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const latest = sorted[0].score;
  const previous = sorted[examCount - 1].score;
  
  return previous - latest; // Positive means there was a drop
}
