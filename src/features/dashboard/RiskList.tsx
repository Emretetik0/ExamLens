import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/Card";
import { Badge } from "@/shared/components/ui/Badge";
import { StudentAnalytics } from "@/domain/models/student.model";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export function RiskList({ highRiskStudents }: { highRiskStudents: StudentAnalytics[] }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className=" flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-danger" />
          Kritik Durumdaki Öğrenciler
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {highRiskStudents.length === 0 ? (
            <p className="text-sm text-foreground/50 text-center py-8">Kritik seviyede öğrenci bulunmuyor.</p>
          ) : (
            highRiskStudents.map(student => (
              <Link href={`/students/${student.id}`} key={student.id} className="block group">
                <div className="p-3 rounded-lg border border-border group-hover:border-danger/30 group-hover:bg-danger/5 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-sm group-hover:text-danger transition-colors">{student.name}</p>
                      <p className="text-xs text-foreground/60">{student.className} • {student.studentNumber}</p>
                    </div>
                    <Badge variant="danger" className="text-[10px]">
                      Risk: {student.riskScore.toFixed(0)}
                    </Badge>
                  </div>
                  {student.insights[0] && (
                    <p className="text-xs text-danger/80 line-clamp-2">
                      {student.insights[0].message}
                    </p>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
