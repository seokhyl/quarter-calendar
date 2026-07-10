const DATE_RANGE_YEAR = 2026

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
