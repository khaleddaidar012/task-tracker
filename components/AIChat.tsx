"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2, X, AlertCircle } from "lucide-react";
interface AIChatProps {
  message: string;
  setMessage: (msg: string) => void;
  loading: boolean;
  error: string | null;
  onSend: () => void;
  onClearError: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function AIChat({
  message,
  setMessage,
  loading,
  error,
  onSend,
  onClearError,
  isOpen,
  setIsOpen,
}: AIChatProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && message.trim()) onSend();
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* ── Collapsed pill ── */
          <motion.button
            key="pill"
            id="ai-chat-toggle"
            onClick={() => setIsOpen(true)}
            className="mx-auto flex items-center gap-2 px-5 py-2.5 rounded-full
                       bg-primary text-primary-foreground shadow-lg
                       hover:bg-primary/90 transition-colors font-medium text-sm"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Sparkles size={16} className="shrink-0" />
            <span>مساعد الذكاء الاصطناعي</span>
          </motion.button>
        ) : (
          /* ── Expanded panel ── */
          <motion.div
            key="panel"
            className="rounded-2xl border border-border bg-card/90 shadow-2xl backdrop-blur-md overflow-hidden"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
                  <Sparkles size={14} className="text-primary" />
                </div>
                <span className="font-semibold text-sm text-foreground">
                  مساعد المشاريع الذكي
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  AI
                </span>
              </div>
              <button
                id="ai-chat-close"
                onClick={() => {
                  setIsOpen(false);
                  onClearError();
                }}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
              >
                <X size={16} />
              </button>
            </div>

            {/* Hint chips */}
            <div className="flex gap-2 px-4 pt-3 pb-1 flex-wrap">
              {[
                "أنشئ مشروع لتعلم React",
                "Create a portfolio project",
                "أضف مهام لمشروعي",
              ].map((hint) => (
                <button
                  key={hint}
                  onClick={() => setMessage(hint)}
                  className="text-xs px-3 py-1 rounded-full border border-border
                             bg-muted/40 text-muted-foreground hover:bg-muted
                             hover:text-foreground transition-colors"
                >
                  {hint}
                </button>
              ))}
            </div>

            {/* Input area */}
            <div className="flex items-end gap-3 p-4 pt-2">
              <textarea
                ref={inputRef}
                id="ai-chat-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اكتب طلبك… مثال: أنشئ مشروع لتعلم React وأنهيت 30% منه"
                rows={2}
                dir="auto"
                disabled={loading}
                className="flex-1 resize-none bg-transparent text-sm text-foreground
                           placeholder:text-muted-foreground outline-none leading-relaxed
                           disabled:opacity-50"
              />
              <button
                id="ai-chat-send"
                onClick={onSend}
                disabled={loading || !message.trim()}
                className="shrink-0 w-9 h-9 rounded-xl bg-primary text-primary-foreground
                           flex items-center justify-center
                           hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed
                           transition-all active:scale-95"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={15} />
                )}
              </button>
            </div>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mx-4 mb-4 flex items-start gap-2 text-xs text-red-500
                             bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2"
                >
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
