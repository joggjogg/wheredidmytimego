'use client'

import React, { useMemo } from 'react'
import { TimeFrame } from '@/lib/services/timeFrames'
import { Table } from '@mantine/core'
import { toDurationString, toTimeString } from '@/lib/util/dates'
import { usePathname, useRouter } from 'next/navigation'
import styles from './TimeFrameList.module.css'
import { intlFormat } from 'date-fns'

const TimeFrameList = (props: { timeFrames: TimeFrame[] }) => {
  const { timeFrames } = props
  const router = useRouter()
  const pathname = usePathname()

  const showProject = !pathname.includes('projects')

  const sortedTimeFrames = useMemo(() => {
    return timeFrames
      ?.slice()
      .sort((a, b) => b.timeFrameStart.localeCompare(a.timeFrameStart))
  }, [timeFrames])

  return (
    <Table stickyHeader stickyHeaderOffset={-16} highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Date</Table.Th>
          <Table.Th>Start</Table.Th>
          <Table.Th>End</Table.Th>
          <Table.Th>Duration</Table.Th>
          {showProject && <Table.Th>Project</Table.Th>}
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {sortedTimeFrames?.map(timeFrame => (
          <Table.Tr
            key={timeFrame.timeFrameId}
            className={styles.row}
            onClick={() => router.push(`/timeframes/${timeFrame.timeFrameId}`)}
          >
            <Table.Td>
              {intlFormat(new Date(timeFrame.timeFrameStart))}
            </Table.Td>
            <Table.Td>
              {toTimeString(new Date(timeFrame.timeFrameStart))}
            </Table.Td>
            <Table.Td>
              {timeFrame.timeFrameEnd &&
                toTimeString(new Date(timeFrame.timeFrameEnd))}
            </Table.Td>
            <Table.Td>
              {timeFrame.timeFrameEnd &&
                toDurationString(
                  new Date(timeFrame.timeFrameStart),
                  new Date(timeFrame.timeFrameEnd),
                )}
            </Table.Td>
            {showProject && (
              <Table.Td>{timeFrame.project?.projectName}</Table.Td>
            )}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

export default TimeFrameList
