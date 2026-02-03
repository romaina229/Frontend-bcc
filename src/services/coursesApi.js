import { apiSlice } from '../store/api/apiSlice';

export const coursesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Liste des cours publics
    getCourses: builder.query({
      query: (params = {}) => ({
        url: '/cours',
        params: {
          page: params.page || 1,
          per_page: params.per_page || 15,
          categorie_id: params.categorie_id,
          niveau: params.niveau,
          statut: params.statut || 'actif'
        }
      }),
      providesTags: ['Course'],
    }),
    
    // Détails d'un cours
    getCourseById: builder.query({
      query: (id) => `/cours/${id}`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),
    
    // Mes cours inscrits
    getMyCourses: builder.query({
      query: () => '/mes-cours',
      providesTags: ['Course', 'Enrollment'],
    }),
    
    // Contenu d'un cours (pour les utilisateurs inscrits)
    getCourseContent: builder.query({
      query: (id) => `/cours/${id}/contenu`,
      providesTags: (result, error, id) => [{ type: 'Course', id }],
    }),
    
    // Progression dans un cours
    getCourseProgress: builder.query({
      query: (id) => `/cours/${id}/progression`,
      providesTags: ['Progress'],
    }),
    
    // Inscription à un cours
    enrollCourse: builder.mutation({
      query: (id) => ({
        url: `/cours/${id}/inscription`,
        method: 'POST',
      }),
      invalidatesTags: ['Course', 'Enrollment'],
    }),
    
    // Créer un cours (instructeur/admin)
    createCourse: builder.mutation({
      query: (courseData) => ({
        url: '/admin/cours',
        method: 'POST',
        body: courseData,
      }),
      invalidatesTags: ['Course'],
    }),
    
    // Mettre à jour un cours
    updateCourse: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/admin/cours/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Course', id }],
    }),
    
    // Supprimer un cours
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/admin/cours/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Course'],
    }),
    
    // Cours de l'instructeur
    getInstructorCourses: builder.query({
      query: () => '/formateur/cours',
      providesTags: ['Course'],
    }),
    
    // Étudiants d'un cours
    getCourseStudents: builder.query({
      query: (id) => `/formateur/cours/${id}/etudiants`,
      providesTags: ['Enrollment'],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetMyCoursesQuery,
  useGetCourseContentQuery,
  useGetCourseProgressQuery,
  useEnrollCourseMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetInstructorCoursesQuery,
  useGetCourseStudentsQuery,
} = coursesApi;
