import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/utils/cn';
import { useAppStore } from '@/shared/store/app.store';
import { useDataStore } from '@/shared/store/data.store';
import { LayoutDashboard, Users, UploadCloud, Moon, Sun, Edit3, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme, sidebarOpen } = useAppStore();
  const resetData = useDataStore(state => state.resetData);

  const links = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Öğrenciler', href: '/students', icon: Users },
    { name: 'Veri Yükle', href: '/import', icon: UploadCloud },
    { name: 'Manuel Giriş', href: '/manual', icon: Edit3 },
  ];

  if (!sidebarOpen) return null;

  const handleReset = () => {
    toast.error('Sistemdeki tüm verileri sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz.', {
      action: {
        label: 'Evet, Sıfırla',
        onClick: () => {
          resetData();
          toast.success("Sistemdeki tüm veriler başarıyla temizlendi.");
        }
      },
      cancel: {
        label: 'İptal',
        onClick: () => {}
      },
      duration: 10000,
    });
  };

  return (
    <aside className="w-64 glass-panel border-r-0 border-y-0 rounded-none h-screen flex flex-col fixed left-0 top-0 z-40 transition-transform">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-info bg-clip-text text-transparent flex items-center gap-2">
          <LayoutDashboard className="text-primary h-8 w-8" />
          ExamLens
        </h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
                isActive 
                  ? "bg-primary text-white shadow-md shadow-primary/20" 
                  : "text-foreground/70 hover:bg-surface-hover hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto space-y-2">
        <button 
          onClick={handleReset}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-danger/80 hover:bg-danger/10 hover:text-danger transition-colors font-medium cursor-pointer"
        >
          <Trash2 className="h-5 w-5" />
          Verileri Sıfırla
        </button>
        <button 
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-foreground/70 hover:bg-surface-hover transition-colors font-medium cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5 text-warning" /> : <Moon className="h-5 w-5 text-indigo-500" />}
          Tema Değiştir
        </button>
      </div>
    </aside>
  );
}
