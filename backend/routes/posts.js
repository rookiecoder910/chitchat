import express from 'express';
import { body, validationResult } from 'express-validator';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validatePost = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Post content is required')
    .isLength({ max: 280 })
    .withMessage('Post cannot exceed 280 characters')
];

// Create new post
router.post('/create', authenticateToken, validatePost, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { content, visibility = 'public', parentPost } = req.body;

    // If this is a reply, check if parent post exists
    let isReply = false;
    if (parentPost) {
      const parent = await Post.findById(parentPost);
      if (!parent) {
        return res.status(404).json({
          error: 'Parent post not found'
        });
      }
      isReply = true;
    }

    // Create new post
    const post = new Post({
      content,
      author: req.user._id,
      visibility,
      parentPost: parentPost || null,
      isReply
    });

    await post.save();

    // Populate author information
    await post.populate('author', 'username profile.displayName profile.avatar isVerified');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });

  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      error: 'Failed to create post'
    });
  }
});

// Get timeline posts (posts from user and following)
router.get('/timeline', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    // Get user's following list
    const user = await User.findById(req.user._id).select('following');
    const followingIds = user.following.map(id => id.toString());

    // Get timeline posts
    const posts = await Post.getTimelinePosts(req.user._id, followingIds)
      .skip(skip)
      .limit(parseInt(limit));

    // Add user interaction data
    const postsWithInteractions = posts.map(post => {
      const postObj = post.toObject();
      postObj.isLiked = post.isLikedBy(req.user._id);
      postObj.isReposted = post.isRepostedBy(req.user._id);
      return postObj;
    });

    res.json({
      posts: postsWithInteractions,
      page: parseInt(page),
      limit: parseInt(limit),
      total: postsWithInteractions.length
    });

  } catch (error) {
    console.error('Get timeline error:', error);
    res.status(500).json({
      error: 'Failed to get timeline'
    });
  }
});

// Get public posts (for discover/explore)
router.get('/public', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      visibility: 'public',
      isReply: false
    })
    .populate('author', 'username profile.displayName profile.avatar isVerified')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    // Add user interaction data if user is authenticated
    let postsWithInteractions = posts;
    if (req.user) {
      postsWithInteractions = posts.map(post => {
        const postObj = post.toObject();
        postObj.isLiked = post.isLikedBy(req.user._id);
        postObj.isReposted = post.isRepostedBy(req.user._id);
        return postObj;
      });
    }

    res.json({
      posts: postsWithInteractions,
      page: parseInt(page),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Get public posts error:', error);
    res.status(500).json({
      error: 'Failed to get public posts'
    });
  }
});

// Get specific post by ID
router.get('/:postId', optionalAuth, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate('author', 'username profile.displayName profile.avatar isVerified')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'username profile.displayName profile.avatar isVerified'
        },
        options: { sort: { createdAt: -1 }, limit: 10 }
      });

    if (!post) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    // Check visibility
    if (post.visibility === 'private' && (!req.user || post.author._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({
        error: 'You do not have permission to view this post'
      });
    }

    const postObj = post.toObject();
    if (req.user) {
      postObj.isLiked = post.isLikedBy(req.user._id);
      postObj.isReposted = post.isRepostedBy(req.user._id);
    }

    res.json({ post: postObj });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({
      error: 'Failed to get post'
    });
  }
});

// Like/Unlike post
router.post('/:postId/like', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    const existingLike = post.likes.find(
      like => like.user.toString() === req.user._id.toString()
    );

    if (existingLike) {
      // Unlike: remove like
      post.likes = post.likes.filter(
        like => like.user.toString() !== req.user._id.toString()
      );
    } else {
      // Like: add like
      post.likes.push({ user: req.user._id });
    }

    await post.save();

    res.json({
      message: existingLike ? 'Post unliked' : 'Post liked',
      isLiked: !existingLike,
      likesCount: post.stats.likesCount
    });

  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      error: 'Failed to like/unlike post'
    });
  }
});

// Repost
router.post('/:postId/repost', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    // Check if user already reposted
    const existingRepost = post.reposts.find(
      repost => repost.user.toString() === req.user._id.toString()
    );

    if (existingRepost) {
      // Un-repost: remove repost
      post.reposts = post.reposts.filter(
        repost => repost.user.toString() !== req.user._id.toString()
      );
    } else {
      // Repost: add repost
      post.reposts.push({ user: req.user._id });
    }

    await post.save();

    res.json({
      message: existingRepost ? 'Post unreposted' : 'Post reposted',
      isReposted: !existingRepost,
      repostsCount: post.stats.repostsCount
    });

  } catch (error) {
    console.error('Repost error:', error);
    res.status(500).json({
      error: 'Failed to repost'
    });
  }
});

// Delete post
router.delete('/:postId', authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    // Check if user owns the post
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'You can only delete your own posts'
      });
    }

    await Post.findByIdAndDelete(postId);

    res.json({
      message: 'Post deleted successfully'
    });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      error: 'Failed to delete post'
    });
  }
});

// Search posts
router.get('/search/:query', optionalAuth, async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 20 } = req.query;

    if (!query.trim()) {
      return res.status(400).json({
        error: 'Search query is required'
      });
    }

    const posts = await Post.searchPosts(query, parseInt(limit));

    // Add user interaction data if user is authenticated
    let postsWithInteractions = posts;
    if (req.user) {
      postsWithInteractions = posts.map(post => {
        const postObj = post.toObject();
        postObj.isLiked = post.isLikedBy(req.user._id);
        postObj.isReposted = post.isRepostedBy(req.user._id);
        return postObj;
      });
    }

    res.json({
      posts: postsWithInteractions,
      query,
      total: postsWithInteractions.length
    });

  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({
      error: 'Failed to search posts'
    });
  }
});

export default router;