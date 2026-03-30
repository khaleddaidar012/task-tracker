"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Sparkles, FolderPlus, ListPlus, TrendingUp } from "lucide-react";
import type { AIResponse } from "@/hooks/useAIHandler";

interface AIResponsePreviewProps {
  preview: AIResponse | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const ACTION_META = {
  create_project: {
    label: "إنشاء مشروع جديد",
    labelEn: "Create Project",
    icon: FolderPlus,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  add_tasks: {
    label: "إضافة مهام",
    labelEn: "Add Tasks",
    icon: ListPlus,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  update_progress: {
    label: "تحديث التقدم",
    labelEn: "Update Progress",
    icon: TrendingUp,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
  },
};

export function AIResponsePreview({
  preview,
  onConfirm,
  onCancel,
}: AIResponsePreviewProps) {
  if (!preview) return null;

  const meta = ACTION_META[preview.action];
  const Icon = meta.icon;
  const hasProgress =
    typeof preview.progress === "number" && preview.progress > 0;

  return (
    <AnimatePresence>
      {preview && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Panel */}
          <motion.div
            key="preview-panel"
            className="fixed bottom-50 left-1/2 -translate-x-1/2 z-50
                       w-full max-w-lg px-4"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">

              {/* Header */}
              <div className={`flex items-center gap-3 px-5 py-4 border-b border-border ${meta.bg}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${meta.bg} border ${meta.border}`}>
                  <Icon size={18} className={meta.color} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles size={11} className="text-primary" />
                    اقتراح الذكاء الاصطناعي
                  </p>
                  <p className={`text-sm font-bold ${meta.color}`}>{meta.label}</p>
                </div>
              </div>

              {/* Body */}
              <div className="px-5 py-4 space-y-4">

                {/* Project title */}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">اسم المشروع</p>
                  <p className="font-semibold text-foreground text-base">{preview.projectTitle}</p>
                </div>

                {/* Tasks list */}
                {preview.tasks && preview.tasks.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      المهام ({preview.tasks.length})
                    </p>
                    <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {preview.tasks.map((task, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-primary/10
                                          text-primary text-[10px] font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="leading-snug">{task}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Progress bar */}
                {hasProgress && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-muted-foreground">نسبة الإنجاز</p>
                      <p className="text-xs font-bold text-primary">{preview.progress}%</p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${preview.progress}%` }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      سيتم تحديد {Math.round((preview.progress! / 100) * (preview.tasks?.length ?? 0))} مهمة كمنجزة
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 px-5 pb-5">
                <button
                  id="ai-preview-confirm"
                  onClick={onConfirm}
                  className="flex-1 flex items-center justify-center gap-2
                             bg-primary text-primary-foreground rounded-xl
                             py-2.5 text-sm font-semibold
                             hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
                >
                  <CheckCircle2 size={16} />
                  تأكيد
                </button>
                <button
                  id="ai-preview-cancel"
                  onClick={onCancel}
                  className="flex-1 flex items-center justify-center gap-2
                             border border-border rounded-xl py-2.5 text-sm
                             font-medium text-muted-foreground
                             hover:bg-muted hover:text-foreground
                             transition-all active:scale-95"
                >
                  <XCircle size={16} />
                  إلغاء
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
