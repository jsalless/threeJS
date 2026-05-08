'use client';

import { Play, Globe, BookText, Layers, ExternalLink } from 'lucide-react';
import { RESOURCES } from '@/lib/courseData';

const ICON_MAP: Record<string, React.ElementType> = {
  youtube: Play,
  blog: Globe,
  docs: BookText,
  examples: Layers,
};

const COLOR_MAP: Record<string, { color: string; bg: string; border: string }> = {
  youtube: { color: '#f87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  blog: { color: '#818cf8', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)' },
  docs: { color: '#34d399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
  examples: { color: '#22d3ee', bg: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.2)' },
};

export default function ResourcesSection() {
  return (
    <section id="recursos" className="mt-16">
      <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#475569' }}>
        Recursos Externos
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {RESOURCES.map((res) => {
          const Icon = ICON_MAP[res.type] ?? Globe;
          const cfg = COLOR_MAP[res.type] ?? COLOR_MAP.blog;

          return (
            <a
              key={res.url}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300 group"
              style={{
                background: 'rgba(12,15,30,0.6)',
                border: `1px solid rgba(99,102,241,0.12)`,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = cfg.border;
                el.style.background = cfg.bg;
                el.style.boxShadow = `0 4px 20px ${cfg.color}20`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(99,102,241,0.12)';
                el.style.background = 'rgba(12,15,30,0.6)';
                el.style.boxShadow = 'none';
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
              >
                <Icon size={17} style={{ color: cfg.color }} />
              </div>
              <span className="flex-1 text-sm" style={{ color: '#94a3b8' }}>
                {res.label}
              </span>
              <ExternalLink
                size={13}
                className="flex-shrink-0 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                style={{ color: cfg.color }}
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}
