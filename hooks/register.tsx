import type { Register } from 'claude-code'

const FAMILY: Record<string, string> = { opus: 'O', sonnet: 'S', haiku: 'H', fable: 'F' }
const EFFORT: Record<string, string> = { low: 'lo', medium: 'md', high: 'hi', xhigh: 'xh', max: 'mx' }

// "claude-sonnet-5-5[1m]" -> "S5.5"; unknown ids fall back to a trimmed id.
const short = (id: string): string => {
  const m = id.toLowerCase().match(/(opus|sonnet|haiku|fable)[-_]?(\d+)?(?:[-_.](\d+))?/)
  if (!m) return id.replace(/^claude-/, '').slice(0, 8)
  return (FAMILY[m[1] ?? ''] ?? '?') + (m[2] ? m[2] + (m[3] ? '.' + m[3] : '') : '')
}

export const register: Register = on => {
  on('ui.render', { component: 'AgentRow' }, ($, e, next) => {
    const { model, effort, label } = e.props
    if (!model) return next(e)
    const fx = effort === undefined ? '' : '·' + (typeof effort === 'number' ? effort : EFFORT[effort] ?? effort)
    return next({ ...e, props: { ...e.props, label: `${short(model)}${fx} ${label}` } })
  })
}
