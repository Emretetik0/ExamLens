"use client";

import { useDataStore } from '@/shared/store/data.store';
import { enrichStudentData } from '@/domain/services/analytics.service';
import { useMemo, useState, useEffect } from 'react';
import { Card, CardContent } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Search, Download, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { utils, writeFile } from 'xlsx';

export function StudentsView() {
  const students = useDataStore(state => state.students);
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearch = searchParams.get('search') || '';
  
  const [search, setSearch] = useState(initialSearch);
  const [sortKey, setSortKey] = useState<string>('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder(key === 'name' || key === 'className' ? 'asc' : 'desc');
    }
  };

  const enrichedStudents = useMemo(() => {
    return students.map(s => enrichStudentData(s, 300))
      .filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) || 
        s.studentNumber.includes(search)
      )
      .sort((a,b) => {
        let valA = a[sortKey as keyof typeof a] as any;
        let valB = b[sortKey as keyof typeof b] as any;
        
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        return 0;
      });
  }, [students, search, sortKey, sortOrder]);

  const exportToExcel = () => {
    const data = enrichedStudents.map(s => ({
      "Öğrenci No": s.studentNumber,
      "Ad Soyad": s.name,
      "Sınıf": s.className,
      "Genel Ortalama": Number(s.averageScore.toFixed(1)),
      "Risk Puanı": Number(s.riskScore.toFixed(0)),
      "Trend Durumu": s.trend === 'up' ? 'Yükseliş' : s.trend === 'down' ? 'Düşüş' : 'Sabit'
    }));
    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Ögrenci_Raporu");
    writeFile(workbook, "Ogrenci_Performans_Raporu.xlsx");
  };

  if (!mounted) return <div className="animate-pulse h-screen bg-surface/50 rounded-xl" />;

  const renderSortIcon = (key: string) => {
    if (sortKey !== key) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-20 group-hover:opacity-100 transition-opacity" />;
    return sortOrder === 'asc' ? <ChevronUp className="w-4 h-4 ml-1 text-primary" /> : <ChevronDown className="w-4 h-4 ml-1 text-primary" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Öğrenciler</h2>
          <p className="text-foreground/70">Tüm öğrencilerin analizlerini ve risk durumlarını listeleyin.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-72 border border-border rounded-lg bg-surface focus-within:ring-2 focus-within:ring-primary/50 overflow-hidden">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
               <Search className="h-4 w-4 text-foreground/50" />
            </div>
            <input 
              type="text" 
              placeholder="İsim veya numara ile ara..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-transparent focus:outline-none"
            />
          </div>
          <Button variant="outline" onClick={exportToExcel} className="font-medium gap-2">
            <Download className="w-4 h-4" /> Excel Olarak İndir
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-foreground/60 uppercase bg-surface-hover border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold cursor-pointer group select-none transition-colors hover:text-foreground" onClick={() => handleSort('name')}>
                  <div className="flex items-center">Öğrenci {renderSortIcon('name')}</div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer group select-none transition-colors hover:text-foreground" onClick={() => handleSort('className')}>
                  <div className="flex items-center justify-center">Sınıf {renderSortIcon('className')}</div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer group select-none transition-colors hover:text-foreground" onClick={() => handleSort('averageScore')}>
                  <div className="flex items-center justify-center">Ortalama {renderSortIcon('averageScore')}</div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer group select-none transition-colors hover:text-foreground" onClick={() => handleSort('riskScore')}>
                  <div className="flex items-center justify-center">Risk Durumu {renderSortIcon('riskScore')}</div>
                </th>
                <th className="px-6 py-4 font-semibold cursor-pointer group select-none transition-colors hover:text-foreground" onClick={() => handleSort('trendValue')}>
                  <div className="flex items-center justify-center">Trend {renderSortIcon('trendValue')}</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {enrichedStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-foreground/50">
                    Öğrenci bulunamadı.
                  </td>
                </tr>
              ) : (
                enrichedStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    onClick={() => router.push(`/students/${student.id}`)}
                    className="hover:bg-surface-hover/80 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground group-hover:text-primary transition-colors">{student.name}</div>
                      <div className="text-foreground/60 text-xs">No: {student.studentNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-center">{student.className}</td>
                    <td className="px-6 py-4 text-center font-medium">{student.averageScore.toFixed(1)}</td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={student.riskScore > 50 ? 'danger' : student.riskScore > 20 ? 'warning' : 'success'}>
                        {student.riskScore > 50 ? 'Yüksek' : student.riskScore > 20 ? 'Orta' : 'Düşük'} ({student.riskScore.toFixed(0)})
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={student.trend === 'up' ? 'success' : student.trend === 'down' ? 'danger' : 'info'}>
                        {student.trend === 'up' ? 'Yükseliş' : student.trend === 'down' ? 'Düşüş' : 'Sabit'}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
