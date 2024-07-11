import { api } from './api'

export interface TimeFrame {
  timeFrameId: number
  timeFrameStart: string
  timeFrameEnd?: string
  tzName: string
  description?: string
  projectId?: number
}

type TimeFramesResponse = TimeFrame[]

export const timeFramesApi = api.injectEndpoints({
  endpoints: build => ({
    getTimeFrames: build.query<TimeFramesResponse, void>({
      query: () => ({ url: 'timeFrames' }),
      providesTags: (result = []) => [
        ...result.map(
          ({ timeFrameId }) => ({ type: 'TimeFrames', timeFrameId }) as const,
        ),
        { type: 'TimeFrames' as const, id: 'LIST' },
      ],
    }),
    getTimeFrame: build.query<TimeFrame, number>({
      query: timeFrameId => ({ url: `timeFrames/${timeFrameId}` }),
      providesTags: (_result, _err, timeFrameId) => [
        { type: 'TimeFrames', timeFrameId },
      ],
    }),
    getActiveTimeFrame: build.query<TimeFrame, void>({
      query: () => ({ url: 'timeFrames/active' }),
      providesTags: (_result, _err) => [{ type: 'TimeFrames' }],
    }),
    addTimeFrame: build.mutation<TimeFrame, Partial<TimeFrame>>({
      query: body => ({
        url: `timeFrames`,
        method: 'POST',
        body: JSON.stringify(body),
      }),
      invalidatesTags: [{ type: 'TimeFrames', id: 'LIST' }],
    }),
    updateTimeFrame: build.mutation<TimeFrame, Partial<TimeFrame>>({
      query(data) {
        const { timeFrameId, ...body } = data
        return {
          url: `timeFrames/${timeFrameId}`,
          method: 'PATCH',
          body,
        }
      },
      invalidatesTags: timeFrame => [
        { type: 'TimeFrames', timeFrameId: timeFrame?.timeFrameId },
      ],
    }),
  }),
})

export const {
  useGetTimeFramesQuery,
  useGetTimeFrameQuery,
  useGetActiveTimeFrameQuery,
  useAddTimeFrameMutation,
  useUpdateTimeFrameMutation,
} = timeFramesApi
