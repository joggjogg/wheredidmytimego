import { format, formatDuration, intervalToDuration } from 'date-fns'

export const toFullDateString = (date: Date) => {
  return format(date, 'yyyy-MM-dd HH:mm:ss')
}

export const toDurationString = (start: Date, end: Date) => {
  return (
    formatDuration(intervalToDuration({ start, end }), {
      format: ['hours', 'minutes'],
    }) || '< 1 minute'
  )
}

export const toTimeString = (date: Date) => {
  return format(date, 'HH:mm:ss')
}
