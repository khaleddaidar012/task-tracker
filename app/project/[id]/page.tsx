"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { ArrowRight, Calendar, CalendarCheck, Clock, Plus, Trash2, Edit2 } from "lucide-react";
import { calculateProgress } from "@/utils/progress";
import { CircularProgress } from "@/components/CircularProgress";
import { TaskItem } from "@/components/TaskItem";
import { ProjectFormModal } from "@/components/ProjectFormModal";
import { getRelativeTimeString } from "@/utils/date";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const { projects, addTask, toggleTask, deleteTask, deleteProject, updateProject } = useStore();

  useEffect(() => {
    setMounted(true);
    if (!useStore.getState().username) {
      router.push("/login");
    }
  }, [router]);

  if (!mounted || !useStore.getState().username) {
    return (
      <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full animate-pulse">
        <div className="h-10 w-32 bg-muted rounded-xl mb-8" />
        <div className="h-48 w-full bg-muted rounded-3xl mb-12" />
        <div className="space-y-4">
          <div className="h-16 w-full bg-muted rounded-2xl" />
          <div className="h-16 w-full bg-muted rounded-2xl" />
        </div>
      </main>
    );
  }

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full text-center mt-20">
        <h2 className="text-3xl font-bold mb-4">المشروع غير موجود</h2>
        <p className="text-muted-foreground mb-8">عذراً، لم نتمكن من العثور على هذا المشروع.</p>
        <button
          onClick={() => router.push("/")}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-xl"
        >
          العودة للرئيسية
        </button>
      </main>
    );
  }

  const progress = calculateProgress(project);
  const timeString = getRelativeTimeString(project.updatedAt);
  
  const formatDisplayDate = (d: string) => d ? new Date(d).toLocaleDateString("ar-SA", { dateStyle: "medium" }) : "غير محدد";
  const startDate = formatDisplayDate(project.startDate);
  const endDate = formatDisplayDate(project.endDate);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(project.id, newTaskTitle.trim());
      setNewTaskTitle("");
    }
  };

  const handleDeleteProject = () => {
    if (window.confirm("هل أنت متأكد من حذف هذا المشروع نهائياً؟")) {
      deleteProject(project.id);
      router.push("/");
    }
  };

  const handleEditSubmit = (title: string, startDate: string, endDate: string) => {
    updateProject(project.id, {
      title,
      startDate: startDate || "",
      endDate: endDate || "",
    });
  };

  return (
    <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">العودة للوحة المشاريع</span>
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
            title="تعديل المشروع"
          >
            <Edit2 size={18} />
            <span className="hidden sm:inline text-sm font-medium">تعديل</span>
          </button>
          
          <button
            onClick={handleDeleteProject}
            className="flex items-center gap-2 text-muted-foreground hover:text-danger hover:bg-danger/10 px-3 py-1.5 rounded-lg transition-colors"
            title="حذف المشروع"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline text-sm font-medium">حذف</span>
          </button>
        </div>
      </div>

      {/* Project Summary Card */}
      <div className="bg-card border border-border shadow-sm rounded-3xl p-8 mb-12 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="flex-1 relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-6 leading-tight">
            {project.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>البداية: <strong>{startDate}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-primary" />
              <span>النهاية: <strong>{endDate}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>آخر تحديث {timeString}</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 relative z-10 flex flex-col items-center gap-3">
          <CircularProgress progress={progress} size={100} strokeWidth={8} />
          <span className="text-sm font-bold bg-muted px-3 py-1 rounded-full">{progress}% مكتمل</span>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">قائمة المهام</h2>
        <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {project.tasks.filter((t) => t.completed).length} / {project.tasks.length}
        </span>
      </div>

      <div className="space-y-4 mb-8">
        {project.tasks.length === 0 ? (
          <div className="text-center p-8 bg-muted/20 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">لا توجد مهام في هذا المشروع. ابدأ بإضافة مهامك الآن!</p>
          </div>
        ) : (
          project.tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={(taskId) => toggleTask(project.id, taskId)}
              onDelete={(taskId) => deleteTask(project.id, taskId)}
            />
          ))
        )}
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="flex gap-3">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="إضافة مهمة جديدة..."
          className="flex-1 bg-card border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
        />
        <button
          type="submit"
          disabled={!newTaskTitle.trim()}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">إضافة</span>
        </button>
      </form>

      <ProjectFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={project}
      />
    </main>
  );
}
