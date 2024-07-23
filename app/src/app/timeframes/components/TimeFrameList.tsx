'use client'

import React, { useMemo } from 'react'
import { TimeFrame } from '@/lib/services/timeFrames'
import { Table } from '@mantine/core'
import { toDateString } from '@/lib/util/dates'
import { usePathname, useRouter } from 'next/navigation'
import styles from './TimeFrameList.module.css'

const TimeFrameList = (props: { timeFrames: TimeFrame[] }) => {
  const { timeFrames } = props
  const router = useRouter()
  const pathname = usePathname()

  const showProject = !pathname.includes('projects')

  console.debug(pathname)

  const sortedTimeFrames = useMemo(() => {
    return timeFrames
      ?.slice()
      .sort((a, b) => b.timeFrameStart.localeCompare(a.timeFrameStart))
  }, [timeFrames])

  return (
    <Table stickyHeader highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Date</Table.Th>
          <Table.Th>TimeFrameStart</Table.Th>
          <Table.Th>TimeFrameEnd</Table.Th>
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
            <Table.Td>date</Table.Td>
            <Table.Td>
              {toDateString(new Date(timeFrame.timeFrameStart))}
            </Table.Td>
            <Table.Td>
              {timeFrame.timeFrameEnd &&
                toDateString(new Date(timeFrame.timeFrameEnd))}
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
