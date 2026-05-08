'use client';

import { useState } from 'react';
import { ChevronDown, Check, BookOpen, Loader2 } from 'lucide-react';
import { Module } from '@/lib/courseData';

interface ModuleCardProps {
  module: Module;
  moduleIdx: number;
  isExpanded: boolean;
  progress: { done: number; total: number; pct: number };
  isLessonCompleted: (moduleIdx: number, lessonIdx: number) => boolean;
  onToggleModule: () => void;
  onToggleLesson: (moduleIdx: number, lessonIdx: number) => void;
  mounted: boolean;
}

const LEVEL_CONFIG = {
  beginner: { label: 'Iniciante', bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.25)' },
  intermediate: { label: 'Intermediário', bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
  advanced: { label: 'Avançado', bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)' },
};

export default function ModuleCard({
  module,
  moduleIdx,
  isExpanded,
  progress,
  isLessonCompleted,
  onToggleModule,
  onToggleLesson,
  mounted,
}: ModuleCardProps) {
  const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);
  const lvl = LEVEL_CONFIG[module.level];
  const allDone = progress.done === progress.total && progress.total > 0;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: isExpanded ? 'rgba(15,20,40,0.95)' : 'rgba(12,15,30,0.8)',
        border: `1px solid ${isExpanded ? module.accentColor + '55' : 'rgba(99,102,241,0.12)'}`,
        boxShadow: isExpanded ? `0 0 30px ${module.accentColor}18` : 'none',
      }}
    >
      {/* Module Header */}
      <button
        onClick={onToggleModule}
        className="w-full text-left flex items-center gap-4 p-5 group"
        aria-expanded={isExpanded}
        id={`module-${moduleIdx}-btn`}
      >
        {/* Number badge */}
        <div
          className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-mono text-sm font-bold transition-all duration-300"
          style={{
            background: isExpanded ? module.accentColor + '25' : 'rgba(99,102,241,0.1)',
            color: isExpanded ? module.accentColor : '#94a3b8',
            border: `1px solid ${isExpanded ? module.accentColor + '40' : 'rgba(99,102,241,0.15)'}`,
          }}
        >
          {module.num}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="font-heading font-semibold text-base leading-snug"
              style={{ color: isExpanded ? '#e2e8f0' : '#cbd5e1' }}
            >
              {module.title}
            </span>
            <span
              className="text-xs px-2.5 py-0.5 rounded-full font-mono"
              style={{ background: lvl.bg, color: lvl.color, border: `1px solid ${lvl.border}` }}
            >
              {lvl.label}
            </span>
            {allDone && mounted && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-mono">
                ✓ Concluído
              </span>
            )}
          </div>
          <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>{module.desc}</p>

          {/* Mini progress */}
          {mounted && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(99,102,241,0.12)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${progress.pct}%`,
                    background: progress.pct === 100
                      ? 'linear-gradient(90deg, #10b981, #34d399)'
                      : `linear-gradient(90deg, ${module.accentColor}, ${module.accentColor}cc)`,
                  }}
                />
              </div>
              <span className="text-xs font-mono" style={{ color: '#475569' }}>
                {progress.done}/{progress.total}
              </span>
            </div>
          )}
        </div>

        {/* Right meta */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <span className="text-xs font-mono hidden sm:block" style={{ color: '#475569' }}>
            {module.lessons.length} aulas
          </span>
          <ChevronDown
            size={16}
            className="transition-transform duration-300"
            style={{
              color: '#475569',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </div>
      </button>

      {/* Lessons list */}
      <div
        className="overflow-hidden transition-all duration-400"
        style={{
          maxHeight: isExpanded ? `${module.lessons.length * 90}px` : '0',
        }}
      >
        <div
          className="mx-5 mb-4 rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(99,102,241,0.1)' }}
        >
          {module.lessons.map((lesson, lessonIdx) => {
            const done = mounted ? isLessonCompleted(moduleIdx, lessonIdx) : false;
            const isHovered = hoveredLesson === lessonIdx;
            const isLast = lessonIdx === module.lessons.length - 1;

            return (
              <div
                key={lessonIdx}
                className="flex items-start gap-3 p-3.5 cursor-pointer transition-all duration-200"
                style={{
                  background: isHovered ? 'rgba(99,102,241,0.06)' : 'transparent',
                  borderBottom: isLast ? 'none' : '1px solid rgba(99,102,241,0.06)',
                }}
                onMouseEnter={() => setHoveredLesson(lessonIdx)}
                onMouseLeave={() => setHoveredLesson(null)}
                onClick={() => onToggleLesson(moduleIdx, lessonIdx)}
                role="button"
                aria-pressed={done}
                id={`lesson-${moduleIdx}-${lessonIdx}`}
              >
                {/* Checkbox */}
                <div
                  className="flex-shrink-0 w-5 h-5 rounded-md mt-0.5 flex items-center justify-center transition-all duration-200"
                  style={{
                    background: done ? module.accentColor : 'rgba(99,102,241,0.08)',
                    border: `1.5px solid ${done ? module.accentColor : 'rgba(99,102,241,0.2)'}`,
                    boxShadow: done ? `0 0 8px ${module.accentColor}60` : 'none',
                  }}
                >
                  {!mounted ? (
                    <Loader2 size={10} className="animate-spin" style={{ color: '#64748b' }} />
                  ) : done ? (
                    <Check size={11} style={{ color: '#fff' }} strokeWidth={3} />
                  ) : null}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm leading-snug transition-colors duration-200"
                    style={{
                      color: done ? '#64748b' : '#cbd5e1',
                      textDecoration: done ? 'line-through' : 'none',
                    }}
                  >
                    {lesson.name}
                  </p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#475569' }}>
                    {lesson.detail}
                  </p>
                </div>

                {/* Icon */}
                <BookOpen
                  size={14}
                  className="flex-shrink-0 mt-1 transition-opacity duration-200"
                  style={{ color: isHovered ? module.accentColor : '#334155', opacity: isHovered ? 1 : 0.5 }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
