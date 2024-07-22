'use client'

import { Group, Stack } from '@mantine/core'
import React from 'react'
import TimeFrameActive from './components/TimeFrameActive'
import TimeFrameStart from './components/TimeFrameStart'
import TimeFrameStop from './components/TimeFrameStop'
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
      >
        <Stack h={'50%'} justify="flex-start">
          <TimeFrameActive />
          <Group justify="between" grow h={'100%'}>
            <TimeFrameStart />
            <TimeFrameStop />
          </Group>
        </Stack>
        <TimeFrameList />
      </Group>
    </>
  )
}
