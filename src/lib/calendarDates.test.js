import { describe, expect, it } from 'vitest'
import { WEEKS } from '../constants/weeks.js'
import { getAllWeekDateRanges, getEventDate, getWeekDateRange, getWeekOffset } from './calendarDates.js'

describe('calendar date ranges', () => {
  it('computes week offsets from the selected Week 1 Monday', () => {
    expect(getWeekOffset('week-0')).toBe(-7)
    expect(getWeekOffset('week-1')).toBe(0)
    expect(getWeekOffset('week-5')).toBe(28)
    expect(getWeekOffset('week-10')).toBe(63)
    expect(getWeekOffset('finals')).toBe(70)
  })

  it('formats every week range from a Week 1 Monday selection', () => {
    const week1Monday = { month: '3', day: '2' }

    expect(getWeekDateRange('week-0', week1Monday)).toBe('2/23 - 3/1')
    expect(getWeekDateRange('week-1', week1Monday)).toBe('3/2 - 3/8')
    expect(getWeekDateRange('week-5', week1Monday)).toBe('3/30 - 4/5')
    expect(getWeekDateRange('finals', week1Monday)).toBe('5/11 - 5/17')
  })

  it('returns empty ranges until both month and day are selected', () => {
    expect(getWeekDateRange('week-1', { month: '', day: '' })).toBe('')
    expect(getWeekDateRange('week-1', { month: '3', day: '' })).toBe('')
    expect(getWeekDateRange('week-1', null)).toBe('')
  })

  it('can compute ranges for the full quarter list', () => {
    const ranges = getAllWeekDateRanges({ month: '4', day: '6' }, WEEKS)

    expect(ranges).toHaveLength(12)
    expect(ranges[0]).toEqual({ id: 'week-0', label: 'Week 0', range: '3/30 - 4/5' })
    expect(ranges[11]).toEqual({ id: 'finals', label: 'Finals Week', range: '6/15 - 6/21' })
  })

  it('formats event dates from Week 1 Monday, week, and day', () => {
    const week1Monday = { month: '3', day: '2' }

    expect(getEventDate('week-1', week1Monday, 'MON')).toBe('3/2')
    expect(getEventDate('week-2', week1Monday, 'TUE')).toBe('3/10')
    expect(getEventDate('finals', week1Monday, 'FRI')).toBe('5/15')
  })

  it('returns an empty event date until Week 1 Monday and day are selected', () => {
    expect(getEventDate('week-1', { month: '', day: '' }, 'MON')).toBe('')
    expect(getEventDate('week-1', { month: '3', day: '' }, 'MON')).toBe('')
    expect(getEventDate('week-1', { month: '3', day: '2' }, '')).toBe('')
  })
})
