import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMemo, useState } from 'react';
import { StudentAnalytics } from "@/domain/models/student.model";

export function TrendChart({ students }: { students: StudentAnalytics[] }) {
  const [selectedClass, setSelectedClass] = useState<string>("Tümü");

  const classes = useMemo(() => {
    const classSet = new Set<string>();
    students.forEach(s => {
      if (s.className) classSet.add(s.className);
    });
    return ["Tümü", ...Array.from(classSet).sort()];
  }, [students]);

  const chartData = useMemo(() => {
    const filteredStudents = selectedClass === "Tümü" 
      ? students 
      : students.filter(s => s.className === selectedClass);

    const dateMap = new Map<string, { total: number, count: number }>();
    
    filteredStudents.forEach(s => {
      s.examResults.forEach(r => {
        const existing = dateMap.get(r.examName) || { total: 0, count: 0 };
        dateMap.set(r.examName, {
          total: existing.total + r.score,
          count: existing.count + 1
        });
      });
    });

    const data = Array.from(dateMap.entries()).map(([examName, stats]) => ({
      name: examName,
      Ortalama: Math.round(stats.total / stats.count)
    }));
    
    return data;
  }, [students, selectedClass]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle>Sınıf Genel Performans Trendi</CardTitle>
        <select 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
          className="text-sm border border-border rounded-md bg-surface px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer font-medium"
        >
          {classes.map(c => (
            <option key={c} value={c}>{c === "Tümü" ? "Tüm Sınıflar" : `${c} Sınıfı`}</option>
          ))}
        </select>
      </CardHeader>
      <CardContent>
        <div className="w-full mt-4 min-w-0">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOrtalama" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dx={-10} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}
              />
              <Area 
                type="monotone" 
                dataKey="Ortalama" 
                stroke="#4F46E5" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorOrtalama)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
