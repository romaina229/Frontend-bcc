import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Configurer axios pour inclure le token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const forumAPI = {
  // Récupérer les catégories
  getCategories: async () => {
    const response = await axios.get(`${API_URL}/forum/categories`);
    return response.data;
  },
  
  // Récupérer les discussions d'une catégorie
  getCategoryDiscussions: async (categoryId, params = {}) => {
    const response = await axios.get(`${API_URL}/forum/categorie/${categoryId}/discussions`, { params });
    return response.data;
  },
  
  // Récupérer toutes les discussions (avec filtres)
  getDiscussions: async (params = {}) => {
    const response = await axios.get(`${API_URL}/forum/discussions`, { 
      params: {
        per_page: params.per_page || 15,
        page: params.page || 1,
        categorie_id: params.categorie_id,
        cours_id: params.cours_id,
        search: params.search,
        filter: params.filter || 'recent'
      }
    });
    return response.data;
  },
  
  // Récupérer une discussion spécifique
  getDiscussion: async (id) => {
    const response = await axios.get(`${API_URL}/forum/discussions/${id}`);
    return response.data;
  },
  
  // Récupérer les posts d'une discussion
  getPosts: async (discussionId) => {
    const response = await axios.get(`${API_URL}/forum/discussions/${discussionId}`);
    // Les posts sont inclus dans la discussion
    return response.data.posts || [];
  },
  
  // Créer une discussion
  createDiscussion: async (data) => {
    const response = await axios.post(`${API_URL}/forum/discussions`, {
      titre: data.titre,
      contenu: data.contenu,
      categorie_id: data.categorie_id,
      cours_id: data.cours_id,
      tags: data.tags
    });
    return response.data;
  },
  
  // Mettre à jour une discussion
  updateDiscussion: async (discussionId, data) => {
    const response = await axios.put(`${API_URL}/forum/discussions/${discussionId}`, data);
    return response.data;
  },
  
  // Supprimer une discussion
  deleteDiscussion: async (discussionId) => {
    const response = await axios.delete(`${API_URL}/forum/discussions/${discussionId}`);
    return response.data;
  },
  
  // Ajouter un post
  addPost: async (discussionId, contenu) => {
    const response = await axios.post(`${API_URL}/forum/discussions/${discussionId}/posts`, {
      contenu
    });
    return response.data;
  },
  
  // Modifier un post
  editPost: async (postId, contenu) => {
    const response = await axios.put(`${API_URL}/forum/posts/${postId}`, {
      contenu
    });
    return response.data;
  },
  
  // Supprimer un post
  deletePost: async (postId) => {
    const response = await axios.delete(`${API_URL}/forum/posts/${postId}`);
    return response.data;
  },
  
  // Ajouter un commentaire
  addComment: async (postId, contenu) => {
    const response = await axios.post(`${API_URL}/forum/posts/${postId}/commentaires`, {
      contenu
    });
    return response.data;
  },
  
  // Modifier un commentaire
  editComment: async (commentId, contenu) => {
    const response = await axios.put(`${API_URL}/forum/commentaires/${commentId}`, {
      contenu
    });
    return response.data;
  },
  
  // Supprimer un commentaire
  deleteComment: async (commentId) => {
    const response = await axios.delete(`${API_URL}/forum/commentaires/${commentId}`);
    return response.data;
  },
};
