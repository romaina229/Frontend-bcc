import { apiSlice } from '../components/store/api/apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Connexion - Compatible avec /connexion et /login
    login: builder.mutation({
      query: (credentials) => ({
        url: '/connexion',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // Inscription - Compatible avec /inscription et /register
    register: builder.mutation({
      query: (userData) => ({
        url: '/inscription',
        method: 'POST',
        body: {
          name: userData.name || `${userData.prenom} ${userData.nom}`,
          email: userData.email,
          password: userData.password,
          password_confirmation: userData.password_confirmation,
          phone: userData.telephone || userData.phone,
          role: userData.role || 'participant',
        },
      }),
    }),
    
    // Déconnexion - Compatible avec /deconnexion et /logout
    logout: builder.mutation({
      query: () => ({
        url: '/deconnexion',
        method: 'POST',
      }),
    }),
    
    // Récupérer l'utilisateur actuel - Compatible avec /utilisateur et /me
    getCurrentUser: builder.query({
      query: () => '/utilisateur',
      providesTags: ['User'],
    }),
    
    // Mot de passe oublié
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: '/mot-de-passe-oublie',
        method: 'POST',
        body: { email },
      }),
    }),
    
    // Réinitialiser le mot de passe
    resetPassword: builder.mutation({
      query: ({ token, email, password, password_confirmation }) => ({
        url: '/reinitialiser-mot-de-passe',
        method: 'POST',
        body: { token, email, password, password_confirmation },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;