import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export const quizAPI = {
  // Récupérer un quiz par ID
  getQuiz: async (id) => {
    const response = await axios.get(`${API_URL}/quiz/${id}`)
    return response.data
  },
  
  // Récupérer le quiz de la semaine
  getWeeklyQuiz: async (week) => {
    const response = await axios.get(`${API_URL}/quiz/semaine/${week}`)
    return response.data
  },
  
  // Soumettre un quiz
  submitQuiz: async (quizId, data) => {
    const response = await axios.post(`${API_URL}/quiz/${quizId}/soumettre`, data)
    return response.data
  },
  
  // Récupérer les résultats
  getResults: async (quizId) => {
    const response = await axios.get(`${API_URL}/quiz/${quizId}/resultats`)
    return response.data
  },
  
  // Historique des quiz
  getQuizHistory: async () => {
    const response = await axios.get(`${API_URL}/quiz/historique`)
    return response.data
  },
  
  // Détails d'une tentative
  getAttemptDetails: async (attemptId) => {
    const response = await axios.get(`${API_URL}/quiz/tentative/${attemptId}`)
    return response.data
  },
  
  // Statistiques de quiz
  getQuizStats: async () => {
    const response = await axios.get(`${API_URL}/quiz/statistiques`)
    return response.data
  },
  
  // Questions fréquemment manquées
  getMissedQuestions: async () => {
    const response = await axios.get(`${API_URL}/quiz/questions-manquees`)
    return response.data
  },
  
  // Progression des quiz
  getQuizProgress: async () => {
    const response = await axios.get(`${API_URL}/quiz/progression`)
    return response.data
  }
}
