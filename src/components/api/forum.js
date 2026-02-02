import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export const forumAPI = {
  // Récupérer les catégories
  getCategories: async () => {
    const response = await axios.get(`${API_URL}/forum/categories`)
    return response.data
  },
  
  // Récupérer les discussions
  getDiscussions: async (params = {}) => {
    const response = await axios.get(`${API_URL}/forum/discussions`, { params })
    return response.data
  },
  
  // Récupérer une discussion spécifique
  getDiscussion: async (id) => {
    const response = await axios.get(`${API_URL}/forum/discussions/${id}`)
    return response.data
  },
  
  // Récupérer les posts d'une discussion
  getPosts: async (discussionId) => {
    const response = await axios.get(`${API_URL}/forum/discussions/${discussionId}/posts`)
    return response.data
  },
  
  // Créer une discussion
  createDiscussion: async (data) => {
    const response = await axios.post(`${API_URL}/forum/discussions`, data)
    return response.data
  },
  
  // Ajouter un post
  addPost: async (discussionId, content) => {
    const response = await axios.post(`${API_URL}/forum/discussions/${discussionId}/posts`, {
      contenu: content
    })
    return response.data
  },
  
  // Modifier un post
  editPost: async (postId, content) => {
    const response = await axios.put(`${API_URL}/forum/posts/${postId}`, {
      contenu: content
    })
    return response.data
  },
  
  // Supprimer un post
  deletePost: async (postId) => {
    const response = await axios.delete(`${API_URL}/forum/posts/${postId}`)
    return response.data
  },
  
  // Sauvegarder une discussion
  bookmarkDiscussion: async (discussionId) => {
    const response = await axios.post(`${API_URL}/forum/discussions/${discussionId}/bookmark`)
    return response.data
  },
  
  // Signaler une discussion
  reportDiscussion: async (discussionId, reason) => {
    const response = await axios.post(`${API_URL}/forum/discussions/${discussionId}/report`, {
      reason
    })
    return response.data
  },
  
  // Récupérer les discussions sauvegardées
  getBookmarkedDiscussions: async () => {
    const response = await axios.get(`${API_URL}/forum/bookmarks`)
    return response.data
  },
  
  // Rechercher dans le forum
  search: async (query, filters = {}) => {
    const response = await axios.get(`${API_URL}/forum/search`, {
      params: { q: query, ...filters }
    })
    return response.data
  },
  
  // Marquer comme lu
  markAsRead: async (discussionId) => {
    const response = await axios.post(`${API_URL}/forum/discussions/${discussionId}/read`)
    return response.data
  },
  
  // Statistiques du forum
  getStats: async () => {
    const response = await axios.get(`${API_URL}/forum/stats`)
    return response.data
  }
}
