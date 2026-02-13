'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

interface SubmissionData {
  period: string
  count: number
  type: 'Recent' | 'Medium' | 'Older'
}

interface Props {
  data: SubmissionData[]
}

const COLORS = {
  Recent: '#3B82F6', // blue-500
  Medium: '#F59E0B', // amber-500
  Older: '#EF4444',  // red-500
}

export default function SubmissionsByPeriod({ data }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    // Group data by period
    const periods = [...new Set(data.map(item => item.period))]
    const types = ['Recent', 'Medium', 'Older'] as const

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: periods,
        datasets: types.map(type => ({
          label: type,
          data: periods.map(period => 
            data.find(d => d.period === period && d.type === type)?.count || 0
          ),
          backgroundColor: COLORS[type],
          borderRadius: 4,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              boxHeight: 12,
              padding: 15,
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            padding: 12,
            titleFont: {
              size: 13,
              weight: 500
            },
            bodyFont: {
              size: 12
            },
            callbacks: {
              label: function(context) {
                return ` ${context.dataset.label}: ${context.parsed.y} submissions`
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 12
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              font: {
                size: 12
              }
            }
          }
        }
      }
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Submissions by Period</h3>
          <p className="text-sm text-gray-500 mt-1">Distribution of submissions over time</p>
        </div>
        <div className="flex items-center gap-6">
          {Object.entries(COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-600">{type}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="relative h-[300px]">
        <canvas ref={chartRef} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {data.map((item) => (
          <div key={`${item.period}-${item.type}`} className="text-center">
            <div className="text-2xl font-semibold text-gray-900">{item.count}</div>
            <div className="text-sm text-gray-500">{item.period}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
