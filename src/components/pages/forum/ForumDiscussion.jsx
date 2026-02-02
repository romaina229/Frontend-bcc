import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {
  ArrowLeftIcon,
  ShareIcon,
  BookmarkIcon,
  FlagIcon,
  PaperAirplaneIcon,
  PencilIcon,
  TrashIcon,
  ReplyIcon,
  UserCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import {
  BookmarkIcon as BookmarkSolidIcon,
  FlagIcon as FlagSolidIcon
} from '@heroicons/react/24/solid'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { forumAPI } from '../../api/forum'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-toastify'

export default function ForumDiscussion() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [replyContent, setReplyContent] = useState('')
  const [editingPostId, setEditingPostId] = useState(null)
  const [editContent, setEditContent] = useState('')

  // Récupérer la discussion
  const { data: discussion, isLoading: loadingDiscussion } = useQuery({
    queryKey: ['forum-discussion', id],
    queryFn: () => forumAPI.getDiscussion(id),
    enabled: !!id
  })

  // Récupérer les posts
  const { data: posts, isLoading: loadingPosts } = useQuery({
    queryKey: ['forum-posts', id],
    queryFn: () => forumAPI.getPosts(id),
    enabled: !!id
  })

  // Mutation pour ajouter un post
  const addPostMutation = useMutation({
    mutationFn: (content) => forumAPI.addPost(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['forum-posts', id])
      queryClient.invalidateQueries(['forum-discussion', id])
      setReplyContent('')
      toast.success('Réponse publiée avec succès')
    },
    onError: () => {
      toast.error('Erreur lors de la publication')
    }
  })

  // Mutation pour éditer un post
  const editPostMutation = useMutation({
    mutationFn: ({ postId, content }) => forumAPI.editPost(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['forum-posts', id])
      setEditingPostId(null)
      toast.success('Message modifié avec succès')
    }
  })

  // Mutation pour supprimer un post
  const deletePostMutation = useMutation({
    mutationFn: (postId) => forumAPI.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries(['forum-posts', id])
      queryClient.invalidateQueries(['forum-discussion', id])
      toast.success('Message supprimé avec succès')
    }
  })

  // Mutation pour signaler/sauvegarder
  const bookmarkMutation = useMutation({
    mutationFn: (postId) => forumAPI.bookmarkPost(postId),
    onSuccess: () => {
      toast.success('Discussion sauvegardée')
    }
  })

  const reportMutation = useMutation({
    mutationFn: (postId) => forumAPI.reportPost(postId),
    onSuccess: () => {
      toast.success('Signalement envoyé')
    }
  })

  const handleSubmitReply = (e) => {
    e.preventDefault()
    if (!replyContent.trim()) {
      toast.error('Le message ne peut pas être vide')
      return
    }
    addPostMutation.mutate(replyContent)
  }

  const handleEditPost = (postId) => {
    if (!editContent.trim()) {
      toast.error('Le message ne peut pas être vide')
      return
    }
    editPostMutation.mutate({ postId, content: editContent })
  }

  const handleDeletePost = (postId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      deletePostMutation.mutate(postId)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Lien copié dans le presse-papier')
  }

  if (loadingDiscussion || loadingPosts) {
    return <LoadingSpinner fullScreen />
  }

  if (!discussion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Discussion non trouvée</h2>
        <Link to="/forum" className="btn-primary">
          Retour au forum
        </Link>
      </div>
    )
  }

  const firstPost = posts?.[0]
  const replyPosts = posts?.slice(1) || []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            to="/forum"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Retour au forum
          </Link>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {discussion.categorie && (
                  <Link
                    to={`/forum/categorie/${discussion.categorie.id}`}
                    className="px-3 py-1 text-sm rounded-full"
                    style={{ backgroundColor: `${discussion.categorie.couleur}20`, color: discussion.categorie.couleur }}
                  >
                    {discussion.categorie.nom}
                  </Link>
                )}
                {discussion.est_epingle && (
                  <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
                    Épinglé
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{discussion.titre}</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Partager"
              >
                <ShareIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => bookmarkMutation.mutate(discussion.id)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Sauvegarder"
              >
                {discussion.is_bookmarked ? (
                  <BookmarkSolidIcon className="h-5 w-5 text-yellow-500" />
                ) : (
                  <BookmarkIcon className="h-5 w-5" />
                )}
              </button>
              <button
                onClick={() => reportMutation.mutate(discussion.id)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Signaler"
              >
                <FlagIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Métriques */}
        <div className="flex items-center gap-6 text-sm text-gray-600 mb-8">
          <div className="flex items-center gap-2">
            <UserCircleIcon className="h-5 w-5" />
            <span>{discussion.user?.prenom} {discussion.user?.nom}</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5" />
            <span>
              {format(new Date(discussion.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <EyeIcon className="h-5 w-5" />
            <span>{discussion.nombre_vues} vues</span>
          </div>
          <div className="flex items-center gap-2">
            <ReplyIcon className="h-5 w-5" />
            <span>{discussion.posts_count || posts?.length || 0} réponses</span>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-8">
          {/* Message original */}
          {firstPost && (
            <div className="mb-8 pb-8 border-b border-gray-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    {firstPost.user?.avatar ? (
                      <img
                        src={firstPost.user.avatar}
                        alt={firstPost.user.prenom}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-primary-600">
                        {firstPost.user?.prenom?.[0]}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {firstPost.user?.prenom} {firstPost.user?.nom}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {format(new Date(firstPost.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                    {user?.id === firstPost.user_id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingPostId(firstPost.id)
                            setEditContent(firstPost.contenu)
                          }}
                          className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-lg"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(firstPost.id)}
                          className="p-2 text-gray-600 hover:text-danger-600 hover:bg-gray-100 rounded-lg"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {editingPostId === firstPost.id ? (
                    <div className="mb-4">
                      <ReactQuill
                        theme="snow"
                        value={editContent}
                        onChange={setEditContent}
                        className="mb-4"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEditPost(firstPost.id)}
                          className="btn-primary"
                          disabled={editPostMutation.isLoading}
                        >
                          Enregistrer
                        </button>
                        <button
                          onClick={() => setEditingPostId(null)}
                          className="btn-secondary"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: firstPost.contenu }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Réponses */}
          {replyPosts.length > 0 && (
            <div className="space-y-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900">
                Réponses ({replyPosts.length})
              </h3>
              
              {replyPosts.map((post) => (
                <div key={post.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      {post.user?.avatar ? (
                        <img
                          src={post.user.avatar}
                          alt={post.user.prenom}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-gray-600">
                          {post.user?.prenom?.[0]}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {post.user?.prenom} {post.user?.nom}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {format(new Date(post.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                          </p>
                        </div>
                        {user?.id === post.user_id && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingPostId(post.id)
                                setEditContent(post.contenu)
                              }}
                              className="p-1 text-gray-600 hover:text-primary-600"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-1 text-gray-600 hover:text-danger-600"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      
                      {editingPostId === post.id ? (
                        <div>
                          <ReactQuill
                            theme="snow"
                            value={editContent}
                            onChange={setEditContent}
                            className="mb-3 bg-white"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEditPost(post.id)}
                              className="btn-primary text-sm"
                            >
                              Enregistrer
                            </button>
                            <button
                              onClick={() => setEditingPostId(null)}
                              className="btn-secondary text-sm"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: post.contenu }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Zone de réponse */}
          {user ? (
            <div className="border-t border-gray-200 pt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Ajouter une réponse
              </h4>
              <form onSubmit={handleSubmitReply}>
                <ReactQuill
                  theme="snow"
                  value={replyContent}
                  onChange={setReplyContent}
                  className="mb-4 bg-white"
                  placeholder="Votre réponse..."
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={addPostMutation.isLoading || !replyContent.trim()}
                    className="btn-primary flex items-center gap-2"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                    {addPostMutation.isLoading ? 'Publication...' : 'Publier la réponse'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-8 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                Connectez-vous pour participer à la discussion
              </p>
              <Link to="/connexion" className="btn-primary">
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
