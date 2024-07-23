'use client'
import React from 'react'
import TimeFrameActive from './components/TimeFrameActive'
import TimeFrameStart from './components/TimeFrameStart'
import TimeFrameStop from './components/TimeFrameStop'
import TimeFrameList from './components/TimeFrameList'
import styles from './timeFrames.module.css'
import { useGetTimeFramesQuery } from '@/lib/services/timeFrames'
import { Center, Loader, Stack } from '@mantine/core'
import { errorToMessage } from '@/lib/services/helpers'

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
          {isLoading && (
            <Stack h={'100%'} justify="space-around">
              <Center>
                <Loader size={'sm'} color="gray" />
              </Center>
            </Stack>
          )}
          {isError && errorToMessage(error)}
          {isSuccess && <TimeFrameList timeFrames={timeFrames} />}
        </div>
      </div>
    </>
  )
}
