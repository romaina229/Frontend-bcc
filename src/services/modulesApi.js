import { apiSlice } from '../store/api/apiSlice';

export const modulesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourseModules: builder.query({
      query: (courseId) => `/courses/${courseId}/modules`,
    }),
    getModuleById: builder.query({
      query: (id) => `/modules/${id}`,
    }),
  }),
});

export const {
  useGetCourseModulesQuery,
  useGetModuleByIdQuery,
} = modulesApi;