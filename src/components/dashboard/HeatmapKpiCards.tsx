'use client'

import { BuildingOfficeIcon, ChartBarIcon, FireIcon, UserGroupIcon } from '@heroicons/react/24/outline'

type Kpi = {
  title: string
  value: string
  delta?: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  accent: 'cyan' | 'emerald' | 'amber' | 'rose'
}

const ACCENT: Record<Kpi['accent'], { ring: string; glow: string; bg: string; text: string }> = {
  cyan: {
    ring: 'ring-cyan-500/30',
    glow: 'shadow-[0_0_0_1px_rgba(34,211,238,0.18),0_20px_60px_rgba(34,211,238,0.10)]',
    bg: 'from-cyan-500/15 to-cyan-500/5',
    text: 'text-cyan-200',
  },
  emerald: {
    ring: 'ring-emerald-500/25',
    glow: 'shadow-[0_0_0_1px_rgba(16,185,129,0.16),0_20px_60px_rgba(16,185,129,0.10)]',
    bg: 'from-emerald-500/15 to-emerald-500/5',
    text: 'text-emerald-200',
  },
  amber: {
    ring: 'ring-amber-500/25',
    glow: 'shadow-[0_0_0_1px_rgba(245,158,11,0.16),0_20px_60px_rgba(245,158,11,0.10)]',
    bg: 'from-amber-500/15 to-amber-500/5',
    text: 'text-amber-200',
  },
  rose: {
    ring: 'ring-rose-500/25',
    glow: 'shadow-[0_0_0_1px_rgba(244,63,94,0.18),0_20px_60px_rgba(244,63,94,0.10)]',
    bg: 'from-rose-500/15 to-rose-500/5',
    text: 'text-rose-200',
  },
}

export default function HeatmapKpiCards() {
  const kpis: Kpi[] = [
    { title: 'Total Risk Zones', value: '48', delta: '+6', icon: BuildingOfficeIcon, accent: 'cyan' },
    { title: 'High Exposure Areas', value: '12', delta: '+2', icon: FireIcon, accent: 'rose' },
    { title: 'Active Claims Density', value: '3.8', delta: '-0.4', icon: ChartBarIcon, accent: 'amber' },
    { title: 'Broker Activity Points', value: '96', delta: '+14', icon: UserGroupIcon, accent: 'emerald' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon
        const a = ACCENT[kpi.accent]
        const isNegative = (kpi.delta ?? '').trim().startsWith('-')

        return (
          <div
            key={kpi.title}
            className={[
              'relative overflow-hidden rounded-2xl',
              'bg-gradient-to-b from-slate-900/60 to-slate-950/60',
              'ring-1',
              a.ring,
              a.glow,
              'border border-white/5',
              'backdrop-blur-xl',
            ].join(' ')}
          >
            <div className={['absolute inset-0 bg-gradient-to-br', a.bg].join(' ')} />
            <div className="relative p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs tracking-wide text-slate-300/90">{kpi.title}</div>
                  <div className="mt-1 flex items-end gap-2">
                    <div className="text-2xl font-semibold text-white">{kpi.value}</div>
                    {kpi.delta && (
                      <div
                        className={[
                          'text-xs font-medium',
                          isNegative ? 'text-rose-300' : a.text,
                        ].join(' ')}
                      >
                        {kpi.delta}
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <div className={['absolute -inset-2 rounded-xl blur-xl opacity-60', a.text].join(' ')} />
                  <div className="relative rounded-xl bg-white/5 ring-1 ring-white/10 p-2">
                    <Icon className="h-5 w-5 text-slate-100" />
                  </div>
                </div>
              </div>

              <div className="mt-3 h-[1px] w-full bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
              <div className="mt-3 text-[11px] text-slate-400">
                Updated moments ago • calibrated for executive view
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

