/** Append a reinsurer quote notification to the submission chat thread (broker inbox). */
export function appendQuoteChatMessage(
  submissionId: string,
  messageText: string
): void {
  if (typeof window === 'undefined') return;
  const storageKey = `cedewise:messages:${submissionId}`;
  try {
    const raw = localStorage.getItem(storageKey);
    const existing = raw ? (JSON.parse(raw) as unknown[]) : [];
    const list = Array.isArray(existing) ? existing : [];
    const entry = {
      id: `quote-${Date.now()}`,
      text: messageText,
      sender: 'reinsurer',
      to: 'broker',
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(storageKey, JSON.stringify([...list, entry]));
    window.dispatchEvent(
      new CustomEvent('cedewise:chat-updated', { detail: { submissionId } })
    );
  } catch {
    // ignore
  }
}
