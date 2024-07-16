import React, { useMemo } from 'react'
import { useGetTimeFramesQuery } from '@/lib/services/timeFrames'
import { Skeleton, Stack, Table, Text } from '@mantine/core'
import { toDateString } from '@/lib/util/dates'
import styles from './timeFrameList.module.css'

const TimeFrameList = () => {
  const {
    data: timeFrames,
    isLoading,
    isSuccess,
    isError,
  } = useGetTimeFramesQuery()

  const sortedTimeFrames = useMemo(() => {
    return timeFrames
      ?.slice()
      .sort((a, b) => b.timeFrameStart.localeCompare(a.timeFrameStart))
  }, [timeFrames])

  return (
    <div className={styles.container}>
      {isLoading && <Skeleton radius="md" h={'100%'} animate />}
      {isError && (
        <Stack>
          <Text p="md" size="xl">
            Error loading TimeFrames
          </Text>
        </Stack>
      )}
      {isSuccess && (
        <Table stickyHeader highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>TimeFrameStart</Table.Th>
              <Table.Th>TimeFrameEnd</Table.Th>
              <Table.Th>Project</Table.Th>
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>
            {sortedTimeFrames?.map(timeFrame => (
              <Table.Tr key={timeFrame.timeFrameId}>
                <Table.Td>date</Table.Td>
                <Table.Td>
                  {toDateString(new Date(timeFrame.timeFrameStart))}
                </Table.Td>
                <Table.Td>
                  {timeFrame.timeFrameEnd &&
                    toDateString(new Date(timeFrame.timeFrameEnd))}
                </Table.Td>
                <Table.Td>{timeFrame.projectId}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </div>
  )
}

export default TimeFrameList
