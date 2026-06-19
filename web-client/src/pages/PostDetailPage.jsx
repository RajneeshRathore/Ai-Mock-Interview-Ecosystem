import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ThumbsUp, MessageCircle, Clock, Send, Loader2, Trash2 } from 'lucide-react';
import { getPostById, toggleUpvote, addComment, toggleCommentUpvote, deletePost } from '../services/communityService';
import { useAuth } from '../app/providers/AuthProvider';
import Skeleton from '../components/loaders/Skeleton';

const categoryConfig = {
  'interview-experience': { label: 'Interview Experience', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  'tips': { label: 'Tips & Tricks', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  'question': { label: 'Question', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  'resource': { label: 'Resource', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  'general': { label: 'General', color: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getPostById(id)
      .then(data => {
        setPost(data);
        setComments(data.comments || []);
      })
      .catch(err => console.error('Failed to load post:', err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpvote = async () => {
    try {
      const result = await toggleUpvote(id);
      setPost(prev => ({
        ...prev,
        upvotes: result.hasUpvoted
          ? [...(prev.upvotes || []), user?.id]
          : (prev.upvotes || []).filter(uid => uid !== user?.id),
      }));
    } catch (err) {
      console.error('Failed to toggle upvote:', err);
    }
  };

  const handleCommentUpvote = async (commentId) => {
    try {
      const result = await toggleCommentUpvote(id, commentId);
      setComments(prev => prev.map(c => {
        if (c._id === commentId) {
          return {
            ...c,
            upvotes: result.hasUpvoted
              ? [...(c.upvotes || []), user?.id]
              : (c.upvotes || []).filter(uid => uid !== user?.id),
          };
        }
        return c;
      }));
    } catch (err) {
      console.error('Failed to toggle comment upvote:', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submitting) return;

    setSubmitting(true);
    try {
      const newComment = await addComment(id, commentText.trim());
      setComments(prev => [...prev, newComment]);
      setCommentText('');
      // Update post comment count
      setPost(prev => ({ ...prev, commentCount: (prev.commentCount || 0) + 1 }));
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    setDeleting(true);
    try {
      await deletePost(id);
      navigate('/dashboard/community');
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('Failed to delete post. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">Post not found</h3>
        <Link to="/dashboard/community" className="text-primary-600 hover:underline mt-2 inline-block">
          Back to Community
        </Link>
      </div>
    );
  }

  const catCfg = categoryConfig[post.category] || categoryConfig.general;
  const hasUpvoted = post.upvotes?.some(uid =>
    (typeof uid === 'string' ? uid : uid?.toString()) === user?.id
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          to="/dashboard/community"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Community
        </Link>
      </motion.div>

      {/* Post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden"
      >
        <div className="p-8">
          {/* Category & Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${catCfg.color}`}>
              {catCfg.label}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Clock size={12} />
              {timeAgo(post.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">
            {post.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20">
              {(post.author?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                {post.author?.name || 'Anonymous'}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {post.author?.email}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {post.body}
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              {post.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              id="post-upvote-btn"
              onClick={handleUpvote}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                hasUpvoted
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 ring-2 ring-primary-200 dark:ring-primary-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500'
              }`}
            >
              <ThumbsUp size={16} className={hasUpvoted ? 'fill-current' : ''} />
              {post.upvotes?.length || 0} Upvotes
            </button>
            <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <MessageCircle size={16} />
              {comments.length} Comments
            </span>
            {/* Delete button — only shown to post owner */}
            {user?.id && post.author?._id && user.id === post.author._id.toString() && (
              <button
                id="delete-post-btn"
                onClick={handleDeletePost}
                disabled={deleting}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 disabled:opacity-50"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {deleting ? 'Deleting...' : 'Delete Post'}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white mb-5">
          Comments ({comments.length})
        </h2>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mb-6">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-primary-500/40 focus-within:border-primary-400 transition-all">
            <textarea
              id="comment-input"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              maxLength={3000}
              className="w-full px-5 py-4 bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none resize-none"
            />
            <div className="flex items-center justify-end px-4 pb-3">
              <button
                id="submit-comment-btn"
                type="submit"
                disabled={!commentText.trim() || submitting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {submitting ? 'Posting...' : 'Comment'}
              </button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-sm">
              No comments yet. Be the first to share your thoughts!
            </div>
          ) : (
            comments.map((comment, i) => {
              const commentHasUpvoted = comment.upvotes?.some(uid =>
                (typeof uid === 'string' ? uid : uid?.toString()) === user?.id
              );

              return (
                <motion.div
                  key={comment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {(comment.author?.name || 'A').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                          {comment.author?.name || 'Anonymous'}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {timeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {comment.body}
                      </p>
                      <button
                        onClick={() => handleCommentUpvote(comment._id)}
                        className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          commentHasUpvoted
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                            : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600'
                        }`}
                      >
                        <ThumbsUp size={12} className={commentHasUpvoted ? 'fill-current' : ''} />
                        {comment.upvotes?.length || 0}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
}
