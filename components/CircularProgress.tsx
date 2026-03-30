"use client";

import { motion } from "framer-motion";

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({ 
  progress, 
  size = 40, 
  strokeWidth = 4 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background Circle */}
        <circle
          className="text-muted"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress Circle */}
        <motion.circle
          className="text-primary transition-colors"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Centered Percentage Text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <span 
          className="font-bold text-foreground drop-shadow-sm tracking-tighter"
          style={{ fontSize: size * 0.28, lineHeight: 1 }}
        >
          {Math.round(progress)}
          <span className="text-muted-foreground opacity-80 mr-0.5" style={{ fontSize: size * 0.16 }}> %</span>
        </span>
      </motion.div>
    </div>
  );
}
