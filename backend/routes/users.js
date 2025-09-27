import express from 'express';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get user profile by username
router.get('/:username', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username })
      .populate('followers', 'username profile.displayName profile.avatar')
      .populate('following', 'username profile.displayName profile.avatar');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check if profile is private
    const isOwner = req.user && req.user._id.toString() === user._id.toString();
    const isFollowing = req.user && user.followers.some(
      follower => follower._id.toString() === req.user._id.toString()
    );

    if (user.isPrivate && !isOwner && !isFollowing) {
      return res.json({
        user: {
          username: user.username,
          profile: {
            displayName: user.profile.displayName,
            avatar: user.profile.avatar
          },
          isVerified: user.isVerified,
          isPrivate: user.isPrivate,
          stats: {
            postsCount: 0,
            followersCount: user.stats.followersCount,
            followingCount: user.stats.followingCount
          },
          createdAt: user.createdAt
        },
        isPrivate: true
      });
    }

    const userProfile = user.getPublicProfile();
    
    // Add follow status if viewer is authenticated
    if (req.user && req.user._id.toString() !== user._id.toString()) {
      userProfile.isFollowedByMe = user.followers.some(
        follower => follower._id.toString() === req.user._id.toString()
      );
    }

    res.json({ user: userProfile });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      error: 'Failed to get user profile'
    });
  }
});

// Get user's posts
router.get('/:username/posts', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check if profile is private
    const isOwner = req.user && req.user._id.toString() === user._id.toString();
    const isFollowing = req.user && user.followers.some(
      follower => follower._id.toString() === req.user._id.toString()
    );

    if (user.isPrivate && !isOwner && !isFollowing) {
      return res.status(403).json({
        error: 'This account is private'
      });
    }

    const posts = await Post.find({
      author: user._id,
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
    console.error('Get user posts error:', error);
    res.status(500).json({
      error: 'Failed to get user posts'
    });
  }
});

// Follow/Unfollow user
router.post('/:username/follow', authenticateToken, async (req, res) => {
  try {
    const { username } = req.params;

    // Find target user
    const targetUser = await User.findOne({ username });
    if (!targetUser) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Can't follow yourself
    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        error: 'You cannot follow yourself'
      });
    }

    // Get current user
    const currentUser = await User.findById(req.user._id);

    const isFollowing = currentUser.following.includes(targetUser._id);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        id => id.toString() !== targetUser._id.toString()
      );
      targetUser.followers = targetUser.followers.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      // Follow
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(req.user._id);
    }

    // Save both users
    await Promise.all([currentUser.save(), targetUser.save()]);

    res.json({
      message: isFollowing ? 'User unfollowed' : 'User followed',
      isFollowing: !isFollowing,
      followersCount: targetUser.stats.followersCount
    });

  } catch (error) {
    console.error('Follow/unfollow error:', error);
    res.status(500).json({
      error: 'Failed to follow/unfollow user'
    });
  }
});

// Get user's followers
router.get('/:username/followers', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username })
      .populate({
        path: 'followers',
        select: 'username profile.displayName profile.avatar isVerified',
        options: { skip, limit: parseInt(limit) }
      });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check if profile is private
    const isOwner = req.user && req.user._id.toString() === user._id.toString();
    const isFollowing = req.user && user.followers.some(
      follower => follower._id.toString() === req.user._id.toString()
    );

    if (user.isPrivate && !isOwner && !isFollowing) {
      return res.status(403).json({
        error: 'This account is private'
      });
    }

    // Add follow status for each follower if viewer is authenticated
    let followers = user.followers;
    if (req.user) {
      const currentUser = await User.findById(req.user._id).select('following');
      followers = user.followers.map(follower => {
        const followerObj = follower.toObject();
        followerObj.isFollowedByMe = currentUser.following.includes(follower._id);
        return followerObj;
      });
    }

    res.json({
      followers,
      page: parseInt(page),
      limit: parseInt(limit),
      total: user.stats.followersCount
    });

  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({
      error: 'Failed to get followers'
    });
  }
});

// Get user's following
router.get('/:username/following', optionalAuth, async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const user = await User.findOne({ username })
      .populate({
        path: 'following',
        select: 'username profile.displayName profile.avatar isVerified',
        options: { skip, limit: parseInt(limit) }
      });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Check if profile is private
    const isOwner = req.user && req.user._id.toString() === user._id.toString();
    const isFollowing = req.user && user.followers.some(
      follower => follower._id.toString() === req.user._id.toString()
    );

    if (user.isPrivate && !isOwner && !isFollowing) {
      return res.status(403).json({
        error: 'This account is private'
      });
    }

    // Add follow status for each following if viewer is authenticated
    let following = user.following;
    if (req.user) {
      const currentUser = await User.findById(req.user._id).select('following');
      following = user.following.map(followingUser => {
        const followingObj = followingUser.toObject();
        followingObj.isFollowedByMe = currentUser.following.includes(followingUser._id);
        return followingObj;
      });
    }

    res.json({
      following,
      page: parseInt(page),
      limit: parseInt(limit),
      total: user.stats.followingCount
    });

  } catch (error) {
    console.error('Get following error:', error);
    res.status(500).json({
      error: 'Failed to get following'
    });
  }
});

// Search users
router.get('/search/:query', optionalAuth, async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 20 } = req.query;

    if (!query.trim()) {
      return res.status(400).json({
        error: 'Search query is required'
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { 'profile.displayName': { $regex: query, $options: 'i' } }
      ]
    })
    .select('username profile.displayName profile.avatar isVerified stats')
    .limit(parseInt(limit))
    .sort({ 'stats.followersCount': -1 });

    // Add follow status if viewer is authenticated
    let usersWithFollowStatus = users;
    if (req.user) {
      const currentUser = await User.findById(req.user._id).select('following');
      usersWithFollowStatus = users.map(user => {
        const userObj = user.toObject();
        if (user._id.toString() !== req.user._id.toString()) {
          userObj.isFollowedByMe = currentUser.following.includes(user._id);
        }
        return userObj;
      });
    }

    res.json({
      users: usersWithFollowStatus,
      query,
      total: usersWithFollowStatus.length
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      error: 'Failed to search users'
    });
  }
});

export default router;