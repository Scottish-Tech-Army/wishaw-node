import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth-store';
import { Trophy, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

export default function RegisterPage() {
  const [form, setForm] = useState({ displayName: '', firstName: '', lastName: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-surface-900 px-4 py-8">
      <div className="mx-auto flex max-w-6xl justify-end">
        <ThemeToggle />
      </div>
      <div className="flex items-center justify-center py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center mx-auto mb-4"><Trophy className="w-8 h-8 text-white" /></div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-surface-400 mt-1">Join the WYMCA eSports Academy and start tracking your growth.</p>
        </div>
        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">{error}</div>}
          <div><label className="label">Display Name</label><input className="input" value={form.displayName} onChange={set('displayName')} required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">First Name</label><input className="input" value={form.firstName} onChange={set('firstName')} required /></div>
            <div><label className="label">Last Name</label><input className="input" value={form.lastName} onChange={set('lastName')} required /></div>
          </div>
          <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={set('email')} required /></div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} className="input pr-10" value={form.password} onChange={set('password')} required minLength={6} />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400" onClick={() => setShowPw(!showPw)}>{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
            </div>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
          <p className="text-sm text-surface-400 text-center">Already have an account? <Link to="/login" className="text-primary-400 hover:underline">Sign in</Link></p>
        </form>
      </div>
      </div>
    </div>
  );
}
