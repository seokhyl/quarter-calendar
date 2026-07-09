export const DAY_OPTIONS = [
  { value: '', label: 'N/A' },
  { value: 'MON', label: 'MON' },
  { value: 'TUE', label: 'TUE' },
  { value: 'WED', label: 'WED' },
  { value: 'THU', label: 'THU' },
  { value: 'FRI', label: 'FRI' },
  { value: 'SAT', label: 'SAT' },
  { value: 'SUN', label: 'SUN' },
]

export const DAY_ORDER = DAY_OPTIONS.reduce((order, option, index) => {
  order[option.value] = index
  return order
}, {})
