const DATE_RANGE_YEAR = 2026

const DAY_OFFSETS = {
  MON: 0,
  TUE: 1,
  WED: 2,
  THU: 3,
  FRI: 4,
  SAT: 5,
  SUN: 6,
}

export function getWeekOffset(weekId) {
  if (weekId === 'week-0') {
    return -7
  }

  if (weekId === 'finals') {
    return 70
  }

  return (Number(weekId.replace('week-', '')) - 1) * 7
}

export function formatDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export function formatEventDate(date) {
  return formatDate(date)
}

export function getEventDate(weekId, week1Monday, day, year = DATE_RANGE_YEAR) {
  if (!week1Monday || !week1Monday.month || !week1Monday.day || !(day in DAY_OFFSETS)) {
    return ''
  }

  const eventDate = new Date(year, Number(week1Monday.month) - 1, Number(week1Monday.day))
  eventDate.setDate(eventDate.getDate() + getWeekOffset(weekId) + DAY_OFFSETS[day])

  return formatEventDate(eventDate)
}

export function getWeekDateRange(weekId, week1Monday, year = DATE_RANGE_YEAR) {
  if (!week1Monday || !week1Monday.month || !week1Monday.day) {
    return ''
  }

  const startDate = new Date(year, Number(week1Monday.month) - 1, Number(week1Monday.day))
  startDate.setDate(startDate.getDate() + getWeekOffset(weekId))

  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)

  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

export function getAllWeekDateRanges(week1Monday, weeks, year = DATE_RANGE_YEAR) {
  return weeks.map((week) => ({
    id: week.id,
    label: week.label,
    range: getWeekDateRange(week.id, week1Monday, year),
  }))
}
