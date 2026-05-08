'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { MODULES } from '@/lib/courseData';
import { useProgress } from '@/lib/useProgress';
import { useMemo } from 'react';

const TOTAL_LESSONS = MODULES.reduce((acc, m) => acc + m.lessons.length, 0);

interface ModulePageProps {
  moduleNum: number; // 1-indexed
}

export default function ModulePage({ moduleNum }: ModulePageProps) {
  const idx = moduleNum - 1;
  const mod = MODULES[idx];

  const {
    mounted,
    isLessonCompleted,
    toggleLesson,
    getModuleProgress,
  } = useProgress(TOTAL_LESSONS);

  // Global lesson offset so IDs match the main dashboard
  const lessonOffset = useMemo(
    () => MODULES.slice(0, idx).reduce((acc, m) => acc + m.lessons.length, 0),
    [idx]
  );

  if (!mod) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="flex items-center justify-center">
        <p style={{ color: '#94a3b8' }}>Módulo não encontrado.</p>
      </div>
    );
  }

  const { pct, done, total } = getModuleProgress(idx, mod.lessons.length);
  const prevMod = idx > 0 ? MODULES[idx - 1] : null;
  const nextMod = idx < MODULES.length - 1 ? MODULES[idx + 1] : null;

  const levelLabel: Record<string, string> = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
  };

  const levelColor: Record<string, string> = {
    beginner: '#34d399',
    intermediate: '#f59e0b',
    advanced: '#f87171',
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* ── Top bar ── */}
      <div
        style={{
          borderBottom: '1px solid rgba(99,102,241,0.12)',
          background: 'rgba(5,7,15,0.9)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm transition-colors duration-200"
            style={{ color: '#64748b' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
          >
            <ArrowLeft size={15} />
            Dashboard
          </Link>
          <span className="font-mono text-xs" style={{ color: '#334155' }}>
            Módulo {mod.num}
          </span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, rgba(12,15,30,1) 0%, rgba(12,15,30,0.85) 100%)`,
          borderBottom: `1px solid ${mod.accentColor}22`,
        }}
      >
        {/* Accent glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 80% 50%, ${mod.accentColor}33 0%, transparent 70%)`,
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6 py-14">
          {/* Module number badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs tracking-widest mb-5"
            style={{
              background: `${mod.accentColor}18`,
              border: `1px solid ${mod.accentColor}40`,
              color: mod.accentColor,
            }}
          >
            MÓDULO {mod.num}
            <span
              className="px-2 py-0.5 rounded-full text-xs"
              style={{
                background: `${levelColor[mod.level]}18`,
                color: levelColor[mod.level],
                border: `1px solid ${levelColor[mod.level]}30`,
              }}
            >
              {levelLabel[mod.level]}
            </span>
          </div>

          <h1
            className="font-heading font-bold leading-tight mb-3"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', color: '#f1f5f9' }}
          >
            {mod.title}
          </h1>
          <p style={{ color: '#64748b', maxWidth: '480px' }} className="text-sm mb-8">
            {mod.desc}
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
              <BookOpen size={14} style={{ color: mod.accentColor }} />
              {mod.lessons.length} aulas
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
              <Clock size={14} style={{ color: mod.accentColor }} />
              ~{Math.ceil(mod.lessons.length * 0.5)}h estimadas
            </div>

            {/* Progress pill */}
            {mounted && (
              <div
                className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono ml-auto"
                style={{
                  background: pct === 100 ? 'rgba(52,211,153,0.1)' : `${mod.accentColor}12`,
                  border: `1px solid ${pct === 100 ? '#34d399' : mod.accentColor}30`,
                  color: pct === 100 ? '#34d399' : mod.accentColor,
                }}
              >
                {done}/{total} · {pct}%
                {pct === 100 && ' ✓'}
              </div>
            )}
          </div>

          {/* Progress bar */}
          {mounted && (
            <div
              className="mt-5 h-1 rounded-full overflow-hidden"
              style={{ background: 'rgba(99,102,241,0.1)', maxWidth: '400px' }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: pct === 100
                    ? 'linear-gradient(90deg,#10b981,#34d399)'
                    : `linear-gradient(90deg, ${mod.accentColor}, ${mod.accentColor}aa)`,
                }}
              />
            </div>
          )}
        </div>
      </section>

      {/* ── Lessons ── */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <p className="font-mono text-xs tracking-widest uppercase mb-5" style={{ color: '#334155' }}>
          Aulas deste módulo
        </p>

        <div className="flex flex-col gap-2">
          {mod.lessons.map((lesson, li) => {
            const globalId = lessonOffset + li;
            const completed = mounted ? isLessonCompleted(idx, li) : false;

            return (
              <button
                key={li}
                id={`lesson-${globalId}`}
                onClick={() => toggleLesson(idx, li)}
                className="group flex items-start gap-4 text-left w-full px-5 py-4 rounded-xl transition-all duration-200"
                style={{
                  background: completed
                    ? `${mod.accentColor}0d`
                    : 'rgba(12,15,30,0.6)',
                  border: `1px solid ${completed ? mod.accentColor + '30' : 'rgba(99,102,241,0.08)'}`,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  if (!completed) e.currentTarget.style.borderColor = `${mod.accentColor}25`;
                }}
                onMouseLeave={e => {
                  if (!completed) e.currentTarget.style.borderColor = 'rgba(99,102,241,0.08)';
                }}
              >
                {/* Check icon */}
                <span className="flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110">
                  {completed ? (
                    <CheckCircle2 size={18} style={{ color: mod.accentColor }} />
                  ) : (
                    <Circle size={18} style={{ color: '#334155' }} />
                  )}
                </span>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium leading-snug"
                    style={{ color: completed ? '#e2e8f0' : '#94a3b8' }}
                  >
                    {li + 1}. {lesson.name}
                  </p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#475569' }}>
                    {lesson.detail}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Module navigation ── */}
        <div className="flex items-center justify-between mt-12 pt-6" style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}>
          {prevMod ? (
            <Link
              href={`/modulo${idx}`}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-200"
              style={{
                color: '#64748b',
                background: 'rgba(12,15,30,0.6)',
                border: '1px solid rgba(99,102,241,0.08)',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.08)'; }}
            >
              <ArrowLeft size={14} />
              Módulo {prevMod.num}
            </Link>
          ) : (
            <div />
          )}

          {nextMod ? (
            <Link
              href={`/modulo${idx + 2}`}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-200"
              style={{
                color: mod.accentColor,
                background: `${mod.accentColor}10`,
                border: `1px solid ${mod.accentColor}25`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${mod.accentColor}18`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${mod.accentColor}10`; }}
            >
              Módulo {nextMod.num}
              <ChevronRight size={14} />
            </Link>
          ) : (
            <Link
              href="/"
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-200"
              style={{
                color: '#34d399',
                background: 'rgba(52,211,153,0.08)',
                border: '1px solid rgba(52,211,153,0.2)',
              }}
            >
              Concluído! Voltar ao início
              <ChevronRight size={14} />
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
