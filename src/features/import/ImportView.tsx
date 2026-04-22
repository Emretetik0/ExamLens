"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as xlsx from "xlsx";
import { Card, CardContent } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { UploadCloud, FileSpreadsheet, CheckCircle, AlertTriangle } from "lucide-react";
import { useDataStore } from "@/shared/store/data.store";
import { Student } from "@/domain/models/student.model";
import { useRouter } from "next/navigation";

export function ImportView() {
  const [loading, setLoading] = useState(false);
  const importStudents = useDataStore((state) => state.importStudents);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setSuccess(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = xlsx.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json<any>(sheet);

        const imported: Student[] = jsonData.map((row: any, i: number) => ({
          id: `imp-${Date.now()}-${i}`,
          studentNumber: row.OgrenciNo?.toString() || `UNKNOWN-${i}`,
          name: row.AdSoyad || `Öğrenci ${i}`,
          className: row.Sinif || "Tanımsız",
          examResults: [
            {
              id: `ex-${Date.now()}-${i}`,
              date: new Date().toISOString(),
              examName: "Son Sınav (Import)",
              score: Number(row.ToplamPuan) || 0,
              mathScore: Number(row.MatNet) || 0,
            }
          ]
        }));

        importStudents(imported);
        setSuccess(true);
        setTimeout(() => {
          router.push('/students');
        }, 1500);
      } catch (err) {
        console.error(err);
        alert("Dosya okuma hatası! Lütfen Excel formatını kontrol edin.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsBinaryString(file);
  }, [importStudents, router]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  });

  return (
    <div className="space-y-6 max-w-2xl mx-auto mt-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Veri Yükle</h2>
        <p className="text-foreground/70">Excel dosyasından öğrenci deneme sonuçlarını sisteme aktarın.</p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-primary/10 text-primary rounded-full">
                <UploadCloud className="h-8 w-8" />
              </div>
              <div>
                <p className="font-semibold text-lg">
                  {isDragActive ? "Dosyayı buraya bırakın" : "Excel dosyasını sürükleyin veya seçin"}
                </p>
                <p className="text-sm text-foreground/60 mt-1">.xlsx, .xls formatları desteklenmektedir.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Örnek Şablon İndir
            </Button>
          </div>

          {success && (
            <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3 text-success">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">Başarıyla yüklendi! Öğrenci listesine yönlendiriliyorsunuz...</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="bg-info/10 border border-info/20 text-info text-sm p-4 rounded-lg flex gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <p>PDF yükleme modülü şu anda taslak aşamasındadır. Daha karmaşık OCR ve parsing işlemleri için server-side entegrasyonu gerekmektedir.</p>
      </div>
    </div>
  );
}
