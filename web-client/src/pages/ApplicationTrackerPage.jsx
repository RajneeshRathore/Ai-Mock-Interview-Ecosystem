import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Building2, Briefcase, IndianRupee, ExternalLink, Calendar, Trash2, Edit2, Loader2, ArrowRight } from 'lucide-react';
import { getApplications, createApplication, updateApplication, deleteApplication } from '../services/applicationService';
import Skeleton from '../components/loaders/Skeleton';

const statuses = [
  { id: 'applied', label: 'Applied', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300', dot: 'bg-slate-400' },
  { id: 'oa', label: 'Online Assessment', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', dot: 'bg-blue-500' },
  { id: 'interview', label: 'Interview', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', dot: 'bg-amber-500' },
  { id: 'offer', label: 'Offer', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
  { id: 'rejected', label: 'Rejected', color: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400', dot: 'bg-rose-500' },
];

export default function ApplicationTrackerPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'applied',
    link: '',
    ctc: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getApplications();
      setApplications(data || []);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        const updated = await updateApplication(editingId, formData);
        setApplications(prev => prev.map(app => app._id === editingId ? updated : app));
      } else {
        const created = await createApplication(formData);
        setApplications(prev => [created, ...prev]);
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save application:', error);
      alert('Failed to save application');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      await deleteApplication(id);
      setApplications(prev => prev.filter(app => app._id !== id));
    } catch (error) {
      console.error('Failed to delete application:', error);
      alert('Failed to delete application');
    }
  };

  const openModalForEdit = (app) => {
    setFormData({
      company: app.company,
      role: app.role,
      status: app.status,
      link: app.link || '',
      ctc: app.ctc || '',
      notes: app.notes || '',
    });
    setEditingId(app._id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ company: '', role: '', status: 'applied', link: '', ctc: '', notes: '' });
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const updated = await updateApplication(id, { status: newStatus });
      setApplications(prev => prev.map(app => app._id === id ? updated : app));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/4" />
        <div className="flex gap-6 overflow-hidden">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[600px] w-80 rounded-2xl flex-shrink-0" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between flex-shrink-0"
      >
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
            Application Tracker
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track your job applications and interview processes
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5"
        >
          <Plus size={18} />
          Add Application
        </button>
      </motion.div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto custom-scrollbar pb-4">
        <div className="flex gap-6 h-full min-w-max items-start">
          {statuses.map((statusColumn, i) => {
            const columnApps = applications.filter(app => app.status === statusColumn.id);
            
            return (
              <motion.div
                key={statusColumn.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="w-80 flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800"
              >
                {/* Column Header */}
                <div className="p-4 border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${statusColumn.dot}`} />
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">{statusColumn.label}</h3>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-white dark:bg-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 shadow-sm">
                    {columnApps.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {columnApps.map(app => (
                    <motion.div
                      layoutId={app._id}
                      key={app._id}
                      className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-lg">
                          {app.company.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openModalForEdit(app)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(app._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1" title={app.company}>
                        {app.company}
                      </h4>
                      <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-1" title={app.role}>
                        <Briefcase size={14} className="text-slate-400" />
                        {app.role}
                      </div>
                      
                      {app.ctc && (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 mb-3 font-medium bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-md">
                          <IndianRupee size={12} />
                          {app.ctc}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(app.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                        
                        {/* Quick move forward button if not in final state */}
                        {statusColumn.id !== 'offer' && statusColumn.id !== 'rejected' && (
                          <button 
                            onClick={() => {
                              const nextStatus = statuses[statuses.findIndex(s => s.id === statusColumn.id) + 1].id;
                              updateStatus(app._id, nextStatus);
                            }}
                            className="flex items-center gap-1 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
                          >
                            Move <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {columnApps.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 text-sm">
                      No applications
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeModal} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingId ? 'Edit Application' : 'Add New Application'}
                </h2>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">×</button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company *</label>
                    <input
                      type="text"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none"
                      placeholder="e.g. Google"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role *</label>
                    <input
                      type="text"
                      name="role"
                      required
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none"
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none"
                    >
                      {statuses.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expected CTC</label>
                    <input
                      type="text"
                      name="ctc"
                      value={formData.ctc}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none"
                      placeholder="e.g. 24 LPA"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Application Link</label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all outline-none resize-none"
                    placeholder="Any specific prep needed?"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !formData.company || !formData.role}
                    className="px-6 py-2 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting && <Loader2 size={16} className="animate-spin" />}
                    {editingId ? 'Update' : 'Save'} Application
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
