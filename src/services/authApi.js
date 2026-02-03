import { apiSlice } from '../components/store/api/apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Connexion
    login: builder.mutation({
      query: (credentials) => ({
        url: '/connexion',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // Inscription
    register: builder.mutation({
      query: (userData) => ({
        url: '/inscription',
        method: 'POST',
        body: {
          nom: userData.nom,
          prenom: userData.prenom,
          email: userData.email,
          password: userData.password,
          password_confirmation: userData.password_confirmation,
          telephone: userData.telephone,
          date_naissance: userData.date_naissance,
          genre: userData.genre,
        },
      }),
    }),
    
    // Déconnexion
    logout: builder.mutation({
      query: () => ({
        url: '/deconnexion',
        method: 'POST',
      }),
    }),
    
    // Récupérer l'utilisateur actuel
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
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
