import { apiSlice } from '../store/api/apiSlice';

export const certificatesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCertificates: builder.query({
      query: () => '/certificates',
    }),
    getCertificateById: builder.query({
      query: (id) => `/certificates/${id}`,
    }),
  }),
});

export const {
  useGetCertificatesQuery,
  useGetCertificateByIdQuery,
} = certificatesApi;