'use client'

import { Group, Stack } from '@mantine/core'
import React from 'react'
import TimeFrameActive from './components/TimeFrameActive'
import TimeFrameStart from './components/TimeFrameStart'
import TimeFrameStop from './components/TimeFrameStop'
import TimeFrameDetail from './components/TimeFrameDetail'
import TimeFrameList from './components/TimeFrameList'
import styles from './timeFrames.module.css'

export default function Timeframes() {
  return (
    <>
      <h1>Timeframes</h1>
      <Group
        grow
        h={'100%'}
        align="start"
        justify="space-between"
        className={styles.container}
        pb={'xl'}
      >
        <Stack align="stretch" justify="flex-start">
          <TimeFrameActive />
          <Group>
            <TimeFrameStart />
            <TimeFrameStop />
          </Group>
          <TimeFrameDetail />
        </Stack>
        <TimeFrameList />
      </Group>
    </>
  )
}
