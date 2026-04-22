"use client";
import { Sidebar } from './Sidebar';
import { useAppStore } from '@/shared/store/app.store';
import { cn } from '@/shared/utils/cn';
import { useEffect, useState } from 'react';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, theme } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  if (!mounted) {
    return <div className="min-h-screen bg-background" />; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className={cn(
        "flex-1 p-8 transition-all duration-300",
        sidebarOpen ? "ml-64" : "ml-0"
      )}>
        <div className="max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
