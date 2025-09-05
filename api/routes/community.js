const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');

const router = express.Router();

// Get community posts
router.get('/posts', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;

    const query = { isVisible: true };
    if (category && category !== 'all') {
      query.category = category;
    }

    const posts = await Post.find(query)
      .populate('authorId', 'firstName lastName imageUrl driverProfile.experience')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPosts = await Post.countDocuments(query);

    const formattedPosts = posts.map(post => ({
      id: post._id,
      author: `${post.authorId.firstName} ${post.authorId.lastName}`,
      avatar: getInitials(post.authorId.firstName, post.authorId.lastName),
      experience: post.authorId.driverProfile?.experience || 'Membre de la communauté',
      content: post.content,
      timestamp: formatTimestamp(post.createdAt),
      likes: post.likeCount,
      comments: post.commentCount,
      category: post.category,
      isPinned: post.isPinned,
      isLiked: post.likes.some(like => like.userId.toString() === req.user.id.toString()),
      tags: post.tags
    }));

    res.json({
      success: true,
      data: {
        posts: formattedPosts,
        pagination: {
          page,
          totalPages: Math.ceil(totalPosts / limit),
          totalPosts,
          hasNext: page * limit < totalPosts,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des posts'
    });
  }
});

// Create a new post
router.post('/posts', auth, async (req, res) => {
  try {
    const { content, category, tags } = req.body;

    if (!content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Le contenu et la catégorie sont requis'
      });
    }

    const post = new Post({
      authorId: req.user.id,
      content,
      category,
      tags: tags || []
    });

    await post.save();
    
    // Populate author info for response
    await post.populate('authorId', 'firstName lastName imageUrl driverProfile.experience');

    const formattedPost = {
      id: post._id,
      author: `${post.authorId.firstName} ${post.authorId.lastName}`,
      avatar: getInitials(post.authorId.firstName, post.authorId.lastName),
      experience: post.authorId.driverProfile?.experience || 'Membre de la communauté',
      content: post.content,
      timestamp: 'À l\'instant',
      likes: 0,
      comments: 0,
      category: post.category,
      isPinned: false,
      isLiked: false,
      tags: post.tags
    };

    res.status(201).json({
      success: true,
      data: formattedPost
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du post'
    });
  }
});

// Like/unlike a post
router.post('/posts/:postId/like', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post non trouvé'
      });
    }

    const existingLike = post.likes.find(like => like.userId.toString() === userId.toString());

    if (existingLike) {
      // Unlike
      post.likes = post.likes.filter(like => like.userId.toString() !== userId.toString());
    } else {
      // Like
      post.likes.push({ userId, likedAt: new Date() });
    }

    await post.save();

    res.json({
      success: true,
      data: {
        isLiked: !existingLike,
        likeCount: post.likes.length
      }
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du like'
    });
  }
});

// Get active drivers in the community
router.get('/drivers', auth, async (req, res) => {
  try {
    const onlineDrivers = await User.find({
      'driverProfile.status': 'online',
      isActive: true,
      lastActivity: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Active in last 24h
    }).select('firstName lastName imageUrl driverProfile lastActivity')
      .sort({ lastActivity: -1 })
      .limit(20);

    const allActiveDrivers = await User.find({
      isActive: true,
      'driverProfile.totalTrips': { $gt: 0 } // Only drivers with at least 1 trip
    }).select('firstName lastName imageUrl driverProfile lastActivity')
      .sort({ 'driverProfile.rating': -1, 'driverProfile.totalTrips': -1 })
      .limit(50);

    const formattedOnlineDrivers = onlineDrivers.map(driver => ({
      id: driver._id,
      name: `${driver.firstName} ${driver.lastName}`,
      avatar: getInitials(driver.firstName, driver.lastName),
      experience: driver.driverProfile?.experience || '0 an d\'expérience',
      rating: driver.driverProfile?.rating || 5.0,
      trips: driver.driverProfile?.totalTrips || 0,
      status: 'online',
      lastSeen: formatTimestamp(driver.lastActivity)
    }));

    const formattedAllDrivers = allActiveDrivers.map(driver => ({
      id: driver._id,
      name: `${driver.firstName} ${driver.lastName}`,
      avatar: getInitials(driver.firstName, driver.lastName),
      experience: driver.driverProfile?.experience || '0 an d\'expérience',
      rating: driver.driverProfile?.rating || 5.0,
      trips: driver.driverProfile?.totalTrips || 0,
      status: driver.driverProfile?.status || 'offline',
      lastSeen: formatTimestamp(driver.lastActivity)
    }));

    res.json({
      success: true,
      data: {
        onlineDrivers: formattedOnlineDrivers,
        allDrivers: formattedAllDrivers,
        stats: {
          totalMembers: await User.countDocuments({ isActive: true }),
          onlineNow: onlineDrivers.length,
          postsToday: await Post.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
          })
        }
      }
    });
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des chauffeurs'
    });
  }
});

// Helper functions
function getInitials(firstName, lastName) {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}` || 'U';
}

function formatTimestamp(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  
  return new Date(date).toLocaleDateString('fr-FR');
}

module.exports = router;