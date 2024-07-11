import { useUpdateTimeFrameMutation } from '@/lib/services/timeFrames'
import { toDateString } from '@/lib/util/dates'
import { Button, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import React from 'react'

const TimeFrameStop = () => {
  const [updateTimeFrameMutation, { isLoading }] = useUpdateTimeFrameMutation()
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      description: '',
      // project: null,
    },
    validate: {
      description: value =>
        value.length !== 0 ? null : 'Please describe what you have worked on.',
    },
  })

  const handleSumbit = form.onSubmit(async values => {
    const result = await updateTimeFrameMutation({
      timeFrameEnd: toDateString(new Date()),
      description: values.description,
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
  })

  const handleClick = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    open()
  }
  return (
    <>
      <Modal opened={opened} onClose={close} centered title="End TimeFrame">
        <form onSubmit={handleSumbit}>
          <TextInput
            withAsterisk
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
        color="#dfe2e6"
        w={'100%'}
        h={'100%'}
        radius="md"
        onClick={handleClick}
      >
        {isLoading ? 'Loading' : 'Stop'}
      </Button>
    </>
  )
}

export default TimeFrameStop
