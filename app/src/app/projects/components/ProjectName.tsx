import { Project } from '@/lib/services/projects'
import { Box, Text } from '@mantine/core'
import React from 'react'

const ProjectName = (project: Project) => {
  return (
    <Box p="sm">
      <Text fw="bolder">{project.projectName}</Text>
      <Text fz="small" fs="italic" c="dimmed">
        {project.projectDescription}
      </Text>
    </Box>
  )
}

export default ProjectName
