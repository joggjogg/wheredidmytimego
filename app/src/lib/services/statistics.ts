import { api } from './api'
import { createQueryString, TimeFrameParameters } from './timeFrames'

export interface TimeFrameStatistics {
  projectId: number
  timeFrameDateFrom: string
  timeFrameDateTo: string
  hours: number
  minutes: number
  seconds: number
}

export const statisticsApi = api.injectEndpoints({
  endpoints: build => ({
    getStatistics: build.query<TimeFrameStatistics, TimeFrameParameters>({
      query: (params: TimeFrameParameters) => ({
        url: `statistics/timeframes?${createQueryString(params)}`,
      }),
      providesTags: (_result, _err) => [{ type: 'Statistics' }],
    }),
  }),
})

export const { useGetStatisticsQuery } = statisticsApi
