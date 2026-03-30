import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface Project {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
}

interface AppState {
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (projectId: string, taskTitle: string) => void;
  addTasksBulk: (projectId: string, taskTitles: string[]) => void;
  toggleTask: (projectId: string, taskId: string) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  updateProgressByPercent: (projectId: string, percent: number) => void;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "تصميم واجهة المستخدم (UI/UX)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    tasks: [
      { id: "t1", title: "تجهيز الألوان والخطوط", completed: true },
      { id: "t2", title: "تصميم الشاشة الرئيسية", completed: true },
      { id: "t3", title: "مراجعة التصميم مع العميل", completed: false },
    ],
  },
  {
    id: "2",
    title: "تطوير لوحة التحكم",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    tasks: [
      { id: "t4", title: "بناء هيكل قاعدة البيانات", completed: false },
      { id: "t5", title: "تطوير واجهات برمجة التطبيقات (API)", completed: false },
    ],
  },
  {
    id: "3",
    title: "حملة التسويق الرقمي",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString(),
    tasks: [
      { id: "t6", title: "تجهيز المنشورات", completed: true },
      { id: "t7", title: "إطلاق الحملة على منصات التواصل", completed: true },
      { id: "t8", title: "تحليل النتائج الأولية", completed: true },
    ],
  },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      projects: mockProjects,
      username: null,

      login: (username) => set({ username }),
      logout: () => set({ username: null }),

      addProject: (projectData) =>
        set((state) => {
          const newProject: Project = {
            ...projectData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return { projects: [...state.projects, newProject] };
        }),

      updateProject: (id, data) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, ...data, updatedAt: new Date().toISOString() }
              : p
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      addTask: (projectId, taskTitle) =>
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id === projectId) {
              const newTask: Task = {
                id: crypto.randomUUID(),
                title: taskTitle,
                completed: false,
              };
              return {
                ...p,
                tasks: [...p.tasks, newTask],
                updatedAt: new Date().toISOString(),
              };
            }
            return p;
          }),
        })),

      addTasksBulk: (projectId, taskTitles) =>
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id === projectId) {
              const newTasks: Task[] = taskTitles.map((title) => ({
                id: crypto.randomUUID(),
                title,
                completed: false,
              }));
              return {
                ...p,
                tasks: [...p.tasks, ...newTasks],
                updatedAt: new Date().toISOString(),
              };
            }
            return p;
          }),
        })),

      toggleTask: (projectId, taskId) =>
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id === projectId) {
              return {
                ...p,
                tasks: p.tasks.map((t) =>
                  t.id === taskId ? { ...t, completed: !t.completed } : t
                ),
                updatedAt: new Date().toISOString(),
              };
            }
            return p;
          }),
        })),

      deleteTask: (projectId, taskId) =>
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id === projectId) {
              return {
                ...p,
                tasks: p.tasks.filter((t) => t.id !== taskId),
                updatedAt: new Date().toISOString(),
              };
            }
            return p;
          }),
        })),

      updateProgressByPercent: (projectId, percent) =>
        set((state) => ({
          projects: state.projects.map((p) => {
            if (p.id === projectId) {
              const total = p.tasks.length;
              const completedCount = Math.round((percent / 100) * total);
              return {
                ...p,
                tasks: p.tasks.map((t, index) => ({
                  ...t,
                  completed: index < completedCount,
                })),
                updatedAt: new Date().toISOString(),
              };
            }
            return p;
          }),
        })),
    }),
    {
      name: "task-tracker-storage",
    }
  )
);
