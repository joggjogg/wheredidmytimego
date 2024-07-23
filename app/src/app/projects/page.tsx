'use client'

import React from 'react'
import ProjectList from './components/ProjectList'
import ProjectCreate from './components/ProjectCreate'
import { useGetProjectsQuery } from '@/lib/services/projects'
import GridSlotWrapper from '@/lib/components/GridSlotWrapper'
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
        <div className={styles.itemOne}>
          <GridSlotWrapper
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            error={error}
          >
            {projects && <ProjectList projects={projects} />}
          </GridSlotWrapper>
        </div>
        <div className={styles.itemTwo}>
          <ProjectCreate />
        </div>
      </div>
    </>
  )
}

export default Projects
