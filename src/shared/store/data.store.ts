import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Student, ExamResult } from '@/domain/models/student.model';
import { generateMockStudents } from '@/shared/utils/mockData';

interface DataState {
  students: Student[];
  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  importStudents: (students: Student[]) => void;
  addExamToStudent: (studentId: string, exam: ExamResult) => void;
  deleteStudent: (studentId: string) => void;
  resetData: () => void;
}

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      students: [], 
      setStudents: (students) => set({ students }),
      addStudent: (student) => set((state) => ({ students: [...state.students, student] })),
      importStudents: (newStudents) => set((state) => ({ 
        students: [...state.students, ...newStudents] 
      })),
      addExamToStudent: (studentId, exam) => set((state) => ({
        students: state.students.map(s => 
          s.id === studentId ? { ...s, examResults: [...s.examResults, exam] } : s
        )
      })),
      deleteStudent: (studentId) => set((state) => ({
        students: state.students.filter(s => s.id !== studentId)
      })),
      resetData: () => set({ students: [] }),
    }),
    {
      name: 'exam-lens-storage', // name of item in the storage (must be unique)
    }
  )
);

// Sadece storage tamamen boşsa örnek verileri yükle
if (typeof window !== 'undefined') {
  const storeData = localStorage.getItem('exam-lens-storage');
  if (!storeData || !storeData.includes('"students":[')) {
    useDataStore.getState().setStudents(generateMockStudents());
  }
}
