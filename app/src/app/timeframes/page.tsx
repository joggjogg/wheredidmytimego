'use client'

import React from 'react'
import { Box, Grid, SimpleGrid, rem } from '@mantine/core'
import TimeFrameStart from './components/TimeFrameStart'
import TimeFrameStop from './components/TimeFrameStop'
import TimeFrameActive from './components/TimeFrameActive'
import styles from './timeFrames.module.css'
import TimeFrameList from './components/TimeFrameList'

const PRIMARY_COL_HEIGHT = rem(600)

export default function Timeframes() {
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 3 - var(--mantine-spacing-md) / 3)`

  return (
    <>
      <h1>Timeframes</h1>
      <SimpleGrid
        className={styles.grid}
        cols={{ base: 1, sm: 2 }}
        spacing="md"
      >
        <Grid gutter="md">
          <Grid.Col>
            <Box className={styles.box} h={SECONDARY_COL_HEIGHT}>
              <TimeFrameActive />
            </Box>
          </Grid.Col>
          <Grid.Col span={6}>
            <Box h={SECONDARY_COL_HEIGHT}>
              <TimeFrameStart />
            </Box>
          </Grid.Col>
          <Grid.Col span={6}>
            <Box h={SECONDARY_COL_HEIGHT}>
              <TimeFrameStop />
            </Box>
          </Grid.Col>
        </Grid>
        <Box className={styles.box} h={PRIMARY_COL_HEIGHT}>
          <TimeFrameList />
        </Box>
      </SimpleGrid>
    </>
  )
}
