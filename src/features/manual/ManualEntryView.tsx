"use client";

import { useDataStore } from '@/shared/store/data.store';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { UserPlus, FileEdit } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ManualEntryView() {
  const { students, addStudent, addExamToStudent } = useDataStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'student' | 'exam'>('exam');

  // Student Form State
  const [sName, setSName] = useState('');
  const [sNumber, setSNumber] = useState('');
  const [sClass, setSClass] = useState('');

  // Exam Form State
  const [examStudentId, setExamStudentId] = useState('');
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examScore, setExamScore] = useState('');
  const [examMath, setExamMath] = useState('');
  const [examScience, setExamScience] = useState('');
  const [examTurkish, setExamTurkish] = useState('');
  const [examSocial, setExamSocial] = useState('');

  useEffect(() => {
    setMounted(true);
    if (students.length > 0) {
      setExamStudentId(students[0].id);
    }
  }, [students]);

  if (!mounted) return <div className="animate-pulse h-screen bg-surface/50 rounded-xl" />;

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName || !sNumber || !sClass) return alert('Lütfen tüm zorunlu alanları doldurun.');
    
    const newId = `manual_${Date.now()}`;
    addStudent({
      id: newId,
      name: sName,
      studentNumber: sNumber,
      className: sClass,
      examResults: []
    });
    
    alert(`Öğrenci "${sName}" başarıyla eklendi!`);
    setSName(''); setSNumber(''); setSClass('');
    setActiveTab('exam');
    setExamStudentId(newId);
  };

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examStudentId || !examName || !examDate || !examScore) {
      return alert('Lütfen öğrenciyi, tarih, sınav adı ve genel puan alanlarını doldurun.');
    }

    addExamToStudent(examStudentId, {
      id: `exam_${Date.now()}`,
      examName: examName,
      date: new Date(examDate).toISOString(),
      score: Number(examScore),
      mathScore: examMath ? Number(examMath) : undefined,
      scienceScore: examScience ? Number(examScience) : undefined,
      turkishScore: examTurkish ? Number(examTurkish) : undefined,
      socialScore: examSocial ? Number(examSocial) : undefined,
    });

    alert(`Sınav notu başarıyla eklendi!`);
    // Clear form except student selection
    setExamName(''); setExamScore(''); setExamMath(''); setExamScience(''); setExamTurkish(''); setExamSocial('');
    
    // Yönlendirme opsiyonel:
    if(confirm("Sonucu detaylı görmek için öğrenci profiline gitmek ister misiniz?")) {
      router.push(`/students/${examStudentId}`);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manuel Veri Girişi</h2>
        <p className="text-foreground/70">Toplu Excel dosyası yerine elle tekil öğrenci kaydı oluşturabilir ya da sınav sonucu ekleyebilirsiniz.</p>
      </div>

      <div className="flex bg-surface-hover p-1 rounded-lg w-full max-w-xs ring-1 ring-border">
        <button
          onClick={() => setActiveTab('exam')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'exam' ? 'bg-surface shadow-sm text-primary' : 'text-foreground/70 hover:text-foreground'}`}
        >
          <FileEdit className="inline-block w-4 h-4 mr-2" />
          Sınav Notu Gir
        </button>
        <button
          onClick={() => setActiveTab('student')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'student' ? 'bg-surface shadow-sm text-primary' : 'text-foreground/70 hover:text-foreground'}`}
        >
          <UserPlus className="inline-block w-4 h-4 mr-2" />
          Yeni Öğrenci
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'student' ? 'Sisteme Yeni Öğrenci Ekle' : 'Barkodsuz / Eksik Sınav Notu Ekle'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === 'student' && (
            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ad Soyad</label>
                  <input type="text" value={sName} onChange={e => setSName(e.target.value)} required className="w-full border rounded-md px-3 py-2 bg-surface" placeholder="Örn: Veli Yılmaz" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Öğrenci No</label>
                  <input type="text" value={sNumber} onChange={e => setSNumber(e.target.value)} required className="w-full border rounded-md px-3 py-2 bg-surface" placeholder="Örn: 9812" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Sınıf</label>
                  <input type="text" value={sClass} onChange={e => setSClass(e.target.value)} required className="w-full border rounded-md px-3 py-2 bg-surface" placeholder="Örn: 11-B" />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4">Öğrenciyi Kaydet</Button>
            </form>
          )}

          {activeTab === 'exam' && (
            <form onSubmit={handleAddExam} className="space-y-4">
              {students.length === 0 ? (
                <div className="p-4 bg-warning/10 text-warning rounded-lg text-sm">
                  Önce sisteme en az bir öğrenci eklemelisiniz.
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Sınavı Eklenecek Öğrenci</label>
                      <select value={examStudentId} onChange={e => setExamStudentId(e.target.value)} className="w-full border rounded-md px-3 py-2 bg-surface">
                        {students.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.className} - {s.studentNumber})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sınav Adı</label>
                      <input type="text" value={examName} onChange={e => setExamName(e.target.value)} required className="w-full border rounded-md px-3 py-2 bg-surface" placeholder="Örn: 3. Deneme Sınavı" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sınav Tarihi</label>
                      <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} required className="w-full border rounded-md px-3 py-2 bg-surface color-scheme-light dark:color-scheme-dark" />
                    </div>

                    <div className="space-y-2 md:col-span-2 pt-4 border-t border-border">
                      <h4 className="font-semibold text-primary mb-2">Netler & Puan</h4>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Genel Toplam Puan <span className="text-danger">*</span></label>
                      <input type="number" step="0.01" value={examScore} onChange={e => setExamScore(e.target.value)} required className="w-full border rounded-md px-3 py-2 bg-surface" placeholder="Örn: 412.5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Matematik Neti</label>
                      <input type="number" step="0.25" value={examMath} onChange={e => setExamMath(e.target.value)} className="w-full border rounded-md px-3 py-2 bg-surface" placeholder="Örn: 32" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Fen Bilimleri Neti</label>
                      <input type="number" step="0.25" value={examScience} onChange={e => setExamScience(e.target.value)} className="w-full border rounded-md px-3 py-2 bg-surface" placeholder="Örn: 18.5" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Türkçe Neti</label>
                      <input type="number" step="0.25" value={examTurkish} onChange={e => setExamTurkish(e.target.value)} className="w-full border rounded-md px-3 py-2 bg-surface" placeholder="Örn: 38" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-4 bg-success hover:bg-success/90">Sınav Sonucunu Veritabanına Yaz</Button>
                </>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
