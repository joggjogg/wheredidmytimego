'use client'

import React from 'react'
import styles from './TimeFrameControls.module.css'
import { Group, Select } from '@mantine/core'
import { IconCalendar } from '@tabler/icons-react'
import { DatePickerInput, DatesRangeValue } from '@mantine/dates'
import {
  Preset,
  TimeFrameControlsAction,
  TimeFrameControlsActionKind,
  TimeFrameControlsState,
} from '@/app/timeframes/page'
import { useGetProjectsQuery } from '@/lib/services/projects'

const TimeFrameControls = ({
  dispatch,
  preset,
  projectId,
  dateRange,
}: {
  dispatch: React.Dispatch<TimeFrameControlsAction>
  preset: TimeFrameControlsState['preset']
  projectId?: string
  dateRange: DatesRangeValue
}) => {
  const { data: projects } = useGetProjectsQuery()

  return (
    <div className={styles.container}>
      <div className={styles.label__container}>
        <IconCalendar size={'20px'} />
        <div className={styles.label}>Filter</div>
      </div>
      <Group grow align="space-between">
        <Select
          size="sm"
          placeholder="Date range"
          value={preset}
          data={[
            {
              group: 'Current',
              items: [{ label: 'Current Month', value: 'current_month' }],
            },
            {
              group: 'Previous',
              items: [{ label: 'Previous Month', value: 'previous_month' }],
            },
          ]}
          onChange={(value, _option) => {
            if (value) {
              dispatch({
                type: TimeFrameControlsActionKind.PRESET,
                payload: { preset: value as Preset },
              })
            }
          }}
        />
        <Select
          data={projects?.map(project => ({
            label: project.projectName,
            value: `${project.projectId}`,
          }))}
          clearable
          value={projectId}
          onChange={(value, _option) => {
            dispatch({
              type: TimeFrameControlsActionKind.PROJECT,
              payload: { projectId: value || undefined },
            })
          }}
          size="sm"
          placeholder="Project"
        />
      </Group>
      <DatePickerInput
        clearable
        value={dateRange}
        onChange={value => {
          console.debug('dispatch')
          dispatch({
            type: TimeFrameControlsActionKind.DATE_RANGE,
            payload: { dateFrom: value[0], dateTo: value[1] },
          })
        }}
        size="sm"
        type="range"
      />
      {/* <Button
        className={styles.button__apply}
        size="sm"
        variant="outline"
        color="gray"
      >
        Apply
      </Button> */}
    </div>
  )
}

export default TimeFrameControls
