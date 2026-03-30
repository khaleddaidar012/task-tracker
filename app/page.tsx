"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectFormModal } from "@/components/ProjectFormModal";
import { WisdomTicker } from "@/components/WisdomTicker";
import { AIChat } from "@/components/AIChat";
import { AIResponsePreview } from "@/components/AIResponsePreview";
import { useAIHandler } from "@/hooks/useAIHandler";
import { Plus, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const { projects, addProject, username, logout } = useStore();
  const ai = useAIHandler();

  useEffect(() => {
    setMounted(true);
    if (!useStore.getState().username) {
      router.push("/login");
    }
  }, [router]);

  // Hydration skeleton
  if (!mounted || !username) {
    return (
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-48 bg-muted rounded-xl mb-4" />
          <div className="h-12 w-full max-w-2xl bg-muted rounded-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  const handleInitializeProject = () => {
    setIsCreateProjectOpen(true);
  };

  const handleAddProjectSubmit = (title: string, startDate: string, endDate: string) => {
    if (title && title.trim()) {
      addProject({
        title: title.trim(),
        startDate: startDate || "",
        endDate: endDate || "",
        tasks: [],
      });
    }
  };

  return (
    <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center space-y-6 mb-16 mt-8 relative">
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="absolute left-0 top-0 flex items-center gap-2 text-muted-foreground hover:text-danger hover:bg-danger/10 px-3 py-1.5 rounded-lg transition-colors"
          title="تسجيل الخروج"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline text-sm font-medium">خروج</span>
        </button>

        <motion.h1 
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          مرحباً {username} <span className="inline-block animate-bounce origin-bottom">👋</span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full"
        >
          <WisdomTicker />
        </motion.div>
      </div>

      {/* Projects Section */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">مشاريعك الحالية</h2>
        <button
          onClick={handleInitializeProject}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>مشروع جديد</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center border-2 border-dashed border-border rounded-3xl bg-muted/20">
          <div className="text-muted-foreground mb-4">
            <span className="text-6xl text-muted-foreground/30 mb-4 block">📁</span>
            <p className="text-xl font-medium">لا توجد مشاريع حالياً</p>
            <p className="text-sm mt-2">ابدأ بإضافة مشروعك الأول لتنظيم مهامك بفعالية</p>
          </div>
          <button
            onClick={handleInitializeProject}
            className="mt-4 bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-medium hover:bg-primary/90 transition-all shadow-md active:scale-95"
          >
            إنشاء مشروع
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <ProjectFormModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onSubmit={handleAddProjectSubmit}
      />

      {/* AI Preview Modal */}
      <AIResponsePreview
        preview={ai.preview}
        onConfirm={ai.confirm}
        onCancel={ai.cancel}
      />

      {/* AI Floating Chat Bar */}
      <AIChat
        message={ai.message}
        setMessage={ai.setMessage}
        loading={ai.loading}
        error={ai.error}
        onSend={ai.sendMessage}
        onClearError={ai.cancel}
        isOpen={isAIOpen}
        setIsOpen={setIsAIOpen}
      />
    </main>
  );
}
