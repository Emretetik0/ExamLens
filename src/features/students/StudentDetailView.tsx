"use client";

import { useDataStore } from '@/shared/store/data.store';
import { enrichStudentData } from '@/domain/services/analytics.service';
import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, User, AlertTriangle, TrendingUp, TrendingDown, BookOpen, CheckCircle, Info, Printer } from 'lucide-react';
import Link from 'next/link';

export function StudentDetailView({ id }: { id: string }) {
  const students = useDataStore(state => state.students);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const studentData = useMemo(() => {
    const s = students.find(x => x.id === id || x.studentNumber === id);
    if (!s) return null;
    return enrichStudentData(s, 300);
  }, [students, id]);

  const handlePrint = () => {
    window.print();
  };

  if (!mounted) return <div className="animate-pulse h-screen bg-surface/50 rounded-xl" />;

  if (!studentData) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-bold mb-4">Öğrenci Bulunamadı</h2>
        <Link href="/students">
          <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Listeye Dön</Button>
        </Link>
      </div>
    );
  }

  const sortedExams = [...studentData.examResults].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestExam = sortedExams[sortedExams.length - 1];

  return (
    <div className="space-y-6 print-container">
      <div className="flex items-center justify-between no-print mb-2">
        <div className="flex items-center gap-4">
          <Link href="/students">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              {studentData.name}
              <Badge variant={studentData.riskScore > 50 ? 'danger' : studentData.riskScore > 20 ? 'warning' : 'success'}>
                Risk: {studentData.riskScore.toFixed(0)}
              </Badge>
            </h2>
            <p className="text-foreground/70">No: {studentData.studentNumber} • Sınıf: {studentData.className}</p>
          </div>
        </div>
        <Button onClick={handlePrint} variant="outline" className="gap-2">
          <Printer className="w-4 h-4" /> Rapor Al / Yazdır
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-primary/10 text-primary rounded-full">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/60">Genel Ortalama</p>
              <h3 className="text-2xl font-bold">{studentData.averageScore.toFixed(1)}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${studentData.trend === 'up' ? 'bg-success/10 text-success' : studentData.trend === 'down' ? 'bg-danger/10 text-danger' : 'bg-info/10 text-info'}`}>
              {studentData.trend === 'up' ? <TrendingUp className="h-6 w-6" /> : studentData.trend === 'down' ? <TrendingDown className="h-6 w-6" /> : <TrendingUp className="h-6 w-6 transform rotate-45" />}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/60">Trend Eğilimi</p>
              <h3 className="text-lg font-bold">{studentData.trendValue > 0 ? '+' : ''}{studentData.trendValue.toFixed(1)} P/Sınav</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-warning/10 text-warning rounded-full">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/60">Son Sınav (Genel)</p>
              <h3 className="text-2xl font-bold">{latestExam?.score || '-'}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-danger/10 text-danger rounded-full">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/60">Son Sınav (Matematik)</p>
              <h3 className="text-2xl font-bold">{latestExam?.mathScore || '-'} Net</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Sınav Performans Grafiği</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="w-full h-[300px] mt-4 min-w-0">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={sortedExams} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorOgrenci" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="examName" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dx={-10} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--surface)', color: 'var(--foreground)' }} />
                      <Area type="monotone" dataKey="score" name="Genel Puan" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorOgrenci)" />
                      <Area type="monotone" dataKey="mathScore" name="Matematik Neti" stroke="#F59E0B" strokeWidth={2} fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full border-danger/20">
            <CardHeader>
              <CardTitle className="text-danger flex items-center gap-2">
                 <AlertTriangle className="w-5 h-5" />
                 Sistem İçgörüleri & Riskler
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {studentData.insights.length === 0 ? (
                    <p className="text-sm text-foreground/50 text-center py-4">Öğrenci için özel bir tespit bulunmuyor. Performansı istikrarlı gözüküyor.</p>
                  ) : (
                    studentData.insights.map((insight, idx) => {
                      const isPos = insight.type === 'positive';
                      const isWarn = insight.type === 'warning';
                      const colorClass = isPos ? 'text-success border-success/20 bg-success/5' : isWarn ? 'text-warning border-warning/20 bg-warning/5' : 'text-danger border-danger/10 bg-danger/5';
                      const Icon = isPos ? CheckCircle : isWarn ? Info : AlertTriangle;
                      
                      return (
                        <div key={idx} className={`p-3 border rounded-lg flex items-start gap-3 shadow-sm ${colorClass}`}>
                          <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isPos ? 'text-success' : isWarn ? 'text-warning' : 'text-danger'}`} />
                          <p className={`text-sm font-medium ${isPos ? 'text-success/90' : isWarn ? 'text-warning/90' : 'text-danger/90'}`}>{insight.message}</p>
                        </div>
                      )
                    })
                  )}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sınav Geçmişi Listesi</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-foreground/60 uppercase bg-surface-hover border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Tarih</th>
                <th className="px-6 py-4 font-semibold">Sınav Adı</th>
                <th className="px-6 py-4 font-semibold text-center">Genel Puan</th>
                <th className="px-6 py-4 font-semibold text-center">Matematik</th>
                <th className="px-6 py-4 font-semibold text-center">Fen Bilimleri</th>
                <th className="px-6 py-4 font-semibold text-center">Türkçe</th>
                <th className="px-6 py-4 font-semibold text-center">Sosyal B.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedExams.reverse().map((result) => (
                <tr key={result.id} className="hover:bg-surface-hover/50 transition-colors">
                  <td className="px-6 py-4">{new Date(result.date).toLocaleDateString('tr-TR')}</td>
                  <td className="px-6 py-4 font-medium">{result.examName}</td>
                  <td className="px-6 py-4 text-center font-bold text-primary">{result.score}</td>
                  <td className="px-6 py-4 text-center text-foreground/80">{result.mathScore ?? '-'}</td>
                  <td className="px-6 py-4 text-center text-foreground/80">{result.scienceScore ?? '-'}</td>
                  <td className="px-6 py-4 text-center text-foreground/80">{result.turkishScore ?? '-'}</td>
                  <td className="px-6 py-4 text-center text-foreground/80">{result.socialScore ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
