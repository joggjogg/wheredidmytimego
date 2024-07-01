import { useAddTimeFrameMutation } from '@/lib/services/timeFrames'
import { toDateString } from '@/lib/util/dates'
import { Button } from '@mantine/core'
import React from 'react'

const TimeFrameStart = () => {
  const [addTimeFrame, { isLoading }] = useAddTimeFrameMutation()

  const handleSumbit = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    await addTimeFrame({
      timeFrameStart: toDateString(new Date()),
      tzName: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
