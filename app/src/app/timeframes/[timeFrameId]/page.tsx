'use client'

import {
  useDeleteTimeFrameMutation,
  useGetTimeFrameQuery,
  useUpdateTimeFrameMutation,
} from '@/lib/services/timeFrames'
import { toDateTimeString, toDurationString } from '@/lib/util/dates'
import {
  Box,
  Button,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { DateTimePicker } from '@mantine/dates'
import { useRouter } from 'next/navigation'

import React, { useCallback, useEffect, useState } from 'react'
import styles from './page.module.css'
import { IconCheck, IconX } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { useGetProjectsQuery } from '@/lib/services/projects'

const Page = ({ params }: { params: { timeFrameId: string } }) => {
  const router = useRouter()

  const timeFrameId = parseInt(params.timeFrameId)

  if (isNaN(timeFrameId)) router.push('/timeframes')

  const {
    data: timeFrame,
    isError,
    isSuccess,
  } = useGetTimeFrameQuery(timeFrameId)
  const [updateTimeFrameMutation, { isLoading }] = useUpdateTimeFrameMutation()
  const [deleteTimeFrameMutation, { isLoading: isLoadingDelete }] =
    useDeleteTimeFrameMutation()
  const { data: projects } = useGetProjectsQuery()
  const [edit, setEdit] = useState<boolean>(false)
  const [opened, { open, close }] = useDisclosure(false)

  interface FormValues {
    timeFrameStart: Date
    timeFrameEnd: Date
    project: string
    description: string
  }

  const form = useForm<FormValues>({
    mode: 'controlled',
    validate: {},
  })

  const setInitialValues = () => {
    form.setFieldValue('timeFrameStart', new Date(timeFrame?.timeFrameStart!))
    form.setFieldValue('timeFrameEnd', new Date(timeFrame?.timeFrameEnd!))
    form.setFieldValue('project', `${timeFrame?.projectId}`)
    form.setFieldValue('description', timeFrame?.description!)
  }

  const onEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setEdit(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', onEscape, false)
    return () => {
      document.removeEventListener('keydown', onEscape, false)
    }
  }, [])

  const handleSubmit = form.onSubmit(async values => {
    const result = await updateTimeFrameMutation({
      timeFrameId: timeFrame?.timeFrameId,
      timeFrameStart: toDateTimeString(values.timeFrameStart),
      timeFrameEnd: toDateTimeString(values.timeFrameEnd),
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
      message: 'TimeFrame updated',
      withBorder: true,
    })
  })

  const handleDelete = async () => {
    const result = await deleteTimeFrameMutation(timeFrame?.timeFrameId!)

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

    router.back()
    notifications.show({
      color: 'green',
      title: 'Success',
      icon: <IconCheck />,
      message: 'TimeFrame deleted',
      withBorder: true,
    })
  }

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="Are you sure you want to delete this TimeFrame?"
      >
        <form>
          <Group grow justify="between">
            <Button variant="outline" onClick={() => close()}>
              Cancel
            </Button>
            <Button
              disabled={isLoadingDelete}
              variant="outline"
              onClick={handleDelete}
              color="red"
            >
              Delete
            </Button>
          </Group>
        </form>
      </Modal>

      <h1>TimeFrames</h1>
      {isError && <Text>TimeFrame not found</Text>}
      {isSuccess && (
        <Group h="100%" align="flex-start" grow justify="space-between">
          <Stack h="100%" justify="space-between" className={styles.box}>
            <Stack gap={'sm'}>
              <div>
                <Text fw={'bolder'} size="xl">
                  Project
                </Text>
                <Text size="md">
                  {timeFrame.project?.projectName || 'No project linked'}
                </Text>
              </div>
              <div>
                <Text fw={'bolder'} size="xl">
                  Started
                </Text>
                <Text size="md">
                  {toDateTimeString(new Date(timeFrame.timeFrameStart))}
                </Text>
              </div>
              <div>
                <Text fw={'bolder'} size="xl">
                  Ended
                </Text>
                <Text size="md">
                  {timeFrame.timeFrameEnd &&
                    toDateTimeString(new Date(timeFrame.timeFrameEnd))}
                </Text>
              </div>
              <div>
                <Text fw={'bolder'} size="xl">
                  Duration
                </Text>
                <Text size="md">
                  {timeFrame.timeFrameEnd &&
                    toDurationString(
                      new Date(timeFrame.timeFrameStart),
                      new Date(timeFrame.timeFrameEnd),
                    )}
                </Text>
              </div>
              <div>
                <Text fw={'bolder'} size="xl">
                  Worked on
                </Text>
                <Text size="md">{timeFrame.description}</Text>
              </div>
            </Stack>
            <Group>
              <Button
                variant="outline"
                onClick={() => {
                  setInitialValues()
                  setEdit(true)
                }}
              >
                Edit
              </Button>
              <Button
                color="red"
                variant="outline"
                onClick={() => {
                  open()
                }}
              >
                Delete
              </Button>
            </Group>
          </Stack>
          {edit && (
            <Box className={styles.box} h={'100%'}>
              <Group justify="flex-end">
                <IconX
                  color="grey"
                  cursor={'pointer'}
                  onClick={() => setEdit(false)}
                />
              </Group>
              <form className={styles.form} onSubmit={handleSubmit}>
                <Stack h={'100%'} justify="space-between">
                  <Stack>
                    <Select
                      label="Project"
                      placeholder="Select a project"
                      disabled={!projects}
                      data={
                        projects &&
                        projects.map(project => ({
                          label: project.projectName,
                          value: `${project.projectId}`,
                        }))
                      }
                      key={form.key('project')}
                      {...form.getInputProps('project')}
                    />
                    <DateTimePicker
                      label="Started"
                      placeholder="Pick a date and time started"
                      key={form.key('timeFrameStart')}
                      {...form.getInputProps('timeFrameStart')}
                    />
                    <DateTimePicker
                      label="Ended"
                      placeholder="Pick a date and time ended"
                      key={form.key('timeFrameEnd')}
                      {...form.getInputProps('timeFrameEnd')}
                    />
                    <Textarea
                      label="Description"
                      placeholder="Describe what you have worked on"
                      key={form.key('description')}
                      minRows={6}
                      maxRows={6}
                      autosize
                      {...form.getInputProps('description')}
                    />
                  </Stack>
                  <Button disabled={isLoading} variant="outline" type="submit">
                    Save
                  </Button>
                </Stack>
              </form>
            </Box>
          )}
        </Group>
      )}
    </>
  )
}

export default Page
