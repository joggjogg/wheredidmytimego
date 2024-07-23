import { api } from './api'
import { Project } from './projects'

export interface TimeFrame {
  timeFrameId: number
  timeFrameStart: string
  timeFrameEnd?: string
  tzName: string
  description?: string
  projectId?: number
  project?: Project
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
      invalidatesTags: timeFrame => [
        { type: 'TimeFrames', timeFrameId: timeFrame?.timeFrameId },
      ],
    }),
    deleteTimeFrame: build.mutation<{ success: boolean; id: number }, number>({
      query: timeFrameId => ({
        url: `timeFrames/${timeFrameId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'TimeFrames', timeFrameId: id },
        { type: 'Projects' },
      ],
    }),
    updateTimeFrame: build.mutation<TimeFrame, Partial<TimeFrame>>({
      query(data) {
        const { timeFrameId, ...body } = data
        return {
          url: `timeFrames/${timeFrameId}`,
          method: 'PATCH',
          body: JSON.stringify(body),
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
  useDeleteTimeFrameMutation,
} = timeFramesApi
