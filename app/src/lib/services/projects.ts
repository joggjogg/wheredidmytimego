import { api } from './api'
import { TimeFrame } from './timeFrames'

export interface Project {
  projectId: string
  projectName: string
  projectDescription?: string
  timeFrames: TimeFrame[]
}

type ProjectsResponse = Project[]

export const projectsApi = api.injectEndpoints({
  endpoints: build => ({
    getProjects: build.query<ProjectsResponse, void>({
      query: () => ({ url: 'projects' }),
      providesTags: (result = []) => [
        ...result.map(
          ({ projectId }) => ({ type: 'Projects', projectId }) as const,
        ),
        { type: 'Projects' as const, id: 'LIST' },
      ],
    }),
    getProject: build.query<Project, number>({
      query: projectId => ({ url: `projects/${projectId}` }),
      providesTags: (_result, _err, projectId) => [
        { type: 'Projects', projectId },
      ],
    }),
    addProject: build.mutation<Project, Partial<Project>>({
      query: body => ({
        url: `projects`,
        method: 'POST',
        body: JSON.stringify(body),
      }),
      invalidatesTags: project => [
        { type: 'Projects', projectId: project?.projectId },
      ],
    }),
  }),
})

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useAddProjectMutation,
} = projectsApi
