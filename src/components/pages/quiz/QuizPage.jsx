import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  QuestionMarkCircleIcon,
  TrophyIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { quizAPI } from '../../api/quiz'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-toastify'

export default function QuizPage() {
  const { id, week } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)

  // Récupérer le quiz
  const { data: quiz, isLoading: loadingQuiz } = useQuery({
    queryKey: ['quiz', id || week],
    queryFn: () => {
      if (week) {
        return quizAPI.getWeeklyQuiz(week)
      }
      return quizAPI.getQuiz(id)
    },
    enabled: !!(id || week)
  })

  // Mutation pour soumettre le quiz
  const submitQuizMutation = useMutation({
    mutationFn: (data) => quizAPI.submitQuiz(id || quiz?.id, data),
    onSuccess: (data) => {
      setScore(data.score)
      setQuizCompleted(true)
      setShowResults(true)
      if (data.passed) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }
      toast.success(data.passed ? 'Quiz réussi ! 🎉' : 'Quiz terminé')
    },
    onError: () => {
      toast.error('Erreur lors de la soumission du quiz')
    }
  })

  // Gérer le timer
  useEffect(() => {
    if (!quizStarted || !quiz?.duree || quizCompleted) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, quizCompleted, quiz?.duree])

  // Initialiser le timer
  useEffect(() => {
    if (quiz?.duree) {
      setTimeLeft(quiz.duree * 60) // Convertir les minutes en secondes
    }
  }, [quiz])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < (quiz?.questions?.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleStartQuiz = () => {
    setQuizStarted(true)
  }

  const handleSubmitQuiz = () => {
    const timeSpent = quiz?.duree ? (quiz.duree * 60) - timeLeft : 0
    submitQuizMutation.mutate({
      answers,
      time_spent: timeSpent
    })
  }

  const handleRetryQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setQuizStarted(false)
    setQuizCompleted(false)
    setShowResults(false)
    setScore(null)
    if (quiz?.duree) {
      setTimeLeft(quiz.duree * 60)
    }
  }

  if (loadingQuiz) {
    return <LoadingSpinner fullScreen />
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <QuestionMarkCircleIcon className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz non trouvé</h2>
        <p className="text-gray-600 mb-6">Ce quiz n'est pas disponible</p>
        <button onClick={() => navigate('/cours')} className="btn-primary">
          Retour aux cours
        </button>
      </div>
    )
  }

  const questions = quiz.questions || []
  const currentQ = questions[currentQuestion]
  const totalQuestions = questions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      {showConfetti && <Confetti />}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.titre}</h1>
          <p className="text-gray-600">{quiz.description}</p>
          
          {quizStarted && quiz.duree && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow">
              <ClockIcon className="h-5 w-5 text-primary-600" />
              <span className="font-mono text-lg font-bold">
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!quizStarted ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-card p-8"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <QuestionMarkCircleIcon className="h-12 w-12 text-primary-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Prêt pour le quiz ?
                </h2>
                
                <div className="max-w-md mx-auto space-y-4 mb-8">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Nombre de questions</span>
                    <span className="font-semibold">{totalQuestions}</span>
                  </div>
                  {quiz.duree && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">Durée</span>
                      <span className="font-semibold">{quiz.duree} minutes</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Note minimale</span>
                    <span className="font-semibold">{quiz.note_minimale}%</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600">Tentatives</span>
                    <span className="font-semibold">
                      {quiz.max_tentatives || 'Illimitées'}
                    </span>
                  </div>
                </div>
                
                {quiz.instructions && (
                  <div className="mb-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="font-semibold text-yellow-800 mb-2">Instructions</h3>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      {quiz.instructions.map((instruction, index) => (
                        <li key={index}>• {instruction}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <button
                  onClick={handleStartQuiz}
                  className="btn-primary px-8 py-3 text-lg"
                >
                  Commencer le quiz
                </button>
              </div>
            </motion.div>
          ) : !showResults ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl shadow-card p-8"
            >
              {/* Barre de progression */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Question {currentQuestion + 1} sur {totalQuestions}
                  </span>
                  <span className="text-sm font-medium text-primary-600">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              
              {/* Question */}
              {currentQ && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary-600">
                        {currentQuestion + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {currentQ.question}
                    </h3>
                  </div>
                  
                  {/* Options de réponse */}
                  <div className="space-y-3">
                    {currentQ.type === 'qcm' && currentQ.options && (
                      currentQ.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(currentQ.id, option)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            answers[currentQ.id] === option
                              ? 'border-primary-600 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                              answers[currentQ.id] === option
                                ? 'border-primary-600 bg-primary-600'
                                : 'border-gray-300'
                            }`}>
                              {answers[currentQ.id] === option && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <span>{option}</span>
                          </div>
                        </button>
                      ))
                    )}
                    
                    {currentQ.type === 'texte' && (
                      <textarea
                        value={answers[currentQ.id] || ''}
                        onChange={(e) => handleAnswerSelect(currentQ.id, e.target.value)}
                        placeholder="Votre réponse..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        rows={4}
                      />
                    )}
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Précédent
                </button>
                
                <div className="flex items-center gap-4">
                  {currentQuestion === totalQuestions - 1 ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={Object.keys(answers).length !== totalQuestions}
                      className="btn-primary px-8 py-2"
                    >
                      Terminer le quiz
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="btn-primary px-8 py-2"
                    >
                      Suivant
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-card p-8"
            >
              <div className="text-center">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  score >= quiz.note_minimale ? 'bg-success-100' : 'bg-danger-100'
                }`}>
                  {score >= quiz.note_minimale ? (
                    <TrophyIcon className="h-12 w-12 text-success-600" />
                  ) : (
                    <XCircleIcon className="h-12 w-12 text-danger-600" />
                  )}
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {score >= quiz.note_minimale ? 'Félicitations !' : 'Quiz terminé'}
                </h2>
                <p className="text-gray-600 mb-8">
                  {score >= quiz.note_minimale
                    ? 'Vous avez réussi le quiz avec succès !'
                    : 'Dommage, vous n\'avez pas atteint la note minimale.'}
                </p>
                
                {/* Score */}
                <div className="max-w-sm mx-auto mb-8">
                  <div className="relative h-32 w-32 mx-auto">
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={score >= quiz.note_minimale ? '#10b981' : '#ef4444'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${(score / 100) * 283} 283`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{score}%</span>
                      <span className="text-sm text-gray-600">Score</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-gray-600">
                      Note minimale requise : <span className="font-semibold">{quiz.note_minimale}%</span>
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate(`/quiz/${id}/resultats`)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <ChartBarIcon className="h-5 w-5" />
                    Voir les détails
                  </button>
                  
                  {quiz.max_tentatives === null || 
                   (quiz.max_tentatives && 
                    (quiz.user_attempts?.length || 0) < quiz.max_tentatives) ? (
                    <button
                      onClick={handleRetryQuiz}
                      className="btn-primary flex items-center gap-2"
                    >
                      <ArrowPathIcon className="h-5 w-5" />
                      Réessayer
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate('/cours')}
                      className="btn-primary"
                    >
                      Retour aux cours
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
