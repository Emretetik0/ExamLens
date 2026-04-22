import { StudentsView } from "@/features/students/StudentsView";
import { Suspense } from "react";

export default function StudentsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-screen bg-surface/50 rounded-xl" />}>
      <StudentsView />
    </Suspense>
  );
}
