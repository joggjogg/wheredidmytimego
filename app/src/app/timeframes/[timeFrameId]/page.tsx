'use client'

import { useGetTimeFrameQuery } from '@/lib/services/timeFrames'
import { toDateString, toDurationString } from '@/lib/util/dates'
import {
  Box,
  Button,
  Group,
  Select,
  Stack,
  Text,
  Textarea,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { redirect } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './page.module.css'
import { IconX } from '@tabler/icons-react'

const Page = ({ params }: { params: { timeFrameId: string } }) => {
  const timeFrameId = parseInt(params.timeFrameId)

  if (isNaN(timeFrameId)) redirect('/timeframes')

  const {
    data: timeFrame,
    isError,
    isSuccess,
  } = useGetTimeFrameQuery(timeFrameId)

  const [edit, setEdit] = useState<boolean>(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      timeFrameStart: timeFrame?.timeFrameStart,
      timeFrameEnd: timeFrame?.timeFrameEnd,
      description: timeFrame?.description,
      project: timeFrame?.projectId,
    },
    validate: {},
  })

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

  const handleSubmit = form.onSubmit(values => {})

  return (
    <>
      <h1>Timeframe</h1>
      {isError && <Text>TimeFrame not found</Text>}
      {isSuccess && (
        <Group h="100%" align="flex-start" grow justify="space-between">
          <Stack h="100%" justify="space-between" className="box">
            <Stack gap={'sm'}>
              <div>
                <Text fw={'bolder'} size="xl">
                  Project
                </Text>
                <Text size="md">
                  {timeFrame.projectId || 'No project linked'}
                </Text>
              </div>
              <div>
                <Text fw={'bolder'} size="xl">
                  Started
                </Text>
                <Text size="md">
                  {toDateString(new Date(timeFrame.timeFrameStart))}
                </Text>
              </div>
              <div>
                <Text fw={'bolder'} size="xl">
                  Ended
                </Text>
                <Text size="md">
                  {timeFrame.timeFrameEnd &&
                    toDateString(new Date(timeFrame.timeFrameEnd))}
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
              <Button variant="outline" onClick={() => setEdit(true)}>
                Edit
              </Button>
              <Button color="red" variant="outline">
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
                  <div>
                    <Select
                      label="Project"
                      placeholder="Select a project"
                      key={form.key('project')}
                      {...form.getInputProps('project')}
                    />
                    <Textarea
                      label="Description"
                      placeholder="Describe what you have worked on."
                      key={form.key('description')}
                      {...form.getInputProps('description')}
                    />
                  </div>
                  <Button variant="outline" type="submit">
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
