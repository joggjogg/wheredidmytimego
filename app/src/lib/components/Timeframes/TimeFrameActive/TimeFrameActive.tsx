import React from 'react'
import { useTimeElapsed } from '@/lib/hooks'
import { useGetActiveTimeFrameQuery } from '@/lib/services/timeFrames'
import { Skeleton, Stack, Text } from '@mantine/core'
import styles from './timeFrameActive.module.css'
import { formatRelative } from 'date-fns'
import { IconClock } from '@tabler/icons-react'

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
      {!isLoading && (
        <Stack h={'100%'} gap={0}>
          <div className={styles.label__container}>
            <IconClock size={'20px'} />
            <div className={styles.label}>Current TimeFrame</div>
          </div>
          {isError && (
            <div className={styles.label__inactive}>
              Ready to get to work :)
            </div>
          )}
          {isSuccess && (
            <>
              <Text className={styles.timeElapsed}>
                {timeFrame && timeElapsed(timeFrame.timeFrameStart)}
              </Text>
              <Text size="sm">
                Started{' '}
                {formatRelative(new Date(timeFrame.timeFrameStart), new Date())}
              </Text>
            </>
          )}
        </Stack>
      )}
    </>
  )
}

export default TimeFrameActive
