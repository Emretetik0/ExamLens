import { Card, CardContent } from "@/shared/components/ui/Card";
import { Users, AlertTriangle, TrendingUp, Activity } from "lucide-react";
import Link from 'next/link';

export function KPICards({ analytics }: { analytics: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-primary/10 text-primary rounded-full">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/60">Toplam Öğrenci</p>
            <h3 className="text-2xl font-bold">{analytics.totalStudents}</h3>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 flex items-center space-x-4">
          <div className="p-3 bg-info/10 text-info rounded-full">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground/60">Genel Ortalama</p>
            <h3 className="text-2xl font-bold">{analytics.avgScoreAll.toFixed(1)}</h3>
          </div>
        </CardContent>
      </Card>

      <Link href="/students" className="block focus:outline-none">
        <Card className="h-full hover:border-danger/40 hover:bg-danger/5 transition-all cursor-pointer">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-danger/10 text-danger rounded-full">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/60">Riskli Öğrenci</p>
              <h3 className="text-2xl font-bold">{analytics.atRiskStudents}</h3>
            </div>
          </CardContent>
        </Card>
      </Link>

      {analytics.topImprovers[0] ? (
        <Link href={`/students/${analytics.topImprovers[0].id}`} className="block focus:outline-none">
          <Card className="h-full hover:border-success/40 hover:bg-success/5 transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="p-3 bg-success/10 text-success rounded-full">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="flex-1 w-0">
                <p className="text-sm font-medium text-foreground/60">En Çok Gelişen</p>
                <h3 className="text-2xl font-bold truncate">
                  {analytics.topImprovers[0].name}
                </h3>
              </div>
            </CardContent>
          </Card>
        </Link>
      ) : (
        <Card className="h-full">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-success/10 text-success rounded-full">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="flex-1 w-0">
              <p className="text-sm font-medium text-foreground/60">En Çok Gelişen</p>
              <h3 className="text-2xl font-bold truncate">-</h3>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
