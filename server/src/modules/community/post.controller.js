import { Post } from './post.model.js';

class PostController {
  // @desc    Get all posts (with pagination & filters)
  // @route   GET /api/posts
  // @access  Private
  async getPosts(req, res, next) {
    try {
      const { category, tag, search, page = 1, limit = 20, sort = 'newest' } = req.query;
      
      const query = {};
      if (category) query.category = category;
      if (tag) query.tags = tag;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ];
      }

      const sortOption = sort === 'popular' 
        ? { upvotes: -1, createdAt: -1 } 
        : { createdAt: -1 };

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [posts, total] = await Promise.all([
        Post.find(query)
          .populate('user', 'name email')
          .populate('comments.user', 'name')
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit)),
        Post.countDocuments(query)
      ]);

      res.status(200).json({
        success: true,
        data: posts,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Get single post
  // @route   GET /api/posts/:id
  // @access  Private
  async getPost(req, res, next) {
    try {
      const post = await Post.findById(req.params.id)
        .populate('user', 'name email')
        .populate('comments.user', 'name');

      if (!post) {
        res.status(404);
        throw new Error('Post not found');
      }

      // Increment views
      post.views += 1;
      await post.save();

      res.status(200).json({
        success: true,
        data: post
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
      const { title, content, category, tags } = req.body;

      const post = await Post.create({
        user: req.user._id,
        title,
        content,
        category,
        tags: tags || []
      });

      const populated = await Post.findById(post._id)
        .populate('user', 'name email');

      res.status(201).json({
        success: true,
        data: populated
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Toggle upvote on a post
  // @route   POST /api/posts/:id/upvote
  // @access  Private
  async toggleUpvote(req, res, next) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        res.status(404);
        throw new Error('Post not found');
      }

      const userId = req.user._id.toString();
      const index = post.upvotes.findIndex(id => id.toString() === userId);

      if (index === -1) {
        post.upvotes.push(req.user._id);
      } else {
        post.upvotes.splice(index, 1);
      }

      await post.save();

      res.status(200).json({
        success: true,
        data: {
          upvoteCount: post.upvotes.length,
          isUpvoted: index === -1 // true if we just added it
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Add a comment to a post
  // @route   POST /api/posts/:id/comment
  // @access  Private
  async addComment(req, res, next) {
    try {
      const { content } = req.body;

      const post = await Post.findById(req.params.id);

      if (!post) {
        res.status(404);
        throw new Error('Post not found');
      }

      post.comments.push({
        user: req.user._id,
        content
      });

      await post.save();

      // Return the post with populated comments
      const updated = await Post.findById(post._id)
        .populate('user', 'name email')
        .populate('comments.user', 'name');

      res.status(201).json({
        success: true,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  }

  // @desc    Delete a post (only by owner)
  // @route   DELETE /api/posts/:id
  // @access  Private
  async deletePost(req, res, next) {
    try {
      const post = await Post.findById(req.params.id);

      if (!post) {
        res.status(404);
        throw new Error('Post not found');
      }

      if (post.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to delete this post');
      }

      await Post.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Post deleted'
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PostController();
