import React from 'react'
import { useTimeElapsed } from '@/lib/hooks'
import { useGetActiveTimeFrameQuery } from '@/lib/services/timeFrames'
import { Skeleton, Stack, Text } from '@mantine/core'
import styles from './timeFrameActive.module.css'

const TimeFrameActive = () => {
  const {
    data: timeFrame,
    isLoading,
    isSuccess,
    isError,
  } = useGetActiveTimeFrameQuery()

  const { timeElapsed } = useTimeElapsed({})

  return (
    <>
      {isLoading && <Skeleton height={'100%'} radius="md" />}
      {isError && (
        <Stack className="box">
          <Text size="xl">No active TimeFrame</Text>
        </Stack>
      )}
      {isSuccess && (
        <Stack className="box" h={'100%'} gap={0} p={'md'}>
          <Text size="xl">Active</Text>
          <Text className={styles.timeElapsed}>
            {timeFrame && timeElapsed(timeFrame.timeFrameStart)}
          </Text>
          <Text size="sm">
            Started on{' '}
            {`${new Date(timeFrame.timeFrameStart).toLocaleTimeString()}`}
          </Text>
        </Stack>
      )}
    </>
  )
}

export default TimeFrameActive
