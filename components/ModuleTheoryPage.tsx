'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronRight, CheckCircle2, Circle, BookOpen, Clock } from 'lucide-react';
import { MODULES } from '@/lib/courseData';
import { useProgress } from '@/lib/useProgress';
import { useMemo, useState } from 'react';

const TOTAL_LESSONS = MODULES.reduce((acc, m) => acc + m.lessons.length, 0);

/* ─── Primitive types for theory blocks ─── */
export interface ConceptCard { title: string; text: string; }
export interface DefItem { term: string; desc: string; }
export interface CodeBlock { label: string; code: string; }
export interface Callout { type: 'info' | 'warn' | 'tip'; text: string; }
export type ContentBlock =
  | { kind: 'text'; title: string; paragraphs: string[]; callout?: Callout; }
  | { kind: 'concepts'; title: string; paragraphs?: string[]; cards: ConceptCard[]; callout?: Callout; }
  | { kind: 'defs'; title: string; paragraphs?: string[]; items: DefItem[]; callout?: Callout; }
  | { kind: 'code'; title: string; paragraphs?: string[]; blocks: CodeBlock[]; callout?: Callout; }
  | { kind: 'mixed'; title: string; paragraphs?: string[]; defs?: DefItem[]; cards?: ConceptCard[]; code?: CodeBlock; callout?: Callout; };

export interface ExerciseTask { label: string; }
export interface Exercise {
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  desc: string;
  tasks: ExerciseTask[];
}

export interface ModuleTheoryData {
  blocks: ContentBlock[];
  exercises: Exercise[];
}

/* ─── Helpers ─── */
const diffLabel = { easy: '● FÁCIL', medium: '● MÉDIO', hard: '● DESAFIO' };
const diffStyle: Record<string, React.CSSProperties> = {
  easy:   { background: 'rgba(74,222,128,0.1)',  color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' },
  medium: { background: 'rgba(251,191,36,0.1)',  color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' },
  hard:   { background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' },
};

const calloutStyle = {
  info: { bg: 'rgba(34,211,238,0.05)',  border: 'rgba(34,211,238,0.15)',  icon: '◈', color: '#22d3ee' },
  warn: { bg: 'rgba(251,191,36,0.05)',  border: 'rgba(251,191,36,0.15)',  icon: '⚠', color: '#fbbf24' },
  tip:  { bg: 'rgba(167,139,250,0.05)', border: 'rgba(167,139,250,0.15)', icon: '◆', color: '#a78bfa' },
};

/* ─── Sub-components ─── */
function BlockTitle({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ width: 3, height: 20, background: accent, borderRadius: 2, flexShrink: 0 }} />
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: '#e2e8f0' }}>
        {children}
      </span>
    </div>
  );
}

function Para({ html }: { html: string }) {
  return (
    <p
      style={{ fontSize: 14.5, color: '#c5c9d6', lineHeight: 1.8, marginBottom: 12 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function ConceptGrid({ cards }: { cards: ConceptCard[] }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, margin: '16px 0' }}>
      {cards.map((c, i) => (
        <div key={i} style={{ background: '#0c0f1e', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, padding: 16, transition: 'border-color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)')}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 11, fontWeight: 700, color: '#6366f1', marginBottom: 6 }}>{c.title}</div>
          <div style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.6 }}>{c.text}</div>
        </div>
      ))}
    </div>
  );
}

function DefList({ items }: { items: DefItem[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '14px 0' }}>
      {items.map((d, i) => (
        <div key={i} style={{ background: '#0c0f1e', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 8, padding: '12px 16px', display: 'grid', gridTemplateColumns: '150px 1fr', gap: 12 }}>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: 11.5, fontWeight: 700, color: '#f59e0b', paddingTop: 1 }}>{d.term}</span>
          <span style={{ fontSize: 13, color: '#c5c9d6', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: d.desc }} />
        </div>
      ))}
    </div>
  );
}

function Code({ block }: { block: CodeBlock }) {
  return (
    <div style={{ background: '#070809', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 10, overflow: 'hidden', margin: '16px 0', fontFamily: 'Space Mono, monospace' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px', background: '#0c0f1e', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#ff5f57','#febc2e','#28c840'].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
        </div>
        <span style={{ fontSize: 11, color: '#475569' }}>{block.label}</span>
      </div>
      <pre style={{ padding: '16px 20px', fontSize: 12, lineHeight: 1.85, overflowX: 'auto', color: '#abb2bf', margin: 0, whiteSpace: 'pre' }}>
        {block.code}
      </pre>
    </div>
  );
}

function CalloutBox({ c }: { c: Callout }) {
  const s = calloutStyle[c.type];
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: '14px 18px', margin: '16px 0', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 18, color: s.color, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
      <span style={{ fontSize: 13.5, color: '#c5c9d6', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: c.text }} />
    </div>
  );
}

function ContentSection({ block, accent }: { block: ContentBlock; accent: string }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <BlockTitle accent={accent}>{block.title}</BlockTitle>

      {'paragraphs' in block && block.paragraphs?.map((p, i) => <Para key={i} html={p} />)}

      {block.kind === 'concepts' && <ConceptGrid cards={block.cards} />}
      {block.kind === 'defs' && <DefList items={block.items} />}
      {block.kind === 'code' && block.blocks.map((b, i) => <Code key={i} block={b} />)}
      {block.kind === 'mixed' && (
        <>
          {block.defs && <DefList items={block.defs} />}
          {block.cards && <ConceptGrid cards={block.cards} />}
          {block.code && <Code block={block.code} />}
        </>
      )}

      {'callout' in block && block.callout && <CalloutBox c={block.callout} />}
    </div>
  );
}

/* ─── Main export ─── */
interface Props {
  moduleNum: number;
  theory: ModuleTheoryData;
}

export default function ModuleTheoryPage({ moduleNum, theory }: Props) {
  const idx = moduleNum - 1;
  const mod = MODULES[idx];

  const { mounted, isLessonCompleted, toggleLesson, getModuleProgress } = useProgress(TOTAL_LESSONS);

  // lessonOffset kept for potential future use but not needed for 2-arg API
  const _lessonOffset = useMemo(
    () => MODULES.slice(0, idx).reduce((acc, m) => acc + m.lessons.length, 0),
    [idx]
  ); void _lessonOffset;

  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const toggleTask = (key: string) => setTasks(p => ({ ...p, [key]: !p[key] }));

  if (!mod) return null;

  const { pct, done, total } = getModuleProgress(idx, mod.lessons.length);
  const prevMod = idx > 0 ? MODULES[idx - 1] : null;
  const nextMod = idx < MODULES.length - 1 ? MODULES[idx + 1] : null;

  const levelLabel: Record<string, string> = { beginner: 'Iniciante', intermediate: 'Intermediário', advanced: 'Avançado' };
  const levelColor: Record<string, string> = { beginner: '#34d399', intermediate: '#f59e0b', advanced: '#f87171' };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', width: '100%' }}>
      {/* ── Top bar ── */}
      <div style={{ borderBottom: '1px solid rgba(99,102,241,0.12)', background: 'rgba(5,7,15,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm transition-colors duration-200" style={{ color: '#64748b' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#94a3b8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
            <ArrowLeft size={15} /> Dashboard
          </Link>
          <span className="font-mono text-xs" style={{ color: '#334155' }}>Módulo {mod.num}</span>
        </div>
      </div>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg,rgba(12,15,30,1) 0%,rgba(12,15,30,0.85) 100%)', borderBottom: `1px solid ${mod.accentColor}22` }}>
        <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse 60% 50% at 80% 50%, ${mod.accentColor}33 0%, transparent 70%)` }} />
        <div className="relative max-w-3xl mx-auto px-6 py-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs tracking-widest mb-5"
            style={{ background: `${mod.accentColor}18`, border: `1px solid ${mod.accentColor}40`, color: mod.accentColor }}>
            MÓDULO {mod.num}
            <span className="px-2 py-0.5 rounded-full text-xs"
              style={{ background: `${levelColor[mod.level]}18`, color: levelColor[mod.level], border: `1px solid ${levelColor[mod.level]}30` }}>
              {levelLabel[mod.level]}
            </span>
          </div>
          <h1 className="font-heading font-bold leading-tight mb-3" style={{ fontSize: 'clamp(1.5rem,4vw,2.4rem)', color: '#f1f5f9' }}>
            {mod.title}
          </h1>
          <p style={{ color: '#64748b', maxWidth: 480 }} className="text-sm mb-8">{mod.desc}</p>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
              <BookOpen size={14} style={{ color: mod.accentColor }} /> {mod.lessons.length} aulas
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
              <Clock size={14} style={{ color: mod.accentColor }} /> ~{Math.ceil(mod.lessons.length * 0.5)}h estimadas
            </div>
            {mounted && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono ml-auto"
                style={{ background: pct === 100 ? 'rgba(52,211,153,0.1)' : `${mod.accentColor}12`, border: `1px solid ${pct === 100 ? '#34d399' : mod.accentColor}30`, color: pct === 100 ? '#34d399' : mod.accentColor }}>
                {done}/{total} · {pct}%{pct === 100 && ' ✓'}
              </div>
            )}
          </div>
          {mounted && (
            <div className="mt-5 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(99,102,241,0.1)', maxWidth: 400 }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: pct === 100 ? 'linear-gradient(90deg,#10b981,#34d399)' : `linear-gradient(90deg,${mod.accentColor},${mod.accentColor}aa)` }} />
            </div>
          )}
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-6 py-10">

        {/* ── Theory blocks ── */}
        <p className="font-mono text-xs tracking-widest uppercase mb-8" style={{ color: '#334155' }}>Material Teórico</p>
        {theory.blocks.map((block, i) => (
          <ContentSection key={i} block={block} accent={mod.accentColor} />
        ))}

        {/* ── Lessons ── */}
        <div style={{ borderTop: '1px solid rgba(99,102,241,0.1)', paddingTop: 40, marginTop: 16 }}>
          <p className="font-mono text-xs tracking-widest uppercase mb-5" style={{ color: '#334155' }}>Aulas deste módulo</p>
          <div className="flex flex-col gap-2">
            {mod.lessons.map((lesson, li) => {
              const completed = mounted ? isLessonCompleted(idx, li) : false;
              return (
                <button key={li} id={`lesson-${idx}-${li}`} onClick={() => toggleLesson(idx, li)}
                  className="group flex items-start gap-4 text-left w-full px-5 py-4 rounded-xl transition-all duration-200"
                  style={{ background: completed ? `${mod.accentColor}0d` : 'rgba(12,15,30,0.6)', border: `1px solid ${completed ? mod.accentColor + '30' : 'rgba(99,102,241,0.08)'}`, cursor: 'pointer' }}
                  onMouseEnter={e => { if (!completed) e.currentTarget.style.borderColor = `${mod.accentColor}25`; }}
                  onMouseLeave={e => { if (!completed) e.currentTarget.style.borderColor = 'rgba(99,102,241,0.08)'; }}>
                  <span className="flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110">
                    {completed ? <CheckCircle2 size={18} style={{ color: mod.accentColor }} /> : <Circle size={18} style={{ color: '#334155' }} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug" style={{ color: completed ? '#e2e8f0' : '#94a3b8' }}>
                      {li + 1}. {lesson.name}
                    </p>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: '#475569' }}>{lesson.detail}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Exercises ── */}
        <div style={{ marginTop: 48, background: '#0c0f1e', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ background: `linear-gradient(135deg,${mod.accentColor}12,rgba(167,139,250,0.06))`, borderBottom: '1px solid rgba(99,102,241,0.12)', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, background: `${mod.accentColor}18`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: `1px solid ${mod.accentColor}30` }}>✦</div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 600, color: '#e2e8f0' }}>Exercícios — Módulo {mod.num}</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>3 exercícios práticos · {mod.title}</div>
            </div>
          </div>

          {theory.exercises.map((ex, ei) => (
            <div key={ei} style={{ padding: '20px 24px', borderBottom: ei < theory.exercises.length - 1 ? '1px solid rgba(99,102,241,0.08)' : 'none', display: 'grid', gridTemplateColumns: '48px 1fr', gap: 16 }}>
              <span style={{ fontFamily: 'Space Mono,monospace', fontSize: 22, fontWeight: 700, color: 'rgba(99,102,241,0.25)', lineHeight: 1, paddingTop: 4 }}>
                {`0${ei + 1}`.slice(-2)}
              </span>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontFamily: 'Space Mono,monospace', padding: '2px 8px', borderRadius: 20, marginBottom: 10, ...diffStyle[ex.difficulty] }}>
                  {diffLabel[ex.difficulty]}
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', marginBottom: 6 }}>{ex.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 12 }}>{ex.desc}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {ex.tasks.map((t, ti) => {
                    const key = `${ei}-${ti}`;
                    const done = tasks[key] ?? false;
                    return (
                      <label key={ti} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                        <div onClick={() => toggleTask(key)}
                          style={{ width: 16, height: 16, border: done ? 'none' : '1.5px solid rgba(99,102,241,0.3)', borderRadius: 4, flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, background: done ? mod.accentColor : 'transparent', color: '#000', cursor: 'pointer', transition: 'all 0.2s' }}>
                          {done && '✓'}
                        </div>
                        <span style={{ fontSize: 12.5, color: done ? '#94a3b8' : '#6b7280', lineHeight: 1.6, textDecoration: done ? 'line-through' : 'none' }}>
                          {t.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center justify-between mt-12 pt-6" style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}>
          {prevMod ? (
            <Link href={`/modulo${idx}`} className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-200"
              style={{ color: '#64748b', background: 'rgba(12,15,30,0.6)', border: '1px solid rgba(99,102,241,0.08)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.08)'; }}>
              <ArrowLeft size={14} /> Módulo {prevMod.num}
            </Link>
          ) : <div />}

          {nextMod ? (
            <Link href={`/modulo${idx + 2}`} className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-200"
              style={{ color: mod.accentColor, background: `${mod.accentColor}10`, border: `1px solid ${mod.accentColor}25` }}
              onMouseEnter={e => { e.currentTarget.style.background = `${mod.accentColor}18`; }}
              onMouseLeave={e => { e.currentTarget.style.background = `${mod.accentColor}10`; }}>
              Módulo {nextMod.num} <ChevronRight size={14} />
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg"
              style={{ color: '#34d399', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
              Concluído! Voltar ao início <ChevronRight size={14} />
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
