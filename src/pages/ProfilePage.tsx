import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/auth-store';
import api from '../services/api';
import { Loading } from '../components/ui';
import toast from 'react-hot-toast';
import type { Profile } from '../types';

export default function ProfilePage() {
  const { profile: storeProfile, updateProfile } = useAuthStore();
  const [form, setForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProfile().then((p) => { setForm(p); setLoading(false); });
  }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    try {
      const updated = await api.updateProfile(form);
      updateProfile(updated);
      toast.success('Profile updated');
    } catch { toast.error('Failed to update'); }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="page-header">Profile</h1>
      <div className="card space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-300 text-3xl font-semibold">
            {form.displayName?.[0]?.toUpperCase() || '?'}
          </div>
          <div><p className="text-lg font-semibold text-white">{form.displayName}</p><p className="text-sm text-surface-400">{form.firstName} {form.lastName}</p></div>
        </div>
        <div><label className="label">Display Name</label><input className="input" value={form.displayName ?? ''} onChange={set('displayName')} /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label">First Name</label><input className="input" value={form.firstName ?? ''} onChange={set('firstName')} /></div>
          <div><label className="label">Last Name</label><input className="input" value={form.lastName ?? ''} onChange={set('lastName')} /></div>
        </div>
        <div><label className="label">Bio</label><textarea className="input" rows={3} value={form.bio ?? ''} onChange={set('bio')} /></div>
        <button className="btn-primary" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}
