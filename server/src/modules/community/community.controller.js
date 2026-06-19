import { Post } from './post.model.js';
import { Comment } from './comment.model.js';

class CommunityController {
  // @desc    Get all posts (paginated, filterable)
  // @route   GET /api/posts
  // @access  Private
  async getPosts(req, res, next) {
    try {
      const { category, sort = 'newest', page = 1, limit = 10 } = req.query;
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const filter = {};
      if (category && category !== 'all') {
        filter.category = category;
      }

      let sortOption = { createdAt: -1 }; // newest first
      if (sort === 'popular') {
        // Sort by upvote count — since upvotes is an array, we can sort by array length
        // We'll use an aggregation or just sort in-memory for simplicity
        sortOption = { createdAt: -1 }; // fallback, we'll handle in query
      }

      const [posts, total] = await Promise.all([
        Post.find(filter)
          .populate('author', 'name email profile.avatarUrl')
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        Post.countDocuments(filter),
      ]);

      // If sorting by popular, sort by upvote count
      let result = posts;
      if (sort === 'popular') {
        result = posts.sort((a, b) => (b.upvotes?.length || 0) - (a.upvotes?.length || 0));
      }

      res.status(200).json({
        success: true,
        data: result,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get single post with comments
  // @route   GET /api/posts/:id
  // @access  Private
  async getPostById(req, res, next) {
    try {
      const { id } = req.params;

      const post = await Post.findById(id)
        .populate('author', 'name email profile.avatarUrl')
        .lean();

      if (!post) {
        res.status(404);
        throw new Error('Post not found');
      }

      const comments = await Comment.find({ post: id })
        .populate('author', 'name email profile.avatarUrl')
        .sort({ createdAt: 1 })
        .lean();

      res.status(200).json({
        success: true,
        data: { ...post, comments },
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Create a new post
  // @route   POST /api/posts
  // @access  Private
  async createPost(req, res, next) {
    try {
      const { title, body, category, tags } = req.body;

      if (!title || !body) {
        res.status(400);
        throw new Error('Title and body are required');
      }

      const post = await Post.create({
        author: req.user._id,
        title,
        body,
        category: category || 'general',
        tags: tags || [],
      });

      // Populate author before returning
      const populated = await Post.findById(post._id)
        .populate('author', 'name email profile.avatarUrl')
        .lean();

      res.status(201).json({
        success: true,
        data: populated,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Toggle upvote on a post
  // @route   PUT /api/posts/:id/upvote
  // @access  Private
  async toggleUpvote(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const post = await Post.findById(id);
      if (!post) {
        res.status(404);
        throw new Error('Post not found');
      }

      const hasUpvoted = post.upvotes.some(uid => uid.toString() === userId.toString());

      if (hasUpvoted) {
        post.upvotes = post.upvotes.filter(uid => uid.toString() !== userId.toString());
      } else {
        post.upvotes.push(userId);
      }

      await post.save();

      res.status(200).json({
        success: true,
        data: {
          upvotes: post.upvotes,
          upvoteCount: post.upvotes.length,
          hasUpvoted: !hasUpvoted,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Add a comment to a post
  // @route   POST /api/posts/:id/comments
  // @access  Private
  async addComment(req, res, next) {
    try {
      const { id } = req.params;
      const { body } = req.body;

      if (!body) {
        res.status(400);
        throw new Error('Comment body is required');
      }

      const post = await Post.findById(id);
      if (!post) {
        res.status(404);
        throw new Error('Post not found');
      }

      const comment = await Comment.create({
        post: id,
        author: req.user._id,
        body,
      });

      // Increment denormalized comment count
      post.commentCount = (post.commentCount || 0) + 1;
      await post.save();

      const populated = await Comment.findById(comment._id)
        .populate('author', 'name email profile.avatarUrl')
        .lean();

      res.status(201).json({
        success: true,
        data: populated,
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Toggle upvote on a comment
  // @route   PUT /api/posts/:postId/comments/:commentId/upvote
  // @access  Private
  async toggleCommentUpvote(req, res, next) {
    try {
      const { commentId } = req.params;
      const userId = req.user._id;

      const comment = await Comment.findById(commentId);
      if (!comment) {
        res.status(404);
        throw new Error('Comment not found');
      }

      const hasUpvoted = comment.upvotes.some(uid => uid.toString() === userId.toString());

      if (hasUpvoted) {
        comment.upvotes = comment.upvotes.filter(uid => uid.toString() !== userId.toString());
      } else {
        comment.upvotes.push(userId);
      }

      await comment.save();

      res.status(200).json({
        success: true,
        data: {
          upvotes: comment.upvotes,
          upvoteCount: comment.upvotes.length,
          hasUpvoted: !hasUpvoted,
        },
      });
    } catch (error) {
      next(error);
    }
  }
  // @desc    Delete a post (owner only)
  // @route   DELETE /api/posts/:id
  // @access  Private
  async deletePost(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const post = await Post.findById(id);
      if (!post) {
        res.status(404);
        throw new Error('Post not found');
      }

      if (post.author.toString() !== userId.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this post');
      }

      // Delete all associated comments
      await Comment.deleteMany({ post: id });

      await Post.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'Post deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CommunityController();
