import { Student } from '@/domain/models/student.model';

export function generateMockStudents(): Student[] {
  const baseDate = new Date('2023-09-01T10:00:00Z').getTime();
  const getD = (offsetDays: number) => new Date(baseDate + offsetDays * 86400000).toISOString();

  return [
    // 12-A Sınıfı (Genellikle Yüksek Başarı)
    {
      id: "s1", studentNumber: "101", name: "Ahmet Yılmaz", className: "12-A",
      examResults: [
        { id: "e1", date: getD(15), examName: "Deneme 1", score: 400, mathScore: 30, scienceScore: 30, turkishScore: 35, socialScore: 25 },
        { id: "e2", date: getD(45), examName: "Deneme 2", score: 410, mathScore: 32, scienceScore: 30, turkishScore: 34, socialScore: 26 },
        { id: "e3", date: getD(75), examName: "Deneme 3", score: 405, mathScore: 31, scienceScore: 29, turkishScore: 35, socialScore: 24 },
        { id: "e4", date: getD(105), examName: "Deneme 4", score: 420, mathScore: 34, scienceScore: 32, turkishScore: 36, socialScore: 26 },
      ]
    },
    {
      id: "s2", studentNumber: "102", name: "Ayşe Kaya", className: "12-A",
      examResults: [
        { id: "e1", date: getD(15), examName: "Deneme 1", score: 380, mathScore: 25, scienceScore: 28, turkishScore: 33, socialScore: 20 },
        { id: "e2", date: getD(45), examName: "Deneme 2", score: 390, mathScore: 28, scienceScore: 28, turkishScore: 35, socialScore: 22 },
        { id: "e3", date: getD(75), examName: "Deneme 3", score: 350, mathScore: 18, scienceScore: 25, turkishScore: 30, socialScore: 20 },
        { id: "e4", date: getD(105), examName: "Deneme 4", score: 300, mathScore: 8, scienceScore: 20, turkishScore: 28, socialScore: 18 },
      ]
    }, // Keskin düşüş (Risk)
    {
      id: "s3", studentNumber: "103", name: "Burak Demir", className: "12-A",
      examResults: [
        { id: "e1", date: getD(15), examName: "Deneme 1", score: 450, mathScore: 38, scienceScore: 36, turkishScore: 38, socialScore: 30 },
        { id: "e2", date: getD(45), examName: "Deneme 2", score: 455, mathScore: 39, scienceScore: 37, turkishScore: 39, socialScore: 31 },
        { id: "e3", date: getD(75), examName: "Deneme 3", score: 440, mathScore: 37, scienceScore: 35, turkishScore: 36, socialScore: 29 },
        { id: "e4", date: getD(105), examName: "Deneme 4", score: 460, mathScore: 40, scienceScore: 38, turkishScore: 39, socialScore: 32 },
      ]
    }, 
    {
      id: "s4", studentNumber: "104", name: "Ceyda Çelik", className: "12-A",
      examResults: [
        { id: "e1", date: getD(15), examName: "Deneme 1", score: 320, mathScore: 15, scienceScore: 15, turkishScore: 30, socialScore: 25 },
        { id: "e2", date: getD(45), examName: "Deneme 2", score: 340, mathScore: 18, scienceScore: 18, turkishScore: 32, socialScore: 26 },
        { id: "e3", date: getD(75), examName: "Deneme 3", score: 360, mathScore: 22, scienceScore: 20, turkishScore: 33, socialScore: 28 },
        { id: "e4", date: getD(105), examName: "Deneme 4", score: 395, mathScore: 26, scienceScore: 25, turkishScore: 35, socialScore: 30 },
      ]
    }, // Sürekli artış (Top improver)
    {
      id: "s5", studentNumber: "105", name: "Deniz Arslan", className: "12-A",
      examResults: [
        { id: "e1", date: getD(15), examName: "Deneme 1", score: 310, mathScore: 12, scienceScore: 20, turkishScore: 25, socialScore: 20 },
        { id: "e2", date: getD(45), examName: "Deneme 2", score: 305, mathScore: 10, scienceScore: 18, turkishScore: 24, socialScore: 18 },
        { id: "e3", date: getD(75), examName: "Deneme 3", score: 290, mathScore: 8, scienceScore: 15, turkishScore: 23, socialScore: 15 },
        { id: "e4", date: getD(105), examName: "Deneme 4", score: 260, mathScore: 4, scienceScore: 10, turkishScore: 20, socialScore: 14 },
      ]
    }, // Düşüş eğilimi

    // 12-B Sınıfı (Karışık - Ortalama altı)
    {
      id: "s6", studentNumber: "201", name: "Efe Polat", className: "12-B",
      examResults: [
        { id: "e1", date: getD(15), examName: "Deneme 1", score: 280, mathScore: 10, scienceScore: 10, turkishScore: 25, socialScore: 20 },
        { id: "e2", date: getD(45), examName: "Deneme 2", score: 285, mathScore: 12, scienceScore: 12, turkishScore: 24, socialScore: 21 },
        { id: "e3", date: getD(75), examName: "Deneme 3", score: 270, mathScore: 9, scienceScore: 10, turkishScore: 20, socialScore: 18 },
        { id: "e4", date: getD(105), examName: "Deneme 4", score: 265, mathScore: 7, scienceScore: 8, turkishScore: 19, socialScore: 16 },
      ]
    }, 
    {
      id: "s7", studentNumber: "202", name: "Faruk Yıldız", className: "12-B",
      examResults: [
        { id: "e1", date: getD(15), examName: "Deneme 1", score: 400, mathScore: 30, scienceScore: 25, turkishScore: 35, socialScore: 20 },
        { id: "e2", date: getD(45), examName: "Deneme 2", score: 410, mathScore: 32, scienceScore: 28, turkishScore: 35, socialScore: 22 },
        { id: "e3", date: getD(75), examName: "Deneme 3", score: 320, mathScore: 15, scienceScore: 15, turkishScore: 25, socialScore: 15 },
        { id: "e4", date: getD(105), examName: "Deneme 4", score: 325, mathScore: 16, scienceScore: 14, turkishScore: 26, socialScore: 14 },
      ]
    }, // Ani düşme ve tutarsızlık
    {
      id: "s8", studentNumber: "203", name: "Gizem Kurt", className: "12-B",
      examResults: [
        { id: "e1", date: getD(15), examName: "Deneme 1", score: 350, mathScore: 20, scienceScore: 20, turkishScore: 30, socialScore: 25 },
        { id: "e2", date: getD(45), examName: "Deneme 2", score: 360, mathScore: 22, scienceScore: 22, turkishScore: 31, socialScore: 26 },
        { id: "e3", date: getD(75), examName: "Deneme 3", score: 365, mathScore: 24, scienceScore: 21, turkishScore: 32, socialScore: 27 },
        { id: "e4", date: getD(105), examName: "Deneme 4", score: 375, mathScore: 25, scienceScore: 24, turkishScore: 34, socialScore: 28 },
      ]
    }, 
    {
      id: "s9", studentNumber: "204", name: "Hakan Koç", className: "12-B",
      examResults: [
        { id: "e1", date: getD(15), examName: "Deneme 1", score: 250, mathScore: 4, scienceScore: 5, turkishScore: 18, socialScore: 15 },
        { id: "e2", date: getD(45), examName: "Deneme 2", score: 260, mathScore: 6, scienceScore: 6, turkishScore: 20, socialScore: 16 },
        { id: "e3", date: getD(75), examName: "Deneme 3", score: 255, mathScore: 5, scienceScore: 5, turkishScore: 19, socialScore: 15 },
        { id: "e4", date: getD(105), examName: "Deneme 4", score: 240, mathScore: 3, scienceScore: 4, turkishScore: 15, socialScore: 12 },
      ]
    }, 
    
    // 12-C Sınıfı
    {
      id: "s10", studentNumber: "301", name: "Irmak Şahin", className: "12-C",
      examResults: [
        { id: "e1", date: getD(15), examName: "Deneme 1", score: 380, mathScore: 25, scienceScore: 20, turkishScore: 35, socialScore: 30 },
        { id: "e2", date: getD(45), examName: "Deneme 2", score: 375, mathScore: 24, scienceScore: 19, turkishScore: 34, socialScore: 29 },
        { id: "e3", date: getD(75), examName: "Deneme 3", score: 385, mathScore: 26, scienceScore: 22, turkishScore: 36, socialScore: 31 },
        { id: "e4", date: getD(105), examName: "Deneme 4", score: 380, mathScore: 25, scienceScore: 20, turkishScore: 35, socialScore: 30 },
      ]
    },
    {
      id: "s11", studentNumber: "302", name: "Rüzgar Eser", className: "12-C",
      examResults: [
        { id: "e1", date: getD(15), examName: "Deneme 1", score: 200, mathScore: 1, scienceScore: 2, turkishScore: 15, socialScore: 10 },
        { id: "e2", date: getD(45), examName: "Deneme 2", score: 215, mathScore: 3, scienceScore: 5, turkishScore: 18, socialScore: 12 },
        { id: "e3", date: getD(75), examName: "Deneme 3", score: 225, mathScore: 5, scienceScore: 7, turkishScore: 19, socialScore: 14 },
        { id: "e4", date: getD(105), examName: "Deneme 4", score: 240, mathScore: 8, scienceScore: 10, turkishScore: 22, socialScore: 16 },
      ]
    }
  ];
}
