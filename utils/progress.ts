import { Project } from "@/store/useStore";

export function calculateProgress(project: Project): number {
  if (!project.tasks || project.tasks.length === 0) return 0;
  
  const completedTasks = project.tasks.filter((t) => t.completed).length;
  const totalTasks = project.tasks.length;
  
  return Math.round((completedTasks / totalTasks) * 100);
}
