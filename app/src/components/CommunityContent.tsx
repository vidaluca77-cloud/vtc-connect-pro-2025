'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface Post {
  id: number;
  author: string;
  avatar: string;
  experience: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  category: string;
}

interface Driver {
  id: number;
  name: string;
  avatar: string;
  experience: string;
  rating: number;
  trips: number;
  status: 'online' | 'offline';
}

export default function CommunityContent() {
  const { user } = useUser();
  const [tabValue, setTabValue] = useState(0);
  const [openPostDialog, setOpenPostDialog] = useState(false);
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    // Mock data load
    setPosts([
      {
        id: 1,
        author: 'Jean Martin',
        avatar: 'JM',
        experience: 'Chauffeur VTC depuis 3 ans',
        content: 'Excellente zone aujourd\'hui autour de La Défense ! Beaucoup de demandes entre 17h et 19h. N\'hésitez pas à vous y positionner.',
        timestamp: 'Il y a 2h',
        likes: 12,
        comments: 3,
        category: 'Conseils'
      },
      {
        id: 2,
        author: 'Sophie Leroy',
        avatar: 'SL',
        experience: 'Nouvelle conductrice VTC',
        content: 'Des conseils pour optimiser mes trajets en région parisienne ? Je débute et j\'aimerais avoir vos retours d\'expérience. Merci d\'avance !',
        timestamp: 'Il y a 4h',
        likes: 8,
        comments: 7,
        category: 'Question'
      },
      {
        id: 3,
        author: 'Marc Dubois',
        avatar: 'MD',
        experience: 'Expert VTC - 5 ans',
        content: 'Attention aux travaux sur la ligne 1 cette semaine ! Impact important sur les trajets vers République et Bastille. Prévoyez du temps supplémentaire.',
        timestamp: 'Il y a 6h',
        likes: 15,
        comments: 2,
        category: 'Alerte'
      }
    ]);

    setDrivers([
      {
        id: 1,
        name: 'Pierre Bernard',
        avatar: 'PB',
        experience: '4 ans d\'expérience',
        rating: 4.9,
        trips: 2420,
        status: 'online'
      },
      {
        id: 2,
        name: 'Marie Durand',
        avatar: 'MD',
        experience: '2 ans d\'expérience',
        rating: 4.8,
        trips: 1180,
        status: 'online'
      },
      {
        id: 3,
        name: 'Thomas Petit',
        avatar: 'TP',
        experience: '6 ans d\'expérience',
        rating: 4.95,
        trips: 3650,
        status: 'offline'
      }
    ]);
  }, []);

  const handleCreatePost = () => {
    if (!newPost.trim()) return;

    const post: Post = {
      id: posts.length + 1,
      author: user?.firstName + ' ' + user?.lastName || 'Utilisateur',
      avatar: (user?.firstName?.charAt(0) || 'U') + (user?.lastName?.charAt(0) || ''),
      experience: 'Membre de la communauté',
      content: newPost,
      timestamp: 'À l\'instant',
      likes: 0,
      comments: 0,
      category: 'Discussion'
    };

    setPosts([post, ...posts]);
    setNewPost('');
    setOpenPostDialog(false);
  };

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">👥 Communauté VTC</h1>
            <p className="text-gray-600 mt-2">
              Échangez avec {drivers.length + 150} chauffeurs VTC actifs
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
                {posts.map((post) => (
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
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{post.experience}</p>
                        <p className="text-gray-800 mb-4">{post.content}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-6 text-sm text-gray-500">
                            <span>{post.timestamp}</span>
                          </div>
                          <div className="flex gap-4">
                            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors">
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
                ))}
              </div>
            )}

            {tabValue === 1 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Chauffeurs connectés</h3>
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
                  <span className="font-semibold">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">En ligne maintenant</span>
                  <span className="font-semibold text-green-600">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posts aujourd&apos;hui</span>
                  <span className="font-semibold">42</span>
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
                      onClick={() => setOpenPostDialog(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPost.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Publier
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