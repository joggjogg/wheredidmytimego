import { format } from 'date-fns'

export const toDateString = (date: Date) => {
  return format(date, 'yyyy-MM-dd HH:mm:ss')
}
