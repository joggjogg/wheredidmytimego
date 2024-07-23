'use client'

import { useAddProjectMutation } from '@/lib/services/projects'
import { Button, Modal, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import React from 'react'

const ProjectCreate = () => {
  const [addProject, { isLoading }] = useAddProjectMutation()
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      projectName: '',
      projectDescription: '',
    },
    validate: {
      projectDescription: value =>
        value.length > 64
          ? 'Please limit your description to 64 characters.'
          : null,
    },
  })

  const handleSubmit = form.onSubmit(async values => {
    const result = await addProject(values)

    if (result.error) {
      notifications.show({
        color: 'red',
        title: 'Error',
        icon: <IconX />,
        withBorder: true,
        message: JSON.stringify(result.error),
      })
      return
    }

    notifications.show({
      color: 'green',
      title: 'Success',
      icon: <IconCheck />,
      message: 'Created new project',
      withBorder: true,
    })
    form.reset()
    close()
  })

  return (
    <>
      <Modal centered opened={opened} title="New Project" onClose={close}>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Name"
              required
              placeholder="Enter a name for your project"
              key={form.key('projectName')}
              {...form.getInputProps('projectName')}
            />
            <TextInput
              label="Description"
              placeholder="Enter a description for your project"
              key={form.key('projectDescription')}
              {...form.getInputProps('projectDescription')}
            />
            <Button disabled={isLoading} fullWidth type="submit">
              Create new project
            </Button>
          </Stack>
        </form>
      </Modal>
      <Button color="#dfe2e6" onClick={open} fullWidth>
        New Project
      </Button>
    </>
  )
}

export default ProjectCreate
