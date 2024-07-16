import { format, formatDuration, intervalToDuration } from 'date-fns'

export const toDateString = (date: Date) => {
  return format(date, 'yyyy-MM-dd HH:mm:ss')
}

export const toDurationString = (start: Date, end: Date) => {
  return formatDuration(intervalToDuration({ start, end }))
}
