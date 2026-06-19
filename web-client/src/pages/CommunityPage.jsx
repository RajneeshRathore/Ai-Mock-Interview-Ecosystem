import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ThumbsUp, MessageCircle, Clock, Filter, TrendingUp, SortAsc, MessagesSquare, Tag, Trash2 } from 'lucide-react';
import { getPosts, toggleUpvote, deletePost } from '../services/communityService';
import { useAuth } from '../app/providers/AuthProvider';
import NewPostModal from '../components/common/NewPostModal';
import Skeleton from '../components/loaders/Skeleton';

const categoryConfig = {
  'all': { label: 'All Posts', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  'interview-experience': { label: 'Interview Experience', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  'tips': { label: 'Tips & Tricks', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  'question': { label: 'Questions', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  'resource': { label: 'Resources', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
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

export default function CommunityPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const params = { page: pageNum, limit: 10, sort };
      if (category !== 'all') params.category = category;

      const response = await getPosts(params);
      const data = response.data || [];
      const pag = response.pagination;

      if (append) {
        setPosts(prev => [...prev, ...data]);
      } else {
        setPosts(data);
      }
      setPagination(pag);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchPosts(1, false);
  }, [category, sort]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, true);
  };

  const handleUpvote = async (postId) => {
    try {
      const result = await toggleUpvote(postId);
      setPosts(prev => prev.map(p => {
        if (p._id === postId) {
          return {
            ...p,
            upvotes: result.hasUpvoted
              ? [...(p.upvotes || []), user?.id]
              : (p.upvotes || []).filter(uid => uid !== user?.id),
          };
        }
        return p;
      }));
    } catch (err) {
      console.error('Failed to toggle upvote:', err);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(postId);
      setPosts(prev => prev.filter(p => p._id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10 w-28 rounded-xl" />)}
        </div>
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
            Community
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Discuss interview experiences, share tips, and help each other
          </p>
        </div>
        <button
          id="new-post-btn"
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5 flex-shrink-0"
        >
          <Plus size={18} />
          New Post
        </button>
      </motion.div>

      {/* Category Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {Object.entries(categoryConfig).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setCategory(key)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              category === key
                ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                : `${cfg.color} hover:ring-2 hover:ring-primary-200 dark:hover:ring-primary-700`
            }`}
          >
            {cfg.label}
          </button>
        ))}
      </motion.div>

      {/* Sort Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="flex items-center gap-2"
      >
        <SortAsc size={16} className="text-slate-400" />
        <button
          onClick={() => setSort('newest')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            sort === 'newest'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock size={12} className="inline mr-1" />
          Newest
        </button>
        <button
          onClick={() => setSort('popular')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            sort === 'popular'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp size={12} className="inline mr-1" />
          Most Upvoted
        </button>
      </motion.div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <MessagesSquare size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">No posts yet</h3>
          <p className="text-slate-400 dark:text-slate-500 mt-1">Be the first to start a discussion!</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
          >
            <Plus size={16} />
            Create First Post
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, i) => {
            const catCfg = categoryConfig[post.category] || categoryConfig.general;
            const hasUpvoted = post.upvotes?.some(uid =>
              (typeof uid === 'string' ? uid : uid?.toString()) === user?.id
            );

            return (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary-200 dark:hover:border-primary-700 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Upvote Column */}
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <button
                        id={`upvote-${post._id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleUpvote(post._id);
                        }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                          hasUpvoted
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 ring-2 ring-primary-200 dark:ring-primary-700'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-500'
                        }`}
                      >
                        <ThumbsUp size={16} className={hasUpvoted ? 'fill-current' : ''} />
                      </button>
                      <span className={`text-sm font-semibold ${hasUpvoted ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {post.upvotes?.length || 0}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/dashboard/community/${post._id}`}
                          className="block group/link flex-1"
                        >
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover/link:text-primary-600 dark:group-hover/link:text-primary-400 transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                        </Link>
                        {/* Delete button — only shown to post owner */}
                        {user?.id && post.author?._id && user.id === post.author._id.toString() && (
                          <button
                            id={`delete-post-${post._id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeletePost(post._id);
                            }}
                            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
                            title="Delete post"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                        {post.body}
                      </p>

                      {/* Tags */}
                      {post.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {post.tags.slice(0, 4).map((tag, ti) => (
                            <span key={ti} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Meta */}
                      <div className="flex items-center gap-4 mt-4 text-xs text-slate-400 dark:text-slate-500">
                        <span className={`px-2.5 py-1 rounded-lg font-medium ${catCfg.color}`}>
                          {catCfg.label}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle size={12} />
                          {post.commentCount || 0} comments
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {timeAgo(post.createdAt)}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500">
                          by <strong className="font-medium text-slate-600 dark:text-slate-300">{post.author?.name || 'Anonymous'}</strong>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Load More */}
      {pagination && page < pagination.pages && (
        <div className="text-center pt-4">
          <button
            id="load-more-btn"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-8 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md transition-all disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Load More Posts'}
          </button>
        </div>
      )}

      {/* New Post Modal */}
      <NewPostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
