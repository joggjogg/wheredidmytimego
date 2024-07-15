import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { useEffect, useState } from 'react'
import { intervalToDuration } from 'date-fns'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

type Config = {
  interval?: number
}

export type ReturnValue = {
  timeElapsed: (timeStart: string) => string
}

export const useTimeElapsed = ({ interval = 1000 }: Config): ReturnValue => {
  const [now, setNow] = useState<number>(new Date().getTime())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(t => t + 1000)
    }, interval)

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  const timeElapsed = (timeStart: string) => {
    const duration = intervalToDuration({
      start: new Date(timeStart),
      end: new Date(now),
    })

    const hours = duration.hours || 0
    const minutes = duration.minutes || 0
    const seconds = duration.seconds || 0

    const toDoubleDigits = (number: number) =>
      number.toLocaleString('en-US', { minimumIntegerDigits: 2 })

    return `${toDoubleDigits(hours)}:${toDoubleDigits(minutes)}:${toDoubleDigits(seconds)}`
  }

  return { timeElapsed }
}
