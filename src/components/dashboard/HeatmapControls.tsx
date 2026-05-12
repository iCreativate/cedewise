'use client'

import { Switch } from '@headlessui/react'

export type HeatmapControlsState = {
  riskLayer: 'Policy Exposure' | 'Claims Density' | 'Broker Activity' | 'Regional Migration' | 'Loss Ratio'
  timeRange: 'Today' | '7 Days' | '30 Days' | 'Quarter' | 'Year'
  intensity: number
  radius: number
  showColumns: boolean
  showGlow: boolean
  showGrid: boolean
}

function classNames(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

export default function HeatmapControls({
  value,
  onChange,
}: {
  value: HeatmapControlsState
  onChange: (next: HeatmapControlsState) => void
}) {
  return (
    <div className="rounded-2xl bg-slate-950/50 border border-white/10 ring-1 ring-white/10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-white">Controls</div>
            <div className="text-xs text-slate-400 mt-0.5">Fine-tune layers, range, and visual intensity.</div>
          </div>
          <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.7)]" />
        </div>

        <div className="mt-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-300">Risk Layer</label>
              <select
                className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 text-sm px-3 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/60"
                value={value.riskLayer}
                onChange={(e) => onChange({ ...value, riskLayer: e.target.value as HeatmapControlsState['riskLayer'] })}
              >
                <option>Policy Exposure</option>
                <option>Claims Density</option>
                <option>Broker Activity</option>
                <option>Regional Migration</option>
                <option>Loss Ratio</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300">Time Range</label>
              <select
                className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 text-slate-100 text-sm px-3 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500/60"
                value={value.timeRange}
                onChange={(e) => onChange({ ...value, timeRange: e.target.value as HeatmapControlsState['timeRange'] })}
              >
                <option>Today</option>
                <option>7 Days</option>
                <option>30 Days</option>
                <option>Quarter</option>
                <option>Year</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-300">Intensity</label>
              <div className="text-xs text-slate-300">{value.intensity}%</div>
            </div>
            <input
              type="range"
              min={25}
              max={140}
              value={value.intensity}
              onChange={(e) => onChange({ ...value, intensity: Number(e.target.value) })}
              className="mt-2 w-full accent-cyan-400"
            />
            <div className="mt-1 text-[11px] text-slate-500">Scales heat glow and column height.</div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-slate-300">Radius</label>
              <div className="text-xs text-slate-300">{value.radius}px</div>
            </div>
            <input
              type="range"
              min={40}
              max={160}
              value={value.radius}
              onChange={(e) => onChange({ ...value, radius: Number(e.target.value) })}
              className="mt-2 w-full accent-cyan-400"
            />
            <div className="mt-1 text-[11px] text-slate-500">Controls hotspot spread.</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Toggle
              label="Show markers"
              checked={value.showColumns}
              onChange={(checked) => onChange({ ...value, showColumns: checked })}
            />
            <Toggle
              label="Show Heat Glow"
              checked={value.showGlow}
              onChange={(checked) => onChange({ ...value, showGlow: checked })}
            />
            <Toggle
              label="Show Region Grid"
              checked={value.showGrid}
              onChange={(checked) => onChange({ ...value, showGrid: checked })}
            />
          </div>

          <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Active layer</span>
              <span className="text-white font-medium">{value.riskLayer}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-slate-400">Range</span>
              <span className="text-white font-medium">{value.timeRange}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-slate-200">{label}</div>
        <Switch
          checked={checked}
          onChange={onChange}
          className={classNames(
            checked ? 'bg-cyan-500' : 'bg-white/10',
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/60'
          )}
        >
          <span
            className={classNames(
              checked ? 'translate-x-6' : 'translate-x-1',
              'inline-block h-4 w-4 transform rounded-full bg-white transition-transform'
            )}
          />
        </Switch>
      </div>
      <div className="mt-2 h-[1px] bg-white/10" />
      <div className="mt-2 text-[11px] text-slate-500">{checked ? 'Enabled' : 'Disabled'}</div>
    </div>
  )
}

