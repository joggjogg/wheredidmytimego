'use client'

import React from 'react'
import { useGetProjectQuery } from '@/lib/services/projects'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import { errorToMessage } from '@/lib/services/helpers'
import ProjectName from '../components/ProjectName'

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
      {isError && errorToMessage(error)}
      {isSuccess && (
        <div className={styles.grid}>
          <div className={styles.itemOne}>
            <ProjectName {...project} />
          </div>
        </div>
      )}
    </>
  )
}

export default Page
