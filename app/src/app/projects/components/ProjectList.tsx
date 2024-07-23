'use client'

import React from 'react'
import { Project, useGetProjectsQuery } from '@/lib/services/projects'
import { Skeleton, Stack, Text } from '@mantine/core'
import styles from './ProjectList.module.css'
import Link from 'next/link'

const projectListItems = (projects: Project[]) =>
  projects.map(project => (
    <Link key={project.projectId} href={`/projects/${project.projectId}`}>
      <div className={styles.projectListItem}>
        <Text fw="bolder">{project.projectName}</Text>
        <Text c="dimmed" fz="sm" fs="italic">
          {project.projectDescription}
        </Text>
      </div>
    </Link>
  ))

const ProjectList = () => {
  const { data, isLoading, isSuccess, isError, error } = useGetProjectsQuery()
  return (
    <>
      {isLoading && <Skeleton h={'100%'} />}
      {!isLoading && (
        <>
          {isError && JSON.stringify(error)}
          {isSuccess && data && <Stack>{projectListItems(data)}</Stack>}
        </>
      )}
    </>
  )
}

export default ProjectList
