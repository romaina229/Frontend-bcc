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

export const quizAPI = {
  // Récupérer un quiz par ID
  getQuiz: async (id) => {
    const response = await axios.get(`${API_URL}/quiz/${id}`);
    return response.data;
  },
  
  // Récupérer le quiz de la semaine
  getWeeklyQuiz: async (week) => {
    const response = await axios.get(`${API_URL}/quiz/semaine/${week}`);
    return response.data;
  },
  
  // Soumettre un quiz
  submitQuiz: async (quizId, data) => {
    const response = await axios.post(`${API_URL}/quiz/${quizId}/soumettre`, {
      answers: data.answers, // Format: { question_id: answer }
      time_spent: data.time_spent // temps en secondes
    });
    return response.data;
  },
  
  // Récupérer les résultats d'un quiz
  getResults: async (quizId) => {
    const response = await axios.get(`${API_URL}/quiz/${quizId}/resultats`);
    return response.data;
  },
  
  // Historique des quiz
  getQuizHistory: async () => {
    const response = await axios.get(`${API_URL}/quiz/historique`);
    return response.data;
  },
  
  // Détails d'une tentative
  getAttemptDetails: async (attemptId) => {
    const response = await axios.get(`${API_URL}/quiz/tentative/${attemptId}`);
    return response.data;
  },
  
  // Pour les formateurs - créer un quiz
  createQuiz: async (quizData) => {
    const response = await axios.post(`${API_URL}/formateur/quiz`, {
      titre: quizData.titre,
      description: quizData.description,
      cours_id: quizData.cours_id,
      module_id: quizData.module_id,
      type: quizData.type, // 'semaine', 'module', 'final'
      semaine: quizData.semaine,
      duree: quizData.duree, // en minutes
      note_minimale: quizData.note_minimale || 70,
      max_tentatives: quizData.max_tentatives,
      date_debut: quizData.date_debut,
      date_fin: quizData.date_fin,
      statut: quizData.statut || 'brouillon',
      instructions: quizData.instructions,
      ordre: quizData.ordre || 0
    });
    return response.data;
  },
  
  // Pour les formateurs - voir les réponses d'un quiz
  getQuizResponses: async (quizId) => {
    const response = await axios.get(`${API_URL}/formateur/quiz/${quizId}/reponses`);
    return response.data;
  },
};
