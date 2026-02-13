'use client'

import { usePathname } from 'next/navigation'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const pathname = usePathname()
  
  return (
    <header className="bg-[#1a237e] px-8 py-6">
      {(pathname === '/dashboard' || pathname === '/') && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">
            Cedewise
          </h1>
        </div>
      )}
      <div>
        <h2 className="text-4xl font-bold text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 text-xl text-white/80">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  )
} 