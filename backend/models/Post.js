import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true,
    maxlength: [280, 'Post cannot exceed 280 characters'],
    minlength: [1, 'Post content cannot be empty']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post must have an author']
  },
  images: [{
    url: String,
    alt: String
  }],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  parentPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  isReply: {
    type: Boolean,
    default: false
  },
  reposts: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  hashtags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  mentions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  stats: {
    likesCount: {
      type: Number,
      default: 0
    },
    repliesCount: {
      type: Number,
      default: 0
    },
    repostsCount: {
      type: Number,
      default: 0
    }
  },
  visibility: {
    type: String,
    enum: ['public', 'followers', 'private'],
    default: 'public'
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create indexes for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ hashtags: 1 });
postSchema.index({ 'likes.user': 1 });
postSchema.index({ parentPost: 1 });

// Extract hashtags and mentions before saving
postSchema.pre('save', function(next) {
  // Extract hashtags
  const hashtagRegex = /#(\w+)/g;
  const hashtags = [];
  let match;
  while ((match = hashtagRegex.exec(this.content)) !== null) {
    hashtags.push(match[1].toLowerCase());
  }
  this.hashtags = [...new Set(hashtags)]; // Remove duplicates

  // Update stats
  this.stats.likesCount = this.likes.length;
  this.stats.repliesCount = this.replies.length;
  this.stats.repostsCount = this.reposts.length;

  next();
});

// Update parent post reply count when this is a reply
postSchema.post('save', async function(doc) {
  if (doc.parentPost && doc.isReply) {
    try {
      await mongoose.model('Post').findByIdAndUpdate(
        doc.parentPost,
        { $addToSet: { replies: doc._id } }
      );
    } catch (error) {
      console.error('Error updating parent post:', error);
    }
  }
});

// Update author's post count
postSchema.post('save', async function(doc) {
  try {
    const User = mongoose.model('User');
    const postCount = await mongoose.model('Post').countDocuments({ 
      author: doc.author, 
      isReply: false 
    });
    await User.findByIdAndUpdate(doc.author, { 
      'stats.postsCount': postCount 
    });
  } catch (error) {
    console.error('Error updating user post count:', error);
  }
});

// Instance method to check if user liked this post
postSchema.methods.isLikedBy = function(userId) {
  return this.likes.some(like => like.user.toString() === userId.toString());
};

// Instance method to check if user reposted this post
postSchema.methods.isRepostedBy = function(userId) {
  return this.reposts.some(repost => repost.user.toString() === userId.toString());
};

// Static method to get timeline posts
postSchema.statics.getTimelinePosts = function(userId, followingIds = []) {
  const userIds = [userId, ...followingIds];
  
  return this.find({
    author: { $in: userIds },
    isReply: false,
    visibility: { $in: ['public', 'followers'] }
  })
  .populate('author', 'username profile.displayName profile.avatar isVerified')
  .sort({ createdAt: -1 })
  .limit(50);
};

// Static method to search posts
postSchema.statics.searchPosts = function(query, limit = 20) {
  return this.find({
    $or: [
      { content: { $regex: query, $options: 'i' } },
      { hashtags: { $in: [query.toLowerCase()] } }
    ],
    visibility: 'public',
    isReply: false
  })
  .populate('author', 'username profile.displayName profile.avatar isVerified')
  .sort({ createdAt: -1 })
  .limit(limit);
};

export default mongoose.model('Post', postSchema);