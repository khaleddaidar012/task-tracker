"use client";

import Link from "next/link";
import { Clock } from "lucide-react";
import { Project } from "@/store/useStore";
import { calculateProgress } from "@/utils/progress";
import { getRelativeTimeString } from "@/utils/date";
import { ProgressBar } from "./ProgressBar";
import { CircularProgress } from "./CircularProgress";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progress = calculateProgress(project);
  const timeString = getRelativeTimeString(project.updatedAt);

  return (
    <Link href={`/project/${project.id}`}>
      <div className="group relative bg-card hover:bg-muted/30 border border-border hover:border-border/80 rounded-2xl p-6 transition-all duration-300 ease-out shadow-sm hover:shadow-md cursor-pointer h-full flex flex-col justify-between">
        
        {/* Header content */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {project.title}
            </h3>
            <div className="mr-4 flex-shrink-0">
              <CircularProgress progress={progress} size={48} strokeWidth={4} />
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
            <Clock className="w-3.5 h-3.5" />
            <span>حدث {timeString}</span>
          </div>
        </div>

        {/* Footer content: Progress Bar */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-muted-foreground">التقدم</span>
            <span className="text-sm font-bold text-foreground">{progress}%</span>
          </div>
          <ProgressBar progress={progress} />
        </div>
      </div>
    </Link>
  );
}
