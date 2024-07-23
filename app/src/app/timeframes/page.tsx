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
      <div className={styles.grid}>
        <div className={styles.itemOne}>
          <TimeFrameActive />
        </div>
        <div className={styles.itemTwo}>
          <TimeFrameStart />
        </div>
        <div className={styles.itemThree}>
          <TimeFrameStop />
        </div>
        <div className={styles.itemFour}>
          <GridSlotWrapper
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            error={error}
          >
            {timeFrames && <TimeFrameList timeFrames={timeFrames} />}
          </GridSlotWrapper>
        </div>
      </div>
    </>
  )
}
