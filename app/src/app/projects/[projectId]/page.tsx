'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import ProjectName from '../components/ProjectName'
import { useGetProjectQuery } from '@/lib/services/projects'
import TimeFrameList from '@/app/timeframes/components/TimeFrameList'
import GridSlotWrapper from '@/lib/components/GridSlotWrapper'

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
      <h1>Projects</h1>
      <div className={styles.grid}>
        <div className={styles.itemOne}>
          <GridSlotWrapper
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            error={error}
          >
            {project && <ProjectName project={project} />}
          </GridSlotWrapper>
        </div>
        <div className={styles.itemTwo}>
          <GridSlotWrapper
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            error={error}
          >
            {project && <TimeFrameList timeFrames={project.timeFrames} />}
          </GridSlotWrapper>
        </div>
      </div>
    </>
  )
}

export default Page
