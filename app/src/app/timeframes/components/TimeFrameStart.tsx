import { useAddTimeFrameMutation } from '@/lib/services/timeFrames'
import { toDateString } from '@/lib/util/dates'
import { Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons-react'
import React from 'react'

const TimeFrameStart = () => {
  const [addTimeFrame, { isLoading }] = useAddTimeFrameMutation()

  const handleSumbit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const result = await addTimeFrame({
      timeFrameStart: toDateString(new Date()),
      tzName: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
      message: 'Started a TimeFrame',
      withBorder: true,
    })
  }

  return (
    <Button
      color="#dfe2e6"
      w={'100%'}
      h={'100%'}
      radius="md"
      onClick={handleSumbit}
    >
      {isLoading ? 'Loading' : 'Start'}
    </Button>
  )
}

export default TimeFrameStart
