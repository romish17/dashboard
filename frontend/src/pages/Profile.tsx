import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { User, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password && password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const updates: { name?: string; password?: string } = {};
      if (name !== user?.name) updates.name = name;
      if (password) updates.password = password;

      await authService.updateProfile(updates);
      toast.success('Profile updated');
      setPassword('');
      setConfirmPassword('');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-base-200">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-16">
                <span className="text-2xl">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-base-content/60">{user?.email}</p>
              <span className={`badge ${user?.role === 'ADMIN' ? 'badge-warning' : 'badge-ghost'} mt-1`}>
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <User className="w-4 h-4 opacity-70" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="grow"
                  required
                />
              </label>
            </div>

            <div className="divider">Change Password</div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <Lock className="w-4 h-4 opacity-70" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Leave empty to keep current"
                  className="grow"
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <Lock className="w-4 h-4 opacity-70" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="grow"
                />
              </label>
            </div>

            <div className="flex justify-end mt-6">
              <button type="submit" disabled={isLoading} className="btn btn-primary">
                {isLoading && <span className="loading loading-spinner loading-sm"></span>}
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
