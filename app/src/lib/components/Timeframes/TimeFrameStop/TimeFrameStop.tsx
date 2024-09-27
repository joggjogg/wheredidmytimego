import { useGetProjectsQuery } from '@/lib/services/projects'
import {
  useGetActiveTimeFrameQuery,
  useUpdateTimeFrameMutation,
} from '@/lib/services/timeFrames'
import { toDateTimeString } from '@/lib/util/dates'
import { Button, Modal, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import React from 'react'

const TimeFrameStop = () => {
  const {
    data: activeTimeFrame,
    isLoading: activeTimeFrameIsLoading,
    isSuccess: activeTimeFrameIsSuccess,
  } = useGetActiveTimeFrameQuery()
  const [updateTimeFrameMutation, { isLoading }] = useUpdateTimeFrameMutation()
  const { data: projects } = useGetProjectsQuery()
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    mode: 'controlled',
    initialValues: {
      description: '',
      project: '',
    },
    validate: {
      description: value =>
        value.length !== 0 ? null : 'Please describe what you have worked on.',
    },
  })

  const handleSumbit = form.onSubmit(async values => {
    if (activeTimeFrameIsSuccess && activeTimeFrame == undefined) {
      notifications.show({
        color: 'red',
        title: 'Error',
        icon: <IconX />,
        withBorder: true,
        message: 'There is no active TimeFrame to stop.',
      })
      return
    }

    const result = await updateTimeFrameMutation({
      timeFrameId: activeTimeFrame?.timeFrameId,
      timeFrameEnd: toDateTimeString(new Date()),
      tzName: Intl.DateTimeFormat().resolvedOptions().timeZone,
      description: values.description,
      projectId: parseInt(values.project),
    })

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
      message: 'Stopped TimeFrame',
      withBorder: true,
    })
    form.reset()
    close()
  })

  const handleClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    open()
  }
  return (
    <>
      <Modal opened={opened} onClose={close} centered title="Stop TimeFrame">
        <form onSubmit={handleSumbit}>
          <Select
            label="Project"
            placeholder="Select on which project you have worked"
            key={form.key('project')}
            disabled={!projects}
            data={
              projects &&
              projects.map(project => ({
                label: project.projectName,
                value: `${project.projectId}`,
              }))
            }
            {...form.getInputProps('project')}
          />
          <TextInput
            required
            label="Description"
            placeholder="What did you work on?"
            key={form.key('description')}
            {...form.getInputProps('description')}
          />

          <Button mt={'md'} fullWidth type="submit">
            End
          </Button>
        </form>
      </Modal>
      <Button
        h={'100%'}
        fullWidth
        color="#dfe2e6"
        radius="md"
        disabled={activeTimeFrame == undefined || activeTimeFrameIsLoading}
        onClick={handleClick}
      >
        {isLoading ? 'Loading' : 'Stop'}
      </Button>
    </>
  )
}

export default TimeFrameStop
