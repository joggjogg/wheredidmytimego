'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import { useGetProjectQuery } from '@/lib/services/projects'
import TimeFrameList from '@/lib/components/Timeframes/TimeFrameList/TimeFrameList'
import GridSlotWrapper from '@/lib/components/GridSlotWrapper/GridSlotWrapper'
import Breadcrumbs from '@/lib/components/Breadcrumbs/Breadcrumbs'
import { useGetStatisticsQuery } from '@/lib/services/statistics'
import { Stack, Text } from '@mantine/core'
import { formatDuration } from 'date-fns'
import { IconClock } from '@tabler/icons-react'

const Page = ({ params }: { params: { projectId: string } }) => {
  const router = useRouter()

  const projectId = parseInt(params.projectId)

  if (isNaN(projectId)) router.push('/projects')

  const {
    data: project,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProjectQuery(projectId)

  const { data: statistics } = useGetStatisticsQuery({
    projectId: params.projectId,
    tzName: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })

  const breadCrumbItems = [
    { title: 'Projects', href: '/projects' },
    { title: project?.projectName!, href: `/projects/${project?.projectId}` },
  ]

  return (
    <>
      <Breadcrumbs items={breadCrumbItems} />
      <div className={styles.grid}>
        <div className={styles.timeFrameList}>
          <GridSlotWrapper
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            error={error}
          >
            {project && <TimeFrameList timeFrames={project.timeFrames} />}
          </GridSlotWrapper>
        </div>
        <Stack h={'100%'} gap={0}>
          <div className={styles.label__container}>
            <IconClock size={'20px'} />
            <div className={styles.label}>Hours worked</div>
          </div>
          <Stack align="center" className={styles.stat} justify="space-around">
            <Text>
              {formatDuration(
                { ...statistics },
                { format: ['hours', 'minutes'] },
              )}
            </Text>
          </Stack>
        </Stack>
      </div>
    </>
  )
}

export default Page
