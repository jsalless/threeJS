'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'threejs_course_progress';

interface ProgressState {
  completedLessons: Record<string, boolean>; // key: "moduleIdx-lessonIdx"
  expandedModules: Record<string, boolean>;
  lastUpdated: string;
}

const defaultState: ProgressState = {
  completedLessons: {},
  expandedModules: { '0': true },
  lastUpdated: new Date().toISOString(),
};

export function useProgress(totalLessons: number) {
  const [state, setState] = useState<ProgressState>(defaultState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const save = useCallback((next: ProgressState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
    setState(next);
  }, []);

  const toggleLesson = useCallback((moduleIdx: number, lessonIdx: number) => {
    setState(prev => {
      const key = `${moduleIdx}-${lessonIdx}`;
      const next: ProgressState = {
        ...prev,
        completedLessons: {
          ...prev.completedLessons,
          [key]: !prev.completedLessons[key],
        },
        lastUpdated: new Date().toISOString(),
      };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const toggleModule = useCallback((moduleIdx: number) => {
    setState(prev => {
      const key = String(moduleIdx);
      const next: ProgressState = {
        ...prev,
        expandedModules: {
          ...prev.expandedModules,
          [key]: !prev.expandedModules[key],
        },
        lastUpdated: new Date().toISOString(),
      };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    save({ ...defaultState, lastUpdated: new Date().toISOString() });
  }, [save]);

  const completedCount = Object.values(state.completedLessons).filter(Boolean).length;
  const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const isLessonCompleted = (moduleIdx: number, lessonIdx: number) =>
    !!state.completedLessons[`${moduleIdx}-${lessonIdx}`];

  const isModuleExpanded = (moduleIdx: number) =>
    !!state.expandedModules[String(moduleIdx)];

  const getModuleProgress = (moduleIdx: number, lessonCount: number) => {
    const done = Array.from({ length: lessonCount }, (_, i) =>
      state.completedLessons[`${moduleIdx}-${i}`]
    ).filter(Boolean).length;
    return { done, total: lessonCount, pct: lessonCount > 0 ? Math.round((done / lessonCount) * 100) : 0 };
  };

  return {
    mounted,
    completedCount,
    percentage,
    isLessonCompleted,
    isModuleExpanded,
    getModuleProgress,
    toggleLesson,
    toggleModule,
    resetProgress,
  };
}
