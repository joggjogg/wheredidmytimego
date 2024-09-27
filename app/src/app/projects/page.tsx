'use client'

import React from 'react'
import ProjectList from '../../lib/components/Projects/ProjectList/ProjectList'
import ProjectCreate from '../../lib/components/Projects/ProjectCreate/ProjectCreate'
import { useGetProjectsQuery } from '@/lib/services/projects'
import GridSlotWrapper from '@/lib/components/GridSlotWrapper/GridSlotWrapper'
import styles from './page.module.css'

const Projects = () => {
  const {
    data: projects,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetProjectsQuery()
  return (
    <>
      <h1>Projects</h1>
      <div className={styles.grid}>
        <div className={styles.projectList}>
          <GridSlotWrapper
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            error={error}
          >
            {projects && <ProjectList projects={projects} />}
          </GridSlotWrapper>
        </div>
        <div className={styles.projectCreate}>
          <ProjectCreate />
        </div>
      </div>
    </>
  )
}

export default Projects
