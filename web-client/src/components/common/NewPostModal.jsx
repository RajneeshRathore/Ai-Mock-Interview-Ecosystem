import { useState } from 'react';
import { X, Send, Tag, Loader2 } from 'lucide-react';
import { createPost } from '../../services/communityService';

const categories = [
  { value: 'general', label: 'General' },
  { value: 'interview-experience', label: 'Interview Experience' },
  { value: 'tips', label: 'Tips & Tricks' },
  { value: 'question', label: 'Question' },
  { value: 'resource', label: 'Resource' },
];

export default function NewPostModal({ isOpen, onClose, onPostCreated }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('general');
  const [tagsInput, setTagsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const tags = tagsInput
        .split(',')
        .map(t => t.trim().toLowerCase())
        .filter(Boolean);

      const newPost = await createPost({ title, body, category, tags });
      onPostCreated(newPost);
      // Reset form
      setTitle('');
      setBody('');
      setCategory('general');
      setTagsInput('');
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => !submitting && onClose()}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">
            Create a New Post
          </h2>
          <button
            onClick={() => !submitting && onClose()}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="post-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Title
            </label>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              maxLength={200}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
            />
          </div>

          {/* Body */}
          <div>
            <label htmlFor="post-body" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Body
            </label>
            <textarea
              id="post-body"
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Share your thoughts, experience, or question..."
              rows={6}
              maxLength={10000}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="post-category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Category
            </label>
            <select
              id="post-category"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all appearance-none"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="post-tags" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              <Tag size={14} className="inline mr-1" />
              Tags (comma-separated)
            </label>
            <input
              id="post-tags"
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="e.g. google, system-design, tips"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => !submitting && onClose()}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              id="submit-post-btn"
              type="submit"
              disabled={submitting || !title.trim() || !body.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-indigo-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Publish Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
