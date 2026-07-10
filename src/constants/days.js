export const DAY_OPTIONS = [
  { value: '', label: 'N/A' },
  { value: 'MON', label: '월' },
  { value: 'TUE', label: '화' },
  { value: 'WED', label: '수' },
  { value: 'THU', label: '목' },
  { value: 'FRI', label: '금' },
  { value: 'SAT', label: '토' },
  { value: 'SUN', label: '일' },
]

export function getDayLabel(day) {
  return DAY_OPTIONS.find((option) => option.value === day)?.label ?? ''
}

export const DAY_ORDER = DAY_OPTIONS.reduce((order, option, index) => {
  order[option.value] = index
  return order
}, {})
