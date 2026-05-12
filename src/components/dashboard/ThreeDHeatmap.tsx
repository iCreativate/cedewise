'use client'

import { useEffect, useMemo, useState } from 'react'
import type { HeatmapControlsState } from './HeatmapControls'

export type HeatPoint = {
  x: number
  y: number
  intensity: number
  label: string
  type: 'Low' | 'Medium' | 'High' | 'Critical'
}

const TYPE_COLOR: Record<HeatPoint['type'], { core: string; glow: string; bar: string; ring: string }> = {
  Low: {
    core: 'rgba(16,185,129,0.85)', // emerald
    glow: 'rgba(16,185,129,0.35)',
    bar: 'from-emerald-300/70 to-emerald-500/20',
    ring: 'ring-emerald-400/30',
  },
  Medium: {
    core: 'rgba(250,204,21,0.85)', // yellow
    glow: 'rgba(250,204,21,0.35)',
    bar: 'from-yellow-300/70 to-yellow-500/20',
    ring: 'ring-yellow-300/30',
  },
  High: {
    core: 'rgba(251,146,60,0.85)', // orange
    glow: 'rgba(251,146,60,0.35)',
    bar: 'from-orange-300/70 to-orange-500/20',
    ring: 'ring-orange-300/30',
  },
  Critical: {
    core: 'rgba(244,63,94,0.88)', // rose/red
    glow: 'rgba(244,63,94,0.40)',
    bar: 'from-rose-300/70 to-rose-600/20',
    ring: 'ring-rose-300/35',
  },
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function formatMoney(n: number) {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(n)
}

export default function ThreeDHeatmap({
  heatPoints,
  controls,
}: {
  heatPoints: HeatPoint[]
  controls: HeatmapControlsState
}) {
  const [hovered, setHovered] = useState<HeatPoint | null>(null)
  const [pinned, setPinned] = useState<HeatPoint | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30)
    return () => clearTimeout(t)
  }, [])

  const scaledPoints = useMemo(() => {
    const scale = controls.intensity / 100
    return heatPoints.map((p) => ({
      ...p,
      scaledIntensity: clamp(Math.round(p.intensity * scale), 10, 100),
    }))
  }, [heatPoints, controls.intensity])

  const activePoint = pinned ?? hovered

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900/50 shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
      {/* neon scanline + vignette */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(34,211,238,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_420px_at_70%_20%,rgba(59,130,246,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_20%_80%,rgba(16,185,129,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:100%_6px] opacity-[0.08]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,transparent_30%,rgba(0,0,0,0.65)_90%)]" />
      </div>

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white">City risk heatmap</div>
            <div className="mt-1 text-xs text-slate-400">
              Hotspots represent {controls.riskLayer.toLowerCase()} for the selected range.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.75)]" />
            <div className="text-[11px] text-slate-400">Live mock feed</div>
          </div>
        </div>

        {/* City / map scene */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
          <div className="relative">
            <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950/30 aspect-[16/10] min-h-[380px] lg:min-h-[520px]">
              {/* map background */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.85]">
                <div className="absolute inset-0 bg-[url('/heatmap-map.svg')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/55 to-slate-950/75" />
              </div>

              {/* grid */}
              {controls.showGrid && (
                <div className="pointer-events-none absolute inset-0 opacity-60">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:28px_100%]" />
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:100%_28px]" />
                </div>
              )}

              {/* subtle "streets" */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.25]">
                <div className="absolute left-[18%] top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent blur-[0.2px]" />
                <div className="absolute left-[52%] top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-blue-300/25 to-transparent blur-[0.2px]" />
                <div className="absolute left-[78%] top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-emerald-300/20 to-transparent blur-[0.2px]" />
                <div className="absolute top-[26%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent blur-[0.2px]" />
                <div className="absolute top-[58%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-300/20 to-transparent blur-[0.2px]" />
                <div className="absolute top-[80%] left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-300/15 to-transparent blur-[0.2px]" />
              </div>

              {/* scene plane with perspective */}
              <div className="absolute inset-0 [perspective:1400px]">
                <div className="absolute inset-0 origin-center [transform-style:preserve-3d] [transform:translateY(14px)_rotateX(58deg)_rotateZ(-12deg)_scale(1.08)]">
                  {/* faux city blocks */}
                  <CityBlocks />

                  {/* hotspots */}
                  {scaledPoints.map((p) => (
                    <Hotspot
                      key={p.label}
                      point={p}
                      radius={controls.radius}
                      showGlow={controls.showGlow}
                      showColumns={controls.showColumns}
                      mounted={mounted}
                      isHovered={activePoint?.label === p.label}
                      onHover={(v) => {
                        if (!pinned) setHovered(v)
                      }}
                      onLeave={() => {
                        if (!pinned) setHovered(null)
                      }}
                      onClick={(v) => {
                        setPinned((cur) => (cur?.label === v.label ? null : v))
                        setHovered(null)
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* tooltip */}
              {activePoint && (
                <Tooltip
                  point={activePoint}
                  intensityScaled={
                    scaledPoints.find((p) => p.label === activePoint.label)?.scaledIntensity ??
                    activePoint.intensity
                  }
                  pinned={Boolean(pinned)}
                  onClose={() => setPinned(null)}
                />
              )}
            </div>
          </div>

          {/* right panel: legend + insights */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">Insights</div>
              <div className="text-[11px] text-slate-400">{controls.timeRange}</div>
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Hover a hotspot to inspect exposure, claims, and risk classification.
            </div>

            <div className="mt-5 space-y-3">
              <LegendRow label="Low" color="bg-emerald-400" note="Low concentration" />
              <LegendRow label="Medium" color="bg-yellow-300" note="Elevated activity" />
              <LegendRow label="High" color="bg-orange-400" note="High attention zone" />
              <LegendRow label="Critical" color="bg-rose-500" note="Immediate review" />
            </div>

            <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/40 p-4">
              <div className="text-xs text-slate-400">Recommendation</div>
              <div className="mt-1 text-sm text-white font-semibold">Prioritize underwriting review on critical clusters.</div>
              <div className="mt-2 text-xs text-slate-400">
                Activate stricter limits and schedule broker outreach for elevated regions.
              </div>
            </div>

            <div className="mt-6 text-[11px] text-slate-500">
              Visual is a premium mock (CSS + transforms). Can be swapped for a real geo layer when GIS is available.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function LegendRow({ label, color, note }: { label: string; color: string; note: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/30 p-3">
      <div className="flex items-center gap-3">
        <div className={['h-2.5 w-2.5 rounded-full', color, 'shadow-[0_0_18px_rgba(255,255,255,0.22)]'].join(' ')} />
        <div className="text-xs font-medium text-white">{label}</div>
      </div>
      <div className="text-[11px] text-slate-400">{note}</div>
    </div>
  )
}

function Tooltip({
  point,
  intensityScaled,
  pinned,
  onClose,
}: {
  point: HeatPoint
  intensityScaled: number
  pinned: boolean
  onClose: () => void
}) {
  const exposure = Math.round(2_500_000_000 * (intensityScaled / 100) * 0.42)
  const claims = Math.max(1, Math.round((intensityScaled / 100) * (point.type === 'Critical' ? 38 : 22)))
  return (
    <div className="absolute left-5 bottom-5 w-[min(360px,calc(100%-40px))] rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-xl p-4 shadow-[0_30px_80px_rgba(0,0,0,0.65)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{point.label}</div>
          <div className="mt-0.5 text-xs text-slate-400">Risk level: <span className="text-slate-200">{point.type}</span></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-xl bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-slate-200">
            {intensityScaled}%
          </div>
          {pinned && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-slate-200 hover:bg-white/10"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl bg-white/5 border border-white/10 p-3">
          <div className="text-slate-400">Estimated exposure</div>
          <div className="mt-1 font-semibold text-white">{formatMoney(exposure)}</div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10 p-3">
          <div className="text-slate-400">Active claims</div>
          <div className="mt-1 font-semibold text-white">{claims}</div>
        </div>
      </div>

      <div className="mt-3 text-[11px] text-slate-500">
        {pinned ? 'Pinned. Click another hotspot to switch.' : 'Click a hotspot to pin this card.'}
      </div>
    </div>
  )
}

function CityBlocks() {
  // deterministic pseudo blocks
  const blocks = useMemo(() => {
    const seed = [
      { x: 8, y: 22, w: 12, h: 10, z: 10 },
      { x: 22, y: 18, w: 14, h: 11, z: 16 },
      { x: 38, y: 30, w: 16, h: 12, z: 12 },
      { x: 58, y: 20, w: 12, h: 10, z: 18 },
      { x: 72, y: 34, w: 10, h: 9, z: 14 },
      { x: 16, y: 56, w: 14, h: 12, z: 18 },
      { x: 36, y: 62, w: 10, h: 9, z: 12 },
      { x: 58, y: 60, w: 14, h: 12, z: 16 },
      { x: 76, y: 66, w: 10, h: 9, z: 12 },
    ]
    return seed
  }, [])

  return (
    <div className="absolute inset-0">
      {blocks.map((b, idx) => (
        <div
          key={idx}
          className="absolute rounded-md border border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.w}%`,
            height: `${b.h}%`,
            transform: `translateZ(${b.z}px)`,
          }}
        />
      ))}
    </div>
  )
}

function Hotspot({
  point,
  radius,
  showGlow,
  showColumns,
  mounted,
  isHovered,
  onHover,
  onLeave,
  onClick,
}: {
  point: HeatPoint & { scaledIntensity: number }
  radius: number
  showGlow: boolean
  showColumns: boolean
  mounted: boolean
  isHovered: boolean
  onHover: (p: HeatPoint) => void
  onLeave: () => void
  onClick: (p: HeatPoint) => void
}) {
  const c = TYPE_COLOR[point.type]
  const barHeight = clamp((point.scaledIntensity / 100) * 180, 26, 190)
  const blob = Math.round(radius * (0.7 + point.scaledIntensity / 180))

  return (
    <div
      className="absolute"
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
      onMouseEnter={() => onHover(point)}
      onMouseLeave={onLeave}
      onClick={() => onClick(point)}
    >
      {/* anchor */}
      <div
        className={[
          'relative -translate-x-1/2 -translate-y-1/2',
          'transition-transform duration-200',
          isHovered ? 'scale-105' : 'scale-100',
        ].join(' ')}
      >
        {/* glow blob */}
        {showGlow && (
          <div
            className={[
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              'rounded-full blur-2xl',
              point.type === 'Critical' ? 'animate-pulse' : '',
            ].join(' ')}
            style={{
              width: blob,
              height: blob,
              background: `radial-gradient(circle at 50% 50%, ${c.core} 0%, ${c.glow} 35%, rgba(0,0,0,0) 70%)`,
              opacity: 0.95,
            }}
          />
        )}

        {/* marker */}
        <div
          className={[
            'relative h-3.5 w-3.5 rounded-full',
            'ring-2',
            c.ring,
            'bg-white/10 backdrop-blur-sm',
            'shadow-[0_0_25px_rgba(255,255,255,0.18)]',
            'cursor-pointer',
          ].join(' ')}
          style={{
            background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), ${c.core})`,
          }}
        />

        {/* bar */}
        {showColumns && (
          <div
            className={[
              'absolute left-1/2 top-1/2 -translate-x-1/2',
              'w-6 rounded-md border border-white/10',
              'bg-gradient-to-b',
              c.bar,
              'shadow-[0_0_22px_rgba(255,255,255,0.12),0_12px_30px_rgba(0,0,0,0.35)]',
              'origin-bottom transition-transform duration-700',
            ].join(' ')}
            style={{
              height: barHeight,
              transform: `translateX(-50%) translateY(-8px) translateZ(${24 + barHeight / 3}px) scaleY(${mounted ? 1 : 0.05})`,
              filter: point.type === 'Critical' ? 'drop-shadow(0 0 18px rgba(244,63,94,0.35))' : undefined,
            }}
          />
        )}
      </div>
    </div>
  )
}

