"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const wisdoms = [
  "« مَنْ عَمِلَ صَالِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً »",
  "« وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ »",
  "« إِنَّ مَعَ الْعُسْرِ يُسْرًا »",
  "« وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ »",
  "« فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ ۚ إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ »"
];

export function WisdomTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % wisdoms.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex bg-muted/30 border border-border/50 rounded-full px-5 py-2 overflow-hidden h-10 items-center justify-center max-w-2xl mx-auto w-full relative shadow-sm">
      <AnimatePresence mode="popLayout">
        <motion.p
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute text-sm font-medium text-foreground tracking-wide text-center w-full"
        >
          {wisdoms[currentIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
