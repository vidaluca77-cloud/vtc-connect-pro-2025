'use client';

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ForumPost {
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
  attachments?: Array<{
    type: 'image' | 'document';
    url: string;
    name: string;
  }>;
  location?: string;
  platform?: string;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

interface ForumPostProps {
  post: ForumPost;
  comments?: Comment[];
  showComments?: boolean;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, content: string) => void;
  onCommentLike?: (commentId: string) => void;
  onShare?: (postId: string) => void;
  isCompact?: boolean;
}

export default function ForumPost({
  post,
  comments = [],
  showComments = false,
  onLike,
  onComment,
  onCommentLike,
  onShare,
  isCompact = false
}: ForumPostProps) {
  const [showAllComments, setShowAllComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'conseil': '💡',
      'alerte': '⚠️',
      'question': '❓',
      'partage': '📢',
      'humour': '😄',
      'technique': '🔧',
      'juridique': '⚖️',
      'economie': '💰',
      'social': '👥',
      'generale': '💬'
    };
    return icons[category] || '💬';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'conseil': 'bg-blue-100 text-blue-800',
      'alerte': 'bg-red-100 text-red-800',
      'question': 'bg-yellow-100 text-yellow-800',
      'partage': 'bg-green-100 text-green-800',
      'humour': 'bg-purple-100 text-purple-800',
      'technique': 'bg-orange-100 text-orange-800',
      'juridique': 'bg-indigo-100 text-indigo-800',
      'economie': 'bg-emerald-100 text-emerald-800',
      'social': 'bg-pink-100 text-pink-800',
      'generale': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && onComment) {
      onComment(post.id, newComment.trim());
      setNewComment('');
      setIsCommenting(false);
    }
  };

  const visibleComments = showAllComments ? comments : comments.slice(0, 3);

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${isCompact ? 'p-4' : 'p-6'}`}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <img
          src={post.avatar}
          alt={post.author}
          className="w-10 h-10 rounded-full object-cover"
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{post.author}</h4>
            {post.isPinned && (
              <span className="text-yellow-500" title="Post épinglé">📌</span>
            )}
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{post.experience}</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>
              {formatDistanceToNow(new Date(post.timestamp), { 
                addSuffix: true,
                locale: fr 
              })}
            </span>
            {post.location && (
              <>
                <span>•</span>
                <span>📍 {post.location}</span>
              </>
            )}
            {post.platform && (
              <>
                <span>•</span>
                <span>🚗 {post.platform}</span>
              </>
            )}
          </div>
        </div>
        
        {/* Category badge */}
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
          <span>{getCategoryIcon(post.category)}</span>
          <span className="capitalize">{post.category}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Attachments */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-3 space-y-2">
            {post.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="text-lg">
                  {attachment.type === 'image' ? '🖼️' : '📄'}
                </span>
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  {attachment.name}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pb-3 border-b border-gray-100">
        <button
          onClick={() => onLike?.(post.id)}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
            post.isLiked 
              ? 'bg-red-50 text-red-600' 
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <span className="text-lg">{post.isLiked ? '❤️' : '🤍'}</span>
          <span className="text-sm font-medium">{post.likes}</span>
        </button>
        
        <button
          onClick={() => setIsCommenting(!isCommenting)}
          className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <span className="text-lg">💬</span>
          <span className="text-sm font-medium">{post.comments}</span>
        </button>
        
        <button
          onClick={() => onShare?.(post.id)}
          className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <span className="text-lg">📤</span>
          <span className="text-sm font-medium">Partager</span>
        </button>
      </div>

      {/* Comment form */}
      {isCommenting && (
        <form onSubmit={handleCommentSubmit} className="mt-3 pt-3">
          <div className="flex gap-3">
            <img
              src="/api/placeholder/32/32"
              alt="Votre avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Écrivez votre commentaire..."
                className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCommenting(false);
                    setNewComment('');
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Commenter
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Comments */}
      {showComments && comments.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="space-y-3">
            {visibleComments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <img
                  src={comment.avatar}
                  alt={comment.author}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.timestamp), { 
                          addSuffix: true,
                          locale: fr 
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">{comment.content}</p>
                  </div>
                  
                  <button
                    onClick={() => onCommentLike?.(comment.id)}
                    className={`flex items-center gap-1 mt-1 px-2 py-1 rounded text-xs transition-colors ${
                      comment.isLiked 
                        ? 'text-red-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>{comment.isLiked ? '❤️' : '🤍'}</span>
                    <span>{comment.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {comments.length > 3 && !showAllComments && (
            <button
              onClick={() => setShowAllComments(true)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800"
            >
              Voir les {comments.length - 3} autres commentaires
            </button>
          )}
          
          {showAllComments && comments.length > 3 && (
            <button
              onClick={() => setShowAllComments(false)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800"
            >
              Masquer les commentaires
            </button>
          )}
        </div>
      )}
    </div>
  );
}