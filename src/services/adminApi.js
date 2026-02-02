import { apiSlice } from '../store/api/apiSlice';

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['Admin'],
    }),
    getAdminUsers: builder.query({
      query: ({ page = 1, limit = 10, role = '' }) => 
        `/admin/users?page=${page}&limit=${limit}&role=${role}`,
      providesTags: ['Admin'],
    }),
    getAdminCourses: builder.query({
      query: ({ page = 1, limit = 10, status = '' }) => 
        `/admin/courses?page=${page}&limit=${limit}&status=${status}`,
      providesTags: ['Admin'],
    }),
    updateUserStatus: builder.mutation({
      query: ({ userId, status }) => ({
        url: `/admin/users/${userId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Admin'],
    }),
    updateCourseStatus: builder.mutation({
      query: ({ courseId, status }) => ({
        url: `/admin/courses/${courseId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetAdminUsersQuery,
  useGetAdminCoursesQuery,
  useUpdateUserStatusMutation,
  useUpdateCourseStatusMutation,
} = adminApi;