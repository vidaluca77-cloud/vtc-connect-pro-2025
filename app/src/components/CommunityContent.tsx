'use client';

import { useState, useEffect } from 'react';
import { useApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

interface Post {
  id: string;
  author: string;
  avatar: string;
  experience: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  category: string;
  isPinned?: boolean;
  isLiked?: boolean;
  tags?: string[];
}

interface Driver {
  id: string;
  name: string;
  avatar: string;
  experience: string;
  rating: number;
  trips: number;
  status: 'online' | 'offline';
  lastSeen?: string;
}

interface CommunityStats {
  totalMembers: number;
  onlineNow: number;
  postsToday: number;
}

// Helper functions
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Conseils':
      return 'bg-blue-100 text-blue-800';
    case 'Question':
      return 'bg-yellow-100 text-yellow-800';
    case 'Alerte':
      return 'bg-red-100 text-red-800';
    case 'Discussion':
      return 'bg-green-100 text-green-800';
    case 'Aide':
      return 'bg-purple-100 text-purple-800';
    case 'Partage':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getAvatarColor = (initials: string) => {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
    'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
  ];
  const index = initials.charCodeAt(0) % colors.length;
  return colors[index];
};

export default function CommunityContent() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const api = useApi();
  
  const [tabValue, setTabValue] = useState(0);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Discussion');
  
  // Data state
  const [posts, setPosts] = useState<Post[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [stats, setStats] = useState<CommunityStats>({ totalMembers: 0, onlineNow: 0, postsToday: 0 });
  
  // Loading states
  const [postsLoading, setPostsLoading] = useState(true);
  const [driversLoading, setDriversLoading] = useState(true);
  const [postSubmitting, setPostSubmitting] = useState(false);
  
  // Error states
  const [postsError, setPostsError] = useState<string | null>(null);
  const [driversError, setDriversError] = useState<string | null>(null);

  // Fetch posts from API
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fetchPosts = async () => {
      setPostsLoading(true);
      setPostsError(null);

      try {
        const result = await api.community.getPosts();
        
        if (result.success && result.data) {
          setPosts(result.data.posts || []);
        } else {
          console.error('Failed to fetch posts:', result.error);
          setPostsError(result.error || 'Failed to load posts');
        }
      } catch (error) {
        console.error('Posts fetch error:', error);
        setPostsError('Failed to load posts');
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, [authLoading, isAuthenticated, api]);

  // Fetch drivers from API
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const fetchDrivers = async () => {
      setDriversLoading(true);
      setDriversError(null);

      try {
        const result = await api.community.getDrivers();
        
        if (result.success && result.data) {
          // Filter drivers to match expected status type
          const filteredDrivers = (result.data.allDrivers || []).map(driver => ({
            ...driver,
            status: (driver.status === 'online' ? 'online' : 'offline') as 'online' | 'offline'
          }));
          setDrivers(filteredDrivers);
          setStats(result.data.stats || { totalMembers: 0, onlineNow: 0, postsToday: 0 });
        } else {
          console.error('Failed to fetch drivers:', result.error);
          setDriversError(result.error || 'Failed to load drivers');
        }
      } catch (error) {
        console.error('Drivers fetch error:', error);
        setDriversError('Failed to load drivers');
      } finally {
        setDriversLoading(false);
      }
    };

    fetchDrivers();
  }, [authLoading, isAuthenticated, api]);

  const handleCreatePost = async () => {
    if (!newPost.trim() || postSubmitting) return;

    setPostSubmitting(true);

    try {
      const result = await api.community.createPost({
        content: newPost.trim(),
        category: newPostCategory
      });

      if (result.success && result.data) {
        // Add the new post to the beginning of the list
        setPosts(prev => [result.data!, ...prev]);
        setNewPost('');
        setNewPostCategory('Discussion');
        setOpenPostDialog(false);
        
        // Update stats
        setStats(prev => ({ ...prev, postsToday: prev.postsToday + 1 }));
      } else {
        console.error('Failed to create post:', result.error);
        alert('Erreur lors de la création du post: ' + (result.error || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Create post error:', error);
      alert('Erreur lors de la création du post');
    } finally {
      setPostSubmitting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const result = await api.community.likePost(postId);
      
      if (result.success && result.data) {
        // Update the post in the list
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likes: result.data!.likeCount, 
                isLiked: result.data!.isLiked 
              }
            : post
        ));
      } else {
        console.error('Failed to like post:', result.error);
      }
    } catch (error) {
      console.error('Like post error:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">👥 Communauté VTC</h1>
            <p className="text-gray-600 mt-2">
              Échangez avec {stats.totalMembers} chauffeurs VTC actifs
            </p>
          </div>
          <button 
            onClick={() => setOpenPostDialog(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            ➕ Nouveau post
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['Forum', 'Chauffeurs actifs', 'Conseils du jour'].map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setTabValue(index)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    tabValue === index
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {tabValue === 0 && (
              <div className="space-y-6">
                {postsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="animate-pulse">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div>
                              <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded"></div>
                                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : postsError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-red-800 font-semibold mb-2">Erreur de chargement</h3>
                    <p className="text-red-600">{postsError}</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <h3 className="text-gray-700 font-semibold mb-2">Aucun post pour le moment</h3>
                    <p className="text-gray-500 mb-4">Soyez le premier à partager quelque chose avec la communauté !</p>
                    <button 
                      onClick={() => setOpenPostDialog(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Créer le premier post
                    </button>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 ${getAvatarColor(post.avatar)} rounded-full flex items-center justify-center text-white font-semibold`}>
                          {post.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{post.author}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                              {post.category}
                            </span>
                            {post.isPinned && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                📌 Épinglé
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{post.experience}</p>
                          <p className="text-gray-800 mb-4">{post.content}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex gap-6 text-sm text-gray-500">
                              <span>{post.timestamp}</span>
                            </div>
                            <div className="flex gap-4">
                              <button 
                                onClick={() => handleLikePost(post.id)}
                                className={`flex items-center gap-1 transition-colors ${
                                  post.isLiked ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                                }`}
                              >
                                👍 {post.likes}
                              </button>
                              <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
                                💬 {post.comments}
                              </button>
                              <button className="text-gray-500 hover:text-blue-600 transition-colors">
                                📤
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tabValue === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Chauffeurs connectés</h3>
                
                {driversLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : driversError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-red-800 font-semibold mb-2">Erreur de chargement</h3>
                    <p className="text-red-600">{driversError}</p>
                  </div>
                ) : drivers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucun chauffeur trouvé</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {drivers.map((driver) => (
                      <div key={driver.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${getAvatarColor(driver.avatar)} rounded-full flex items-center justify-center text-white font-semibold relative`}>
                            {driver.avatar}
                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                              driver.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                            }`}></div>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{driver.name}</h4>
                            <p className="text-gray-600 text-sm">{driver.experience}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-yellow-500">⭐</span>
                              <span className="text-sm text-gray-600">{driver.rating} • {driver.trips} courses</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                            💬 Message
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tabValue === 2 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">💡 Conseils du jour</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">🕐 Heures de pointe</h4>
                    <p className="text-blue-800 text-sm">
                      Positionnez-vous près des gares entre 7h-9h et 17h-19h pour maximiser vos courses d&apos;affaires.
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900 mb-2">🛣️ Évitez les embouteillages</h4>
                    <p className="text-green-800 text-sm">
                      Utilisez Waze ou Google Maps en temps réel. Un trajet fluide = client satisfait = meilleur pourboire.
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-900 mb-2">💰 Optimisez vos revenus</h4>
                    <p className="text-yellow-800 text-sm">
                      Acceptez les courses avec retour possible. Évitez les zones mortes sans demande de retour.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">📊 Communauté</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Membres actifs</span>
                  <span className="font-semibold">{stats.totalMembers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">En ligne maintenant</span>
                  <span className="font-semibold text-green-600">{stats.onlineNow}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posts aujourd&apos;hui</span>
                  <span className="font-semibold">{stats.postsToday}</span>
                </div>
              </div>
            </div>

            {/* Popular Topics */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">🔥 Sujets populaires</h3>
              <div className="space-y-2">
                {['Zones rentables Paris', 'Conseils nouveaux chauffeurs', 'Gestion carburant', 'Optimisation trajets'].map((topic, index) => (
                  <button key={index} className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm text-gray-700">
                    #{topic.replace(' ', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Create Post Dialog */}
        {openPostDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <h3 className="text-xl font-semibold mb-4">Créer un nouveau post</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    id="category"
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Discussion">Discussion</option>
                    <option value="Conseils">Conseils</option>
                    <option value="Question">Question</option>
                    <option value="Alerte">Alerte</option>
                    <option value="Aide">Aide</option>
                    <option value="Partage">Partage</option>
                  </select>
                </div>
                
                <textarea
                  placeholder="Partagez vos conseils, posez une question ou démarrez une discussion..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {newPost.length}/500 caractères
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setOpenPostDialog(false);
                        setNewPost('');
                        setNewPostCategory('Discussion');
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      disabled={postSubmitting}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPost.trim() || postSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {postSubmitting ? 'Publication...' : 'Publier'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}