"use client";

import { useDataStore } from '@/shared/store/data.store';
import { enrichStudentData, synthesizeDashboardAnalytics } from '@/domain/services/analytics.service';
import { useMemo, useState, useEffect } from 'react';
import { KPICards } from './KPICards';
import { TrendChart } from './TrendChart';
import { RiskList } from './RiskList';

export function Dashboard() {
  const students = useDataStore((state) => state.students);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { enrichedStudents, analytics } = useMemo(() => {
    const enriched = students.map(s => enrichStudentData(s, 300));
    return {
      enrichedStudents: enriched,
      analytics: synthesizeDashboardAnalytics(enriched)
    };
  }, [students]);

  if (!mounted) return <div className="animate-pulse h-full bg-surface/50 rounded-xl min-h-[500px]" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Performans Özeti</h2>
        <p className="text-foreground/70">Öğrencilerinizin genel durumunu ve kritik riskleri buradan takip edebilirsiniz.</p>
      </div>

      <KPICards analytics={analytics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChart students={enrichedStudents} />
        </div>
        <div className="lg:col-span-1">
          <RiskList highRiskStudents={analytics.highRiskStudentsList} />
        </div>
      </div>
    </div>
  );
}
