import { Student, StudentAnalytics, Insight } from '../models/student.model';
import { calculateLinearTrend, getAverageScore, getRecentDrop } from './trend.service';
import { calculateRiskScore } from './risk.service';

export function enrichStudentData(student: Student, classAverage: number = 300): StudentAnalytics {
  const { trendValue, direction } = calculateLinearTrend(student.examResults);
  const averageScore = getAverageScore(student.examResults);
  const riskScore = calculateRiskScore(student.examResults, classAverage);
  
  const insights: Insight[] = [];
  
  if (direction === 'down') {
    insights.push({ message: `Son sınavlarda ortalama ${Math.abs(trendValue).toFixed(1)} puanlık düşüş trendi var.`, type: 'danger' });
  } else if (direction === 'up') {
    insights.push({ message: `Öğrenci başarısında istikrarlı bir yükseliş sergiliyor.`, type: 'positive' });
  }

  // Son 3 sınavda düşüş var mı? (Eğer >= 3 sınav varsa)
  if (student.examResults.length >= 3) {
    const sortedDates = [...student.examResults].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const last3 = sortedDates.slice(-3);
    if (last3[0].score > last3[1].score && last3[1].score > last3[2].score) {
      insights.push({ message: "Son 3 sınavda sürekli düşüş yaşandı.", type: 'danger' });
    } else if (last3[0].score < last3[1].score && last3[1].score < last3[2].score) {
      insights.push({ message: "Son 3 sınavda sürekli bir artış gözlemleniyor.", type: 'positive' });
    }
  }

  const drop = getRecentDrop(student.examResults, 2);
  if (drop > 20) {
    insights.push({ message: `Son sınavda bir önceki sınava göre ani puan düşüşü (${drop.toFixed(1)} puan).`, type: 'danger' });
  } else if (drop < -20) {
    insights.push({ message: `Son sınavda bir önceki sınava göre dikkate değer bir puan artışı (${Math.abs(drop).toFixed(1)} puan).`, type: 'positive' });
  }

  if (averageScore < classAverage * 0.8) {
    insights.push({ message: "Genel ortalamanın önemli ölçüde altında performans.", type: 'warning' });
  } else if (averageScore > classAverage * 1.2) {
    insights.push({ message: "Genel ortalamanın çok üstünde üstün başarı.", type: 'positive' });
  }

  const sorted = [...student.examResults].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latest = sorted[0];

  if (latest && latest.mathScore !== undefined && latest.mathScore < 10) {
    insights.push({ message: "Son sınav matematik neti kritik seviyede (<10).", type: 'danger' });
  } else if (latest && latest.mathScore !== undefined && latest.mathScore > 35) {
    insights.push({ message: "Son sınav matematikte mükemmele yakın performans.", type: 'positive' });
  }

  return {
    ...student,
    averageScore,
    trend: direction,
    trendValue,
    riskScore,
    insights
  };
}

export function synthesizeDashboardAnalytics(students: StudentAnalytics[]) {
  const totalStudents = students.length;
  const avgScoreAll = students.reduce((sum, s) => sum + s.averageScore, 0) / (totalStudents || 1);
  const atRiskStudents = students.filter(s => s.riskScore >= 50);
  const topImprovers = [...students].sort((a, b) => b.trendValue - a.trendValue).slice(0, 5);

  return {
    totalStudents,
    avgScoreAll,
    atRiskStudents: atRiskStudents.length,
    highRiskStudentsList: atRiskStudents.sort((a, b) => b.riskScore - a.riskScore).slice(0, 5),
    topImprovers
  };
}
