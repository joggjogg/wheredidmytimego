'use client'

import React, { useReducer } from 'react'
import TimeFrameActive from '../../lib/components/Timeframes/TimeFrameActive/TimeFrameActive'
import TimeFrameStart from '../../lib/components/Timeframes/TimeFrameStart/TimeFrameStart'
import TimeFrameStop from '../../lib/components/Timeframes/TimeFrameStop/TimeFrameStop'
import TimeFrameList from '../../lib/components/Timeframes/TimeFrameList/TimeFrameList'
import { useGetTimeFramesQuery } from '@/lib/services/timeFrames'
import styles from './page.module.css'
import GridSlotWrapper from '@/lib/components/GridSlotWrapper/GridSlotWrapper'
import TimeFrameControls from '@/lib/components/Timeframes/TimeFrameControls/TimeFrameControls'
import { endOfDay, endOfMonth, format, startOfMonth } from 'date-fns'
import { DateValue } from '@mantine/dates'

export enum TimeFrameControlsActionKind {
  DATE_RANGE,
  PROJECT,
  PRESET,
}

export type Preset =
  | 'current_month'
  | 'previous_month'
  | 'current_week'
  | 'previous_week'

export type TimeFrameControlsAction =
  | {
      type: TimeFrameControlsActionKind.DATE_RANGE
      payload: { dateFrom: DateValue; dateTo: DateValue }
    }
  | { type: TimeFrameControlsActionKind.PRESET; payload: { preset: Preset } }
  | {
      type: TimeFrameControlsActionKind.PROJECT
      payload: { projectId?: string }
    }

export interface TimeFrameControlsState {
  preset: Preset
  dateFrom: DateValue | null
  dateTo: DateValue | null
  projectId?: string
  tzName: string
}

const timeFrameControlsReducer = (
  state: TimeFrameControlsState,
  action: TimeFrameControlsAction,
): TimeFrameControlsState => {
  const { type, payload } = action

  switch (type) {
    case TimeFrameControlsActionKind.PRESET:
      return {
        ...state,
        preset: payload.preset,
      }
    case TimeFrameControlsActionKind.DATE_RANGE:
      return {
        ...state,
        dateFrom: payload.dateFrom,
        dateTo: payload.dateTo,
      }

    case TimeFrameControlsActionKind.PROJECT:
      return {
        ...state,
        projectId: payload.projectId,
      }
    default:
      return state
  }
}

const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone

const initialState: TimeFrameControlsState = {
  preset: 'current_month',
  tzName: tzName,
  dateFrom: startOfMonth(new Date()),
  dateTo: endOfMonth(endOfDay(new Date())),
}

export default function Timeframes() {
  const [state, dispatch] = useReducer(timeFrameControlsReducer, initialState)
  const {
    data: timeFrames,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTimeFramesQuery({
    ...state,
    dateFrom: state.dateFrom
      ? format(state.dateFrom, 'yyyy-MM-dd HH:mm:ssXXX')
      : undefined,
    dateTo: state.dateTo
      ? format(state.dateTo, 'yyyy-MM-dd HH:mm:ssXXX')
      : undefined,
  })

  return (
    <>
      <h1>TimeFrames</h1>
      <ul className={styles.grid}>
        <div className={styles.timeFrameActive}>
          <TimeFrameActive />
        </div>
        <div className={styles.timeFrameStart}>
          <TimeFrameStart />
          <TimeFrameStop />
        </div>

        <div className={styles.timeFrameControls}>
          <TimeFrameControls
            dateRange={[state.dateFrom, state.dateTo]}
            preset={state.preset}
            projectId={state.projectId}
            dispatch={dispatch}
          />
        </div>
        <div className={styles.timeFrameList}>
          <GridSlotWrapper
            isLoading={isLoading}
            isSuccess={isSuccess}
            isError={isError}
            error={error}
          >
            {timeFrames && <TimeFrameList timeFrames={timeFrames} />}
          </GridSlotWrapper>
        </div>
      </ul>
    </>
  )
}
