import React, { useState, useEffect } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
//import { motion } from 'framer-motion'
//import {
  MagnifyingGlassIcon,
  PlusIcon,
  FireIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  PinIcon
} from '@heroicons/react/24/outline'
//import ForumCategorySidebar from './ForumCategorySidebar'
//import DiscussionCard from './DiscussionCard'
import CreateDiscussionModal from './CreateDiscussionModal'
//import LoadingSpinner from '../../components/common/LoadingSpinner'
import { forumAPI } from '../../api/forum'
//import { useAuth } from '../../hooks/useAuth'

export default function Forum() {
  const { id: categoryId } = useParams()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('recent')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: categories, isLoading: loadingCategories } = useQuery({
    queryKey: ['forum-categories'],
    queryFn: forumAPI.getCategories
  })

  const { data: discussionsData, isLoading: loadingDiscussions } = useQuery({
    queryKey: ['forum-discussions', categoryId, filter, search, currentPage],
    queryFn: () => forumAPI.getDiscussions({
      categorie_id: categoryId,
      filter,
      search,
      page: currentPage
    })
  })

  const discussions = discussionsData?.data || []
  const pagination = discussionsData?.meta

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  if (loadingCategories) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Forum de Discussion</h1>
              <p className="text-gray-600 mt-2">
                Échangez avec la communauté, posez vos questions et partagez vos connaissances
              </p>
            </div>
            
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                Nouvelle Discussion
              </button>
            )}
          </div>

          {/* Barre de recherche et filtres */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher une discussion..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <button type="submit" className="sr-only">Rechercher</button>
              </div>
            </form>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleFilterChange('recent')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'recent' ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <ClockIcon className="h-5 w-5" />
                Récents
              </button>
              <button
                onClick={() => handleFilterChange('popular')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'popular' ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <FireIcon className="h-5 w-5" />
                Populaires
              </button>
              <button
                onClick={() => handleFilterChange('unanswered')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'unanswered' ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                Sans réponse
              </button>
              <button
                onClick={() => handleFilterChange('pinned')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${filter === 'pinned' ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <PinIcon className="h-5 w-5" />
                Épinglés
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar des catégories */}
          <div className="lg:w-1/4">
            <ForumCategorySidebar
              categories={categories}
              currentCategoryId={categoryId}
            />
          </div>

          {/* Liste des discussions */}
          <div className="lg:w-3/4">
            {loadingDiscussions ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : discussions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune discussion trouvée
                </h3>
                <p className="text-gray-600 mb-6">
                  {search ? 'Aucun résultat pour votre recherche' : 'Soyez le premier à lancer une discussion !'}
                </p>
                {user && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary"
                  >
                    Créer une discussion
                  </button>
                )}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {discussions.map((discussion) => (
                  <DiscussionCard key={discussion.id} discussion={discussion} />
                ))}

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Précédent
                      </button>
                      
                      {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                        let pageNum
                        if (pagination.last_page <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= pagination.last_page - 2) {
                          pageNum = pagination.last_page - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-lg ${currentPage === pageNum ? 'bg-primary-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                        disabled={currentPage === pagination.last_page}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Suivant
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de création */}
      {showCreateModal && (
        <CreateDiscussionModal
          categories={categories}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  )
}
