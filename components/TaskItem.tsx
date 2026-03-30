"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Trash2, X } from "lucide-react";
import { Task } from "@/store/useStore";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group flex items-center justify-between p-3 rounded-xl border transition-all ${
        task.completed
          ? "bg-muted/30 border-transparent"
          : "bg-card border-border hover:border-border/80 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        {/* Custom Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            task.completed
              ? "bg-primary border-primary text-primary-foreground"
              : "border-muted-foreground/30 hover:border-primary/50 text-transparent"
          }`}
        >
          <motion.div
            initial={false}
            animate={{ scale: task.completed ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Check size={14} strokeWidth={3} />
          </motion.div>
        </button>

        {/* Task Title */}
        <span
          className={`text-base font-medium transition-all truncate select-none cursor-pointer ${
            task.completed ? "text-muted-foreground line-through decoration-muted-foreground/50" : "text-foreground"
          }`}
          onClick={() => onToggle(task.id)}
        >
          {task.title}
        </span>
      </div>

      {/* Delete / Confirm Actions */}
      <AnimatePresence mode="popLayout" initial={false}>
        {!showConfirm ? (
          <motion.button
            key="delete-btn"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={() => setShowConfirm(true)}
            className="p-2 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
            title="حذف المهمة"
          >
            <Trash2 size={16} />
          </motion.button>
        ) : (
          <motion.div
            key="confirm-actions"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-1 bg-danger/10 px-2 py-1 rounded-lg"
          >
            <span className="text-xs text-danger font-medium mx-2">تأكيد الحذف؟</span>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 text-danger bg-danger/20 hover:bg-danger/30 rounded-md transition-colors"
            >
              <Check size={14} />
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
