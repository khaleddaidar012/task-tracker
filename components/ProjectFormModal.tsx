"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";
import { Project } from "@/store/useStore";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, startDate: string, endDate: string) => void;
  initialData?: Project;
}

export function ProjectFormModal({ isOpen, onClose, onSubmit, initialData }: ProjectFormModalProps) {
  const [title, setTitle] = useState("");
  const [showDates, setShowDates] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isEditing = !!initialData;

  // Initialize fields when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        // If it has dates, we show them. 
        // Note: The stored date is likely ISO string, we need YYYY-MM-DD for <input type="date">
        const formatForInput = (isoString?: string) => {
          if (!isoString) return "";
          try {
            return new Date(isoString).toISOString().split('T')[0];
          } catch {
            return "";
          }
        };

        const sd = formatForInput(initialData.startDate);
        const ed = formatForInput(initialData.endDate);
        
        setStartDate(sd);
        setEndDate(ed);
        
        if (sd || ed) {
          setShowDates(true);
        } else {
          setShowDates(false);
        }
      } else {
        setTitle("");
        setStartDate("");
        setEndDate("");
        setShowDates(false);
      }
    }
  }, [isOpen, initialData]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      // If user toggled dates off, we send empty strings
      const finalStart = showDates && startDate ? new Date(startDate).toISOString() : "";
      const finalEnd = showDates && endDate ? new Date(endDate).toISOString() : "";
      
      onSubmit(title.trim(), finalStart, finalEnd);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-lg bg-card border border-border/60 shadow-xl rounded-3xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 pb-4 border-b border-border/40">
              <h2 className="text-xl font-bold text-foreground">
                {isEditing ? "تعديل المشروع" : "مشروع جديد"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5 mb-8">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-muted-foreground mb-2">
                    اسم المشروع
                  </label>
                  <input
                    id="title"
                    type="text"
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: إعادة تصميم واجهات المستخدم..."
                    className="w-full bg-background border border-border/80 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground/40 shadow-sm"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDates(!showDates)}
                    className="flex items-center gap-2 text-sm text-primary font-medium hover:underline focus:outline-none"
                  >
                    <Calendar size={16} />
                    {showDates ? "إلغاء التواريخ المحددة" : "إضافة تواريخ (اختياري)"}
                  </button>
                </div>

                <AnimatePresence>
                  {showDates && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-2 gap-4 overflow-hidden"
                    >
                      <div>
                        <label htmlFor="startDate" className="block text-xs font-medium text-muted-foreground mb-1">
                          تاريخ البداية
                        </label>
                        <input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-background border border-border/80 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                        />
                      </div>
                      <div>
                        <label htmlFor="endDate" className="block text-xs font-medium text-muted-foreground mb-1">
                          تاريخ النهاية
                        </label>
                        <input
                          id="endDate"
                          type="date"
                          value={endDate}
                          min={startDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-background border border-border/80 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-foreground"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-md disabled:opacity-50 disabled:shadow-none active:scale-95"
                >
                  {isEditing ? "تحديث المشروع" : "حفظ المشروع"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
