'use client'

import React, { useMemo } from 'react'
import { TimeFrame } from '@/lib/services/timeFrames'
import { Table } from '@mantine/core'
import { toDateString } from '@/lib/util/dates'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconExternalLink } from '@tabler/icons-react'

const TimeFrameList = (props: { timeFrames: TimeFrame[] }) => {
  const { timeFrames } = props
  const router = useRouter()

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
          <Table.Th>Project</Table.Th>
          <Table.Th>Link</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {sortedTimeFrames?.map(timeFrame => (
          <Table.Tr
            key={timeFrame.timeFrameId}
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
            <Table.Td>{timeFrame.projectId}</Table.Td>
            <Table.Td>
              <Link href={`/timeframes/${timeFrame.timeFrameId}`}>
                <IconExternalLink />
              </Link>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  )
}

export default TimeFrameList
