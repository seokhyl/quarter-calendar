export const TODAY_TIME_ZONE_OPTIONS = [
  { value: 'KST', label: 'KST', timeZone: 'Asia/Seoul' },
  { value: 'PST', label: 'PST', timeZone: 'America/Los_Angeles' },
]

function getTimeZone(optionValue) {
  return TODAY_TIME_ZONE_OPTIONS.find((option) => option.value === optionValue)?.timeZone ?? TODAY_TIME_ZONE_OPTIONS[0].timeZone
}

export function formatTodayLabel(date, optionValue) {
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: getTimeZone(optionValue),
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).formatToParts(date)

  const valueByType = Object.fromEntries(parts.map((part) => [part.type, part.value]))

  return `${valueByType.year}/${valueByType.month}/${valueByType.day} (${valueByType.weekday})`
}
