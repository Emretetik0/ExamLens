import { ExamResult } from '../models/student.model';
import { calculateLinearTrend, getAverageScore, getRecentDrop } from './trend.service';

export function calculateRiskScore(results: ExamResult[], classAverage: number = 300): number {
  if (!results || results.length === 0) return 0;

  const { trendValue } = calculateLinearTrend(results);
  const avg = getAverageScore(results);
  // Ani düşüş kontrolü (son 2 sınav arası)
  const drop = getRecentDrop(results, 2);
  
  const variance = results.reduce((sum, r) => sum + Math.pow(r.score - avg, 2), 0) / results.length;
  const stdDev = Math.sqrt(variance);

  const [latestExam] = [...results].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestMath = latestExam?.mathScore || 0;

  let risk = 0;

  // 1. Düşüş trendi (max 30)
  if (trendValue < -10) risk += 30;
  else if (trendValue < -5) risk += 20;
  else if (trendValue < -2) risk += 10;

  // 2. Düşük ortalama (max 20)
  if (avg < classAverage * 0.8) risk += 20;
  else if (avg < classAverage * 0.9) risk += 10;

  // 3. Ani düşüş (max 25)
  if (drop > 30) risk += 25;
  else if (drop > 15) risk += 15;

  // 4. Matematik zayıflığı (max 15) - Örn: <10 net risk
  if (latestMath < 5) risk += 15;
  else if (latestMath < 10) risk += 5;

  // 5. Performans Tutarsızlığı (max 10)
  if (stdDev > 40) risk += 10;
  else if (stdDev > 20) risk += 5;

  return Math.min(risk, 100);
}
