'use client'

import React from 'react'
import TimeFrameActive from './components/TimeFrameActive'
import TimeFrameStart from './components/TimeFrameStart'
import TimeFrameStop from './components/TimeFrameStop'
import TimeFrameList from './components/TimeFrameList'
import { useGetTimeFramesQuery } from '@/lib/services/timeFrames'
import styles from './page.module.css'
import GridSlotWrapper from '@/lib/components/GridSlotWrapper'

export default function Timeframes() {
  const {
    data: timeFrames,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTimeFramesQuery()

  return (
    <>
      <h1>TimeFrames</h1>
      <ul className={styles.column__list}>
        <div className={styles.timeFrameActive}>
          <TimeFrameActive />
        </div>
        <div className={styles.timeFrameStart}>
          <TimeFrameStart />
        </div>
        <div className={styles.timeFrameStop}>
          <TimeFrameStop />
        </div>
        <div className={styles.timeFrameList}>
          <GridSlotWrapper
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            error={error}
          >
            {timeFrames && <TimeFrameList timeFrames={timeFrames} />}
          </GridSlotWrapper>
        </div>
      </ul>
    </>
  )
}
