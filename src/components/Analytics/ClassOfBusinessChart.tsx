'use client'

import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

interface ClassOfBusinessData {
  classOfBusiness: string
  count: number
  percentage: number
}

interface Props {
  data: ClassOfBusinessData[]
}

const COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#06B6D4', // cyan-500
  '#F97316', // orange-500
]

export default function ClassOfBusinessChart({ data }: Props) {
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

    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(item => item.classOfBusiness),
        datasets: [{
          data: data.map(item => item.percentage),
          backgroundColor: COLORS,
          borderWidth: 1,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // Hide default legend since we're using custom one
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
                const label = context.label || ''
                const value = context.raw as number
                return ` ${value.toFixed(1)}%`
              },
              title: function(context) {
                return context[0].label
              }
            }
          }
        },
        layout: {
          padding: 20
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
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Submissions by Class of Business</h3>
        <div className="flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-500">Updated just now</span>
        </div>
      </div>
      
      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-7">
          <div className="relative h-[300px]">
            <canvas ref={chartRef} />
          </div>
        </div>
        
        <div className="md:col-span-5">
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={item.classOfBusiness} 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600 truncate flex-grow">
                  {item.classOfBusiness}
                </span>
                <span className="text-sm font-medium text-gray-900 tabular-nums">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 