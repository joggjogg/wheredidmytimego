import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

type Config = {
  timeStart: Date
  interval?: number
}

export type ReturnValue = {
  timeElapsed: string
}

export const useTimeElapsed = ({
  timeStart,
  interval = 1000,
}: Config): ReturnValue => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(new Date(now.setTime(now.getTime() + 1000)))
    }, interval)

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  var timeElapsed = ''
  if (timeStart) {
    timeElapsed = format(
      new Date(now.getTime() - timeStart?.getTime()),
      'HH:mm:ss',
    )
  }

  return { timeElapsed }
}
