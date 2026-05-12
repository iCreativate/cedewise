/** True when Prisma failed before/during connect (missing URL, unreachable DB, auth failure). */
export function isPrismaUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const e = error as { name?: string; code?: string; message?: string }
  if (e.name === 'PrismaClientInitializationError') return true
  if (typeof e.code === 'string') {
    if (e.code.startsWith('P10')) return true
    if (e.code === 'P2024') return true
  }
  const msg = typeof e.message === 'string' ? e.message : ''
  return /can't reach database|does not exist|connection refused|ECONNREFUSED|Server has closed the connection/i.test(
    msg
  )
}
