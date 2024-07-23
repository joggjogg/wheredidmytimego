'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import ProjectName from '../components/ProjectName'
import { useGetProjectQuery } from '@/lib/services/projects'
import { Center, Loader, Stack } from '@mantine/core'
import { errorToMessage } from '@/lib/services/helpers'
import TimeFrameList from '@/app/timeframes/components/TimeFrameList'

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

  return (
    <>
      <h1>Project</h1>
      <div className={styles.grid}>
        <div className={styles.itemOne}>
          {isLoading && (
            <Stack h={'100%'} justify="space-around">
              <Center>
                <Loader size={'sm'} color="gray" />
              </Center>
            </Stack>
          )}
          {isError && errorToMessage(error)}
          {isSuccess && <ProjectName project={project} />}
        </div>
        <div className={styles.itemTwo}>
          {isLoading && (
            <Stack h={'100%'} justify="space-around">
              <Center>
                <Loader size={'sm'} color="gray" />
              </Center>
            </Stack>
          )}
          {isError && errorToMessage(error)}
          {isSuccess && <TimeFrameList timeFrames={project.timeFrames} />}
        </div>
      </div>
    </>
  )
}

export default Page
