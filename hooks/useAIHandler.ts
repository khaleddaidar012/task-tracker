"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";

export type AIAction = "create_project" | "add_tasks" | "update_progress";

export interface AIResponse {
  action: AIAction;
  projectTitle: string;
  tasks: string[];
  progress?: number;
}

interface UseAIHandlerReturn {
  message: string;
  setMessage: (msg: string) => void;
  loading: boolean;
  error: string | null;
  preview: AIResponse | null;
  sendMessage: () => Promise<void>;
  confirm: () => void;
  cancel: () => void;
}

export function useAIHandler(): UseAIHandlerReturn {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<AIResponse | null>(null);

  const { projects, addProject, addTasksBulk, updateProgressByPercent } =
    useStore();

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setPreview(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "حدث خطأ غير متوقع");
        return;
      }

      setPreview(data as AIResponse);
    } catch {
      setError("تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.");
    } finally {
      setLoading(false);
    }
  };

  /** Find a project by partial, case-insensitive title match */
  const findProject = (title: string) =>
    projects.find(
      (p) =>
        p.title.toLowerCase().includes(title.toLowerCase()) ||
        title.toLowerCase().includes(p.title.toLowerCase())
    );

  const confirm = () => {
    if (!preview) return;

    const { action, projectTitle, tasks = [], progress } = preview;

    if (action === "create_project") {
      // 1. Create the project
      addProject({ title: projectTitle, startDate: "", endDate: "", tasks: [] });

      // 2. Get the newly created project (appended last)
      const newProject = useStore.getState().projects.at(-1);
      if (!newProject) return;

      // 3. Bulk-add tasks
      if (tasks.length > 0) {
        addTasksBulk(newProject.id, tasks);
      }

      // 4. Apply progress percentage if provided
      if (typeof progress === "number" && progress > 0 && tasks.length > 0) {
        updateProgressByPercent(newProject.id, progress);
      }
    }

    if (action === "add_tasks") {
      const project = findProject(projectTitle);
      if (!project) {
        setError(`لم يتم العثور على مشروع باسم "${projectTitle}"`);
        return;
      }
      if (tasks.length > 0) {
        addTasksBulk(project.id, tasks);
      }
    }

    if (action === "update_progress") {
      const project = findProject(projectTitle);
      if (!project) {
        setError(`لم يتم العثور على مشروع باسم "${projectTitle}"`);
        return;
      }
      if (typeof progress === "number") {
        updateProgressByPercent(project.id, progress);
      }
    }

    // Clear state after confirming
    setPreview(null);
    setMessage("");
    setError(null);
  };

  const cancel = () => {
    setPreview(null);
    setError(null);
  };

  return {
    message,
    setMessage,
    loading,
    error,
    preview,
    sendMessage,
    confirm,
    cancel,
  };
}
