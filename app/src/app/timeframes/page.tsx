'use client'

import React from 'react'
import { Box, Grid, SimpleGrid, Skeleton, rem } from '@mantine/core'
import classes from './timeframes.module.css'
import TimeFrameStart from './components/TimeFrameStart'
import TimeFrameStop from './components/TimeFrameStop'

const PRIMARY_COL_HEIGHT = rem(600)

export default function Timeframes() {
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 3 - var(--mantine-spacing-md) / 3)`

  return (
    <>
      <h1>Timeframes</h1>
      <SimpleGrid
        className={classes.grid}
        cols={{ base: 1, sm: 2 }}
        spacing="md"
      >
        <Grid gutter="md">
          <Grid.Col>
            <Skeleton
              height={SECONDARY_COL_HEIGHT}
              radius="md"
              animate={false}
            />
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
        <Skeleton radius="md" h={PRIMARY_COL_HEIGHT} animate={false} />
        {/* // <TimeFrameTable /> */}
      </SimpleGrid>
    </>
  )
}
