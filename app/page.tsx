'use client';

import dynamic from 'next/dynamic';
import { MODULES, COURSE_STATS } from '@/lib/courseData';
import { useProgress } from '@/lib/useProgress';
import ModuleCard from '@/components/ModuleCard';
import ResourcesSection from '@/components/ResourcesSection';
import {
  Layers,
  BookOpen,
  Clock,
  Folder,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { useState } from 'react';

// Three.js canvas loaded only on client (no SSR)
const ThreeCanvas = dynamic(() => import('@/components/ThreeCanvas'), { ssr: false });

const TOTAL_LESSONS = MODULES.reduce((acc, m) => acc + m.lessons.length, 0);

export default function Home() {
  const {
    mounted,
    completedCount,
    percentage,
    getModuleProgress,
    resetProgress,
  } = useProgress(TOTAL_LESSONS);

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    if (showResetConfirm) {
      resetProgress();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', width: '100%' }}>

      {/* ── Hero Section ──────────────────────────────────── */}
      <section
        id="hero"
        className="relative overflow-hidden"
        style={{ minHeight: '420px' }}
      >
        {/* Three.js canvas background */}
        <div className="absolute inset-0" style={{ opacity: 0.85 }}>
          <ThreeCanvas />
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(5,7,15,0.3) 0%, rgba(5,7,15,0.7) 60%, rgba(5,7,15,1) 100%)',
          }}
        />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 flex flex-col items-start">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 font-mono text-xs tracking-widest"
            style={{
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.35)',
              color: '#818cf8',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#22d3ee' }}
            />
            THREE.JS · CURSO COMPLETO
          </div>

          {/* Title */}
          <h1
            className="font-heading font-bold leading-tight mb-3"
            style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', color: '#f1f5f9' }}
          >
            Curso Completo de{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #22d3ee 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Three.js
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base mb-2" style={{ color: '#94a3b8', maxWidth: '520px' }}>
            Do zero ao avançado: WebGL, física, shaders e muito mais.
          </p>
          <p className="text-sm" style={{ color: '#475569' }}>
            Baseado na playlist de Wael Yasmina + conteúdo expandido.
          </p>

          {/* Stats chips */}
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              { icon: Layers, label: `${COURSE_STATS.modules} módulos` },
              { icon: BookOpen, label: `${COURSE_STATS.lessons} aulas` },
              { icon: Clock, label: COURSE_STATS.duration + ' de estudo' },
              { icon: Folder, label: `${COURSE_STATS.projects} projetos` },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
                style={{
                  background: 'rgba(12,15,30,0.7)',
                  border: '1px solid rgba(99,102,241,0.15)',
                  color: '#94a3b8',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Icon size={14} style={{ color: '#6366f1' }} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 pb-20">

        {/* ── Overall Progress Card ── */}
        <section
          id="progresso"
          className="rounded-2xl p-6 mb-10 -mt-2"
          style={{
            background: 'rgba(12,15,30,0.9)',
            border: '1px solid rgba(99,102,241,0.2)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.08)',
          }}
        >
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="font-heading font-semibold text-lg" style={{ color: '#e2e8f0' }}>
                Seu Progresso
              </h2>
              <p className="text-sm mt-0.5" style={{ color: '#64748b' }}>
                {mounted
                  ? completedCount > 0
                    ? `${completedCount} de ${TOTAL_LESSONS} aulas concluídas`
                    : 'Marque as aulas à medida que avançar'
                  : 'Carregando progresso...'}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div
                className="font-mono font-bold text-2xl"
                style={{
                  color: percentage === 100 ? '#34d399' : '#818cf8',
                }}
              >
                {mounted ? `${percentage}%` : '--'}
              </div>
              {percentage === 100 && mounted && (
                <span className="text-xs" style={{ color: '#34d399' }}>Completo! 🎉</span>
              )}
            </div>
          </div>

          {/* Big progress bar */}
          <div
            className="h-2 rounded-full overflow-hidden mb-5"
            style={{ background: 'rgba(99,102,241,0.12)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              style={{
                width: mounted ? `${percentage}%` : '0%',
                background: percentage === 100
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : 'linear-gradient(90deg, #6366f1, #22d3ee)',
              }}
            />
          </div>

          {/* Module mini-progress row */}
          <div className="flex gap-1.5 mb-5">
            {MODULES.map((mod, i) => {
              const prog = mounted ? getModuleProgress(i, mod.lessons.length) : { pct: 0 };
              return (
                <div
                  key={i}
                  className="flex-1 h-1.5 rounded-full overflow-hidden"
                  title={`${mod.title}: ${prog.pct}%`}
                  style={{ background: 'rgba(99,102,241,0.1)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${prog.pct}%`,
                      background: mod.accentColor,
                      opacity: prog.pct === 0 ? 0.2 : 1,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Concluídas', value: mounted ? completedCount : '—', color: '#818cf8' },
              { label: 'Restantes', value: mounted ? TOTAL_LESSONS - completedCount : '—', color: '#22d3ee' },
              { label: 'Total', value: TOTAL_LESSONS, color: '#94a3b8' },
              { label: 'Módulos', value: COURSE_STATS.modules, color: '#94a3b8' },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(5,7,15,0.5)', border: '1px solid rgba(99,102,241,0.08)' }}
              >
                <div className="font-mono font-bold text-xl" style={{ color }}>
                  {value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#475569' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Reset */}
          {mounted && completedCount > 0 && (
            <div className="flex items-center justify-end mt-4">
              <button
                onClick={handleReset}
                id="reset-progress-btn"
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
                style={{
                  color: showResetConfirm ? '#f87171' : '#475569',
                  background: showResetConfirm ? 'rgba(239,68,68,0.1)' : 'transparent',
                  border: `1px solid ${showResetConfirm ? 'rgba(239,68,68,0.25)' : 'transparent'}`,
                }}
              >
                {showResetConfirm ? (
                  <>
                    <AlertTriangle size={12} />
                    Clique para confirmar
                  </>
                ) : (
                  <>
                    <RotateCcw size={12} />
                    Resetar progresso
                  </>
                )}
              </button>
            </div>
          )}
        </section>

        {/* ── Prerequisitos ── */}
        <div
          className="flex gap-3 items-start rounded-xl p-4 mb-8"
          style={{
            background: 'rgba(99,102,241,0.06)',
            border: '1px solid rgba(99,102,241,0.15)',
          }}
        >
          <div
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
            style={{ background: 'rgba(99,102,241,0.15)' }}
          >
            <span style={{ color: '#818cf8', fontSize: 14, fontWeight: 700 }}>›</span>
          </div>
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: '#c7d2fe' }}>Pré-requisitos</p>
            <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
              HTML, CSS e JavaScript básico/intermediário. Noções de matemática (vetores, trigonometria)
              são um plus, mas não obrigatórias — o curso os aborda ao longo das aulas.
            </p>
          </div>
        </div>

        {/* ── Modules ── */}
        <section id="modulos">
          <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#475569' }}>
            Trilha de Aprendizado
          </p>
          <div className="flex flex-col gap-3">
            {MODULES.map((mod, i) => (
              <ModuleCard
                key={mod.num}
                module={mod}
                moduleIdx={i}
                progress={getModuleProgress(i, mod.lessons.length)}
                mounted={mounted}
              />
            ))}
          </div>
        </section>

        {/* ── Resources ── */}
        <ResourcesSection />

        {/* ── Footer ── */}
        <footer className="mt-16 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}>
          <p className="font-mono text-xs" style={{ color: '#334155' }}>
            Three.js Course Dashboard · {new Date().getFullYear()}
          </p>
          <p className="text-xs" style={{ color: '#1e293b' }}>
            Progresso salvo localmente no navegador
          </p>
        </footer>

      </div>
    </div>
  );
}
