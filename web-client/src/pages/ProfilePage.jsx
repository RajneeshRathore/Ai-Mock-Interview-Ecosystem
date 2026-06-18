import { useState, useEffect } from 'react';
import { useAuth } from '../app/providers/AuthProvider';
import { getProfile, updateProfile, changePassword, getMyBadges } from '../services/userService';
import { User, Mail, GraduationCap, Briefcase, Code, Lock, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import Skeleton from '../components/loaders/Skeleton';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    Promise.all([
      getProfile().then(data => {
        setProfile(data);
        setFormData({
          name: data.name || '',
          college: data.profile?.college || '',
          branch: data.profile?.branch || '',
          graduationYear: data.profile?.graduationYear || '',
          skills: (data.profile?.skills || []).join(', ')
        });
      }),
      getMyBadges().then(data => setBadges(data)).catch(() => setBadges([]))
    ]).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    try {
      const updateData = {
        name: formData.name,
        college: formData.college,
        branch: formData.branch,
        graduationYear: formData.graduationYear ? parseInt(formData.graduationYear) : undefined,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : []
      };
      const updated = await updateProfile(updateData);
      setProfile(prev => ({ ...prev, ...updated }));
      setSaveMsg('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setSaveMsg('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordMsg('');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters');
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordMsg('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordMsg(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );

  const initials = (profile?.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="animate-fade-in-down opacity-0 animate-fill-forwards">
        <h2 className="text-2xl font-bold text-slate-900">My Profile</h2>
        <p className="text-slate-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in-up opacity-0 animation-delay-100 animate-fill-forwards">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32 relative">
          <div className="absolute -bottom-12 left-8">
            {profile?.profile?.avatarUrl ? (
              <img src={profile.profile.avatarUrl} alt={profile.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-2xl font-bold">
                {initials}
              </div>
            )}
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{profile?.name}</h3>
              <div className="flex items-center gap-2 text-slate-500 mt-1">
                <Mail size={14} />
                <span className="text-sm">{profile?.email}</span>
                {profile?.isEmailVerified && (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    <CheckCircle size={10} /> Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Shield size={14} className="text-slate-400" />
                <span className="text-xs text-slate-400 capitalize">{profile?.authProvider} account • {profile?.role}</span>
              </div>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors">
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditing(false)} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {saveMsg && (
            <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${saveMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {saveMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                <User size={12} className="inline mr-1" /> Full Name
              </label>
              {editing ? (
                <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              ) : (
                <p className="text-slate-700">{profile?.name || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                <GraduationCap size={12} className="inline mr-1" /> College
              </label>
              {editing ? (
                <input value={formData.college} onChange={e => setFormData(p => ({ ...p, college: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              ) : (
                <p className="text-slate-700">{profile?.profile?.college || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                <Briefcase size={12} className="inline mr-1" /> Branch
              </label>
              {editing ? (
                <input value={formData.branch} onChange={e => setFormData(p => ({ ...p, branch: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              ) : (
                <p className="text-slate-700">{profile?.profile?.branch || '—'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                <GraduationCap size={12} className="inline mr-1" /> Graduation Year
              </label>
              {editing ? (
                <input type="number" value={formData.graduationYear} onChange={e => setFormData(p => ({ ...p, graduationYear: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              ) : (
                <p className="text-slate-700">{profile?.profile?.graduationYear || '—'}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                <Code size={12} className="inline mr-1" /> Skills
              </label>
              {editing ? (
                <input value={formData.skills} onChange={e => setFormData(p => ({ ...p, skills: e.target.value }))} placeholder="e.g. React, Node.js, MongoDB" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(profile?.profile?.skills || []).length > 0 ? profile.profile.skills.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">{s}</span>
                  )) : <span className="text-slate-400">No skills added</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in-up opacity-0 animation-delay-200 animate-fill-forwards">
        <h3 className="font-bold text-lg text-slate-900 mb-4">🏆 Badges Earned</h3>
        {badges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, i) => (
              <div key={i} className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl mb-2">{badge.icon}</div>
                <div className="font-bold text-slate-900 text-sm">{badge.name}</div>
                <div className="text-xs text-slate-500 mt-1">{badge.description}</div>
                <div className="text-[10px] text-amber-600 mt-2">{new Date(badge.earnedAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">Complete interviews to earn badges! 🎯</p>
        )}
      </div>

      {/* Password Section */}
      {profile?.authProvider === 'local' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-fade-in-up opacity-0 animation-delay-300 animate-fill-forwards">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Lock size={18} /> Security
            </h3>
            <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>
          </div>

          {showPasswordForm && (
            <div className="space-y-3">
              {passwordMsg && (
                <div className={`px-4 py-2 rounded-lg text-sm font-medium ${passwordMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {passwordMsg}
                </div>
              )}
              <input type="password" placeholder="Current Password" value={passwordData.currentPassword} onChange={e => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              <input type="password" placeholder="New Password" value={passwordData.newPassword} onChange={e => setPasswordData(p => ({ ...p, newPassword: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              <input type="password" placeholder="Confirm New Password" value={passwordData.confirmPassword} onChange={e => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
              <button onClick={handleChangePassword} disabled={changingPassword} className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
                {changingPassword ? 'Changing...' : 'Update Password'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
