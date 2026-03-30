"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { username, login } = useStore();
  
  const [inputUsername, setInputUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setMounted(true);
    // If already logged in, redirect to home
    if (useStore.getState().username) {
      router.push("/");
    }
  }, [router]);

  if (!mounted) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim()) {
      login(inputUsername.trim());
      router.push("/");
    }
  };

  return (
    <main className="flex-1 min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 bg-card border border-border rounded-2xl mx-auto flex items-center justify-center shadow-sm mb-6"
          >
            <span className="text-3xl">✨</span>
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">مرحباً بك</h1>
          <p className="text-sm text-muted-foreground">قم بتسجيل الدخول للوصول إلى مهامك</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block ml-1">
              اسم المستخدم
            </label>
            <input
              type="text"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              required
              placeholder="مثال: خالد"
              className="w-full bg-card border border-border/60 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/50 shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block ml-1">
              كلمة المرور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-card border border-border/60 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/50 shadow-sm"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!inputUsername.trim() || !password}
            className="w-full bg-foreground text-background font-medium rounded-xl py-3.5 mt-4 transition-colors hover:opacity-90 disabled:opacity-50 shadow-md"
          >
            الدخول إلى لوحة التحكم
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}
