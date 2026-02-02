import { apiSlice } from '../store/api/apiSlice';

export const instructorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInstructorCourses: builder.query({
      query: () => '/instructor/courses',
    }),
    getInstructorAnalytics: builder.query({
      query: () => '/instructor/analytics',
    }),
  }),
});

export const {
  useGetInstructorCoursesQuery,
  useGetInstructorAnalyticsQuery,
} = instructorApi;