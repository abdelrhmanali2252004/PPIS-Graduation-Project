function toDisplayString(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  return String(value)
}

export function ProseSection({ title, text }: { title: string; text?: unknown }) {
  const content = toDisplayString(text).trim()
  return (
    <section>
      <h3 className="mb-2 text-sm font-bold text-heading">{title}</h3>
      {content ? (
        <p className="whitespace-pre-wrap text-sm leading-7 text-body/90">{content}</p>
      ) : (
        <p className="text-sm text-slateMuted">لا يوجد نص لهذا القسم.</p>
      )}
    </section>
  )
}
