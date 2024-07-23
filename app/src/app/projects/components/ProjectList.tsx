'use client'

import React from 'react'
import { Project } from '@/lib/services/projects'
import { Stack, Text } from '@mantine/core'
import styles from './ProjectList.module.css'
import Link from 'next/link'

const ProjectList = (props: { projects: Project[] }) => {
  const { projects } = props
  return (
    <Stack>
      {projects.map(project => (
        <Link key={project.projectId} href={`/projects/${project.projectId}`}>
          <div className={styles.projectListItem}>
            <Text fw="bolder">{project.projectName}</Text>
            <Text c="dimmed" fz="sm" fs="italic">
              {project.projectDescription}
            </Text>
          </div>
        </Link>
      ))}
    </Stack>
  )
}

export default ProjectList
