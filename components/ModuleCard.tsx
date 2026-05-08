'use client';

import Link from 'next/link';
import { BookOpen, Loader2, ChevronRight } from 'lucide-react';
import { Module } from '@/lib/courseData';

interface ModuleCardProps {
  module: Module;
  moduleIdx: number;
  progress: { done: number; total: number; pct: number };
  mounted: boolean;
}

const LEVEL_CONFIG = {
  beginner:     { label: 'Iniciante',    bg: 'rgba(16,185,129,0.12)',  color: '#34d399', border: 'rgba(16,185,129,0.25)' },
  intermediate: { label: 'Intermediário', bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
  advanced:     { label: 'Avançado',     bg: 'rgba(239,68,68,0.12)',   color: '#f87171', border: 'rgba(239,68,68,0.25)' },
};

export default function ModuleCard({ module, moduleIdx, progress, mounted }: ModuleCardProps) {
  const lvl = LEVEL_CONFIG[module.level];
  const allDone = progress.done === progress.total && progress.total > 0;
  const href = `/modulo${moduleIdx + 1}`;

  return (
    <Link
      href={href}
      className="block rounded-2xl overflow-hidden transition-all duration-300 group"
      style={{
        background: 'rgba(12,15,30,0.8)',
        border: `1px solid rgba(99,102,241,0.12)`,
        textDecoration: 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = `1px solid ${module.accentColor}55`;
        e.currentTarget.style.boxShadow = `0 0 30px ${module.accentColor}18`;
        e.currentTarget.style.background = 'rgba(15,20,40,0.95)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '1px solid rgba(99,102,241,0.12)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.background = 'rgba(12,15,30,0.8)';
      }}
      id={`module-${moduleIdx}-card`}
    >
      <div className="flex items-center gap-4 p-5">
        {/* Number badge */}
        <div
          className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-mono text-sm font-bold transition-all duration-300"
          style={{
            background: `${module.accentColor}20`,
            color: module.accentColor,
            border: `1px solid ${module.accentColor}35`,
          }}
        >
          {module.num}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-heading font-semibold text-base leading-snug" style={{ color: '#cbd5e1' }}>
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
          {mounted ? (
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
          ) : (
            <div className="flex items-center gap-2 mt-2">
              <Loader2 size={10} className="animate-spin" style={{ color: '#334155' }} />
              <span className="text-xs font-mono" style={{ color: '#334155' }}>carregando...</span>
            </div>
          )}
        </div>

        {/* Right: aulas count + arrow */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end gap-0.5">
            <span className="text-xs font-mono flex items-center gap-1" style={{ color: '#475569' }}>
              <BookOpen size={11} /> {module.lessons.length} aulas
            </span>
          </div>
          <ChevronRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-1"
            style={{ color: '#334155' }}
          />
        </div>
      </div>

      {/* Bottom accent line (shows on hover via accent color width animation) */}
      <div style={{ height: 2, background: `linear-gradient(90deg, ${module.accentColor}00, ${module.accentColor}60, ${module.accentColor}00)`, opacity: 0.6 }} />
    </Link>
  );
}
