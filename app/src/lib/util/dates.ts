import {
  endOfDay,
  endOfMonth,
  formatDuration,
  intervalToDuration,
  startOfDay,
  startOfMonth,
} from 'date-fns'

import { format } from 'date-fns-tz'

export const toDateTimeString = (date: Date) => {
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

export const toStartOfMonthString = (date: Date, tzName: string) => {
  return format(startOfDay(startOfMonth(date)), 'yyyy-MM-dd HH:mm:ssxxx', {
    timeZone: tzName,
  })
}

export const toEndOfMonthString = (date: Date, tzName: string) => {
  return format(endOfDay(endOfMonth(date)), 'yyyy-MM-dd HH:mm:ssxxx', {
    timeZone: tzName,
  })
}
