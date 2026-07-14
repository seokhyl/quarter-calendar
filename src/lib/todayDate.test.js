import { describe, expect, it } from 'vitest'
import { formatTodayLabel } from './todayDate.js'

describe('today date label', () => {
  it('formats today in Korean date order for KST', () => {
    const instant = new Date('2026-07-01T06:00:00.000Z')

    expect(formatTodayLabel(instant, 'KST')).toBe('2026/7/1 (수)')
  })

  it('formats today using the selected PST calendar day', () => {
    const instant = new Date('2026-07-01T06:00:00.000Z')

    expect(formatTodayLabel(instant, 'PST')).toBe('2026/6/30 (화)')
  })
})
