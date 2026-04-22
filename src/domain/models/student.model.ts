import { z } from 'zod';

export const ExamResultSchema = z.object({
  id: z.string(),
  date: z.string(), // ISO date string
  examName: z.string(),
  score: z.number(), // Genel/Toplam Puan
  mathScore: z.number().optional(),
  scienceScore: z.number().optional(),
  turkishScore: z.number().optional(),
  socialScore: z.number().optional(),
});

export const StudentSchema = z.object({
  id: z.string(),
  studentNumber: z.string(),
  name: z.string(),
  className: z.string(),
  examResults: z.array(ExamResultSchema),
});

export type ExamResult = z.infer<typeof ExamResultSchema>;
export type Student = z.infer<typeof StudentSchema>;

export type TrendDirection = 'up' | 'down' | 'stable';

export interface Insight {
  message: string;
  type: 'positive' | 'warning' | 'danger';
}

export interface StudentAnalytics extends Student {
  averageScore: number;
  trend: TrendDirection;
  trendValue: number; // Eğilim katsayısı (pozitif: artış, negatif: düşüş)
  riskScore: number; // 0-100 arası risk puanı (yüksek olan risklidir)
  insights: Insight[];
}
