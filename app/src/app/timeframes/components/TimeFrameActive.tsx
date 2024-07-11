import React from 'react'
import { useTimeElapsed } from '@/lib/hooks'
import { useGetActiveTimeFrameQuery } from '@/lib/services/timeFrames'
import { Skeleton, Stack, Text } from '@mantine/core'
import styles from './timeFrameActive.module.css'

const TimeFrameActive = () => {
  const { data: timeFrame, isLoading, isSuccess } = useGetActiveTimeFrameQuery()

  const { timeElapsed } = useTimeElapsed({
    timeStart: timeFrame ? new Date(timeFrame.timeFrameStart) : new Date(),
  })

  return (
    <>
      {isLoading && <Skeleton height={'100%'} radius="md" />}
      {isSuccess && !timeFrame && <Text>No active TimeFrame</Text>}
      {isSuccess && (
        <Stack gap={0} p={'md'}>
          <Text size="xl">Active</Text>
          <Text className={styles.timeElapsed}>{timeElapsed}</Text>
          <Text size="sm">Started on {`${timeFrame.timeFrameStart}`}</Text>
        </Stack>
      )}
    </>
  )
}

export default TimeFrameActive
